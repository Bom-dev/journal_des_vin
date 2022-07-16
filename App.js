import React, { useEffect, useState } from 'react';
import { Button, Text, View, Image, Linking, StyleSheet, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';


export default function App() {

  const [allWine, setAllWine] = useState([])
  const [wine, setWine] = useState([])
  const [allWinemaker, setAllWinemaker] = useState([])
  const [winemaker, setWinemaker] = useState({})
  const [fav, setFav] = useState([])

  const getAllWine = async () => {
    await axios.get(`https://journal-des-vin.herokuapp.com/wines/`)
    .then((r) => {
      setAllWine(r.data)
    })
  }

  const getAllWinemaker = async () => {
    await axios.get(`https://journal-des-vin.herokuapp.com/winemakers/`)
    .then((r) => {
      setAllWinemaker(r.data)
    })
  }

  const getWineDetail = async (key) => {
    await axios.get(`https://journal-des-vin.herokuapp.com/wines/${key}`)
    .then((r) => {
      setWine(r.data)
    })
  }

  const getWinemakerDetail = async (key) => {
    await axios.get(`https://journal-des-vin.herokuapp.com/winemakers/${key}`)
    .then((r) => {
      setWinemaker(r.data)
    })
  }

  const handleFaveToggle = (wineKey) => {
    const faves = fav.slice()
    const index = faves.indexOf(wineKey)
    if (index > -1) {
      faves.splice(index, 1)
    } else {
      faves.push(wineKey)
    }
    setFav(faves)
  }

  useEffect(() => {
    getAllWine()
    getAllWinemaker()
  }, [])

  function WineScreen({ navigation }) {
    
    let wineList = allWine.map(item => {
      return (
        <Pressable style={styles.list} key={item.id} onPress={() => {
          navigation.navigate('Wine Details')
          getWineDetail(item.id)
        }}>
          <Text style={styles.listText}>{item.name}</Text>
        </Pressable>
      )
    })

    return (
      <View style={styles.container}>
        {wineList}
      </View>
    );
  }
  
  function WineDetailsScreen({ navigation }) {

    return (
      <View style={styles.container}>
        <Image source={{ uri: `${wine.label}` }} style={{ width: 200, height: 200 }} />
        <Text style={styles.title}>{wine.name}</Text>
        <Text style={styles.subTitle}>{wine.grape} from {wine.country}</Text>
        <Text style={styles.tinyText}>${wine.price}</Text>
        {/* <Button title={wine.winemaker.name} onPress={() => {
          const winemakerkey = wine.winemaker.id
          navigation.navigate('Winemaker Details')
          getWinemakerDetail(winemakerkey)
        }}/> */}
        <Pressable onPress={() => Linking.openURL(`${wine.link}`)} style={styles.list}>
          <Text style={styles.listText}>Buy This</Text>
        </Pressable>
        <Pressable onPress={() => handleFaveToggle(wine.id)} style={styles.list}>
          <Text style={styles.listText}>{fav.includes(wine.id) ? 'Unselect' : 'Select'}</Text>
        </Pressable>
      </View>
    );
  }
  
  function WinemakerScreen({ navigation }) {

    let winemakerList = allWinemaker.map(item => {
      return (
        <Pressable key={item.id} style={styles.list} onPress={() => {
          navigation.navigate('Winemaker Details')
          getWinemakerDetail(item.id)
        }}>
          <Text style={styles.listText}>{item.name}</Text>
        </Pressable>
      )
    })

    return (
      <View style={styles.container}>
        {winemakerList}
      </View>
    );
  }
  
   const WinemakerDetailsScreen = ({ navigation }) => {

    // console.log(winemaker.wines[0].name)

      return (
        <View style={styles.container}>
          <Text style={styles.title}>{winemaker.name}</Text>
          <Text style={styles.subTitle}>{winemaker.location}</Text>
          <Text style={styles.tinyText}>{winemaker.description}</Text>
          {/* <Button title={winemaker.wines[0].name} onPress={() => {
                  navigation.navigate('Wine Details')
                  getWineDetail(winemaker.wines[0].id)
                }} /> */}
        </View>
      );
  }

  
  function HomeStackScreen() {

    return (
      <View style={styles.container}>
        <Text style={styles.landingTitle}>Journal{"\n"}Des{"\n"}Vin</Text>
        <Text style={styles.tinyText}>: Browse wines and wineries list</Text>
      </View>
    );
  }

  function FavoriteScreen({ navigation }) {

    if (fav.length > 0) {

        const favs = fav.map(item => {
            return (
              <Pressable style={styles.list} key={item.name} onPress={() => {
                navigation.navigate('Wine Details')
                getWineDetail(item.id)
              }}>
                <Text style={styles.listText}>
                  {item.name}
                </Text>
              </Pressable>
            )
        })

      return (
        <View style={styles.container}>
          <Text style={styles.mainText}>Favorite ({fav.length})</Text>
          <View>{favs}</View>
        </View>
      )
    }

    else 
    return (
      <View style={styles.container}>
        <Text style={styles.mainText}>Nothing Inside</Text>
        <Text style={styles.tinyText}>Select your favorite bottle!</Text>
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

// style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#523',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    backgroundColor: '#937',
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
  },
  listText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.25,
  },
  landingTitle: {
    fontSize: 80,
    fontWeight: "600",
    color: "white",
  },
  title: {
    fontSize: 40,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
  mainText: {
    fontWeight: "600",
    fontSize: 50,
    color: "white",
  },
  subTitle: {
    fontSize: 30,
    color: "white",
    fontWeight: "500",
    textAlign: "center",
  },
  tinyText: {
    marginTop: -5,
    marginBottom: 20,
    fontSize: 20,
    color: "white",
    fontWeight: "500",
    marginTop: 20,
  },
})