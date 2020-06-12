import * as React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableWithoutFeedback } from 'react-native';
import colors from '../static/color'
import Icons from 'react-native-vector-icons/AntDesign';
import TransactionListItem from '../components/transactionListItem'


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

  return (
    <View style={styles.main}>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>Diablerets Sensations</Text>
      </View>
      <View style={styles.containerSolde}>
            <Text style={styles.textSolde}>4594 CHF</Text>
      </View>
      <View style={styles.containerAddTransactions}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('AddTransaction')}>
                <Icons size={55} color={colors.LIGHT_PRIMARY} name="pluscircle" />
            </TouchableWithoutFeedback>
      </View>
      <View style={styles.containerTransactions}>
          <FlatList
              data={DATA}
              renderItem={({ item }) => <TransactionListItem title={item.title} goToNewTransaction={(title) => navigation.navigate('Details', {item: item})} />}
              keyExtractor={item => item.id}
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
  }
});