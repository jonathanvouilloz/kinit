import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import colors from '../static/color'
import Icons from 'react-native-vector-icons/Entypo';


export default function transactionItem({transa, goToNewTransaction}) {    
    const {date, currency, typeTransaction, montant, name} = transa;
    const dateFormat = new Date(date).toLocaleDateString();
    

  return (
    <View style={styles.main}>
        <View style={styles.leftContainer}>
        <View style={styles.titleContainer2}>
                <Text style={styles.dateText}>{dateFormat}</Text>
            </View>
            <View style={styles.titleContainer}>
                <Text numberOfLines={1} style={styles.titleText}>{name}</Text>
            </View>
            <View style={styles.amountContainer}>
                {typeTransaction === 0 ?
                    <Text style={styles.amountTextD}>- {montant} {currency === 0 ? "CHF" : "EUR"}</Text>
                :  typeTransaction === 1 ? <Text style={styles.amountTextC}>+ {montant} {currency === 0 ? "CHF" : "EUR"}</Text>
                :   <Text style={styles.amountTextCa}>~ {montant} {currency === 0 ? "CHF" : "EUR"}</Text>
                }   
            </View>
        </View>
        <View style={styles.rightContainer}>
            <TouchableWithoutFeedback onPress={() => goToNewTransaction()}>
                            <Icons name="dots-three-vertical" color={colors.CUS_WHITE} size={35}></Icons>
            </TouchableWithoutFeedback>
        </View>
     </View>
  );
}


const styles = StyleSheet.create({
    main:{
        borderRadius:25,
        backgroundColor:colors.LIGHT_PRIMARY,
        marginBottom:8,
        height:100,
        flexDirection:'row'
    },
    leftContainer:{
        flex:3,
    },
    rightContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    titleContainer:{
        flex:2,
        justifyContent:'center',
        paddingLeft:15,
    },
    titleContainer2:{
        flex:1,
        justifyContent:'flex-end',
        paddingLeft:15,
        paddingTop:10
    },
    amountContainer:{
        flex:3,
        justifyContent:'flex-start',
        paddingLeft:15
    },
    amountTextD:{
        fontSize:25,
        color:colors.RED
    },
    amountTextC:{
        fontSize:25,
        color:colors.GREEN
    },
    amountTextCa:{
        fontSize:25,
        color:colors.ORANGE
    },
    titleText:{
        fontSize:16,
        color:colors.LIGHT_WHITE
    },
    dateText:{
        fontSize:12,
        color:colors.CUS_WHITE
    }
  });