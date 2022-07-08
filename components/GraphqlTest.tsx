import { gql, useQuery } from '@apollo/client';
import { Text, View } from './Themed';

const query = gql`
    query getMusk {
        company {
            ceo
        }
    }
`;

export default function GraphqlTest() {
    const { loading, error, data } = useQuery(query);

    return (
        <Text
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)">
            {loading ? "Still loading..." : "According to their api, the ceo of SpaceX is: " + data.company.ceo}
        </Text>
    );
}
