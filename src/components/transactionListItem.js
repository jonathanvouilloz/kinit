import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import colors from '../static/color'
import Icons from 'react-native-vector-icons/Entypo';


export default function transactionItem({transa, goToNewTransaction}) {    
    console.log(transa);
    
  return (
    <View style={styles.main}>
        <View style={styles.leftContainer}>
        <View style={styles.titleContainer2}>
                <Text style={styles.dateText}>{transa.name}</Text>
            </View>
            <View style={styles.titleContainer}>
                <Text numberOfLines={1} style={styles.titleText}>{transa.id}</Text>
            </View>
            <View style={styles.amountContainer}>
                <Text style={styles.amountText}>~ 45.94 CHF</Text>
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
    amountText:{
        fontSize:25,
        color:colors.GREEN
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