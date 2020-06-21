import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../static/color'
import { Divider } from 'react-native-elements';
import {Picker} from '@react-native-community/picker';


export default function Help({ navigation }) {
  const [selectedValue, setSelectedValue] = useState("CPV");



  return (
    <View style={styles.main}>
      <View style={styles.containerTitle}>
        <View style={styles.titleContainer}>
          <Text numberOfLines={1} style={styles.title}>Infos et Aide</Text>
        </View>
      </View>
      <View style={styles.containerChoice}>
        <View style={{ borderRadius: 25, overflow: 'hidden'}}>
 
          <Picker

            selectedValue={selectedValue}
            style={{ height: 40, backgroundColor:colors.LIGHT_PRIMARY, color:colors.CUS_WHITE }}
            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
          >
            <Picker.Item label="Centre Protestant de Vacances" value="CPV" />
          </Picker>
        </View>
      </View>
      <View style={styles.containerInfos}>
        <View style={styles.containerInfosDetail}>
          <Text style={styles.titleInfos}>Téléphone</Text>
          <Text style={styles.infos}>022.394.23.92</Text>
        </View>
        <View style={styles.containerInfosDetail}>
          <Text style={styles.titleInfos}>Téléphone 2</Text>
          <Text style={styles.infos}>022.324.11.23</Text>
        </View>
        <View style={styles.containerInfosDetail}>
          <Text style={styles.titleInfos}>Mail</Text>
          <Text style={styles.infos}>cpv@camps.ch</Text>
        </View>
        <View style={styles.containerInfosDetail}>
          <Text style={styles.titleInfos}>Mail 2</Text>
          <Text style={styles.infos}>ddsaosk@gmail.com</Text>
        </View>
      </View>
      <Divider style={{ backgroundColor: colors.CUS_WHITE, marginBottom:15 }} />
      <View style={styles.containerAbout}>
      <Text style={styles.aboutText}>
        A propos
      </Text>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.DARK_PRIMARY,
    paddingHorizontal: 15
  },
  containerTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    color: colors.CUS_WHITE
  },
  containerChoice: {
    flex: 1,
    paddingHorizontal:15 
  },
  containerInfos: {
    flex: 3,
  },
  containerAbout: {
    flex: 2,
    alignItems:'center'
  },
  infos: {
    flex: 2,
    fontSize: 18,
    color: colors.CUS_WHITE,
    textAlign:'right'
  },
  titleInfos: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 18,
    color: colors.CUS_WHITE,
  },
  containerInfosDetail:{
      flex:1,
      flexDirection:'row'
  },
  aboutText:{
    fontSize:24,
    color:colors.CUS_WHITE
  },
  
});