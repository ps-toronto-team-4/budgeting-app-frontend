import { useQuery } from "@apollo/client";
import { ReactElement, useEffect, useRef, useState } from "react";
import { Category, GetExpensesDocument, GetExpensesQuery } from "../components/generated";
import { Button, ColorValue, TouchableHighlight } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  ScrollView,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RootTabScreenProps } from "../types";
import AddButton from "../components/AddButton";
import { useAuth } from "../hooks/useAuth";

//TODO
// - *IMPORTANT* fix virtualization issue
// - Have special names for today and yesterday
// - close delete on back navigate
// - make deltet a trash can
// - lazy render of lists


const Separator = () => <View style={styles.itemSeparator} />;
const LeftSwipeActions = (selectedColor: String) => {
  return (
    <View
      style={{ flex: 1, backgroundColor: selectedColor as ColorValue, justifyContent: 'center' }}
    >
      <Text style={styles.seeDetailsText}>
        {`See details >>>`}
      </Text>
    </View>
  );
};
const rightSwipeActions = ({ id }: { id: number | null | undefined }) => {
  return (
    <View style={styles.deleteContainer}>
      <Text style={styles.deleteText}>
        Delete
      </Text>
    </View>
  );
};
const swipeFromLeftOpen = ({ id, navigateCallBack, swipeableRef }
  : { id: number | null | undefined, navigateCallBack: Function, swipeableRef: React.MutableRefObject<any> }) => {
  if (swipeableRef.current != null) {
    const casted = swipeableRef as React.MutableRefObject<Swipeable>
    casted.current.close()
  }
  navigateCallBack(id)
};
const ListItem = ({ id, title, amount, description, category, navigateCallBack }:
  {
    id?: number | null | undefined,
    title?: String | null | undefined,
    amount?: Number | null | undefined,
    description?: String | null | undefined,
    category?: Category | null | undefined,
    navigateCallBack: Function
  }) => {
  const swipeableRef = useRef(null);
  const selectedColor = (category?.colourHex) ? '#' + category.colourHex : '#03c2fc'
  return (
    <Swipeable
      ref={swipeableRef}
      // renderLeftActions={() => LeftSwipeActions(selectedColor)}
      renderRightActions={() => rightSwipeActions({ id })}
      onSwipeableLeftOpen={() => swipeFromLeftOpen({ id, navigateCallBack, swipeableRef })}
    >
      <View style={styles.expenseItemWrapper}>
        <View style={{ flexBasis: 10, width: 10, backgroundColor: selectedColor }}></View>
        <TouchableHighlight
          style={{ flex: 1 }}
          onPress={() => navigateCallBack(id)}
        >
          <View style={styles.expenseItemDisplayContainer}>
            <Text style={{ flex: 1, fontSize: 24 }}>
              {category?.name || 'Uncategorized'}
            </Text>
            <Text style={{ fontSize: 24 }}>
              ${amount}
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    </Swipeable>
  )
};

export default function ExpensesScreen({ navigation }: RootTabScreenProps<'Expenses'>) {
  const passwordHash = useAuth();
  const [amountToRender, setAmountToRender] = useState(20);
  const { loading, error, data } = useQuery<GetExpensesQuery>(GetExpensesDocument, {
    variables: { passwordHash }
  });
  const navigateCallBack = (id: number | null | undefined) => {
    if (id === undefined || id == null) {
      alert("Transaction could not be found!")
    } else {
      navigation.navigate('ExpenseDetails', { expenseId: id, refresh: false })
    }

  }
  const dailyGrouping = splitTransationsOnDate(data, amountToRender)
  function handleAddExpense() {
    navigation.navigate('CreateExpense', { refresh: false });
  }

  const FakeFlatList = (
    {
      data,
      title,
      renderItem,
      ItemSeparatorComponent }:
      {
        data: Array<any>,
        title: string,
        key: number | string,
        renderItem: (item: any) => ReactElement,
        ItemSeparatorComponent: () => ReactElement
      }) => {

    const itemsRender = data.map((item: any, index: number) => {

      return (<View key={index}>
        {index != 0 && ItemSeparatorComponent()}
        {renderItem({ item })}
      </View>)
    })

    return (<View>
      <Text>{title}</Text>
      {itemsRender}
      {/* <Text>hi</Text> */}
    </View>)
  }


  return (
    <>
      <StatusBar />
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', marginVertical: 20 }}>
          Expenses
        </Text>
        <ScrollView>
          {dailyGrouping && (
            <View>
              {dailyGrouping.map((gItem, index) => {
                return (<FakeFlatList
                  data={gItem.item}
                  title={gItem.key}
                  key={index}
                  renderItem={({ item }) => <ListItem {...item} navigateCallBack={navigateCallBack} />}
                  ItemSeparatorComponent={() => <Separator />}
                />)
              })}
              <Button title="Load More Expenses" onPress={() => setAmountToRender(amountToRender + 20)} />
            </View>)
          }
          {data?.expenses.__typename == 'FailurePayload' && <View>
            <Text>{data.expenses.errorMessage}</Text>
            <Text>{data.expenses.exceptionName}</Text>
          </View>}
        </ScrollView>
      </SafeAreaView>
      <AddButton style={styles.addExpenseBtn} accessibilityLabel="Button to Add Expense" size={100} onPress={handleAddExpense}></AddButton>

    </>
  );
}

const splitTransationsOnDate = (data: GetExpensesQuery | undefined, amountToRender: number) => {
  if (data === undefined || data?.expenses.__typename == 'FailurePayload') {
    return undefined
  }

  let dailyGrouping: { [key: string]: Array<any> } = {}

  if (data.expenses.__typename == 'ExpensesSuccess') {
    const listOfEle = JSON.parse(JSON.stringify(data.expenses.expenses));

    listOfEle.sort((a: any, b: any) => {
      if (a === undefined || b === undefined || a == null || b == null) {
        return 0
      }
      if (a.date > b.date) {
        return -1
      } else if (a.date < b.date) {
        return 1
      }
      return 0
    })
    listOfEle.slice(0, amountToRender).forEach((item: any) => { // REMOIVE THIS AFTER DEMO- TOO LAGGY WITH OUT
      if (item?.date == undefined) {
        console.warn("date is undefined for transation")
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
  seeDetailsText: {
    color: '#40394a',
    paddingHorizontal: 10,
    fontWeight: '100',
    fontSize: 30,
    paddingVertical: 20,
  },
  deleteContainer: {
    backgroundColor: '#fc0303',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  deleteText: {
    color: '#1b1a17',
    paddingHorizontal: 10,
    fontWeight: '600',
    paddingVertical: 20,
  },
  expenseItemDisplayContainer: {
    flex: 1,
    flexDirection: "row",
    alignContent: "space-between",
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  expenseItemWrapper: {
    flex: 1,
    flexDirection: "row",
  },
  addExpenseBtn: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
});