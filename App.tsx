import { ActivityIndicator, AppRegistry, Platform, StyleSheet } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'https://backend.ps4.bornais.ca/graphql',
  // uri: 'http://localhost:9090/graphql',
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
          <StatusBar backgroundColor='black' style={Platform.OS === 'android' ? 'light' : 'dark'} />
          <Navigation colorScheme={colorScheme} />
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