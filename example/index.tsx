import "react-app-polyfill/ie11"
import "babel-polyfill"
import "semantic-ui-css/semantic.min.css"

import React from "react"
import ReactDOM from "react-dom"

import { Container } from "semantic-ui-react"
import styled from "styled-components"

import { MDXProvider } from "@mdx-js/react"
import Content from "./index.mdx"

import SyntaxHighlighter from "react-syntax-highlighter"

import { GoogleLoginProvider, WithGoogleUser, getProfile, getTokens } from "@cs125/react-google-login"

const PaddedContainer = styled(Container)({
  paddingTop: 16,
})
const components = {
  code: SyntaxHighlighter,
}
const App: React.SFC = () => (
  <GoogleLoginProvider
    clientConfig={{
      client_id: "948918026196-q49uid1opmf7oid570ptpl7kd1alcjru.apps.googleusercontent.com",
    }}
  >
    <PaddedContainer text>
      <MDXProvider components={components}>
        <Content />
      </MDXProvider>
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
    </PaddedContainer>
  </GoogleLoginProvider>
)
ReactDOM.render(<App />, document.getElementById("root"))
