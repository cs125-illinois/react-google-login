import React from "react"
import { Helmet } from "react-helmet"
import { hot } from "react-hot-loader"

import { Container } from "semantic-ui-react"

import { MDXProvider } from "@mdx-js/react"
import Content from "./index.mdx"

import { Highlighted } from "@cs125/semantic-ui"

import { GoogleLoginProvider } from "@cs125/react-google-login"

const components = {
  code: Highlighted,
}
const App: React.SFC = () => (
  <React.Fragment>
    <Helmet>
      <title>@cs125/react-google-login Examples (v{process.env.npm_package_version})</title>
      <meta name="description" content={process.env.npm_package_description} />
    </Helmet>
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
  </React.Fragment>
)
export default hot(module)(App)
