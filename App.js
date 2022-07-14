import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import axios from 'axios';

function WineScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Wine screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('WineDetails')}
      />
    </View>
  );
}

function WineDetailsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Details!</Text>
    </View>
  );
}

function WinemakerScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Winemaker screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('WinemakerDetails')}
      />
    </View>
  );
}

function WinemakerDetailsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Details!</Text>
    </View>
  );
}

function HomeStackScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to my App!</Text>
    </View>
  );
}

const WineStack = createNativeStackNavigator();

function WineStackScreen() {
  return (
    <WineStack.Navigator>
      <WineStack.Screen name="List" component={WineScreen} />
      <WineStack.Screen name="Details" component={WineDetailsScreen} />
    </WineStack.Navigator>
  );
}

const WinemakerStack = createNativeStackNavigator();

function WinemakerStackScreen() {
  return (
    <WinemakerStack.Navigator>
      <WinemakerStack.Screen name="List" component={WinemakerScreen} />
      <WinemakerStack.Screen name="Details" component={WinemakerDetailsScreen} />
    </WinemakerStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {

  const [allWine, setAllWine] = useState([])
  const [allWinemaker, setAllWinemaker] = useState([])

  const getAllWine = () => {
    axios.get(`https://journal-des-vin.herokuapp.com/wines/`)
    .then((r) => {
      setAllWine(r)
    })
  }

  const getAllWinemaker = () => {
    axios.get(`https://journal-des-vin.herokuapp.com/winemakers/`)
    .then((r) => {
      setAllWinemaker(r)
    })
  }

  useEffect(() => {
    getAllWine()
    getAllWinemaker()
  }, [])

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Wine" component={WineStackScreen} />
        <Tab.Screen name="Winemaker" component={WinemakerStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}