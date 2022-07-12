import { useQuery } from '@apollo/client';
import { Text, View } from './Themed';
import { GetPasswordHashDocument, GetPasswordHashQuery } from './generated';
import SignInScreen from '../screens/SignInScreen';

export default function Graphql() {
    const { loading, error, data } = useQuery<GetPasswordHashQuery>(GetPasswordHashDocument);

    return (
        <Text
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)">
            {loading ? "Still loading..." : "User Logged In " + data?.__typename}
        </Text>
    );
}

