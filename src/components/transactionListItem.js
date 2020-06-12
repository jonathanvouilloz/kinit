import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import colors from '../static/color'
import Icons from 'react-native-vector-icons/Entypo';


export default function transactionItem({title, goToNewTransaction}) {
  return (
    <View style={styles.main}>
        <View style={styles.leftContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>course lundi migros</Text>
            </View>
            <View style={styles.amountContainer}>
                <Text style={styles.amountText}>+ 45.94 CHF</Text>
            </View>
        </View>
        <View style={styles.rightContainer}>
            <TouchableWithoutFeedback onPress={() => goToNewTransaction(title)}>
                            <Icons name="dots-three-vertical" color={colors.CUS_WHITE} size={30}></Icons>
            </TouchableWithoutFeedback>
        </View>
     </View>
  );
}


const styles = StyleSheet.create({
    main:{
        borderRadius:15,
        backgroundColor:colors.LIGHT_PRIMARY,
        marginBottom:5,
        height:80,
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
        justifyContent:'flex-end',
        paddingLeft:15
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
        fontSize:15,
        color:colors.CUS_WHITE
    }
  });