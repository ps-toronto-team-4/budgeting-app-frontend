import { ActivityIndicator, AppRegistry, StyleSheet } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

// Initialize Apollo Client
const client = new ApolloClient({
  //uri: 'http://localhost:9090/graphql', // TODO: change this to our api endpoint
  cache: new InMemoryCache(),
  link: new HttpLink({

    uri: 'http://localhost:9090/graphql',

    // fetchOptions: {

    //   mode: 'no-cors'

    // }

  }),
});

AppRegistry.registerComponent('MyApplication', () => App);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return (<ActivityIndicator size='large' style={styles.load} />);
  } else {
    return (
      <ApolloProvider client={client}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </ApolloProvider>
    );
  }
}

const styles = StyleSheet.create({
  load: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});