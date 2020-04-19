import React from "react"
import { hot } from "react-hot-loader"

import { Container } from "semantic-ui-react"

import { MDXProvider } from "@mdx-js/react"
import Content from "./index.mdx"

import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight"

import { GoogleLoginProvider } from "@cs125/react-google-login"

const components = {
  code: SyntaxHighlighter,
}
const App: React.SFC = () => (
  <GoogleLoginProvider
    clientConfig={{
      client_id: "948918026196-q49uid1opmf7oid570ptpl7kd1alcjru.apps.googleusercontent.com",
    }}
  >
    <Container text style={{ paddingTop: 16 }}>
      <MDXProvider components={components}>
        <Content />
      </MDXProvider>
    </Container>
  </GoogleLoginProvider>
)
export default hot(module)(App)
