import React from 'react';
import {StatusBar } from 'react-native';
import colors from '../static/color'


export default function statusBar() {
  return (
    <StatusBar  barStyle="light-content" backgroundColor={colors.DARK_PRIMARY} />
  );
}
