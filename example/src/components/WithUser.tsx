import React from "react"

import { getProfile, getTokens, useGoogleUser, GoogleUserContext } from "@cs125/react-google-login"

import { Card, CardHeader, Avatar, CardContent, makeStyles } from "@material-ui/core"

const useStyles = makeStyles(() => ({
  content: {
    overflowWrap: "break-word",
  },
}))

const ShowUser: React.FC<{ googleUser: GoogleUserContext }> = ({ googleUser }: { googleUser: GoogleUserContext }) => {
  const classes = useStyles()

  const { user, isSignedIn } = googleUser
  if (!isSignedIn || !user) {
    return null
  }
  const { name, email, imageUrl } = getProfile(user)
  // Replace hyphens with non-breaking hyphens
  const id_token = getTokens(user).id_token.replace(/-/g, "‑")
  return (
    <Card>
      <CardHeader
        avatar={<Avatar alt={name} src={imageUrl} />}
        title={<h3 style={{ marginBottom: 0 }}>{name}</h3>}
        subheader={<code>{email}</code>}
      />
      <CardContent className={classes.content}>
        <code>{id_token}</code>
      </CardContent>
    </Card>
  )
}

export const WithUser: React.FC = () => <ShowUser googleUser={useGoogleUser()} />
