import {
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { colors } from "@/theme/colors";
import { useNavigation } from "@react-navigation/native";
import tw from "@/lib/tailwind";
import { useDeviceContext } from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { fonts } from "@/theme/fonts";

interface Props {
  children: React.ReactNode;
  header?: boolean;
  headerRight?: string;
  headerRightNav?: boolean | string;
  sub?: boolean;
  headerCenterText?: string;
  noFlex?: boolean;
  bg?: string;
  headerBackFunc?: () => void;
  showStatusBar?: boolean;
  from?: string;
  noPad?: boolean;
  viewBack?: boolean
}

const Layout = ({
  children,
  header,
  headerRight,
  headerRightNav,
  sub,
  headerCenterText,
  noFlex,
  bg,
  showStatusBar,
  from,
  noPad,
  headerBackFunc,
  viewBack
}: Props) => {
  useDeviceContext(tw);
  const navigation: any = from !== "Webview" ? useNavigation() : "";
  return (
    <>
      {!showStatusBar && (
        <StatusBar
          barStyle={"dark-content"}
          backgroundColor={bg ? bg : "white"}
          animated={true}
        />
      )}
      <SafeAreaView style={tw`flex-1 bg-white`}>
        <View
          style={{
            backgroundColor: bg ? bg : colors.white,
            flex: noFlex ? 0 : 1,
            paddingTop: sub ? 10 : Platform.OS === "android" ? 10 : 0,
            paddingHorizontal: noPad ? 0 : 20,
            width: "100%",
            paddingBottom: Platform.OS === "android" ? 15 : 0,
          }}
        >
          {header && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <TouchableOpacity
                onPress={
                  headerBackFunc ? headerBackFunc : () => navigation.goBack()
                }
                style={tw`flex flex-row items-center gap-x-2 ${viewBack?'ml-[25px]':'ml-0'}`}
              >
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              {headerRightNav && (
                <TouchableOpacity
                  onPress={() => navigation.navigate(headerRightNav)}
                  style={{
                    borderRadius: 8,
                    borderColor: "#D7DBE0",
                    borderWidth: 1,
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                    {headerRight}
                  </Text>
                </TouchableOpacity>
              )}
              {headerCenterText && (
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    fontFamily: fonts.outfitsemi,
                  }}
                >
                  {headerCenterText}
                </Text>
              )}
              {headerCenterText && (
                <Text style={{ paddingHorizontal: 10 }}>{""}</Text>
              )}
            </View>
          )}
          {children}
        </View>
      </SafeAreaView>
    </>
  );
};

export default Layout;
