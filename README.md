# budgeting-app-frontend

## Dev requirements
- Node >=16.0.0 <17.0.0 (expo only works for these versions)

Don't have this specific version of node? Check out [nvm](https://github.com/coreybutler/nvm-windows#installation--upgrades). After installing, run the following if you are on Linux or wsl:

```sh
nvm install 16.15.1
nvm use 16.15.1
```

To make this node version your default, it is recommended you run:

```sh
nvm alias default 16.15.1
```

## Dev setup

```sh
git clone git@github.com:ps-toronto-team-4/budgeting-app-frontend.git
cd budgeting-app-frontend
npm install
npm start
```

To make writing graphql easier, it is recommended you install the [Apollo GraphQL](https://marketplace.visualstudio.com/items?itemName=apollographql.vscode-apollo) VSCode extension. It will read the endpoints in the apollo.config.js file and provide intellisense when writing graphql queries. 

## Style Guide for Devs

- Tabs are 4 spaces
- Statements must end in a semicolon
- Each file must end with a newline

## Resources
- [React Native - Getting Started](https://reactnative.dev/docs/getting-started)
- [React Native - Components Doc](https://reactnative.dev/docs/components-and-apis)
- [Expo Docs](https://docs.expo.dev/)
- [Expo Icons](https://icons.expo.fyi/)
- [Apollo Client with React](https://www.apollographql.com/docs/react)
- [Apollo Client - React Native Integration](https://www.apollographql.com/docs/react/integrations/react-native)
- [GraphQL Language Reference](https://graphql.org/learn/)
- [GraphQL Code Generator for React/Apollo](https://www.graphql-code-generator.com/docs/guides/react#apollo-and-urql)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
