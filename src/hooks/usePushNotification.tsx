import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Alert, Platform } from "react-native";
//import { toggleNotificationState } from "../service/redux/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "react-query";
import { addTokenApi } from "@/utils/api";
import axios from "axios";

export const usePushNotification = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowAlert: true,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<Record<string, any>>();
  const [notification, setNotification] = useState();
  const [shouldAskForPermission, setShouldAskForPermission] = useState(true);

  const notificationListener = useRef();
  const responseListener = useRef();
  const tokenMutation = useMutation(addTokenApi, {
    onError: (error, context, er) => {
      if (axios.isAxiosError(error)) {
        console.log("Error on uploading push token");
        console.error("Error message:", error?.message);
      } else {
        Alert.alert("Error", "Error on forgot password");
      }
    },
    onSuccess: async (data: any) => {
      console.log("successful push token upload");
    },
  });

  const sendPushToken = async (pushToken: string) => {
    tokenMutation.mutate({
      token: pushToken,
    });
  };

  const registerForPushNotification = async () => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log("ExistingStatus=+", status);
      }

      if (finalStatus !== "granted") {
        return { token: null, granted: false };
      }
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
      return { token, granted: true };
    }
  };
  

  useEffect(() => {
    const checkAndRegisterForPushNotifications = async () => {
      const hasRegistered = await AsyncStorage.getItem(
        "hasRegisteredForPushNotifications"
      );

      if (!hasRegistered && shouldAskForPermission) {
        // @ts-ignore
        const {
          token,
          granted,
        }: {
          token: Record<string, any>;
          granted: boolean;
        } = await registerForPushNotification();
        if (granted) {
          setExpoPushToken(token);
          sendPushToken(token?.data);
          await AsyncStorage.setItem(
            "hasRegisteredForPushNotifications",
            "true"
          );
        } else {
          // If permission is not granted, allow asking for permission again
          setShouldAskForPermission(true);
        }
      }
    };

    checkAndRegisterForPushNotifications();
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [shouldAskForPermission]);

  return { expoPushToken, notification };
};
