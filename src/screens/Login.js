import { TextInput, StyleSheet, View, Text, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { GlobalStyles } from "../utils/Styles";
import Button from "../ui/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addUserName, addUserPassword } from "../src/redux/Reducers";

function Login({ navigation }) {

    const enteredName = useSelector(state => state.appReducer.userName);
    const enteredPassword = useSelector(state => state.appReducer.userPassword);
    const formIsInvalid = enteredName === "" || enteredPassword === "";

    const dispatch = useDispatch();

    // store user to storage
    const storeUser = async () => {
        const userData = {
            name: enteredName,
            password: enteredPassword
        };
        try {
            await AsyncStorage.setItem("userData", JSON.stringify(userData));
        } catch (error) {
            console.log(error);
        }
    };

    // this method will be called when user click on login button
    function login() {
        storeUser();
        navigation.navigate("Dashboard")
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}>
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}>
                <SafeAreaView style={styles.container}>
                    <Image
                        style={styles.image}
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={(value) => dispatch(addUserName(value))}
                        value={enteredName}
                        placeholder="Username"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={(value) => dispatch(addUserPassword(value))}
                        value={enteredPassword}
                        placeholder="Password"
                        secureTextEntry={true}
                    />

                    <View
                        style={styles.buttonStyle}>
                        <Button
                            isEnable={formIsInvalid}
                            style={styles.buttonText}
                            onPress={login}>Login</Button>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 60
    },
    input: {
        height: 40,
        width: '80%',
        marginVertical: 12,
        marginHorizontal: 30,
        borderWidth: 1,
        borderColor: GlobalStyles.colors.primary900,
        borderRadius: 16,
        padding: 10,
    },
    buttonText: {
        fontSize: 16,
        fontStyle: 'bold',
        padding: 2,
    },
    buttonStyle: {
        width: '80%',
        marginTop: 20,
        marginHorizontal: 30,
        marginVertical: 20,
        borderRadius: 16,
        margin: 10
    },
    image: {
        height: 64,
        width: 64,
        margin: 20
    }
});
export default Login;