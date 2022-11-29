import { useEffect, useState } from "react";
import { View, Text, PermissionsAndroid, Button, FlatList, StyleSheet, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../redux/Reducers";
import { GlobalStyles } from "../Utils/Styles";
import { weekDay } from "../Utils/Constants";
import Geolocation from "react-native-geolocation-service";
import Loading from "../UI/Loading";
import ErrorView from "../UI/ErrorView";

function Dashboard() {

  const dispatch = useDispatch();
  const { appReducer } = useSelector((state) => state);

  const status = appReducer.status;
  const error = appReducer.error;
  const data = appReducer.data;

  //default lat long
  const lat = '28.5355';
  const lon = '77.3910';

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

  const requestLocPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Can we access your location?',

          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === 'granted') {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  const getLocation = () => {
    const result = requestLocPermission();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            dispatch(getData({ lat, lon }));
          },
          error => {
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      } else {
        dispatch(getData({ lat, lon }))
      }
    });
  }

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
    getLocation();
  }, []);

  const renderItem = ({ item }) => (
    <View style={style.itemContainer}>
      <Text style={style.dayText}>
        {getNameOfDayOfWeek(getDayOfWeek(item.dt_txt))}
      </Text>
      <Image
        style={style.tinyLogo}
        source={{ uri: getImageUrl(item.weather[0].icon) }}
      />
      <Text style={style.weatherText}>
        {item.weather[0].main}
      </Text>
      <Text style={style.tempText}>
        {convertKelvinToCelcious(item.main.temp)}{'\u00b0'}
      </Text>
    </View>
  );

  if (status === 'failed') {
    return (
      <ErrorView
        heading={error}
        message="Please check your internet connection or open the app again later"
      />
    );
  } else if (status === 'loading') {
    return (
      <Loading />
    );
  } else if (status === 'succeeded') {
    return (
      <View style={style.listContainer}>
        <Text style={style.todayText}>
          {data.city.name}
        </Text>
        <Text style={style.todayTempText}>
          {data.list[0].weather[0].main}
        </Text>
        <Text style={style.minTempText}>
          H:{convertKelvinToCelcious(data.list[0].main.temp_max)}{'\u00b0'}  L:{convertKelvinToCelcious(data.list[0].main.temp_min)}{'\u00b0'}
        </Text>
        <FlatList data={removeDuplicate()}
          keyExtractor={item => item.dt}
          renderItem={renderItem}
        >
        </FlatList>
      </View>
    )
  } else {
    <Text style={style.noDataText}>
      No Data
    </Text>
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
  noDataText: {
    fontSize: 24,
    fontStyle: 'bold',
    textAlign: 'center',
    color: GlobalStyles.colors.primary900,
  },
})
export default Dashboard;