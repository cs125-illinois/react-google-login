import React from "react"
import PropTypes from "prop-types"

import { Container } from "semantic-ui-react"
import { MDXProvider } from "@mdx-js/react"

import { Highlighted } from "@cs125/semantic-ui"
const components = {
  code: Highlighted,
}
const Layout: React.FC = ({ children }) => (
  <Container text style={{ paddingTop: 16 }}>
    <MDXProvider components={components}>{children}</MDXProvider>
  </Container>
)
Layout.propTypes = {
  children: PropTypes.node.isRequired,
}
export default Layout
