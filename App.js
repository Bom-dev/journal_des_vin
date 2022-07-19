import React, { useEffect, useState } from 'react';
import { Text, View, Image, Linking, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';

const FAVORITE = "@fav"

export default function App() {

  const [allWine, setAllWine] = useState([])
  const [wine, setWine] = useState([])
  const [allWinemaker, setAllWinemaker] = useState([])
  const [winemaker, setWinemaker] = useState({})
  const [fav, setFav] = useState([])
  const [recomm, setRecomm] = useState([])
  const [type, setType] = useState('')
  const [varietal, setVarietal] = useState('')
  const [region, setRegion] = useState('')

  const saveFav = async (toSave) => {
    await AsyncStorage.setItem(FAVORITE, JSON.stringify(toSave));
  };

  const loadFav = async () => {
    const ready = await AsyncStorage.getItem(FAVORITE)
    if (ready) {
      setFav(JSON.parse(ready))
    }
  }

  const getAllWine = async () => {
    await axios.get(`https://journal-des-vin.herokuapp.com/wines/`)
    .then((r) => {
      setAllWine(r.data)
    })
    await AsyncStorage.setItem('allWine', JSON.stringify(allWine))
  }

  const getAllWinemaker = async () => {
    await axios.get(`https://journal-des-vin.herokuapp.com/winemakers/`)
    .then((r) => {
      setAllWinemaker(r.data)
    })
    await AsyncStorage.setItem('allWinemaker', JSON.stringify(allWinemaker))
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

  const getRecomm = async (key) => {
    let k = allWine.map(item => {
      if (item.name = key) {
        return item.id
      }
    })
    await axios.get(`https://journal-des-vin.herokuapp.com/wines/${k}`)
    .then((r) => {
      setRecomm(r.data)
    })
  }

  const handleFaveToggle = async (wineKey) => {
    const faves = fav.slice()
    const index = faves.indexOf(wineKey)
    if (index > -1) {
      faves.splice(index, 1)
    } else {
      faves.push(wineKey)
    }
    setFav(faves)
    await saveFav(faves)
  }

  useEffect(() => {
    getAllWine()
    getAllWinemaker()
    loadFav()
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
          <Text style={styles.subTitle}>$ {wine.price}</Text>
          <Text style={styles.tinyText}>{wine.grape} from {wine.country}</Text>
          {/* <Pressable style={styles.list} onPress={() => {
            const winemakerkey = wine.winemaker.id
            navigation.navigate('Winemaker Details')
            getWinemakerDetail(winemakerkey)
          }}>
            <Text style={styles.listText}>
              from {wine.winemaker.name}
            </Text>
          </Pressable> */}
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

      return (
        <View style={styles.container}>
          <ScrollView>
            <Text style={styles.title}>{winemaker.name}</Text>
            <Text style={styles.subTitle}>{winemaker.location}</Text>
            <View style={styles.divider} />
            <Text style={styles.tinyText}>{winemaker.description}</Text>
            {/* <Pressable style={styles.list} onPress={() => {
                    navigation.navigate('Wine Details')
                    getWineDetail(winemaker.wines[0].id)
                  }}>
              <Text style={styles.listText}>
                {winemaker.wines[0].name}
              </Text>
            </Pressable> */}
          </ScrollView>
        </View>
      );
  }

  
  function HomeScreen({ navigation }) {

    return (
      <View style={styles.container}>
        <Ionicons name={'ios-wine'} size={50} color='#fff' />
        <Text style={styles.landingTitle}>Journal{"\n"}Des{"\n"}Vin</Text>
        <Text>{"\n"}</Text>
        <Pressable style={styles.list} onPress={() => {
            navigation.navigate('Type')
        }}>
          <Text style={styles.listText}>Get Recommendation</Text>
        </Pressable>
      </View>
    );
  }

  function TypeScreen({ navigation }) {

    let typeList = []

    const allTypes = allWine.map(item => {
      if (!typeList.includes(item.type))
        typeList.push(item.type) 
    })

    const types = typeList.map(aType => {
      return (
        <Pressable style={styles.list} key={aType} onPress={() => {
          setType(aType)
          navigation.navigate('Varietal')
      }}>
          <Text style={styles.listText}>{aType}</Text>
        </Pressable>
      )
    })

    return (
      <View style={styles.container}>
        <ScrollView>
        <Text style={styles.mainText}>Choose Your Type</Text>
        <Text>{"\n"}</Text>
        <View>{types}</View>
        </ScrollView>
      </View>
    )
  }

  function VarietalScreen({ navigation }) {

    let varietalList = []

    const typedVarietal = allWine.map(item => {
      if ((item.type = type) && (!varietalList.includes(item.grape))) {
          varietalList.push(item.grape)
        }
    })

    const varietals = varietalList.map(aVarietal => {
      return (
        <Pressable style={styles.list} key={aVarietal} onPress={() => {
          setVarietal(aVarietal)
          navigation.navigate('Region')
      }}>
          <Text style={styles.listText}>{aVarietal}</Text>
        </Pressable>
      )
    })

    return (
      <View style={styles.container}>
        <ScrollView>
        <Text style={styles.mainText}>Choose Your Varietal</Text>
        <Text>{"\n"}</Text>
        <View>{varietals}</View>
        </ScrollView>
      </View>
    )
  }

  function RegionScreen({ navigation }) {

    let regionList = []

    const allRegion = allWine.map(item => {
      if ((item.type = type) && (item.varietal = varietal) && (!regionList.includes(item.country))) {
          regionList.push(item.country) 
        }
    })

    const regions = regionList.map(aRegion => {
      return (
        <Pressable style={styles.list} key={aRegion} onPress={() => {
          setRegion(aRegion)
          navigation.navigate('Name')
      }}>
          <Text style={styles.listText}>{aRegion}</Text>
        </Pressable>
      )
    })

    // console.log(type, varietal, region)

    return (
      <View style={styles.container}>
        <ScrollView>
        <Text style={styles.mainText}>Choose Your Region</Text>
        <Text>{"\n"}</Text>
        <View>{regions}</View>
        </ScrollView>
      </View>
    )
  }

  function ResultScreen({ navigation }) {

    let nameList = []

    const allName = allWine.map(item => {
      if ((item.type = type) && (item.varietal = varietal) && (item.region = region) && (!nameList.includes(item.name))) {
          nameList.push(item.name) 
        }
    })

    const names = nameList.map(name => {

      return (
        <Pressable style={styles.list} key={`${name}1`} onPress={() => {
          navigation.navigate('Recommendation')
          getRecomm(name)
          console.log(recomm)
        }}>
          <Text style={styles.listText}>{name}</Text>
        </Pressable>
      )
    })

    return (
      <View style={styles.container}>
        <ScrollView>
        <Text style={styles.mainText}>Choose Your Wine</Text>
        <Text>{"\n"}</Text>
        <View>{names}</View>
        </ScrollView>
      </View>
    )
  }

  function RecommendationScreen({ navigation }) {

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Image source={{ uri: `${recomm.label}` }} style={styles.img} />
          </View>
          <Text>{"\n"}</Text>
          <Text style={styles.title}>{recomm.name}</Text>
          <Text style={styles.subTitle}>$ {recomm.price}</Text>
          <Text style={styles.tinyText}>{recomm.grape} from {recomm.country}</Text>
          <Text>{"\n"}</Text>
          <Pressable onPress={() => Linking.openURL(`${recomm.link}`)} style={styles.list}>
            <Text style={styles.listText}>Buy This</Text>
          </Pressable>
          <Pressable onPress={() => handleFaveToggle(recomm.id)} style={styles.list}>
            <Text style={styles.listText}><Ionicons name={fav.includes(recomm.id) ? 'ios-star' : 'ios-star-outline'} size={20} color='#fff'/></Text>
          </Pressable>
          <View style = {styles.divider} />
        </ScrollView>
      </View>
    );
  }

  function FavoriteScreen({ navigation }) {

    if (fav.length > 0) {

        const favs = fav.map(item => {
          for (let i = 0; i < allWine.length ; i++) {
            if (allWine[i].id === item) {
              return (
              <Pressable style={styles.list} key={allWine[i].name} onPress={() => {
                navigation.navigate('Favorite Details')
                getWineDetail(allWine[i].id)
              }}>
                <Text style={styles.listText}>
                  {allWine[i].name}
                </Text>
              </Pressable>
              )
            }
          }
        })

      return (
        <View style={styles.container}>
          <Text style={styles.mainText}>Favorite ({fav.length})</Text>
          <Text>{"\n"}</Text>
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

  function FavoriteDetailsScreen({ navigation }) {

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
          <Text style={styles.subTitle}>$ {wine.price}</Text>
          <Text style={styles.tinyText}>{wine.grape} from {wine.country}</Text>
          {/* <Pressable style={styles.list} onPress={() => {
            const winemakerkey = wine.winemaker.id
            navigation.navigate('Winemaker Details')
            getWinemakerDetail(winemakerkey)
          }}>
            <Text style={styles.listText}>
              from {wine.winemaker.name}
            </Text>
          </Pressable> */}
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
  
  const HomeStack = createNativeStackNavigator();
  const WineStack = createNativeStackNavigator();
  const WinemakerStack = createNativeStackNavigator();
  const FavoriteStack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  function HomeStackScreen() {
 
    return (
      <HomeStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#E56B6F',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
      }}>
        <HomeStack.Screen name="Journal Des Vin" component={HomeScreen} options={{ title: 'Journal Des Vin'}}/>
        <HomeStack.Screen name="Type" component={TypeScreen} options={{ title: 'Type', headerBackTitleVisible: false }}/>
        <HomeStack.Screen name="Varietal" component={VarietalScreen} options={{ title: 'Varietal', headerBackTitleVisible: false }}/>
        <HomeStack.Screen name="Region" component={RegionScreen} options={{ title: 'Region', headerBackTitleVisible: false }}/>
        <HomeStack.Screen name="Name" component={ResultScreen} options={{ title: 'Wines', headerBackTitleVisible: false }}/>
        <HomeStack.Screen name="Recommendation" component={RecommendationScreen} options={{ title: 'Recommendation', headerBackTitleVisible: false }}/>
      </HomeStack.Navigator>
    );
  }
  
  function WineStackScreen() {
 
    return (
      <WineStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#E56B6F',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
      }}>
        <WineStack.Screen name="Wine List" component={WineScreen} options={{ title: 'List'}}/>
        <WineStack.Screen name="Wine Details" component={WineDetailsScreen} options={{ title: 'Detail', headerBackTitleVisible: false }}/>
      </WineStack.Navigator>
    );
  }
  
  function WinemakerStackScreen() {
 
    return (
      <WinemakerStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#E56B6F',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
      }}>
        <WinemakerStack.Screen name="Winemaker List" component={WinemakerScreen} options={{ title: 'List' }}/>
        <WinemakerStack.Screen name="Winemaker Details" component={WinemakerDetailsScreen} options={{ title: 'Detail', headerBackTitleVisible: false }}/>
      </WinemakerStack.Navigator>
    );
  }

  function FavoriteStackScreen() {
 
    return (
      <FavoriteStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#E56B6F',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
      }}>
        <FavoriteStack.Screen name="Favorite List" component={FavoriteScreen} options={{ title: 'List' }}/>
        <FavoriteStack.Screen name="Favorite Details" component={FavoriteDetailsScreen} options={{ title: 'Detail', headerBackTitleVisible: false }}/>
      </FavoriteStack.Navigator>
    );
  }

  return (

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
          tabBarActiveTintColor: '#E56B6F',
          tabBarInactiveTintColor: '#888',
        })}
      >
        <Tab.Screen name="Home" component={HomeStackScreen} options={{ title: 'Home'}} />
        <Tab.Screen name="Wine" component={WineStackScreen} />
        <Tab.Screen name="Winemaker" component={WinemakerStackScreen} />
        <Tab.Screen name="Favorite" component={FavoriteStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// colors: '#355070' , '#6D597A' , '#B56576' , '#E56B6F' , '#EAAC8B'

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#6D597A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    backgroundColor: '#6D597A',
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
    fontSize: 65,
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
    fontSize: 20,
    color: '#EAAC8B',
    fontWeight: "700",
    textAlign: "center",
    paddingTop: 10,
  },
  tinyText: {
    fontSize: 17,
    color: '#FFF',
    fontWeight: "300",
    margin: 20,
    letterSpacing: 1.1,
    textAlign: "center",
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