import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableWithoutFeedback, Button } from 'react-native';
import colors from '../static/color'
import Icons from 'react-native-vector-icons/AntDesign';
import TransactionListItem from '../components/transactionListItem'
import { useSelector, useDispatch } from 'react-redux'
import { selectCamp, selectTransactions } from '../services/storeNewTransaction'
import { addcamp, addalltransa } from '../redux/campsApp'


export default function Home({ navigation }) {

  const campsRedux = useSelector(state => state);


  //initial data for redux
  const dispatch = useDispatch()
  const addCamp = camp => dispatch(addcamp(camp))
  const addAllTransa = theArray => dispatch(addalltransa(theArray))


  useEffect(() => {
    getInitialData();
  }, [])

  const getInitialData = async function () {
    const camps = await selectCamp();
    const transactions = await selectTransactions();
    
    if (camps) {
      const campRedux = { id: camps.rows.item(0).id, name: camps.rows.item(0).name, solde: camps.rows.item(0).solde };
      addCamp(campRedux);
    }else{
      console.log("pas de camp");  
    }
    if(transactions){
      addAllTransa(transactions)
    }
  }


  return (
    <View style={styles.main}>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>{campsRedux.camp.name ? campsRedux.camp.name : "Aucun camp actif"}</Text>
      </View>
      <View style={styles.containerSolde}>
        <Text style={styles.textSolde}>{campsRedux.camp.solde ? campsRedux.camp.solde : "-"} CHF</Text>
        <Text style={styles.textCaution}>(fonctionnalité à venir)</Text>
      </View>
      <View style={styles.containerAddTransactions}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('AddTransaction')}>
          <Icons size={55} color={colors.LIGHT_PRIMARY} name="pluscircle" />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.containerTransactions}>
        <FlatList
          data={campsRedux.transactions}
          renderItem={({ item }) => <TransactionListItem transa={item} goToNewTransaction={() => navigation.navigate('Details', { item: item })} />}

          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Text style={styles.textEmptyList}>Aucune transaction effectuée</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.DARK_PRIMARY
  },
  title: {
    fontSize: 24,
    color: colors.CUS_WHITE
  },
  containerTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerSolde: {
    flex: 1,
    marginHorizontal: 25,
    alignItems: 'center',
  },
  containerTransactions: {
    flex: 4,
    marginHorizontal: 15,
    paddingTop: 15
  },
  textSolde: {
    textAlign: 'right',
    fontSize: 50,
    color: colors.GREEN
  },
  textCaution: {
    textAlign: 'right',
    fontSize: 14,
    color: "#C8C8C8"
  },
  containerAddTransactions: {
    flex: 1,
    marginHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyList: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textEmptyList: {
    fontSize: 20,
    color: colors.CUS_WHITE
  }
});