import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Picker, TouchableWithoutFeedback } from 'react-native';
import colors from '../static/color'
import Icons from 'react-native-vector-icons/AntDesign';
import { Button } from 'react-native-elements';



export default function componentName({ navigation: { goBack }, route }) {
    const [selectedValue, setSelectedValue] = useState("CHF");
    const { item } = route.params;
    return (
        <View style={styles.main}>
            <View style={styles.containerTitle}>
                <View style={styles.goBack}>
                    <TouchableWithoutFeedback onPress={()=> goBack()}>
                        <Icons size={35} color={colors.LIGHT_PRIMARY} name="back"></Icons>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.titleContainer}>
                    <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
                </View>
                <View style={styles.goBack} />
            </View>
            <View style={styles.containerDetails}>
                <View style={styles.typeTransa}>
                    <Text style={styles.textTypeTransa}>Crédit de:</Text>
                </View>
                <View style={styles.amountTransa}>
                    <TextInput keyboardType="number-pad" style={styles.textAmount}>4530</TextInput>
                </View>
                <View style={styles.updateTransa}>
                    <View style={{ borderRadius: 25, overflow: 'hidden' }}>
                        <Picker
                            selectedValue={selectedValue}
                            style={{ height: 40, backgroundColor: colors.LIGHT_PRIMARY, color: colors.CUS_WHITE }}
                            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                        >
                            <Picker.Item label="CHF" value="CHF" />
                            <Picker.Item label="EUR" value="EUR" />
                        </Picker>
                    </View>


                </View>
            </View>
            <View style={styles.containerTransactions}>

            </View>
            <View style={styles.saveContainer}>
                <Button
                    title="Sauvegarder"
                    type="outline"
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonTitle}
                    containerStyle={{width: '100%',marginLeft:0}}
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
        fontSize: 20,
        color: colors.CUS_WHITE
    },
    containerTitle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 15
    },
    saveContainer: {
        flex: 1,
        marginHorizontal: 15,
        justifyContent:'center'
    },
    containerTransactions: {
        flex: 5,
        marginHorizontal: 15,
        paddingTop: 15,
        backgroundColor: 'yellow'
    },
    textSolde: {
        textAlign: 'right',
        fontSize: 50,
        color: colors.GREEN
    },
    containerDetails: {
        flex: 1,
        marginHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    goBack: {
        flex: 1
    },
    titleContainer: {
        flex: 3,
        alignItems: 'center'
    },
    updateTransa: {
        flex: 1,
    },
    typeTransa: {
        flex: 2,
    },
    amountTransa: {
        flex: 3,
        paddingRight: 5,
    },
    textTypeTransa: {
        fontSize: 20,
        color: colors.CUS_WHITE
    },
    textAmount: {
        fontSize: 20,
        borderRadius: 25,
        color: colors.CUS_WHITE,
        borderWidth: 1,
        height: 40,
        textAlign: 'center',
        borderColor: colors.LIGHT_PRIMARY,
        backgroundColor: colors.LIGHT_PRIMARY
    },
    button:{
        borderColor:colors.GREEN,
        borderRadius:25
    },
    buttonTitle:{
        color:colors.GREEN
    }
});