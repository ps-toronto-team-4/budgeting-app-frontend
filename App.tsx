import { ActivityIndicator, AppRegistry, StyleSheet } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Initialize Apollo Client
const client = new ApolloClient({
  // uri: 'https://backend.ps4.bornais.ca/graphql',
  uri: 'http://localhost:9090/graphql',
  cache: new InMemoryCache()
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