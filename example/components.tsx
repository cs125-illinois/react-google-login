import React from "react"
import PropTypes from "prop-types"

import { Item } from "@cs125/semantic-ui"

import { WithGoogleUser, getProfile, getTokens, withGoogleUser, GoogleUserContext } from "@cs125/react-google-login"

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
