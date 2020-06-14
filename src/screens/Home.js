import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableWithoutFeedback, Button } from 'react-native';
import colors from '../static/color'
import Icons from 'react-native-vector-icons/AntDesign';
import TransactionListItem from '../components/transactionListItem'
import { useSelector } from 'react-redux'


const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item dsidjsaidjaisd sidjasi',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-1455715e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-1455711e29d72',
    title: 'Third Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-14552371e29d72',
    title: 'Third Item',
  },
];



export default function Home({navigation}) {

  const camps = useSelector(state => state);
  let array = []

  function iterateOverData(data) {
    for(let key in data) {
      array.push({id: key, name: data[key].name, solde:data[key].solde})
    }
  }

  console.log(camps.transactions);
  if(camps.transactions === undefined){
    console.log("vide");
    
  }else{
    const {transactions} = camps;
      iterateOverData(transactions); 
    };
  
   //premier lancement -> chargement bdd plus ajout dans redux camp actif

  const flatListRender = ({item}) => (
    <TransactionListItem transa={item} goToNewTransaction={(title) => navigation.navigate('Details', {item: item})} />
  )
 
  return (
    <View style={styles.main}>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>{camps.camp ? camps.camp.name : "Aucun camp actif"}</Text>
      </View>
      <View style={styles.containerSolde}>
            <Text style={styles.textSolde}> "-"CHF</Text>
      </View>
      <View style={styles.containerAddTransactions}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('AddTransaction')}>
                <Icons size={55} color={colors.LIGHT_PRIMARY} name="pluscircle" />
            </TouchableWithoutFeedback>
      </View>
      <View style={styles.containerTransactions}>
         
          <FlatList
              data={array === null ? DATA : array}
              renderItem={flatListRender}
              keyExtractor={item => item.id}
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
  main:{
    flex:1,
    backgroundColor:colors.DARK_PRIMARY
  },
  title: {
    fontSize:24,
    color:colors.CUS_WHITE
  },
  containerTitle: {
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  containerSolde: {
    flex:1,
    marginHorizontal:25,
    alignItems:'center',
  },
  containerTransactions: {
    flex:5,
    marginHorizontal:15,
    paddingTop:15
  },
  textSolde:{
    textAlign:'right',
    fontSize:50,
    color:colors.GREEN
  },
  containerAddTransactions:{
    flex:1,
    marginHorizontal:25,
    alignItems:'center',
    justifyContent:'center'
  },
  emptyList:{
    height:100,
    justifyContent:'center',
    alignItems:'center',
  },
  textEmptyList:{
    fontSize:20,
    color:colors.CUS_WHITE
  }
});