import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import colors from '../static/color'
import { Button, Divider } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux'
import { addcamp, addtransa } from '../redux/campsApp'
import * as query from "../services/storeNewTransaction"


export default function Settings({ navigation }) {

  const [name, setName] = useState(null);
  const [amount, setAmount] = useState(null);

  const dispatch = useDispatch()
  const addCamp = camp => dispatch(addcamp(camp))
  const addTransa = transa => dispatch(addtransa(transa))


  const storeCampInfos = async function () {
    const campSql = { name: name, solde: amount };
    //insert sql, on attends -> insertion redux 
    const resp = await query.insertCamp(campSql);
    const campRedux = { id: resp, name: name, solde: amount };
    addCamp(campRedux);
  }

  const downloadResume = async function () {



  };

  const nouveauCamp = async () => {
    //drop all and create
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
          <TextInput style={styles.textAmount} onChangeText={(value) => updateName(value)} placeholder="Nom du camp"></TextInput>
        </View>
        <View style={styles.containerGenInput2}>
          <TextInput keyboardType="number-pad" style={styles.textAmount} onChangeText={(value) => updateSolde(value)} placeholder="Montant"></TextInput>
        </View>
        <View style={styles.containerGenInput2}>
          <Button
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
