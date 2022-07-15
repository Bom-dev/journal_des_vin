import React, { useEffect, useState } from 'react';
import { Button, Text, View, Image, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import axios from 'axios';


export default function App() {

  const [allWine, setAllWine] = useState([])
  const [wine, setWine] = useState([])
  const [wines, setWines] = useState([])
  const [allWinemaker, setAllWinemaker] = useState([])
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
    axios.get(`https://journal-des-vin.herokuapp.com/wines/${key}`)
    .then((r) => {
      setWine(r.data)
    })
  }

  const getWinemakerDetail = (key) => {
    axios.get(`https://journal-des-vin.herokuapp.com/winemakers/${key}`)
    .then((r) => {
      setWinemaker(r.data)
    })
  }

  const handleFaveToggle = (wineKey) => {
    const faves = fav.slice()
    const index = faves.indexOf(wine)
    if (index > -1) {
      faves.splice(index, 1)
    } else {
      faves.push(wine)
    }
    setFav(faves)
    console.log(fav)
  }

  useEffect(() => {
    getAllWine()
    getAllWinemaker()
  }, [])

  function WineScreen({ navigation }) {
    
    let wineList = allWine.map(item => {
      return (
        <Button title={item.name} key={item.id} onPress={() => {
          const key = item.id
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

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={{ uri: `${wine.label}` }} style={{ width: 150, height: 150 }} />
        <Text>{wine.name}</Text>
        <Text>$ {wine.price}</Text>
        <Text>{wine.grape}</Text>
        <Text>{wine.country}</Text>
        <Button title='Buy This' onPress={() => Linking.openURL(`${wine.link}`)} />
        <Button title={fav.includes(wine) ? 'Unselect' : 'Select'} onPress={() => {
          const wineKey = wine.id
          handleFaveToggle(wineKey)
        }} />
      </View>
    );
  }
  
  function WinemakerScreen({ navigation }) {

    let winemakerList = allWinemaker.map(item => {
      return (
        <Button title={item.name} key={item.id} onPress={() => {
          const key = item.id
          navigation.navigate('Winemaker Details')
          getWinemakerDetail(key)
        }} />
      )
    })

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {winemakerList}
      </View>
    );
  }
  
  function WinemakerDetailsScreen() {
    console.log(winemaker.wines)

    // let makersWine = winemaker.wines.map(item => {
    //   axios.get(`${item}`)
    //   .then((r) => {
    //     console.log(r.data)
    //     // setWines(r.data)
    //   })
      // .then(
      //   console.log(wines)
      //   wines.map(item => {
      //     return (
      //       <View>
      //         <Text>{item.name}</Text>
      //       </View>
      //     )
      //   })
      // )
    // })

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{winemaker.name}</Text>
        <Text>{winemaker.location}</Text>
        <Text>{winemaker.description}</Text>
        {/* <Text>{makersWine}</Text> */}
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