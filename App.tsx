import { AppRegistry } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Root from './src/app/Root';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'http://api.spacex.land/graphql', // TODO: change this to our api endpoint
  cache: new InMemoryCache()
});

AppRegistry.registerComponent('MyApplication', () => App);

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Root></Root>
    </ApolloProvider>
  );
}
