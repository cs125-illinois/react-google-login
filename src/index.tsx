import React, { Component } from "react"
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
  user: GoogleUser | null
  ready: boolean
  isSignedIn: boolean
}
interface GoogleLoginProviderProps {
  children: React.ReactNode
  library_uri: string
  client_config: ClientConfig
}
interface GoogleLoginProviderState {
  auth: GoogleAuth | null
  user: GoogleUser | null
  ready: boolean
  isSignedIn: boolean
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

export class GoogleLoginProvider extends Component<
  GoogleLoginProviderProps,
  GoogleLoginProviderState
> {
  public static defaultProps = {
    library_uri: "https://apis.google.com/js/platform.js",
  }

  public script: HTMLScriptElement | null = null

  constructor(props: GoogleLoginProviderProps) {
    super(props)
    this.state = { ...defaultContext }
  }
  public componentDidMount() {
    this.script = document.createElement("script")
    this.script.src = this.props.library_uri
    this.script.async = true
    this.script.defer = true
    this.script.onload = this.scriptLoaded
    document.head.appendChild(this.script)
  }
  public scriptLoaded = () => {
    window.gapi.load("auth2", () => {
      window.gapi.auth2.init(this.props.client_config).then(
        auth => {
          const initialUser = auth.currentUser.get()
          this.setState({
            auth,
            user: initialUser,
            ready: true,
            isSignedIn: initialUser.isSignedIn(),
          })
          auth.currentUser.listen(user => {
            this.setState({ user, isSignedIn: user.isSignedIn() })
          })
        },
        err => {
          throw err
        }
      )
    })
  }
  public componentWillUnmount() {
    if (this.script !== null) {
      document.head.removeChild(this.script)
    }
  }
  public render() {
    return (
      <GoogleLoginContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </GoogleLoginContext.Provider>
    )
  }
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
