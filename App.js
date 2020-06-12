import * as React from 'react';
import NavigationBottom from './src/navigation/BottomNav'
import StatusBar from './src/components/statusBar'
import {View} from 'react-native'
import colors from "./src/static/color"

 
export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor:colors.DARK_PRIMARY}}>
      <StatusBar />
      <NavigationBottom />
    </View>
  );
}