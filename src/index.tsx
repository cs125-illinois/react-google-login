import React, { useEffect, useState, useContext, useRef } from "react"
import PropTypes from "prop-types"

export interface GoogleLoginContext extends GoogleAuthContext, GoogleUserContext {
  lastLogin: string | undefined
}
const GoogleLoginContext = React.createContext<GoogleLoginContext>({
  auth: null,
  user: null,
  ready: false,
  err: undefined,
  isSignedIn: false,
  lastLogin: undefined,
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
  localStorageKey?: string
}
export interface ClientConfig {
  client_id: string
  cookie_policy?: string | null
  scope?: string | null
  fetch_basic_profile?: boolean | null
  hosted_domain?: string | null
  openid_realm?: string | null
  ux_mode?: string | null
  redirect_uri?: string | null
}

export interface GoogleAuthContext {
  auth: GoogleAuth | null
  ready: boolean
  err: Error | undefined
}
export interface GoogleUserContext {
  user: GoogleUser | null
  isSignedIn: boolean | undefined
}
export interface GoogleTokensContext {
  idToken: string | undefined
  accessToken: string | undefined
}

export const GoogleLoginProvider: React.FC<GoogleLoginProviderProps> = ({
  clientConfig,
  libraryURI,
  localStorageKey,
  children,
}) => {
  const [auth, setAuth] = useState<GoogleAuthContext>({ auth: null, ready: false, err: undefined })
  const [user, setUser] = useState<GoogleUserContext>({
    user: null,
    isSignedIn: undefined,
  })
  const key = localStorageKey as string
  const lastLogin = useRef<string | undefined>(localStorage.getItem(key) || undefined)

  useEffect(() => {
    const script = Object.assign(document.createElement("script"), {
      src: libraryURI,
      async: true,
      defer: true,
    })
    script.onload = (): void => {
      window.gapi.load("auth2", () => {
        window.gapi.auth2.init(clientConfig).then(
          newAuth => {
            setAuth({ auth: newAuth, ready: true, err: undefined })
            const initialUser = newAuth.currentUser.get()
            setUser({ user: initialUser, isSignedIn: initialUser.isSignedIn() })
            newAuth.currentUser.listen(newUser => {
              setUser({ user: newUser, isSignedIn: newUser.isSignedIn() })
              newUser.isSignedIn() ? localStorage.setItem(key, new Date().toISOString()) : localStorage.removeItem(key)
            })
          },
          err => {
            setAuth({ auth: null, ready: false, err })
            throw err
          }
        )
      })
    }
    document.head.appendChild(script)
    return (): void => {
      document.head.removeChild(script)
    }
  }, [clientConfig, libraryURI, key])

  return (
    <GoogleLoginContext.Provider value={{ ...auth, ...user, lastLogin: lastLogin.current }}>
      {children}
    </GoogleLoginContext.Provider>
  )
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
  localStorageKey: PropTypes.string,
}
GoogleLoginProvider.defaultProps = {
  libraryURI: "https://apis.google.com/js/platform.js",
  localStorageKey: "@cs125/react-google-login",
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

export const useGoogleLogin = (): GoogleLoginContext => {
  return useContext(GoogleLoginContext)
}
interface WithGoogleLoginProps {
  children: (googleLogin: GoogleLoginContext) => JSX.Element | null
}
export const WithGoogleLogin: React.FC<WithGoogleLoginProps> = ({ children }) => {
  return children(useGoogleLogin())
}
WithGoogleLogin.propTypes = {
  children: PropTypes.func.isRequired,
}

export const useGoogleUser = (): GoogleUserContext => {
  const { user, isSignedIn } = useContext(GoogleLoginContext)
  return { user, isSignedIn }
}
interface WithGoogleUserProps {
  children: (googleUser: GoogleUserContext) => JSX.Element | null
}
export const WithGoogleUser: React.FC<WithGoogleUserProps> = ({ children }) => {
  return children(useGoogleUser())
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

export const useGoogleTokens = (): GoogleTokensContext => {
  const { user } = useContext(GoogleLoginContext)
  if (!user) {
    return { idToken: undefined, accessToken: undefined }
  }
  const { id_token: idToken, access_token: accessToken } = getTokens(user)
  return { idToken, accessToken }
}
interface WithGoogleTokensProps {
  children: (googleTokens: GoogleTokensContext) => JSX.Element | null
}
export const WithGoogleTokens: React.FC<WithGoogleTokensProps> = ({ children }) => {
  return children(useGoogleTokens())
}
WithGoogleTokens.propTypes = {
  children: PropTypes.func.isRequired,
}

export const useGoogleEmail = (): string | undefined => {
  return useContext(GoogleLoginContext).user?.getBasicProfile().getEmail()
}
interface WithGoogleEmailProps {
  children: (googleEmail: string | undefined) => JSX.Element | null
}
export const WithGoogleEmail: React.FC<WithGoogleEmailProps> = ({ children }) => {
  return children(useGoogleEmail())
}
WithGoogleEmail.propTypes = {
  children: PropTypes.func.isRequired,
}
