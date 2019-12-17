import "react-app-polyfill/ie11"
import "babel-polyfill"

import React, { useState } from "react"
import ReactDOM from "react-dom"

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import Container from "@material-ui/core/Container"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"

import {
  GoogleLoginProvider,
  withGoogleLogin,
  WithGoogleLogin,
  GoogleLoginContext,
  WithGoogleUser,
  getProfile,
  getTokens,
} from "@cs125/react-google-login"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
    },
    wrapper: {
      margin: theme.spacing(1),
      position: "relative",
    },
    buttonProgress: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
  })
)

const LoginButton: React.FC = () => {
  const classes = useStyles()
  const [busy, setBusy] = useState<boolean>(false)

  const { ready, auth, isSignedIn } = withGoogleLogin()
  const loginOrOut = async (): Promise<void> => {
    try {
      setBusy(true)
      await (!isSignedIn ? auth?.signIn() : auth?.signOut())
    } catch (err) {
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Button variant="contained" color="primary" disabled={!ready || busy} onClick={loginOrOut}>
          {!isSignedIn ? "Login" : "Logout"}
        </Button>
        {(!ready || busy) && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
    </div>
  )
}

const SecondLoginButton: React.FC = () => {
  const classes = useStyles()

  const loginOrOut = ({ auth, isSignedIn }: GoogleLoginContext) => async (): Promise<void> => {
    if (!auth) {
      return
    }
    try {
      await (!isSignedIn ? auth.signIn() : auth.signOut())
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <WithGoogleLogin>
      {(googleLoginContext: GoogleLoginContext): JSX.Element => {
        const { ready, isSignedIn } = googleLoginContext
        return (
          <div className={classes.root}>
            <div className={classes.wrapper}>
              <Button variant="contained" color="primary" disabled={!ready} onClick={loginOrOut(googleLoginContext)}>
                {!isSignedIn ? "Login" : "Logout"}
              </Button>
            </div>
          </div>
        )
      }}
    </WithGoogleLogin>
  )
}

const App: React.SFC = () => (
  <GoogleLoginProvider
    clientConfig={{
      client_id: "948918026196-q49uid1opmf7oid570ptpl7kd1alcjru.apps.googleusercontent.com",
    }}
  >
    <Container maxWidth="sm">
      <LoginButton />
      <SecondLoginButton />
      <WithGoogleUser>
        {({ user, isSignedIn }): JSX.Element | null => {
          if (!isSignedIn || !user) {
            return null
          }
          const { name, email, imageUrl } = getProfile(user)
          const { id_token } = getTokens(user)
          return (
            <div>
              <h1>{name}</h1>
              <h2>{email}</h2>
              <img src={imageUrl} />
              <pre style={{ whiteSpace: "pre-wrap", hyphens: "manual", overflowWrap: "break-word" }}>{id_token}</pre>
            </div>
          )
        }}
      </WithGoogleUser>
    </Container>
  </GoogleLoginProvider>
)
ReactDOM.render(<App />, document.getElementById("root"))
