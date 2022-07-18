import { useQuery } from "@apollo/client";
import { useState } from "react";
import { Category, GetExpensesDocument, GetExpensesQuery } from "../components/generated";
import { ColorValue } from "react-native"

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RootTabScreenProps } from "../types";
const todoList = [
  { id: '1', text: 'Learn JavaScript' },
  { id: '2', text: 'Learn React' },
  { id: '3', text: 'Learn TypeScript' },
];
const Separator = () => <View style={styles.itemSeparator} />;
const LeftSwipeActions = (selectedColor: String) => {
  return (
    <View
      style={{ flex: 1, backgroundColor: selectedColor as ColorValue, justifyContent: 'center' }}
    >
      <Text
        style={{
          color: '#40394a',
          paddingHorizontal: 10,
          fontWeight: '100',
          fontSize: 30,
          paddingVertical: 20,
        }}
      >
        {`See details >>>`}
      </Text>
    </View>
  );
};
const rightSwipeActions = () => {
  return (
    <View
      style={{
        backgroundColor: '#fc0303',
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}
    >
      <Text
        style={{
          color: '#1b1a17',
          paddingHorizontal: 10,
          fontWeight: '600',
          paddingVertical: 20,
        }}
      >
        Delete
      </Text>
    </View>
  );
};
const swipeFromLeftOpen = () => {
  alert('Swipe from left');
};
const swipeFromRightOpen = () => {
  // alert('Swipe from right');
  //do nothing
};
const ListItem = ({ id, title, amount, description, category }:
  {
    id?: number | null | undefined,
    title?: String | null | undefined,
    amount?: Number | null | undefined,
    description?: String | null | undefined,
    category?: Category | null | undefined
  }) => {

  const selectedColor = (category?.colourHex) ? '#' + category.colourHex : '#03c2fc'
  return (<Swipeable
    renderLeftActions={() => LeftSwipeActions(selectedColor)}
    renderRightActions={rightSwipeActions}
    onSwipeableRightOpen={swipeFromRightOpen}
    onSwipeableLeftOpen={swipeFromLeftOpen}
  >
    <View style={{
      flex: 1,
      flexDirection: "row",
    }}>
      <View style={{ flexBasis: 10, width: 10, backgroundColor: selectedColor }}></View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignContent: "space-between",
          paddingHorizontal: 30,
          paddingVertical: 20,
          backgroundColor: 'white',
        }}
      >

        <Text style={{ flex: 1, fontSize: 24 }}>
          {title}
        </Text>
        <Text style={{ fontSize: 24 }}>
          ${amount}
        </Text>
      </View>
    </View>
  </Swipeable>)
};

export default function ExpensesScreen({ navigation }: RootTabScreenProps<'Expenses'>) {
  const [passwordHash, setPasswordHash] = useState('$2a$06$W0DqcQ.eGA.eGA.eGA.eG.9QuFuYui/jdsCyGWdU8lh5AM2tUV0o2');
  const { loading, error, data } = useQuery<GetExpensesQuery>(GetExpensesDocument, {
    variables: { passwordHash }
  });
  console.log(data);
  const dailyGrouping = splitTransationsOnDate(data)
  return (
    <>
      <StatusBar />
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', marginVertical: 20 }}>
          Expenses
        </Text>

        <Text>All</Text>
        <View style={{ flex: 1 }}>
          {!loading && data?.expenses.__typename == 'ExpensesSuccess' &&
            <FlatList
              style={{ flex: 1 }}
              data={data?.expenses.expenses}
              keyExtractor={(item) => {
                if (item == null) {
                  return ''
                }
                return String(item.id)
              }}
              renderItem={({ item }) => <ListItem {...item} />}
              ItemSeparatorComponent={() => <Separator />}
            />
          }
        </View>
        <Text>Dates</Text>
        <View>
          {dailyGrouping &&
            dailyGrouping.map((gItem, index) => {

              return (<View>
                <Text>{gItem.key}</Text>{gItem.item.map((dailyItem, dailyIndex) => {
                  console.log("calvin", dailyItem)
                  return (
                    <FlatList
                      data={gItem.item}
                      keyExtractor={(ele) => {
                        if (ele == null) {
                          return ''
                        }
                        return String(ele.id)
                      }}
                      renderItem={({ item }) => <ListItem {...item} />}
                      ItemSeparatorComponent={() => <Separator />}
                    />
                  )
                })}</View>)
            })}
        </View>
      </SafeAreaView>
    </>
  );
}

const splitTransationsOnDate = (data: GetExpensesQuery | undefined) => {
  if (data === undefined || data?.expenses.__typename == 'FailurePayload') {
    return undefined
  }

  var dailyGrouping: { [key: string]: Array<any> } = {}

  if (data.expenses.__typename == 'ExpensesSuccess') {
    data.expenses.expenses.forEach(item => {
      if (item?.date == undefined) {
        return
      }
      const date = item?.date.split(' ')[0]
      if (!(date in dailyGrouping)) {
        dailyGrouping[date] = []
      }
      dailyGrouping[date].push(item)
    })
  }
  const orderDays: Array<{ key: string, item: Array<any> }> = Object.keys(dailyGrouping).map(key => {
    return {
      key: key,
      item: dailyGrouping[key]
    }
  }).sort((a, b) => {
    if (a.key < b.key) {
      return 1
    } else if (a.key > b.key) {
      return -1
    }
    return 0
  })
  return orderDays
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemSeparator: {
    flex: 1,
    flexBasis: 2,
    backgroundColor: '#c9c9c9',
  },
});
