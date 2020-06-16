import React, { useEffect } from 'react';
import NavigationBottom from './src/navigation/BottomNav'
import StatusBar from './src/components/statusBar'
import { View } from 'react-native'
import colors from "./src/static/color"
import { Provider as StoreProvider } from 'react-redux'
import store from './src/redux/store'


export default function App() {

  return (
    <StoreProvider store={store}>
      <View style={{ flex: 1, backgroundColor: colors.DARK_PRIMARY }}>
        <StatusBar />
        <NavigationBottom />
      </View>
    </StoreProvider>
  );
}