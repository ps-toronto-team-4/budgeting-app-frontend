import { useQuery } from '@apollo/client';
import { Text, View } from './Themed';
import { GetMuskDocument, GetMuskQuery } from './generated';

export default function GraphqlTest() {
    const { loading, error, data } = useQuery<GetMuskQuery>(GetMuskDocument);

    return (
        <Text
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)">
            {loading ? "Still loading..." : "According to their api, the ceo of SpaceX is: " + data?.company?.ceo}
        </Text>
    );
}
