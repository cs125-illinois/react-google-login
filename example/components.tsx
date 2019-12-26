import React, { useState } from "react"
import { Button, Icon, Item } from "semantic-ui-react"

import {
  withGoogleLogin,
  WithGoogleLogin,
  GoogleLoginContext,
  GoogleAuth,
  WithGoogleUser,
  getProfile,
  getTokens,
  withGoogleUser,
  GoogleUserContext,
} from "@cs125/react-google-login"
import styled from "styled-components"

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

export const LoginButton: React.FC = () => {
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

export const LoginButtonHOC: React.FC = () => {
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

const ShowUser: React.FC<{ googleUser: GoogleUserContext }> = ({ googleUser }: { googleUser: GoogleUserContext }) => {
  const { user, isSignedIn } = googleUser
  if (!isSignedIn || !user) {
    return null
  }
  const { name, email, imageUrl } = getProfile(user)
  // Replace hyphens with non-breaking hyphens
  const id_token = getTokens(user).id_token.replace(/-/g, "‑")
  return (
    <Item.Group>
      <Item>
        <Item.Image size="small" src={imageUrl} />
        <Item.Content>
          <Item.Header>{name}</Item.Header>
          <Item.Meta>{email}</Item.Meta>
          <Item.Description>
            <pre style={{ whiteSpace: "pre-wrap", hyphens: "manual", overflowWrap: "break-word" }}>{id_token}</pre>
          </Item.Description>
        </Item.Content>
      </Item>
    </Item.Group>
  )
}

export const WithUser: React.FC = () => <ShowUser googleUser={withGoogleUser()} />
export const WithUserHOC: React.FC = () => {
  return (
    <WithGoogleUser>
      {(googleUser): JSX.Element | null => {
        return <ShowUser googleUser={googleUser} />
      }}
    </WithGoogleUser>
  )
}

export const Lead = styled.p`
  font-size: 1.2em;
`
