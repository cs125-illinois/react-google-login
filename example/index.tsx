if (process.env.NODE_ENV === "development" && module.hot) {
  require("react-hot-loader")
}
import React from "react"
import ReactDOM from "react-dom"

import "react-app-polyfill/ie11"
import "babel-polyfill"

import("./App").then(({ default: App }) => {
  ReactDOM.render(<App />, document.getElementById("root"))
})

if (module.hot) {
  module.hot.accept()
}
