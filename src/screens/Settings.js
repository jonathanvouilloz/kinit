import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import colors from '../static/color'
import { Button, Divider } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux'
import { addcamp, reset } from '../redux/campsApp'
import * as query from "../services/storeNewTransaction"
import * as Print from 'expo-print';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system'
import {createPdf} from '../services/createPdf'

export default function Settings({ navigation }) {

  const [name, setName] = useState(null);
  const [amount, setAmount] = useState(null);

  const dispatch = useDispatch()
  const campsRedux = useSelector(state => state);
  const addCamp = camp => dispatch(addcamp(camp))
  const resetAll = () => dispatch(reset())


  console.log(campsRedux.camp);
  
  const storeCampInfos = async function () {
    const campSql = { name: name, solde: amount };
    //insert sql, on attends -> insertion redux 
    const resp = await query.insertCamp(campSql);
    const campRedux = { id: resp, name: name, solde: amount, soldeInitial:amount, caution:0 };
    addCamp(campRedux);
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
  
      
      const response = await Print.printToFileAsync({
        html: await createPdf(),
        width:793,
        height:1122,
        base64:true
      })

    // this changes the bit after the last slash of the uri (the document's name) to "invoice_<date of transaction"
      
      const newName = response.uri.slice(0, response.uri.lastIndexOf('/'))+"/invoice.pdf"

    const pdfName = `${response.uri.slice(0,
        response.uri.lastIndexOf('/') + 1
        )}invoice.pdf`

        await FileSystem.copyAsync({
            from: response.uri,
            to: newName,
        })        
      
        
      if(getLocationAsync()){
        MediaLibrary.saveToLibraryAsync(newName);
      }
      
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

  return (
    <ScrollView style={styles.main}>
      <View style={styles.containerParam}>
        <View style={styles.containerGenTitle}>
          <Text style={styles.genTitle}>Paramètres</Text>
        </View>
        <View style={styles.containerGenInput1}>
          <TextInput editable={campsRedux.camp.name ? false : true} 
                     style={styles.textAmount} onChangeText={(value) => updateName(value)} 
                     placeholder="Nom du camp" >{campsRedux.camp.name ? campsRedux.camp.name:""}         
         </TextInput>
        </View>
        <View style={styles.containerGenInput2}>
          <TextInput editable={campsRedux.camp.name ? false : true}
                     keyboardType="number-pad"
                     style={styles.textAmount} onChangeText={(value) => updateSolde(value)} 
                     placeholder="Solde initial">{campsRedux.camp.soldeInitial ? campsRedux.camp.soldeInitial:""} 
          </TextInput>
        </View>
        <View style={styles.containerGenInput2}>
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
  containerGenInput4: {
    height: 50,
    marginBottom: 30
  },
  containerGenInput2: {
    height: 50,
  },
  containerRecap: {
    height: 250,
  },
  containerReset: {
    height: 200,
    justifyContent: 'center'
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
