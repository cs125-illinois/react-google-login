import React from "react"

import { Item } from "semantic-ui-react"

import { getProfile, getTokens, useGoogleUser, GoogleUserContext } from "@cs125/react-google-login"

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

export const WithUser: React.FC = () => <ShowUser googleUser={useGoogleUser()} />
