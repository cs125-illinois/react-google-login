# @cs125/react-google-login

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
