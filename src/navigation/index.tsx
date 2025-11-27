import React from "react";
import { selectToken } from "@/redux/slices/authSlice";
import Auth from "./Auth";
import Main from "./Main";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { Platform, View } from "react-native";
import { useAppSelector } from "@/hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function Navigation() {
  let isTokenPresent = useAppSelector(selectToken);


  React.useEffect(() => {
    const checkpermission = async () => {
      const { status } = await requestTrackingPermissionsAsync();
      if (status === "granted") {
        console.log("Yay! I have user permission to track data");
      }
    };
    if (Platform.OS === "ios") {
      checkpermission();
    }
  }, []);

  return !isTokenPresent ? (
    <Auth />
  ) : (
  
      <Main />
  );
}
