import { useEffect } from "react";
import { Alert, BackHandler, ImageBackground, StatusBar, StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { Store } from "./src/redux/Store";
import Main from "./Screens/Main";
import { GlobalStyles } from "./Utils/Styles";

const App = () => {

  useEffect(() => {

    const backAction = () => {
      Alert.alert("Close ", "Do you want to close the application?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  return (
    <>
      <StatusBar barStyle={'light'} backgroundColor={GlobalStyles.colors.primary800} />
      <ImageBackground
        source={require('./assets/images/background.jpg')}
        resizeMode='cover'
        style={styles.rootScreen}
        imageStyle={styles.backgroundImage}>
        <Provider
          store={Store}>
          <Main />
        </Provider>
      </ImageBackground>
    </>
  );
}
const styles = StyleSheet.create({
  rootScreen: {
    flex: 1
  },
  backgroundImage: {
    opacity: 0.3,
    resizeMode: 'cover',
  },
});
export default App;
