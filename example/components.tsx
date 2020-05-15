import React, { useState } from "react"
import PropTypes from "prop-types"

import Button from "semantic-ui-react/dist/commonjs/elements/Button"
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon"
import Item from "semantic-ui-react/dist/commonjs/views/Item"

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
        <Item.Image size="small" src={imageUrl} alt="Your Picture" />
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

export const Lead: React.FC = ({ children }) => {
  return <div style={{ fontSize: "1.2rem" }}>{children}</div>
}
Lead.propTypes = {
  children: PropTypes.node.isRequired,
}
