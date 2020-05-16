import React from "react"
import { Helmet } from "react-helmet"
import PropTypes from "prop-types"
import { hot } from "react-hot-loader"

import { Container } from "semantic-ui-react"
import "semantic-ui-css/components/container.min.css"

import { MDXProvider } from "@mdx-js/react"
import Content from "./index.mdx"

import Children from "react-children-utilities"
import PrismLight from "react-syntax-highlighter/dist/esm/prism-light"
import style from "react-syntax-highlighter/dist/esm/styles/prism/tomorrow"
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash"
PrismLight.registerLanguage("bash", bash)
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx"
PrismLight.registerLanguage("tsx", tsx)

import { GoogleLoginProvider } from "@cs125/react-google-login"

interface CodeBlockProps {
  className?: string
  children: React.ReactNode
}
const CodeBlock: React.FC<CodeBlockProps> = (props) => {
  const { className, children } = props
  const language = className?.replace(/language-/, "") || ""
  const contents = Children.onlyText(children).trim()
  return (
    <PrismLight style={style} language={language} customStyle={{ fontSize: "0.9rem" }}>
      {contents}
    </PrismLight>
  )
}
CodeBlock.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}
CodeBlock.defaultProps = {
  className: "",
}

const components = {
  code: CodeBlock,
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
