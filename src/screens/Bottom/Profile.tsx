import tw from "@/lib/tailwind";
import { Image, TouchableOpacity, View, Modal, Pressable, Switch } from "react-native";
import React, { useState } from "react";
import RNText from "@/components/Text";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { logout, selectToken, selectUser } from "@/redux/slices/authSlice";
import { colors } from "@/theme/colors";
import { useDeviceContext } from "twrnc";
import {
  Ionicons,
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Layout from "@/components/Layout";
import RNScrollView from "@/components/ScrollView";
import { useNavigation, NavigationProp, Link } from "@react-navigation/native";
import { ParamListBase } from "@/navigation/types";
import {
  FireIcon,
  LogoutIcon,
  PrivacyIcon,
  ProfileIcon2,
  SecurityIcon,
  SupportIcon,
  TermsIcon,
  VendorIcon,
} from "@/assets/icons";
import RNButton from "@/components/Button";
import * as Linking from "expo-linking";
import { QueryClient } from "react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: 2 },
    },
  });
  const dispatch = useAppDispatch();
  useDeviceContext(tw);
  let isTokenPresent = useAppSelector(selectToken);
  const selectedUser = useAppSelector(selectUser);

  const navigation: NavigationProp<ParamListBase> | any = useNavigation();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(true);

  React.useEffect(() => {
    (async () => {
      try {
        const enabled = await AsyncStorage.getItem("biometric_enabled");
        if (enabled === "false") {
          setBiometricEnabled(false);
        } else if (enabled === "true") {
          setBiometricEnabled(true);
        }
      } catch {}
    })();
  }, []);

  let links = [
    {
      title: "personal information",
      buttons: [
        {
          name: "Personal details",
          text: "Manage your personal details",
          icon: <AntDesign name="user" size={24} color="black" />,
          url: () => navigation.navigate("PersonalDetails"),
        },
        // {
        //   name: 'Account limits',
        //   text: 'View your transaction limits',
        //   icon: <MaterialCommunityIcons name='radar' size={24} color='black' />,
        //   url: () => navigation.navigate('Home'),
        // },
        // {
        //   name: 'Linked cards',
        //   text: 'View your linked cards',
        //   icon: <AntDesign name='creditcard' size={24} color='black' />,
        //   url: () => navigation.navigate('LinkedCards'),
        // },
      ],
    },
    {
      title: "security",
      buttons: [
        {
          name: "Biometric login",
          text: `Use device biometrics`,
          icon: (
            <MaterialCommunityIcons name="fingerprint" size={24} color="#0C1428" />
          ),
          url: () => {},
        },
        {
          name: "Login pin",
          text: "Manage login pin",
          icon: <Ionicons name="key-outline" size={24} color="#0C1428" />,
          url: () => navigation.navigate("LoginPin"),
        },
        {
          name: "Payment pin",
          text: "Manage payment pin",
          icon: (
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color="#0C1428"
            />
          ),
          url: () => navigation.navigate("PaymentPin"),
        },
      ],
    },
    {
      title: "help & support",
      buttons: [
        {
          name: "Chat with us",
          text: "Need help? reach out to us",
          icon: (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color="#0C1428"
            />
          ),
          url: () => Linking.openURL("https://www.memonies.app/contact"),
        },
        {
          name: "FAQs",
          text: "Answers to your questions",
          icon: (
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#0C1428"
            />
          ),
          url: () => Linking.openURL("https://www.memonies.app/faqs"),
        },
      ],
    },
    {
      title: "app",
      buttons: [
        {
          name: "Legal agreements",
          text: "Check out compliance",
          icon: (
            <Ionicons name="document-text-outline" size={24} color="#0C1428" />
          ),
          url: () => Linking.openURL("https://www.memonies.app/privacy"),
        },
        {
          name: "Delete account",
          text: `Please don't`,
          icon: <Ionicons name="trash-outline" size={24} color="#0C1428" />,
          //@ts-ignore
          url: () => navigation.navigate("DeleteReason"),
        },
        {
          name: "Log out",
          text: "Leave the app for now",
          icon: <MaterialIcons name="logout" size={24} color={colors.danger} />,
          //@ts-ignore
          url: () => setShowLogoutModal(true),
        },
      ],
    },
  ];

  return (
    <Layout bg={"#F8FCFF"}>
      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/40`}>
          <View style={tw`bg-white rounded-sm p-6 w-4/5 items-center`}>
            <RNText size="lg" font="outfitsemi" style={tw`mb-2`}>
              Log out?
            </RNText>
            <RNText style={tw`mb-6 text-center`}>
              Are you sure you want to log out?
            </RNText>
            <View style={tw`flex-row w-full justify-between`}>
              <Pressable
                style={tw`flex-1 py-2 mr-2 rounded bg-[#EFF4FF] items-center`}
                onPress={() => setShowLogoutModal(false)}
              >
                <RNText theme="primary">Cancel</RNText>
              </Pressable>
              <Pressable
                style={tw`flex-1 py-2 ml-2 rounded bg-[#FFF4F4] items-center`}
                onPress={() => {
                  setShowLogoutModal(false);
                  queryClient.clear();
                  dispatch(logout());
                }}
              >
                <RNText style={{ color: colors.danger }}>Log out</RNText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* End Logout Confirmation Modal */}
      <View style={tw` w-full flex-1`}>
        <RNText theme="black" font="outfitsemi" size="lgl" style={tw`mb-2`}>
          Profile
        </RNText>
        <TouchableOpacity
          onPress={() => navigation.navigate("PersonalDetails")}
          style={tw`w-full flex flex-row justify-between items-center rounded-xl py-2 mt-3`}
        >
          <View style={tw`flex flex-row items-center`}>
            <View
              style={tw`mr-4 rounded-full bg-[#8d8d8d70] h-12 w-12 flex flex-row items-center justify-center`}
            >
              <RNText style={tw``} font="outfitmedium">
                {selectedUser?.firstName?.slice(0, 1) +
                  selectedUser.lastName.slice(0, 1)}
              </RNText>
            </View>
            {/* @ts-ignore */}
            <View>
              <RNText style={tw``}>
                {selectedUser?.firstName + " " + selectedUser.lastName}
              </RNText>
              <View style={tw`flex flex-row gap-x-4`}>
                {/* <RNText style={tw`text-[#656565]`} size={'sm'}>
                  {selectedUser?.email? selectedUser?.email: 'Email: N/A'}
                </RNText> */}
                {/* <TouchableOpacity
                  style={tw`bg-[#E2FFEC] rounded-full px-3 py-1 flex flex-row items-center gap-x-1`}>
                  <AntDesign name='checkcircle' size={10} color='#0D8436' />
                  <RNText style={tw`text-xs text-[#0D8436]`}>{'Tier 1'}</RNText>
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
          {/* <RNButton
            naked
            nakedTextColor='primary'
            title='Upgrade'
            navigate='ForgotPassword'
            style={tw`mt-0 mb-5`}
            textStyle={tw`text-sm text-secondary`}
          /> */}
        </TouchableOpacity>
        <RNScrollView style={tw`pt-3 h-full`}>
          <View style={tw`w-full flex flex-col flex-1 relative`}>
            {links.map(({ title, buttons }, index) => {
              return (
                <View style={tw`bg-white p-4 mb-2`} key={index}>
                  <RNText
                    size={"smB"}
                    mB
                    style={tw`uppercase text-[#637381] font-semibold `}
                  >
                    {title}
                  </RNText>
                  {buttons?.map(({ name, text, icon, url }, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={url}
                      style={tw`w-full flex flex-row justify-between items-center bg-white rounded-xl mt-2 ${
                        name === "donotshow" ? "hidden" : ""
                      }`}
                    >
                      <View style={tw`flex flex-row items-center`}>
                        <View
                          style={tw`mr-4 h-10 w-10 rounded-full ${
                            name.includes("Log out")
                              ? "bg-[#FFF4F4]"
                              : "bg-[#EFF4FF]"
                          } flex items-center justify-center`}
                        >
                          {icon}
                        </View>
                        {/* @ts-ignore */}
                        <View>
                          <RNText style={tw`-mb-1`} size="md">
                            {name}
                          </RNText>
                          <RNText style={tw`text-[#656565]`} size={"sm"}>
                            {text}
                          </RNText>
                        </View>
                      </View>
                      {name === "Biometric login" ? (
                        <Switch
                          value={biometricEnabled}
                          onValueChange={async (val) => {
                            setBiometricEnabled(val);
                            try {
                              await AsyncStorage.setItem("biometric_enabled", val ? "true" : "false");
                            } catch {}
                          }}
                          trackColor={{false: '#EFF4FF', true: "#EFF4FF"}}
                          thumbColor={biometricEnabled ? colors.primary : '#f4f3f4'}
                          ios_backgroundColor="#EFF4FF"
                        />
                      ) : (
                        <AntDesign name="right" size={14} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              );
            })}
          </View>
          <RNText
            style={tw`text-center mt-4 mb-8`}
            font="outfitlight"
            theme="primary"
          >
            Version 0.6.1
          </RNText>
        </RNScrollView>
      </View>
    </Layout>
  );
};

export default Profile;
