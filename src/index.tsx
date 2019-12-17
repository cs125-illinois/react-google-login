import React, { useEffect, useState, useContext } from "react"
import PropTypes from "prop-types"

export interface GoogleLoginContext extends GoogleAuthContext, GoogleUserContext {}
const GoogleLoginContext = React.createContext<GoogleLoginContext>({
  auth: null,
  user: null,
  ready: false,
  isSignedIn: false,
})

export interface GoogleAuth {
  then: (onInit: (auth: GoogleAuth) => void, onError: (error: Error) => void) => void
  isSignedIn: {
    get: () => boolean
    listen: (callback: (isSignedIn: boolean) => void) => void
  }
  signIn: (options?: {
    prompt: string
    scope: string
    ux_mode: string
    redirect_uri: string
  }) => Promise<GoogleUser> | void
  signOut: () => Promise<void>
  disconnect: () => void
  grantOfflineAccess: (options: OfflineAccessOptions) => Promise<{ code: string }>
  currentUser: {
    get: () => GoogleUser
    listen: (callback: (user: GoogleUser) => void) => void
  }
}
export interface GoogleUser {
  getId: () => string
  isSignedIn: () => boolean
  getHostedDomain: () => string
  getGrantedScopes: () => string
  getBasicProfile: () => {
    getId: () => string
    getName: () => string
    getGivenName: () => string
    getFamilyName: () => string
    getImageUrl: () => string
    getEmail: () => string
  }
  getAuthResponse: (includeAuthorizationData?: boolean) => AuthResponse
  reloadAuthResponse: () => Promise<AuthResponse>
  hasGrantedScopes: (scopes: string) => boolean
  grantOfflineAccess: (options: OfflineAccessOptions) => void
  disconnect: () => void
}
export interface AuthResponse {
  access_token: string
  id_token: string
  scope: string
  expires_in: number
  first_issued_at: number
  expires_at: number
}
export interface OfflineAccessOptions {
  prompt: string
  scope: string
}

export interface GoogleLoginProviderProps {
  clientConfig: ClientConfig
  libraryURI?: string
  children: React.ReactNode
}
export interface ClientConfig {
  client_id: string
  cookie_policy?: string
  scope?: string
  fetch_basic_profile?: boolean
  hosted_domain?: string
  openid_realm?: string
  ux_mode?: string
  redirect_uri?: string
}

interface GoogleAuthContext {
  auth: GoogleAuth | null
  ready: boolean
}
export interface GoogleUserContext {
  user: GoogleUser | null
  isSignedIn: boolean | undefined
}

export const GoogleLoginProvider: React.FC<GoogleLoginProviderProps> = ({ children, clientConfig, libraryURI }) => {
  const [auth, setAuth] = useState<GoogleAuthContext>({ auth: null, ready: false })
  const [user, setUser] = useState<GoogleUserContext>({
    user: null,
    isSignedIn: undefined,
  })

  useEffect(() => {
    setAuth({ auth: null, ready: false })
    setUser({ user: null, isSignedIn: false })
    const script = Object.assign(document.createElement("script"), {
      src: libraryURI,
      async: true,
      defer: true,
    })
    script.onload = (): void => {
      window.gapi.load("auth2", () => {
        window.gapi.auth2.init(clientConfig).then(
          newAuth => {
            setAuth({ auth: newAuth, ready: true })
            const initialUser = newAuth.currentUser.get()
            setUser({ user: initialUser, isSignedIn: initialUser.isSignedIn() })
            newAuth.currentUser.listen(newUser => {
              setUser({ user: newUser, isSignedIn: newUser.isSignedIn() })
            })
          },
          err => {
            throw err
          }
        )
      })
    }
    document.head.appendChild(script)
    return (): void => {
      document.head.removeChild(script)
    }
  }, [])

  return <GoogleLoginContext.Provider value={{ ...auth, ...user }}>{children}</GoogleLoginContext.Provider>
}

GoogleLoginProvider.propTypes = {
  clientConfig: PropTypes.exact({
    client_id: PropTypes.string.isRequired,
    cookie_policy: PropTypes.string,
    scope: PropTypes.string,
    fetch_basic_profile: PropTypes.bool,
    hosted_domain: PropTypes.string,
    openid_realm: PropTypes.string,
    ux_mode: PropTypes.string,
    redirect_uri: PropTypes.string,
  }).isRequired,
  libraryURI: PropTypes.string,
  children: PropTypes.node.isRequired,
}
GoogleLoginProvider.defaultProps = {
  libraryURI: "https://apis.google.com/js/platform.js",
}

declare global {
  interface Window {
    gapi: {
      load: (library: string, callback: () => void) => void
      auth2: {
        init: (params: ClientConfig) => GoogleAuth
        getAuthInstance: () => GoogleAuth
      }
    }
  }
}

export const withGoogleLogin = (): GoogleLoginContext => {
  return useContext(GoogleLoginContext)
}
interface WithGoogleLoginProps {
  children: (withGoogleLogin: GoogleLoginContext) => JSX.Element | null
}
export const WithGoogleLogin: React.FC<WithGoogleLoginProps> = ({ children }) => {
  return children(withGoogleLogin())
}
WithGoogleLogin.propTypes = {
  children: PropTypes.func.isRequired,
}

export const withGoogleUser = (): GoogleUserContext => {
  const { user, isSignedIn } = useContext(GoogleLoginContext)
  return { user, isSignedIn }
}
interface WithGoogleUserProps {
  children: (withGoogleUser: GoogleUserContext) => JSX.Element | null
}
export const WithGoogleUser: React.FC<WithGoogleUserProps> = ({ children }) => {
  return children(withGoogleUser())
}
WithGoogleUser.propTypes = {
  children: PropTypes.func.isRequired,
}

export interface BasicProfile {
  ID: string
  name: string
  givenName: string
  familyName: string
  imageUrl: string
  email: string
}
export const getProfile = (user: GoogleUser): BasicProfile => {
  const profile = user.getBasicProfile()
  return {
    ID: profile.getId(),
    name: profile.getName(),
    givenName: profile.getGivenName(),
    familyName: profile.getFamilyName(),
    imageUrl: profile.getImageUrl(),
    email: profile.getEmail(),
  }
}

export interface GoogleAuthTokens {
  id_token: string
  access_token: string
}
export const getTokens = (user: GoogleUser): GoogleAuthTokens => {
  const authResponse = user.getAuthResponse()
  return {
    id_token: authResponse.id_token,
    access_token: authResponse.access_token,
  }
}
