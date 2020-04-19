# @cs125/react-google-login

[![npm version](https://badge.fury.io/js/%40cs125%2Freact-google-login.svg)](https://badge.fury.io/js/%40cs125%2Freact-google-login)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

React TypeScript support for [Google Sign-in](https://developers.google.com/identity/sign-in/web/sign-in).

## Install

```bash
npm i @cs125/react-google-login
```

## Use

Wrap your app using the `GoogleLoginProvider` context provider:

```jsx
<GoogleLoginProvider clientConfig={{
  client_id: "YOUR_CLIENT_ID.apps.googleusercontent.com",
}} >
  <RestOfApp ... />
</GoogleLoginProvider>
```

Then see
[`examples/components.tsx`](https://github.com/cs125-illinois/react-google-login/blob/master/example/components.tsx)
for examples of how to use the context provided by the `GoogleLoginProvider`.

## Demo

Visit the demo [here](https://cs125-illinois.github.io/react-google-login/).
