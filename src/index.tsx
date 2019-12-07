import React, { useEffect, useState } from "react"
import { Subtract } from "utility-types"

declare global {
  interface Window {
    gapi: GAPI
  }
}

interface GAPI {
  load: (library: string, callback: () => any) => void
  auth2: Auth2
}
export interface GoogleLoginContext {
  auth: GoogleAuth | null
  ready: boolean
  user: GoogleUser | null
  isSignedIn: boolean | undefined
}
interface GoogleLoginProviderProps {
  children: React.ReactNode
  library_uri?: string
  client_config: ClientConfig
}
interface GoogleLoginProviderAuthState {
  auth: GoogleAuth | null
  ready: boolean
}
interface GoogleLoginProviderUserState {
  user: GoogleUser | null
  isSignedIn: boolean | undefined
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
interface GoogleAuth {
  then: (onInit: (auth: GoogleAuth) => void, onError: (error: Error) => void) => void
  isSignedIn: IsSignedIn
  signIn: (options?: SignInOptions) => Promise<GoogleUser> | void
  signOut: () => Promise<void>
  disconnect: () => void
  grantOfflineAccess: (options: OfflineAccessOptions) => Promise<AuthorizationCode>
  currentUser: CurrentUser
}
interface IsSignedIn {
  get: () => boolean
  listen: (callback: (isSignedIn: boolean) => void) => void
}
interface SignInOptions {
  prompt: string
  scope: string
  ux_mode: string
  redirect_uri: string
}
interface AuthorizationCode {
  code: string
}
interface CurrentUser {
  get: () => GoogleUser
  listen: (callback: (user: GoogleUser) => void) => void
}
interface GoogleUser {
  getId: () => string
  isSignedIn: () => boolean
  getHostedDomain: () => string
  getGrantedScopes: () => string
  getBasicProfile: () => string
  getAuthResponse: (includeAuthorizationData?: boolean) => AuthResponse
  reloadAuthResponse: () => Promise<AuthResponse>
  hasGrantedScopes: (scopes: string) => boolean
  grantOfflineAccess: (options: OfflineAccessOptions) => void
  disconnect: () => void
}
interface AuthResponse {
  access_token: string
  id_token: string
  scope: string
  expires_in: number
  first_issued_at: number
  expires_at: number
}
interface OfflineAccessOptions {
  prompt: string
  scope: string
}
interface Auth2 {
  init: (params: ClientConfig) => GoogleAuth
  getAuthInstance: () => GoogleAuth
}

const defaultContext: GoogleLoginContext = {
  auth: null,
  user: null,
  ready: false,
  isSignedIn: false,
}
const GoogleLoginContext = React.createContext<GoogleLoginContext>({ ...defaultContext })

export const GoogleLoginProvider: React.FC<GoogleLoginProviderProps> = ({
  children,
  client_config,
  library_uri = "https://apis.google.com/js/platform.js",
}) => {
  const [auth, setAuth] = useState<GoogleLoginProviderAuthState>({ auth: null, ready: false })
  const [user, setUser] = useState<GoogleLoginProviderUserState>({
    user: null,
    isSignedIn: undefined,
  })
  useEffect(() => {
    setAuth({ auth: null, ready: false })
    setUser({ user: null, isSignedIn: false })
    const script = Object.assign(document.createElement("script"), {
      src: library_uri,
      async: true,
      defer: true,
    })
    script.onload = () => {
      window.gapi.load("auth2", () => {
        window.gapi.auth2.init(client_config).then(
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
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return (
    <GoogleLoginContext.Provider value={{ ...auth, ...user }}>
      {children}
    </GoogleLoginContext.Provider>
  )
}

export interface InjectedGoogleLoginProps {
  googleLogin: GoogleLoginContext
}

export const withGoogleLogin = <P extends InjectedGoogleLoginProps>(
  WrappedComponent: React.ComponentType<P>
) =>
  class WithGoogleLogin extends React.Component<Subtract<P, InjectedGoogleLoginProps>> {
    public render() {
      return (
        <GoogleLoginContext.Consumer>
          {value => <WrappedComponent {...(this.props as P)} googleLogin={value} />}
        </GoogleLoginContext.Consumer>
      )
    }
  }
