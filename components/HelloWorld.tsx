import { Text } from 'react-native';
import { gql, useQuery } from '@apollo/client';

const query = gql`
    query getMusk {
        company {
            ceo
        }
    }
`;

export default function HelloWorld() {
    const { loading, error, data } = useQuery(query);

    return (
        <Text>Hello World {loading ? "Still loading" : data.company.ceo}</Text>
    );
}