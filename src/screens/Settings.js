import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, ActivityIndicator, TouchableWithoutFeedback, ToastAndroid } from 'react-native';
import colors from '../static/color'
import { Button, Divider, Overlay } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux'
import { addcamp, reset } from '../redux/campsApp'
import * as query from "../services/storeNewTransaction"
import * as Print from 'expo-print';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system'
import { createPdf } from '../services/createPdf'
import Icons from 'react-native-vector-icons/AntDesign';
import LottieAnimValid from "../components/lottietes"


export default function Settings({ navigation }) {

  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [pdfDownload, setDownloading] = useState(false);
  const [created, setCreated] = useState(false);

  const dispatch = useDispatch()
  const campsRedux = useSelector(state => state);
  const addCamp = camp => dispatch(addcamp(camp))
  const resetAll = () => dispatch(reset())

  const storeCampInfos = async function () {


    const amountA = amount;
    const nameA = name;
    
    if(amountA === undefined|| nameA === undefined || nameA === "" || amountA === 0 || nameA === "" || amountA === ""){
      ToastAndroid.showWithGravityAndOffset(
        "Merci de remplir les deux champs",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        0,
        50
      );
      return
    }
    

    const campSql = { name: name, solde: amount };
    //insert sql, on attends -> insertion redux 
    const resp = await query.insertCamp(campSql);
    const campRedux = { id: resp, name: name, solde: amount, soldeInitial: amount, caution: 0 };
    addCamp(campRedux);

    ToastAndroid.showWithGravityAndOffset(
      "Le camp a bien été ajouté !",
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
      0,
      50
    );
  }

  async function getLocationAsync() {
    // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
    const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      return true;
    } else {
      throw new Error('Location permission not granted');
    }
  }

  const downloadResume = async function () {

    
    //todo
    setDownloading(true);
    
    const response = await Print.printToFileAsync({
      html: await createPdf(),
      base64: true,
      width:1122,
      height:793
    })
    // this changes the bit after the last slash of the uri (the document's name) to "invoice_<date of transaction"

    const newName = response.uri.slice(0, response.uri.lastIndexOf('/')) + "/comptabilité.pdf"

    await FileSystem.copyAsync({
      from: response.uri,
      to: newName,
    })
    if (getLocationAsync()) {
      await MediaLibrary.saveToLibraryAsync(newName);
    }
    setCreated(true);
    
  }



  const nouveauCamp = async () => {
    //drop all and create + vider store
    resetAll();
    query.createTable();
  }


  const updateName = function (val) {
    setName(val)
  };

  const updateSolde = function (val) {
    setAmount(val)
  };

  const finishPdf = function(){    
    setCreated(false);
    setDownloading(false);
  }

  return (
    <ScrollView style={styles.main}>
      <View style={styles.containerParam}>
        <View style={styles.containerGenTitle}>
          <Text style={styles.genTitle}>Paramètres</Text>
        </View>
        <View style={styles.containerGenInput1}>
          <TextInput editable={campsRedux.camp.name ? false : true}
            style={styles.textAmount} onChangeText={(value) => updateName(value)}
            placeholder="Nom du camp" >{campsRedux.camp.name ? campsRedux.camp.name : ""}
          </TextInput>
        </View>
        <View style={styles.containerGenInput1}>
          <TextInput editable={campsRedux.camp.name ? false : true}
            keyboardType="number-pad"
            style={styles.textAmount} onChangeText={(value) => updateSolde(value)}
            placeholder="Solde initial">{campsRedux.camp.soldeInitial ? campsRedux.camp.soldeInitial : ""}
          </TextInput>
        </View>
        <View style={styles.containerGenInput1}>
          <Button
            disabled={campsRedux.camp.soldeInitial ? true : false}
            title="Sauvegarder"
            type="outline"
            buttonStyle={styles.buttonGen}
            titleStyle={styles.buttonGenTitle}
            onPress={() => storeCampInfos()}
          />
        </View>
      </View>
      <View style={styles.containerRecap}>
        <View style={styles.containerGenTitle}>
          <Text style={styles.genTitle}>Récapitulatif</Text>
        </View>
        <View style={styles.containerGenInput3}>
          <Button
            disabled={campsRedux.camp.name?false:true}
            title="Télécharger le résumé"
            type="outline"
            buttonStyle={styles.buttonGen}
            titleStyle={styles.buttonGenTitle}
            onPress={() => downloadResume()}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Divider style={{ backgroundColor: colors.CUS_WHITE, marginBottom: 30, width: "50%" }} />
        </View>
        <Button
          title="Nouveau camp"
          type="outline"
          buttonStyle={styles.buttonReset}
          titleStyle={styles.buttonResetTitle}
          onPress={() => nouveauCamp()}
        />
      </View>
      <Overlay backdropStyle={styles.overLayBg} overlayStyle={{borderWidth:0, width:"80%",height:200}} isVisible={pdfDownload}>       
        {created ? 
        <View style={{flex:1, alignItems:'flex-end'}}>
          <View style={{flex:1}}>
            <TouchableWithoutFeedback onPress={()=> finishPdf()}><Icons name="closecircle" size={25} color={colors.DARK_PRIMARY} /></TouchableWithoutFeedback>
          </View>
          
        <View style={{alignItems:'center',justifyContent:'center', flex:9,paddingBottom:25}}>
            <LottieAnimValid loop={false} src={require('../../assets/data.json')} size={100} />
            <Text style={{textAlign:'center'}} >Le pdf a bien été créé, vous pourrez le retrouver dans vos documents.</Text>
        </View></View>
        :
        
        
        <View style={{alignItems:'center', flex:1,padding:15}}>
          <LottieAnimValid loop={true} src={require('../../assets/creating.json')} size={100} />
        <Text style={{textAlign:'center', paddingTop:10}} >Merci de patienter durant la création du rapport.</Text>
        
        </View>
        
        }    
        
        </Overlay>
    </ScrollView>
  );
}




const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.DARK_PRIMARY,
    paddingHorizontal: 15
  },
  containerParam: {
    height: 275,
  },
  overLayBg:{
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  containerGenTitle: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerGenTitle: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerGenInput1: {
    height: 50,
  },
  containerGenInput3: {
    height: 50,
    marginBottom: 30
  },
  containerRecap: {
    height: 250,
  },
  textAmount: {
    fontSize: 18,
    borderRadius: 25,
    color: colors.LIGHT_WHITE,
    borderWidth: 1,
    height: 40,
    paddingLeft: 15,
    borderColor: colors.LIGHT_PRIMARY,
    backgroundColor: colors.LIGHT_PRIMARY
  },
  genTitle: {
    fontSize: 24,
    color: colors.CUS_WHITE,
  },
  buttonReset: {
    borderColor: colors.RED,
    borderRadius: 25,
    backgroundColor: colors.DARK_PRIMARY,
    height: 45
  },
  buttonResetTitle: {
    color: colors.RED,
  },
  buttonGen: {
    borderColor: colors.GREEN,
    borderRadius: 25,
    backgroundColor: colors.DARK_PRIMARY,
    height: 45,
  },
  buttonGenTitle: {
    color: colors.GREEN,
  },
});
