import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import colors from '../static/color'
import Icons from 'react-native-vector-icons/AntDesign';
import { Button } from 'react-native-elements';
import {Picker} from '@react-native-community/picker'
import { selectTransaction, recupCaution } from '../services/storeNewTransaction'
import { useSelector, useDispatch } from 'react-redux'
import { addcamp, addalltransa } from '../redux/campsApp'


export default function componentName({navigation: { goBack }, route }) {


    const [selectedValue, setSelectedValue] = useState("CHF");
    const [loaded, setLoaded] = useState(false);
    const [transa, setTransa] = useState({transa:"null"});

    const campsRedux = useSelector(state => state);
    const dispatch = useDispatch()
    const addAllTransa = theArray => dispatch(addalltransa(theArray))
    const addCamp = camp => dispatch(addcamp(camp))

       
    useEffect(() => {
        getInitialData();
      }, [])

    const getInitialData = async function(){
        const transaction = await selectTransaction(route.params.item.id);
        setTransa(transaction)
        setLoaded(true);
    }

    const delTransa = function(){

        Alert.alert(
            "Supprimer la transaction",
            "Êtes-vous sûr de vouloir annuler la transaction ? L'opération est irréversible",
            [
              {
                text: "Oui",
                onPress: () => del(),  
              },
              { text: "Annuler", onPress: () => {return}, style: "cancel"}
            ],
            { cancelable: false }
          );
    }

    const del = async function(){
        
        
        const caution = await recupCaution(route.params.item.id, route.params.item.montant, campsRedux.camp.solde, false, route.params.item.typeTransaction);

        let newSolde;
        if(caution){
            addAllTransa(caution);
            if(route.params.item.typeTransaction===1){
                newSolde = campsRedux.camp.solde/1-route.params.item.montant/1;
            }else{
                newSolde = campsRedux.camp.solde/1+route.params.item.montant/1;
            }
            const campUpdated = { id: campsRedux.camp.id, name: campsRedux.camp.name, solde: newSolde, soldeInitial: campsRedux.camp.soldeInitial, caution: campsRedux.camp.caution};
            addCamp(campUpdated);
          } 
        goBack();
    }

    const updateCaution = async function(){

        const caution = await recupCaution(route.params.item.id, route.params.item.montant, campsRedux.camp.solde, true, 2);
        console.log("caution ", caution);
        
        if(caution){
            addAllTransa(caution);
            let newCaution = campsRedux.camp.caution/1-route.params.item.montant/1;
            const campUpdated = { id: campsRedux.camp.id, name: campsRedux.camp.name, solde: campsRedux.camp.solde/1+route.params.item.montant/1, soldeInitial: campsRedux.camp.soldeInitial, caution: parseFloat(newCaution).toFixed(2)};
            addCamp(campUpdated);
          } 
        goBack();
    }

    return (
        <ScrollView style={styles.main}>
            {loaded ? 
            <View>
            <View style={styles.containerTitle}>
                <View style={styles.goBack}>
                    <TouchableWithoutFeedback onPress={() => goBack()}>
                        <Icons size={35} color={colors.LIGHT_PRIMARY} name="back"></Icons>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Détails</Text>
                </View>
                <View style={styles.goBack} />
            </View>
            <View style={styles.descrContainer}> 
                <Text style={styles.description}>{transa.name}</Text>
            </View>
            <View style={styles.containerDetails}>
                <View style={styles.typeTransa}>
                    <Text style={styles.textTypeTransa}>{transa.typeTransaction === 0 ? "Débit de" : transa.typeTransaction === 1 ? "Crédit de:" : "Caution de"}</Text>
                </View>
                <View style={styles.amountTransa}>
                    <TextInput value={transa.montant.toString()} keyboardType="number-pad" style={styles.textAmount}></TextInput>
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
                {transa.image === "null" ? <View style={{justifyContent:'center',flex:1, alignItems:'center'}}><Text style={styles.textTypeTransa}>Pas d'image disponible</Text><Icons style={{paddingTop:15}} name="unknowfile1" color={colors.LIGHT_WHITE} size={55} /></View> :
                
                <Image source={{uri:`data:image/gif;base64,${transa.image}` }} style={{ flex: 1, width: undefined, height: undefined, borderRadius: 25 }} resizeMode="contain" />
            }
                    </View>
            <View style={styles.saveContainer}>
                {transa.typeTransaction === 2 ?
                <Button
                    title="Caution récupérée"
                    type="outline"
                    onPress={()=>updateCaution()}
                    buttonStyle={styles.buttonV2}
                    titleStyle={styles.buttonTitleV2}
                    containerStyle={{ width: '100%', marginLeft: 0 }}
                />:
                <Button
                    title="Supprimer la transaction"
                    type="outline"
                    onPress={()=>delTransa()}
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonTitle}
                    containerStyle={{ width: '100%', marginLeft: 0, marginBottom:10 }}
                />
                }
            </View>
            </View>
            : 
            <View>
                <ActivityIndicator size="large" color={colors.LIGHT_WHITE} />
            </View>
            }
        </ScrollView>
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
    description: {
        fontSize: 16,
        color: colors.CUS_WHITE,
    },
    containerTitle: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 15
    },
    saveContainer: {
        height: 150,
        marginHorizontal: 15,
        justifyContent: 'center'
    },
    containerTransactions: {
        height:250,
        marginHorizontal: 15,
        paddingTop: 15,
    },
    containerDetails: {
        height:100,
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
    descrContainer: {
        flex: 3,
        marginHorizontal:15
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
    button: {
        borderColor: colors.RED,
        borderRadius: 25
    },
    buttonTitle: {
        color: colors.RED
    },
    buttonV2: {
        borderColor: colors.ORANGE,
        borderRadius: 25
    },
    buttonTitleV2: {
        color: colors.ORANGE
    }
});