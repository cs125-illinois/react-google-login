import React, { useState } from "react"
import { Button, Icon } from "semantic-ui-react"

import { withGoogleLogin, WithGoogleLogin, GoogleLoginContext, GoogleAuth } from "@cs125/react-google-login"

const loginOrOut = (
  { auth, isSignedIn }: { auth: GoogleAuth | null; isSignedIn: boolean | undefined },
  setBusy: (busy: boolean) => void = (): void => {} // eslint-disable-line @typescript-eslint/no-empty-function
) => async (): Promise<void> => {
  if (!auth) {
    return
  }
  setBusy(true)
  try {
    await (!isSignedIn ? auth.signIn() : auth.signOut())
  } finally {
    setBusy(false)
  }
}

export const ContextLoginButton: React.FC = () => {
  const [busy, setBusy] = useState<boolean>(false)

  const { ready, auth, isSignedIn } = withGoogleLogin()
  return (
    <Button
      positive={!isSignedIn}
      loading={!ready || busy}
      disabled={!ready}
      onClick={loginOrOut({ auth, isSignedIn }, setBusy)}
    >
      <Icon name="google" /> {!isSignedIn ? "Login" : "Logout"}
    </Button>
  )
}

export const HOCLoginButton: React.FC = () => {
  return (
    <WithGoogleLogin>
      {(googleLoginContext: GoogleLoginContext): JSX.Element => {
        const { ready, isSignedIn } = googleLoginContext
        return (
          <Button positive={!isSignedIn} loading={!ready} disabled={!ready} onClick={loginOrOut(googleLoginContext)}>
            <Icon name="google" /> {!isSignedIn ? "Login" : "Logout"}
          </Button>
        )
      }}
    </WithGoogleLogin>
  )
}
