import React from "react"
import PropTypes from "prop-types"

import "@cs125/semantic-ui/dist/css/semantic.min.css"

import { GoogleLoginProvider } from "@cs125/react-google-login"

const Root = ({ element }) => {
  return (
    <GoogleLoginProvider
      clientConfig={{
        client_id: "948918026196-q49uid1opmf7oid570ptpl7kd1alcjru.apps.googleusercontent.com",
      }}
    >
      {element}
    </GoogleLoginProvider>
  )
}
Root.propTypes = {
  element: PropTypes.node.isRequired,
}
export { Root as wrapRootElement }
