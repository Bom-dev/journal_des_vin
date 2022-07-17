import React, { useEffect, useState } from 'react';
import { Button, Text, View, Image, Linking, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
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
        <ScrollView>
          {wineList}
        </ScrollView>
      </View>
    );
  }
  
  function WineDetailsScreen({ navigation }) {

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Image source={{ uri: `${wine.label}` }} style={styles.img} />
          </View>
          <Text>{"\n"}</Text>
          <Text style={styles.title}>{wine.name}</Text>
          <Text style={styles.tinyText}>{wine.grape} from {wine.country}</Text>
          {/* <Button title={wine.winemaker.name} onPress={() => {
            const winemakerkey = wine.winemaker.id
            navigation.navigate('Winemaker Details')
            getWinemakerDetail(winemakerkey)
          }}/> */}
          <Text>{"\n"}</Text>
          <Pressable onPress={() => Linking.openURL(`${wine.link}`)} style={styles.list}>
            <Text style={styles.listText}>Buy This</Text>
          </Pressable>
          <Pressable onPress={() => handleFaveToggle(wine.id)} style={styles.list}>
            <Text style={styles.listText}><Ionicons name={fav.includes(wine.id) ? 'ios-star' : 'ios-star-outline'} size={20} color='#fff'/></Text>
          </Pressable>
          <View style = {styles.divider} />
        </ScrollView>
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
        <ScrollView>
          {winemakerList}
        </ScrollView>
      </View>
    );
  }
  
   const WinemakerDetailsScreen = ({ navigation }) => {

    // console.log(winemaker.wines[0].name)

      return (
        <View style={styles.container}>
          <ScrollView>
            <Text style={styles.title}>{winemaker.name}</Text>
            <Text style={styles.subTitle}>{winemaker.location}</Text>
            <View style = {styles.divider} />
            <Text style={styles.tinyText}>{winemaker.description}</Text>
            {/* <Button title={winemaker.wines[0].name} onPress={() => {
                    navigation.navigate('Wine Details')
                    getWineDetail(winemaker.wines[0].id)
                  }} /> */}
          </ScrollView>
        </View>
      );
  }

  
  function HomeStackScreen() {

    return (
      <View style={styles.container}>
        <Ionicons name={'ios-wine'} size={50} color='#fff' />
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
    
    // <ion-icon name="home-outline"></ion-icon>

    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
             let iconName;
             if (route.name === 'Home') {
              iconName = focused
                ? 'ios-home'
                 : 'ios-home-outline';
            } else if (route.name === 'Wine') {
              iconName = focused ? 'ios-wine' : 'ios-wine-outline';
            } else if (route.name === 'Winemaker') {
              iconName = focused ? 'ios-people' : 'ios-people-outline';
            } else if (route.name === 'Favorite') {
              iconName = focused ? 'ios-star' : 'ios-star-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#A26769',
          tabBarInactiveTintColor: '#888',
        })}
      >
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Wine" component={WineStackScreen} />
        <Tab.Screen name="Winemaker" component={WinemakerStackScreen} />
        <Tab.Screen name="Favorite" component={FavoriteScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// '#6D2E46' , '#A26769' , '#D5B9B2' , '#ECE2D0'

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#6D2E46',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    backgroundColor: '#6D2E46',
    borderWidth: 0.75,
    borderColor: '#FFF',
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 3,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
  },
  listText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.25,
  },
  landingTitle: {
    fontSize: 80,
    fontWeight: "800",
    color: '#FFF',
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    color: '#FFF',
    textAlign: "center",
  },
  mainText: {
    fontWeight: "700",
    fontSize: 40,
    color: '#FFF',
  },
  subTitle: {
    fontSize: 30,
    color: '#ECE2D0',
    fontWeight: "500",
    textAlign: "center",
  },
  tinyText: {
    fontSize: 17,
    color: '#FFF',
    fontWeight: "300",
    margin: 20,
    letterSpacing: 2,
  },
  img: { 
    width: 250,
    height: 250, 
  },
  divider: {
    borderWidth: 0.75,
    borderColor: '#FFF',
    marginTop: 25,
}
})