import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RootTabScreenProps } from "../types";
import { useAuth } from "../hooks/useAuth";
import { useUnauthRedirect } from "../hooks/useUnauthRedirect";
import { Screen } from "../components/Screen";
import Styles from '../constants/Styles';
import { VictoryChart, VictoryLegend, VictoryPie } from 'victory-native';
import { useQuery } from '@apollo/client';
import { GetCategoriesDocument, GetCategoriesQuery } from '../components/generated';

export default function ReportsScreen({ navigation }: RootTabScreenProps<'Reports'>) {
    const passwordHash = useAuth();

    useUnauthRedirect();

    const { loading: categoriesLoading, data: categoriesData } = useQuery<GetCategoriesQuery>(GetCategoriesDocument,
        { variables: { passwordHash: passwordHash } }
    );

    return (
        <Screen>
            <View style={Styles.center}>
                <VictoryPie
                    padAngle={({ datum }) => datum.y}
                    innerRadius={100}
                    categories={{ x: ["Test1", "Test2"] }}
                    data={[
                        { x: "Test1", y: 5, label: "$" + 5, fill: "purple" },
                        { x: "Test2", y: 6, label: "$" + 6, fill: "black" },

                    ]}
                    style={{
                        data:
                        {
                            fill:
                                ({ datum }) => datum.fill,
                        }
                    }}
                    width={500}
                />
            </View>
            <View style={Styles.center}>
                <VictoryLegend
                    title="Legend"
                    centerTitle
                    orientation='horizontal'
                    gutter={50}
                    data={[
                        { name: "Planned" }, { name: "Actual" }
                    ]}
                />
            </View>
        </Screen>
    );
}



const styles = StyleSheet.create({

});
