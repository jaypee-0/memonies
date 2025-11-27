import { View, Image, Alert, TouchableOpacity } from "react-native";
import React, { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { setToken, setUserDetails } from "@/redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch } from "@/hooks";
import Layout from "@/components/Layout";
import RNText from "@/components/Text";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import RNButton from "@/components/Button";
import tw from "@/lib/tailwind";
import { useDeviceContext } from "twrnc";
import RNScrollView from "@/components/ScrollView";
import { copyToClipboard } from "@/utils";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";

const Account = ({ route }: { route: Record<string, any> }) => {
  const { wallet } = route?.params;
  useDeviceContext(tw);
  const navigation: any = useNavigation();
  const [state, setState] = React.useReducer(
    (
      prev: Record<
        string,
        string | number | boolean | Record<string, string | number>
      >,
      next: Record<
        string,
        string | number | boolean | Record<string, string | number>
      >
    ) => ({
      ...prev,
      ...next,
    }),
    {
      toogleMethod: 1,
      activeMethod: "",
    }
  );

  const data = [
    {
      name: "Account holder",
      text: wallet?.data?.accountName,
    },
    {
      name: "Account Number",
      text: wallet?.data?.accountNumber,
    },
    {
      name: "Bank Name",
      text: wallet?.data?.bankName,
    },
  ];

  const viewShotRef = useRef();
  // const onShare = async () => {
  //   try {
  //     const result = await Share.share({
  //       title: "Account details",
  //       message: `Your Memonies account credentials:\n\nAccount holder: ${wallet?.data?.accountName}\nAccount Number: ${wallet?.data?.accountNumber}\nBank Name: ${wallet?.data?.bankName}`,
  //     });
  //     if (result.action === Share.sharedAction) {
  //       if (result.activityType) {
  //         // shared with activity type of result.activityType
  //       } else {
  //         // shared
  //       }
  //     } else if (result.action === Share.dismissedAction) {
  //       // dismissed
  //     }
  //   } catch (error: any) {
  //     Alert.alert(error.message);
  //   }
  // };

  const captureAndShareScreenshotPNG = async () => {
    try {
      const uri = await viewShotRef?.current.capture();
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.log("Error capturing or sharing screenshot:", error);
    }
  };

  return (
    <Layout header noPad viewBack>
      <RNScrollView style={tw` w-full flex-1`}>
        <ViewShot
          ref={viewShotRef}
          options={{ format: "png", quality: 0.8 }}
          style={{
            backgroundColor: "#ffffff",
            paddingBottom: 40,
            paddingTop: 30,
            paddingHorizontal: 24
          }}
        >
          <RNText theme="black" font="outfitsemi" size="lgl" style={tw`mb-2`}>
            Account
          </RNText>
          <RNText theme="secondary" style={tw`mb-6`}>
            Top up your Memonies wallet by transferring to this account
          </RNText>

          <Image
            source={require("@/assets/images/wema.png")}
            style={tw`rounded-full w-15 h-15 mt-4`}
          />

          {data.map(({ name, text }, index) => {
            return (
              <View
                style={tw`flex flex-row items-center justify-between`}
                key={index}
              >
                <View style={tw`mt-3 py-2`}>
                  <RNText style={tw`text-[#656565]`} size={"sm"}>
                    {name}
                  </RNText>
                  <RNText style={tw``}>{text}</RNText>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    copyToClipboard(text);
                  }}
                >
                  <Ionicons name="copy" size={20} color="#0C142850" />
                </TouchableOpacity>
              </View>
            );
          })}
        </ViewShot>
        <TouchableOpacity
          style={tw`mt-8 mx-auto flex flex-row items-center gap-x-2`}
          onPress={captureAndShareScreenshotPNG}
        >
          <Feather name="share" size={20} color="#09244B" />
          <RNText style={tw`text-[#09244B]`}>Share details</RNText>
        </TouchableOpacity>
      </RNScrollView>
    </Layout>
  );
};

export default Account;
