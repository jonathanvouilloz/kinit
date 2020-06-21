import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, TextInput, KeyboardAvoidingView, ScrollView, Image, ToastAndroid } from 'react-native';
import colors from '../static/color'
import * as ImagePicker from 'expo-image-picker';
import Icons from 'react-native-vector-icons/AntDesign';
import { Button, ButtonGroup, Overlay } from 'react-native-elements';
import Constants from 'expo-constants';
import CheckBox from '@react-native-community/checkbox'
import { Picker } from '@react-native-community/picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { insertTransaction } from "../services/storeNewTransaction"
import { addtransa, addtransafirst, addcamp } from '../redux/campsApp'
import { useDispatch, useSelector } from 'react-redux'
import LottView from "../components/lottietes"



let débit = () => <Icons size={25} color={colors.CUS_WHITE} name="minus"></Icons>
let crédit = () => <Icons size={25} color={colors.CUS_WHITE} name="plus"></Icons>


export default function componentName({ navigation: { goBack } }) {

  //data pour nouvelle entry
  //0 = débit, 1 = crédit
  const [newSolde, setNewSolde] = useState(0);
  const [typeTransaction, setTransaction] = useState(0);
  const [montant, setMontant] = useState();
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("null");
  const [devise, setDevise] = useState(0);
  const [caution, setCaution] = useState(false);
  //utilitaire
  const [accepted, setAccepted] = useState(false);
  const [isModalValiation, setValidVisible] = useState(false);
  const [transactionValid, setTransactionValid] = useState(false);


  const buttons = [{ element: débit }, { element: crédit }]

  //redux
  const addTransaFirst = transa => dispatch(addtransafirst(transa));
  const addTransa = transa => dispatch(addtransa(transa));
  const addCamp = camp => dispatch(addcamp(camp))
  const dispatch = useDispatch()
  const campsRedux = useSelector(state => state);


  useEffect(() => {
    calcNewSolde(typeTransaction, montant);
  }, [typeTransaction])

  useEffect(() => {
    calcNewSolde(typeTransaction, montant);
  }, [montant])

  const updateType = function (type) {
    setTransaction(type);
    if (type === 1) {
      setCaution(false);
    }
  };

  const toggleOverlay =  async () => {
    setValidVisible(!isModalValiation);
  };

  const calcNewSolde = function (typeTransa, montantA) {
    let newSoldeC = newSolde;
    switch (typeTransa) {
      case 0:
        setNewSolde(parseFloat(campsRedux.camp.solde - montantA).toFixed(2))
        break;
      case 1:
        setNewSolde(parseFloat(campsRedux.camp.solde/1 + montantA/1).toFixed(2))
        break;
      default:
        setNewSolde(parseFloat(campsRedux.camp.solde - montantA).toFixed(2))
        break;
    }
  }

  const storeData = async function () {

    if (montant <= 0 || montant === null || montant === undefined) {
      setValidVisible(!isModalValiation);
      ToastAndroid.showWithGravityAndOffset(
        'Merci de remplir le montant de la transaction',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        0,
        50
      );
      return
    }

    if (description === "" || description === null || description === undefined) {
      setValidVisible(!isModalValiation);
      ToastAndroid.showWithGravityAndOffset(
        'Merci de remplir une description',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        0,
        50
      );
      return
    }


    
    if (image === "null" && !caution) {
      setValidVisible(!isModalValiation);
      ToastAndroid.showWithGravityAndOffset(
        "Merci d'attacher une image à cette transaction",
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        0,
        50
      );
      return
    }

    let type;
    if (typeTransaction === 0 && caution) {
      type = 2;
    } else if (typeTransaction === 0) {
      type = 0;

    } else {
      type = 1;
    }
    const transa = {
      typeTransaction: type,
      name: description,
      montant: montant,
      image: image,
      currency: devise,
      idCamp: 1,
    }
    //insert transactions
    const lastInsert = await insertTransaction(transa);
    //add derniere transa dans le store 
    const insertTransaRedux = {
      id: lastInsert.results.id,
      currency: lastInsert.results.currency,
      name: lastInsert.results.name,
      typeTransaction: lastInsert.results.typeTransaction,
      montant: lastInsert.results.montant,
      image: lastInsert.results.image,
      date: lastInsert.results.date
    }
    
    if (lastInsert.first) {
      addTransaFirst(insertTransaRedux);
    } else {
      addTransa(insertTransaRedux); 
    }



    const cautionUpdated = parseFloat(campsRedux.camp.caution).toFixed(2)/1 + parseFloat(montant).toFixed(2)/1;

    if(caution){
      const campUpdated = {
        id: lastInsert.camp.id, name: lastInsert.camp.name, solde: lastInsert.camp.solde, soldeInitial: campsRedux.camp.soldeInitial, caution: cautionUpdated
      }
      addCamp(campUpdated);
    }else{
      const campUpdated = {
        id: lastInsert.camp.id, name: lastInsert.camp.name, solde: lastInsert.camp.solde, soldeInitial: campsRedux.camp.soldeInitial, caution: campsRedux.camp.caution
      }
      addCamp(campUpdated);
    }
    

    setTransactionValid(!transactionValid);

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

  const endOfContinue = function(){
      toggleOverlay();
      setTransactionValid(!transactionValid);
      setCaution(false);
      setMontant();
      setImage("null");
      setDescription("");
      setAccepted(false);
  }
  const endOfGoBack = async function(){
      await toggleOverlay();
      goBack();
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
      quality: 1,
      base64: true,
    },);

    if (!result.cancelled) {
      setImage(result.uri);
      setAccepted(true);
      _resizeImage(result.uri);
    }else{
      setImage("null");
      setAccepted(false);

    }

  };

  const _resizeImage = async (uri) => {
    //console.log(uri);

    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { height: 350 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPG, base64: true }, {
      base64: true
    }
    );
    setImage(manipResult.base64);
  }

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
          <Text style={styles.textSolde}>{campsRedux.camp.solde ? parseFloat(campsRedux.camp.solde).toFixed(2) : "0"} CHF</Text>
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
          <TextInput type="number" style={styles.textAmount} value={description} onChangeText={(value) => updateDescription(value)} placeholder="Description"></TextInput>

          {/* Input container montant + devise */}
          <View style={styles.containerAmountCurr}>
            <TextInput style={styles.textAmountMontant} value={montant} onChangeText={(value) => updateMontant(value)} keyboardType="number-pad" placeholder="Montant"></TextInput>
            <View style={styles.textAmountCurr}>
              <Picker
                selectedValue={devise}
                style={{ height: 40, backgroundColor: colors.LIGHT_PRIMARY, color: colors.CUS_WHITE }}
                onValueChange={(itemValue, itemIndex) => updateDevise(itemValue)}
              >
                <Picker.Item label="CHF" value={0} />
                <Picker.Item label="EUR" value={1} />
              </Picker>
            </View>
          </View>

          <View style={styles.containerPrev}>
            <Text style={styles.prevText}>{parseFloat(campsRedux.camp.solde).toFixed(2)}</Text>
            <Text style={[styles.prevTextType, { color: typeTransaction == 1 ? colors.GREEN : colors.RED }]}>{typeTransaction == 1 ? "+" : "-"}</Text>
            <Text style={[styles.prevText, { color: typeTransaction == 1 ? colors.GREEN : colors.RED }]}>{montant}</Text>
            <Text style={styles.prevTextRes}>= {newSolde}</Text>
          </View>

          {accepted ? <View style={{ height: 200, paddingBottom: 15 }}>
            <Image source={{ uri: `data:image/gif;base64,${image}` }} style={{ flex: 1, width: undefined, height: undefined, borderRadius: 25 }} resizeMode="contain" />
          </View> : <View />}
          {/* Input ticket a upload */}
          <TouchableWithoutFeedback onPress={() => pickImage()}>
            <View style={styles.button}>
              <Icons
                name={accepted ? "check" : "camera"}
                size={35}
                color={accepted ? colors.GREEN : "white"}
              />
            </View>
          </TouchableWithoutFeedback>
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
        <Overlay backdropStyle={styles.overLayBg} isVisible={isModalValiation} onBackdropPress={toggleOverlay}>

          {transactionValid ? 
            
            <View style={{ width: 275, height: 285, paddingHorizontal:10}}>
              <Text style={{ textAlign: 'center', fontSize: 18,paddingTop:5 }}>Transaction validée !</Text>
              <View style={{alignItems:'center',justifyContent:'flex-start'}}><LottView loop={false} size={140} src={require('../../assets/wallet.json')} /></View>
              <View style={{paddingBottom:5, marginTop:25}}>
              <Button
                  title="Nouvelle transaction"
                  type="outline"
                  onPress={() => endOfContinue()}
                  buttonStyle={styles.buttonOverlayOk}
                  titleStyle={styles.buttonSaveTitleOk}
                  containerStyle={{marginBottom:5}}
                />
                <Button
                  title="Quitter"
                  onPress={() => endOfGoBack()}
                  type="outline"
                  buttonStyle={styles.buttonOverlayOk2}
                  titleStyle={styles.buttonSaveTitleOk2}

                /> 
              </View>
                       
            </View>
            :
            <View style={{ width: 285, height: 110 }}>
              <Text style={{ textAlign: 'center',alignItems:'flex-end',paddingTop:10, fontSize: 20,flex:1 }}>Confimer la transaction?</Text>
              <View style={{ flexDirection: 'row',alignItems:'center', marginLeft: 15,flex:1 }}>
                <Button
                  title="Oui"
                  type="outline"
                  onPress={storeData}
                  buttonStyle={styles.buttonOverlay}
                  titleStyle={styles.buttonSaveTitleOk}
                  containerStyle={{ flex: 1 }}
                />
                <Button
                  title="Non"
                  onPress={toggleOverlay}
                  type="outline"
                  buttonStyle={styles.buttonOverlay2}
                  titleStyle={styles.buttonSaveTitleOk2}
                  containerStyle={{ flex: 1 }}
                />
              </View>

            </View>
          }

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
  overLayBg:{
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
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
  containerTransactions: {
    flex: 3,
    marginHorizontal: 15,
    paddingBottom: 15,
  },
  ContainerButtonAccept: {
    flex: 2,
    justifyContent: "flex-end",
    marginHorizontal: 15,
    marginBottom: 15
  },
  textSolde: {
    textAlign: 'right',
    fontSize: 50,
    color: colors.GREEN
  },
  goBack: {
    flex: 1
  },
  titleContainer: {
    flex: 3,
    alignItems: 'center',
  },
  typeTransa: {
    flex: 2,
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
  button: {
    borderColor: colors.LIGHT_PRIMARY,
    borderRadius: 25,
    backgroundColor: colors.LIGHT_PRIMARY,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',

  },
  buttonSave: {
    borderColor: colors.GREEN,
    borderRadius: 25,
    backgroundColor: colors.DARK_PRIMARY,
    height: 45,
  },
  buttonOverlay: {
    borderColor: colors.GREEN,
    borderWidth:1.5,
    height: 40,
    borderRadius:15,
    width: 115,
  },
  buttonOverlay2: {
    borderColor: colors.RED,
    borderWidth:1.5,
    height: 40,
    borderRadius:15,
    width: 115,
  },
  buttonOverlayOk: {
    borderColor: colors.GREEN,
    borderWidth:1.5,
    height: 40,
    borderRadius:15,
    width:"100%"
  },
  buttonOverlayOk2: {
    borderColor: colors.RED,
    borderWidth:1.5,
    borderRadius:15,
    height: 40,
    width:"100%"
  },
  buttonSaveTitle: {
    color: colors.GREEN,
  },
  buttonSaveTitleOk: {
    color: colors.GREEN,
  },
  buttonSaveTitleOk2: {
    color: colors.RED,
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