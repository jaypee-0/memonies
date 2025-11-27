import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Onboarding from "@/screens/Onboarding";
import {
  Welcome,
  Login,
  ForgotPassword,
  VerifyPassword,
  ChangePassword,
  Signup,
  VerifyEmail,
  OrganizationInput,
} from "@/screens/Auth";
import NoNetwork from "@/screens/NoNetwork";
import NetInfo from "@react-native-community/netinfo";
import { SafeAreaView } from "react-native";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

export default function Auth() {
  const [visible, setVisible] = React.useState<boolean | null>(null);
  const [isFirstLaunch, setIsFirstLaunch] = React.useState<null | boolean>(
    null
  );
  React.useEffect(() => {
    AsyncStorage.getItem("firstTimeAppLaunch")
      .then((result: any) => {
        if (result === null) {
          setIsFirstLaunch(true);
          AsyncStorage.setItem("firstTimeAppLaunch", "false");
        } else {
          setIsFirstLaunch(false);
        }
      })
      .catch((error) => {
        console.error("Error checking app launch status:", error);
      });
  }, []);
  React.useEffect(() => {
    const unSub = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    });
    return () => {
      unSub();
    };
  }, []);
  const screens = [
    {
      name: "OnBoard",
      component: Onboarding,
    },
    {
      name: "OrganizationInput",
      component: OrganizationInput,
    },
    {
      name: "Welcome",
      component: Welcome,
    },
    {
      name: "Login",
      component: Login,
    },
    {
      name: "ForgotPassword",
      component: ForgotPassword,
    },
    {
      name: "VerifyPassword",
      component: VerifyPassword,
    },
    {
      name: "ChangePassword",
      component: ChangePassword,
    },
    {
      name: "Signup",
      component: Signup,
    },
    {
      name: "VerifyEmail",
      component: VerifyEmail,
    },
  ];
  if (visible !== null && isFirstLaunch !== null) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          //initialRouteName={visible ? "OnBoard" : "NoNetwork"}
          initialRouteName={
            isFirstLaunch ? "OnBoard" : "Welcome"
          }
        >
          {screens.map(({ name, component }) => (
            <Stack.Screen
              key={name}
              name={name}
              // @ts-ignore
              component={component}
              options={{ headerShown: false }}
            />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
