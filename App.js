import { useEffect } from "react";
import { Alert, BackHandler, ImageBackground, StatusBar, StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { Store } from "./src/redux/Store";
import Main from "./src/screens/Main";
import { GlobalStyles } from "./src/utils/Styles";

const App = () => {

  useEffect(() => {

    // this method will be called when device's backpress is pressed
    const backAction = () => {
      Alert.alert("Close App?", "Do you want to close the application?", [
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
        source={require('./src/assets/images/background.jpg')}
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
