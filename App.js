import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Browse Wines"
        onPress={() => navigation.navigate('WineList')}
      />
      {/* <Button
        title="Browse Winemakers"
        onPress={() => navigation.navigate('WinemakerList')}
      /> */}
    </View>
  );
}

function WineList({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Wine List</Text>
      <Button
        title="Wine Detail"
        onPress={() => navigation.navigate('WineDetail')}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

function WineDetail({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Wine Detail</Text>
      <Button
        title="Back to List"
        onPress={() => navigation.navigate('WineList')}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}


// function WinemakerList({ navigation }) {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Winemaker List</Text>
//       <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
//       <Button title="Go back" onPress={() => navigation.goBack()} />
//       <Button
//         title="Go back to first screen in stack"
//         onPress={() => navigation.popToTop()}
//       />
//     </View>
//   );
// }

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
        <Stack.Screen name="WineList" component={WineList} options={{ title: 'Wines' }} />
        <Stack.Screen name="WineDetail" component={WineDetail} options={{title: 'Wine Detail'}} />
        {/* <Stack.Screen name="WinemakerList" component={WinemakerList} options={{ title: 'Winemakers'}} /> */}
        {/* <Stack.Screen name="WinemakerDetail" component={WinemakerDetail} options={{title: 'Winemaker Detail'}} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
