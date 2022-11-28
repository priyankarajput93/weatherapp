import { useEffect, useState } from "react";
import { View, Text, PermissionsAndroid, Button, FlatList, StyleSheet, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../redux/Reducers";
import { Data } from "../Utils/DummyData";
import { GlobalStyles } from "../Utils/Styles";
import { weekDay } from "../Utils/Constants";
import Geolocation from "react-native-geolocation-service";
import Loading from "../UI/Loading";

function Dashboard() {

  const dispatch = useDispatch();
  const [location, setLocation] = useState(false);
  const { appReducer } = useSelector((state) => state);
  console.log(appReducer);

  const status = appReducer.status;
  const error = appReducer.error;
  const data = appReducer.data;

  function removeDuplicate() {
    const weatherDataList = [];
    for (let i = 0; i < data.list.length; i++) {
      if (i < (data.list.length - 1)) {
        if (getDayOfWeek(data.list[i].dt_txt) !== getDayOfWeek(data.list[i + 1].dt_txt)) {
          weatherDataList.push(data.list[i]);
        }
      }
    }
    return weatherDataList;
  }

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message:
            "Weather App needs access to your location ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location");
        dispatch(getData());
      } else {
        console.log("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }
  // function to check permissions and get Location
  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position.coords.latitude);
            console.log(position.coords.longitude);
            setLocation(position);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLocation(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      }
    });
    console.log(location);
  };

  function convertKelvinToCelcious(kelvin) {
    var number = (kelvin - 273.15);
    const result = number - number % 1;
    return result;
  }

  function getDayOfWeek(date) {
    const day = new Date(date);
    return day.getDay();
  }

  function getNameOfDayOfWeek(day) {
    var currentDate = new Date();
    if (day == currentDate.getDay()) {
      return 'Today';
    } else {
      return weekDay[day];
    }
  }
  function getImageUrl(image) {
    return 'http://openweathermap.org/img/w/' + image + '.png';
  }

  useEffect(() => {
    //getLocation();
    requestLocationPermission();
  }, []);

  const renderItem = ({ item }) => (
    <View style={style.itemContainer}>
      <Text style={style.dayText}>{getNameOfDayOfWeek(getDayOfWeek(item.dt_txt))}</Text>
      <Image
        style={style.tinyLogo}
        source={{ uri: getImageUrl(item.weather[0].icon) }}
      />
      <Text style={style.weatherText}>{item.weather[0].main}</Text>
      <Text style={style.tempText}>{convertKelvinToCelcious(item.main.temp)}{'\u00b0'}</Text>
    </View>
  );
  if (status === 'error') {
    return (
      <RetryView
        heading="Connection Error!"
        message="Please check your internet connection or try again later"
        onPress={dispatch(getData())}
      />
    );
  } else if (status === 'loading') {
    return (<Loading />);
  } else if (status === 'succeeded') {
    return (
      <View style={style.listContainer}>
        <Text style={style.todayText}> {Data.city.name} </Text>
        <Text style={style.todayTempText}> {convertKelvinToCelcious(Data.list[0].main.temp)}{'\u00b0'} | {Data.list[0].weather[0].main}</Text>
        <Text style={style.minTempText}>H:{convertKelvinToCelcious(Data.list[0].main.temp_max)}{'\u00b0'}  L:{convertKelvinToCelcious(Data.list[0].main.temp_min)}{'\u00b0'}</Text>
        <FlatList data={removeDuplicate()}
          keyExtractor={item => item.dt}
          renderItem={renderItem}
        >
        </FlatList>
      </View>
    )
  } else {
    console.log('else called');
  }
}
const style = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: 'column',
  },
  listContainer: {
    flex: 1.9,
  },
  todayText: {
    fontSize: 28,
    fontStyle: 'bold',
    color: GlobalStyles.colors.primary900,
    textAlign: 'center',
    marginTop: 12
  },
  todayTempText: {
    fontSize: 32,
    fontStyle: 'bold',
    color: GlobalStyles.colors.primary900,
    textAlign: 'center',
    marginVertical: 8
  },
  dayText: {
    fontSize: 16,
    fontStyle: 'bold',
    flex: 0.4,
    color: GlobalStyles.colors.primary900,
  },
  weatherText: {
    fontSize: 16,
    fontStyle: 'bold',
    flex: 0.4,
    textAlign: 'center',
    color: GlobalStyles.colors.primary900,
  },
  tempText: {
    fontSize: 16,
    flex: 0.1,
    fontStyle: 'bold',
    color: GlobalStyles.colors.primary900,
  },
  minTempText: {
    fontSize: 16,
    fontStyle: 'bold',
    color: GlobalStyles.colors.primary900,
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderColor: GlobalStyles.colors.gray700,
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 12,
    marginVertical: 12,
    padding: 24
  },
  tinyLogo: {
    flex: 0.1,
    width: 36,
    height: 28,
  },
})
export default Dashboard;