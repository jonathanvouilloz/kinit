import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from '../screens/Settings'
import HelpScreen from '../screens/Help'
import HomeScreen from '../screens/Home'
import DetailsScreen from '../screens/detailsScreen'
import AddTransaction from '../screens/newTransaction'
import CustomIcons from '../components/CustomTab'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';


const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator 
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false
      }}
    >
     <HomeStack.Screen name="Home" component={HomeScreen}/>
     <HomeStack.Screen name="AddTransaction" component={AddTransaction} />
     <HomeStack.Screen name="Details" component={DetailsScreen} />
    </HomeStack.Navigator>
   );
 }


const Tab = createBottomTabNavigator();


export default function BottomNav() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        backBehavior="initalRoute" 
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? require("../../assets/home2.png") : require("../../assets/home.png");
            } else if (route.name === 'Settings') {
              iconName = focused ? require("../../assets/settings2.png") : require("../../assets/settings.png");
            } else if (route.name === 'Help') {
              iconName = focused ? require("../../assets/info2.png") : require("../../assets/info.png");
            }

            return <CustomIcons src={iconName} />;
          },
        })}
        tabBarOptions={{
          showLabel:false,
          keyboardHidesTabBar:true,
          style:{
            height:50
          },
          tabStyle:{
            backgroundColor: '#283149',
            paddingBottom:2
          }
        }}
      >     
      <Tab.Screen name="Help" component={HelpScreen} />
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  </NavigationContainer>
  );
}