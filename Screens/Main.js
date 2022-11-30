
import { useDispatch } from "react-redux";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Login";
import { clearData } from "../redux/Reducers";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native";
import Dashboard from "./Dashboard";
import { GlobalStyles } from "../Utils/Styles";

const Stack = createNativeStackNavigator();

function Main() {
    var currentUser = null;
    const dispatch = useDispatch();

    const appTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: 'transparent',
        },
    };

    useEffect(() => {
        getUser();
    })

    const getUser = async () => {
        try {
            const savedUser = await AsyncStorage.getItem("userData");
            currentUser = JSON.parse(savedUser);
        } catch (error) {
            console.log(error);
        }
    };

    const clearAppData = async function () {
        try {
            const keys = await AsyncStorage.getAllKeys();
            await AsyncStorage.multiRemove(keys);
            dispatch(clearData());
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <NavigationContainer theme={appTheme} >
            <Stack.Navigator
                initialRouteName={(currentUser !== null) ? "Login" : "Dashboard"}
                screenOptions={{
                    headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
                    headerTintColor: 'white',
                }}>
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={({ navigation }) => ({
                        headerBackVisible: false,
                        headerRight: () => (
                            <Button
                                onPress={() => {
                                    clearAppData();
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Login' }],
                                    });
                                }}
                                title="Logout"
                                color={GlobalStyles.colors.primary500}
                            />
                        ),
                    })} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default Main;