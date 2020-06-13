import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, TextInput, Picker, Image, KeyboardAvoidingView, ScrollView, AsyncStorage } from 'react-native';
import colors from '../static/color'
import * as ImagePicker from 'expo-image-picker';
import Icons from 'react-native-vector-icons/AntDesign';
import { Button, ButtonGroup, Overlay } from 'react-native-elements';
import Constants from 'expo-constants';
import storeNewEntry from "../services/storeNewTransaction"
import CheckBox from '@react-native-community/checkbox'



let débit = () => <Icons size={25} color={colors.CUS_WHITE} name="minus"></Icons>
let crédit = () => <Icons size={25} color={colors.CUS_WHITE} name="plus"></Icons>


export default function componentName({ navigation: { goBack } }) {

  //data pour nouvelle entry
  //0 = débit, 1 = crédit
  const [newSolde, setNewSolde] = useState(4594);
  const [soldeActuel, setSolde] = useState(4594);
  const [typeTransaction, setTransaction] = useState(0);
  const [montant, setMontant] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("null");
  const [devise, setDevise] = useState("CHF");
  const [caution, setCaution] = useState(false);
  //utilitaire
  const [accepted, setAccepted] = useState(false);
  const [isModalValiation, setValidVisible] = useState(false);


  const buttons = [{ element: débit }, { element: crédit }]


  useEffect(() => {
    console.log("helo");
    const newSolde = calcNewSolde(typeTransaction, montant);
    setNewSolde(newSolde);
  }, [typeTransaction])

  useEffect(() => {
    console.log("helo");
    const newSolde = calcNewSolde(typeTransaction, montant);
    setNewSolde(newSolde);
  }, [montant])


  const updateType = function (type) {
    setTransaction(type);
    if (type === 1) {
      setCaution(false);
    }
  };

  const toggleOverlay = () => {
    setValidVisible(!isModalValiation);
  };

  const calcNewSolde = function (typeTransa, montantA) {
    let newSoldeV = soldeActuel;

    switch (typeTransa) {
      case 0:
        newSoldeV = soldeActuel - montantA;
        break;
      case 1:
        newSoldeV = soldeActuel + montantA / 1;
        break;
      default:
        newSoldeV = soldeActuel - montantA;
        break;
    }

    return newSoldeV;
  }

  const storeData = function () {
    const entry = {
      "typeTransaction": typeTransaction,
      "description": description,
      "montant": montant,
      "image": image,
      "devise": devise
    }
    storeNewEntry(entry);
  }

  const updateDevise = function (currency) {
    setDevise(currency)
  };

  const updateDescription = function (desc) {
    setDescription(desc)
  };

  const updateMontant = function (montant) {
    setMontant(montant);
  };

  const updateCaution = function (val) {
    setCaution(val);
    if (val) {
      setTransaction(0);
    }
  }

  useEffect(() => {
    (async () => {
      if (Constants.platform.ios) {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Désolé, nous avons besoin des autorisations de caméra pour que cela fonctionne!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.3,
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result.base64);
      setAccepted(true);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.main}>
      <ScrollView style={{ marginTop: 25 }}>
        <View style={styles.containerTitle}>
          <View style={styles.goBack}>
            <TouchableWithoutFeedback onPress={() => goBack()}>
              <Icons size={35} color={colors.LIGHT_PRIMARY} name="back"></Icons>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={styles.title}>Nouvelle transaction</Text>
          </View>
          <View style={styles.goBack} />
        </View>

        <View style={styles.containerSolde}>
          <Text style={styles.textSolde}>4594 CHF</Text>
        </View>

        {/* Container des input */}
        <View style={styles.containerTransactions}>

          {/* Input type de transaction */}
          <ButtonGroup
            onPress={(type) => updateType(type)}
            selectedIndex={typeTransaction}
            buttons={buttons}
            buttonStyle={styles.buttonTypeStyle}
            selectedButtonStyle={{ backgroundColor: colors.LIGHT_PRIMARY }}
            innerBorderStyle={{ color: colors.LIGHT_PRIMARY }}
            containerStyle={{ borderColor: colors.LIGHT_PRIMARY, borderRadius: 25, width: '100%', marginLeft: 0 }}
          />
          <View style={styles.cautionContainer}>
            <CheckBox
              value={caution}
              tintColors={{ true: colors.GREEN, false: colors.CUS_WHITE }}
              tintColor={colors.CUS_WHITE}
              onCheckColor={colors.GREEN}
              onValueChange={(val) => updateCaution(val)}
            />
            <Text style={styles.cautionText}>Argent gelé / Caution</Text>

          </View>


          {/* Input description */}
          <TextInput type="number" style={styles.textAmount} onC onChangeText={(value) => updateDescription(value)} placeholder="Description"></TextInput>

          {/* Input container montant + devise */}
          <View style={styles.containerAmountCurr}>
            <TextInput style={styles.textAmountMontant} onChangeText={(value) => updateMontant(value)} keyboardType="number-pad" placeholder="Montant"></TextInput>
            <View style={styles.textAmountCurr}>
              <Picker
                selectedValue={devise}
                style={{ height: 40, backgroundColor: colors.LIGHT_PRIMARY, color: colors.CUS_WHITE }}
                onValueChange={(itemValue, itemIndex) => updateDevise(itemValue)}
              >
                <Picker.Item label="CHF" value="CHF" />
                <Picker.Item label="EUR" value="EUR" />
              </Picker>
            </View>
          </View>

          <View style={styles.containerPrev}>
            <Text style={styles.prevText}>{soldeActuel}</Text>
            <Text style={[styles.prevTextType, { color: typeTransaction == 1 ? colors.GREEN : colors.RED }]}>{typeTransaction == 1 ? "+" : "-"}</Text>
            <Text style={[styles.prevText, { color: typeTransaction == 1 ? colors.GREEN : colors.RED }]}>{montant}</Text>
            <Text style={styles.prevTextRes}>= {newSolde}</Text>
          </View>


          {/* Input ticket a upload */}
          <Button
            icon={
              <Icons
                name={accepted ? "check" : "camera"}
                size={35}
                color={accepted ? colors.GREEN : "white"}
              />
            }
            iconRight
            type="outline"
            onPress={pickImage}
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
            containerStyle={{ width: '100%', marginLeft: 0 }}
          />
        </View>
        <View style={styles.ContainerButtonAccept}>
          <Button
            onPress={toggleOverlay}
            title="Sauvegarder"
            type="outline"
            buttonStyle={styles.buttonSave}
            titleStyle={styles.buttonSaveTitle}
            containerStyle={{ width: '100%', marginLeft: 0 }}
          />
        </View>
        <Overlay overlayStyle={{borderRadius:15}}  isVisible={isModalValiation} onBackdropPress={toggleOverlay}>
          <View style={{ width: 275, height: 100, justifyContent:'center' }}>
            <Text style={{textAlign:'center',fontSize:20, paddingBottom:15}}>Confimer la transaction</Text>
            <View style={{flexDirection:'row',marginLeft:15}}>
            <Button
            title="Oui"
            type="outline"
            buttonStyle={styles.buttonOverlay}
            titleStyle={styles.buttonSaveTitle}
            containerStyle={{ flex:1 }}
          />
          <Button
            title="Non"
            type="outline"
            buttonStyle={styles.buttonOverlay}
            titleStyle={styles.buttonSaveTitle}
            containerStyle={{  flex:1  }}
          />
            </View>
           
          </View>
        </Overlay>
      </ScrollView>
    </KeyboardAvoidingView>
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
  prevText: {
    fontSize: 18,
    color: colors.CUS_WHITE,
    flex: 4,
    textAlign: 'center',
  },
  prevTextRes: {
    fontSize: 18,
    color: colors.CUS_WHITE,
    flex: 5,
    textAlign: 'center',
  },
  prevTextType: {
    fontSize: 18,
    color: colors.CUS_WHITE,
    flex: 1,
    textAlign: 'center'
  },
  containerSolde: {
    flex: 1,
    marginHorizontal: 15,
    alignItems: 'center',
    paddingVertical: 25
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
    justifyContent: 'center'
  },
  containerTransactions: {
    flex: 3,
    marginHorizontal: 15,
    paddingBottom: 15,
  },

  ContainerButtonAccept: {
    flex: 2,
    justifyContent: "flex-end",
    marginHorizontal: 15,
    paddingBottom: 15,
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
    alignItems: 'center',
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
    fontSize: 18,
    borderRadius: 25,
    color: colors.LIGHT_WHITE,
    borderWidth: 1,
    marginBottom: 15,
    height: 40,
    paddingLeft: 15,
    borderColor: colors.LIGHT_PRIMARY,
    backgroundColor: colors.LIGHT_PRIMARY
  },
  inputFile: {
    fontSize: 18,
    borderRadius: 25,
    color: colors.LIGHT_WHITE,
    borderWidth: 1,
    marginBottom: 15,
    height: 40,
    paddingLeft: 15,
    borderColor: colors.LIGHT_PRIMARY,
    backgroundColor: colors.LIGHT_PRIMARY
  },
  textAmountCurr: {
    borderRadius: 25,
    color: colors.LIGHT_WHITE,
    borderWidth: 1,
    overflow: 'hidden',
    flex: 1,
    height: 40,
    borderColor: colors.LIGHT_PRIMARY,
    backgroundColor: colors.LIGHT_PRIMARY
  },
  textAmountMontant: {
    fontSize: 18,
    borderRadius: 25,
    color: colors.LIGHT_WHITE,
    borderWidth: 1,
    flex: 3,
    height: 40,
    paddingLeft: 15,
    marginRight: 5,
    borderColor: colors.LIGHT_PRIMARY,
    backgroundColor: colors.LIGHT_PRIMARY
  },
  transactionIndication: {
    fontSize: 18,
    borderRadius: 25,
    color: colors.LIGHT_WHITE,
    borderWidth: 1,
    flex: 1,
    height: 40,
    borderColor: colors.DARK_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    borderColor: colors.LIGHT_PRIMARY,
    borderRadius: 25,
    backgroundColor: colors.LIGHT_PRIMARY,
    height: 80
  },
  buttonSave: {
    borderColor: colors.GREEN,
    borderRadius: 25,
    backgroundColor: colors.DARK_PRIMARY,
    height: 45
  },
  buttonOverlay: {
    borderColor: colors.GREEN,
    height: 40,
    width:115,
  },
  buttonSaveTitle: {
    color: colors.GREEN,
  },
  buttonTitle: {
    color: colors.LIGHT_WHITE,
    paddingRight: 15
  },
  buttonTypeTextStyle: {
    fontSize: 40
  },
  buttonTypeStyle: {
    backgroundColor: colors.DARK_PRIMARY,
    borderColor: colors.LIGHT_PRIMARY
  },
  containerAmountCurr: {
    flexDirection: 'row',
    marginBottom: 15
  },
  containerPrev: {
    height: 40,
    flexDirection: 'row'
  },
  cautionContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  cautionText: {
    fontSize: 16,
    color: colors.CUS_WHITE,
    marginLeft: 5
  }
});