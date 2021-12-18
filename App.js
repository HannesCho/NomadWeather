import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "3b98e61bbe9654fd41fb5421f50e6a1c"

export default function App() {
  const [city, setCity] = useState("Loading...")
  const [days, setDays] = useState([])
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(location[0].city)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json.daily)
  }
  const askPermission = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }    
    getWeather();
  }

  useEffect(() => {
    askPermission();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
       <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.weather}>
        {days.length === 0 ? (<View style={styles.day}>
        <ActivityIndicator color="black" size="large"/>
        </View>) : days.map((day, index) => 
        <View key={index} style={styles.day}>
          <Text style={styles.temp}>{(day.temp.day).toFixed(1)}</Text>
          <Text style={styles.description}>{day.weather[0].main}</Text>
          <Text style={styles.detail}>{day.weather[0].description}</Text>
        </View>
        )}
        
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
    
  },
  city: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
  },
  weather:{
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  temp:{
    marginTop: 20,
    fontSize: 150,
  },
  description: {
    marginTop: -30,
    fontSize: 60,
  },
  detail: {
    fontSize: 20
  }
});
