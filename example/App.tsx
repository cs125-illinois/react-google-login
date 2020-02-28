import React from "react"

import { Container } from "semantic-ui-react"
import styled from "styled-components"

import { MDXProvider } from "@mdx-js/react"
import Content from "./index.mdx"

import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight"

import { GoogleLoginProvider } from "@cs125/react-google-login"

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
    </PaddedContainer>
  </GoogleLoginProvider>
)
export default App
