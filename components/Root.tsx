import { StyleSheet, View, Text } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { gql, useQuery } from "@apollo/client";

const sampleQuery = gql`
  query getMusk {
    company {
      ceo
    }
  }
`;

export default function Root() {
  const { loading, error, data } = useQuery(sampleQuery);

  if (error) {
    // handle error
  }

  return (
    <View style={styles.container}>
      <Text>{loading ? "Loading graphql response..." : "The ceo of SpaceX is: " + data.company.ceo}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
