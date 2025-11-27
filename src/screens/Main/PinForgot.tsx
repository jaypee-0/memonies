import { View, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { selectUser, setToken, setUserDetails } from "@/redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch } from "@/hooks";
import Layout from "@/components/Layout";
import RNScrollView from "@/components/ScrollView";
import RNText from "@/components/Text";
import { areAllValuesPresent, errorHandler, formatTime } from "@/utils";
import RNButton from "@/components/Button";
import tw from "@/lib/tailwind";
import { useDeviceContext } from "twrnc";
//@ts-ignore
import OTPTextInput from "react-native-otp-textinput";
import { colors } from "@/theme/colors";
import { useMutation } from "react-query";
import { sendfrPinCodeApi, verifyfrPinCodeApi } from "@/utils/api";
import axios from "axios";
import { useSelector } from "react-redux";

interface User {
  email: string;
  password: string;
}

const PinForgot = () => {
  useDeviceContext(tw);
  const navigation: any = useNavigation();
  const [token, settoken] = React.useState("");
  const [pin, setpin] = useState("");
  const user = useSelector(selectUser);
  const [timeLeft, setTimeLeft] = React.useState(30);
  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime: number) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setTimeLeft(0);
    }
  }, [timeLeft]);

  const verifyMutation = useMutation(verifyfrPinCodeApi, {
    onError: (error, context, er) => {
      if (axios.isAxiosError(error)) {
        console.error("Error message:", error.message);
        Alert.alert(
          "Error",
          JSON.stringify(error.response?.data?.message).replace(/"/g, "")
        );
      } else {
        Alert.alert("Error", "Error on forgot password");
      }
    },
    onSuccess: async (data: any) => {
      console.log(data, "verified transaction pin");
      navigation.navigate("Profile");
      Alert.alert('Success', 'Transaction pin reset successful')
    },
  });

  const pinMutation = useMutation(sendfrPinCodeApi, {
    onError: (error, context, er) => {
      if (axios.isAxiosError(error)) {
        console.error('Error message:', error.message);
        Alert.alert('Error', JSON.stringify(error.response?.data?.message).replace(/"/g, ''))
      } else {
        Alert.alert('Error', 'Error on sending pin reset code');
      }
    },
    onSuccess: async (data: any) => {
      console.log(data, 'res on sending pin code');
      setTimeLeft(30)
    },
  });

  //console.log(user)
  const handleVerify = () => {
    verifyMutation.mutate({
      user: user?.id,
      pin: String(pin),
      token: String(token),
    });
  };

  const handleResend = () => {
    pinMutation.mutate({
      phoneNumber: String(user?.phoneNumber),
    })
  };

  return (
    <View style={tw`flex-1 bg-white android:pt-8`}>
      <Layout
        header
        headerBackFunc={() => navigation.goBack()}
        headerCenterText=" Forgot payment pin"
      >
        <RNScrollView style={tw`h-full relative `}>
          <View style={tw`flex-1`}>
            <RNText style={tw`text-2xl text-left`} font="outfitmedium">
              Verify your phone number
            </RNText>
            <View style={tw`flex flex-row items-left gap-x-1 mt-2`}>
              <RNText theme="secondary" style={tw`text-left`}>
                Enter the OTP sent to to your phone number
              </RNText>
            </View>

            <View style={tw`w-full flex flex-col relative mt-8 max-w-[80%]`}>
              <RNText theme="secondary" style={tw`text-left mb-2`}>
                Enter Token
              </RNText>
              <>
                <OTPTextInput
                  autoFocus
                  handleTextChange={(text: string) => {
                    settoken(text);
                  }}
                  textInputStyle={tw` border-b-2 bg-[#F4F4F4]`}
                  tintColor={colors.primary}
                  containerStyle={tw``}
                  inputCount={4}
                  keyboardType="numeric"
                />

                <RNText theme="secondary" style={tw`text-left mb-2 mt-4`}>
                  Enter new Pin
                </RNText>

                <OTPTextInput
                  autoFocus
                  handleTextChange={(text: string) => {
                    setpin(text);
                  }}
                  textInputStyle={tw` border-b-2 bg-[#F4F4F4]`}
                  tintColor={colors.primary}
                  containerStyle={tw``}
                  inputCount={4}
                  keyboardType="numeric"
                />

                <View style={tw`flex w-full flex-row mt-2 justify-start`}>
                  {timeLeft > 0 ? (
                    <RNText theme="black">{formatTime(timeLeft)}</RNText>
                  ) : (
                    <RNText theme="grey">00:00</RNText>
                  )}
                </View>

                <View
                  style={tw`flex flex-row items-center gap-x-1 mt-2 justify-start`}
                >
                  {/* <RNText theme='secondary' style={tw``}>
                    You didn't receive a code?
                  </RNText> */}

                  {timeLeft <= 0 ? (
                    <RNButton
                      title="Resend code"
                      onPress={handleResend}
                      naked
                      orientation="center"
                      nakedTextColor="primary"
                      textStyle={tw`underline`}
                    />
                  ) : null}
                </View>
              </>
            </View>
          </View>
        </RNScrollView>
        <RNButton
          title="Verify"
          onPress={handleVerify}
          style={tw`w-full`}
          theme="primary"
          disable={Boolean(token.length !== 4) && Boolean(pin.length !== 4)}
        />
      </Layout>
    </View>
  );
};

export default PinForgot;
