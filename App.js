import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import axios from 'axios';


export default function App() {

  const [allWine, setAllWine] = useState([])
  const [allWinemaker, setAllWinemaker] = useState([])
  const [key, setKey] = useState([])
  const [winemaker, setWinemaker] = useState([])
  const [fav, setFav] = useState([])

  const getAllWine = () => {
    axios.get(`https://journal-des-vin.herokuapp.com/wines/`)
    .then((r) => {
      setAllWine(r.data)
    })
  }

  const getAllWinemaker = () => {
    axios.get(`https://journal-des-vin.herokuapp.com/winemakers/`)
    .then((r) => {
      setAllWinemaker(r.data)
    })
  }

  const getWineDetail = (key) => {
    // axios.get(`https://journal-des-vin.herokuapp.com/wines/${key}`)
    // .then((r) => {
    //   setWine(r.data)
    // })
    console.log(key)
  }

  useEffect(() => {
    getAllWine()
    getAllWinemaker()
  }, [])

  function WineScreen({ navigation }) {
    
    let wineList = allWine.map(item => {
      return (
        <Button title={item.name} key={item.id} onPress={(key) => {
          navigation.navigate('Wine Details')
          getWineDetail(key)
        }} />
      )
    })

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {wineList}
      </View>
    );
  }
  
  function WineDetailsScreen() {
    console.log(key)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Wine Detail</Text>
      </View>
    );
  }
  
  function WinemakerScreen({ navigation }) {

    let winemakerList = allWinemaker.map(item => {
      return (
        <Button title={item.name} key={item.id} onPress={() => navigation.navigate('Winemaker Details')}/>
      )
    })

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {winemakerList}
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

  function FavoriteScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Select your favorite bottle!</Text>
      </View>
    )
  }
  
  const WineStack = createNativeStackNavigator();
  const WinemakerStack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  
  function WineStackScreen() {
    return (
      <WineStack.Navigator>
        <WineStack.Screen name="Wine List" component={WineScreen} />
        <WineStack.Screen name="Wine Details" component={WineDetailsScreen} />
      </WineStack.Navigator>
    );
  }
  
  function WinemakerStackScreen() {
    return (
      <WinemakerStack.Navigator>
        <WinemakerStack.Screen name="Winemaker List" component={WinemakerScreen} />
        <WinemakerStack.Screen name="Winemaker Details" component={WinemakerDetailsScreen} />
      </WinemakerStack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Wine" component={WineStackScreen} />
        <Tab.Screen name="Winemaker" component={WinemakerStackScreen} />
        <Tab.Screen name="Favorite" component={FavoriteScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}