import React from "react"

import "@cs125/semantic-ui/semantic.min.css"

import { GoogleLoginProvider } from "@cs125/react-google-login"
import { Container } from "semantic-ui-react"
import { MDXProvider } from "@mdx-js/react"
import Content from "./index.mdx"

const App: React.FC = () => (
  <GoogleLoginProvider
    clientConfig={{
      client_id: "948918026196-q49uid1opmf7oid570ptpl7kd1alcjru.apps.googleusercontent.com",
    }}
  >
    <Container text style={{ paddingTop: 16 }}>
    <MDXProvider components={{}}>
      <Content />
    </MDXProvider>
    </Container>
  </GoogleLoginProvider>
)
export default App
