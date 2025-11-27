import { View, Image, Alert, KeyboardAvoidingView } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  setSignUpToken,
  setToken,
  setUserDetails,
} from "@/redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch } from "@/hooks";
import Layout from "@/components/Layout";
import RNScrollView from "@/components/ScrollView";
import RNText from "@/components/Text";
import { areAllValuesPresent, errorHandler } from "@/utils";
import RNTinput from "@/components/TextField";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  SimpleLineIcons,
} from "@expo/vector-icons";
import RNButton from "@/components/Button";
import tw from "@/lib/tailwind";
import { useDeviceContext } from "twrnc";
import * as Linking from "expo-linking";
//@ts-ignore
import OTPTextInput from "react-native-otp-textinput";
import { colors } from "@/theme/colors";
import { useMutation } from "react-query";
import {
  addBVNApi,
  addKycApi,
  createPinApi,
  registerApi,
  sendOtpApi,
  verifyOtpApi,
} from "@/utils/api";
import axios from "axios";
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from "react-native-responsive-dimensions";
import { ADD_KYC } from "@/services/url";

interface IUserCredentials {
  stage: number;
  phone: string;
  otp: string;
  bvn: string;
  pin: string;
  confirmPin: string;
  showPin: string;
  confirmShowPin: string;
}

interface Params {
  route: {
    params: {
      verifyAccount?: boolean;
      phone?: string;
      stage?: number;
      organization?: string;
    };
  };
}
const Signup = ({ route }: Params) => {
  const { verifyAccount, phone: phoneNuumber, stage, organization } = route.params ?? {};
  useDeviceContext(tw);
  const dispatch = useAppDispatch();
  const navigation: any = useNavigation();

  const [showPassword, setShowPassword] = React.useState(true);
  const [cshowPassword, setcShowPassword] = React.useState(true);
  const [userCredentials, setuserCredentials] = React.useReducer(
    (
      prev: Record<string, string | number | boolean>,
      next: Record<string, string | number | boolean>
    ) => ({
      ...prev,
      ...next,
    }),
    {
      stage: 1,
      phone: "",
      otp: "",
      bvn: "",
      nin: "",
      pin: "",
      confirmPin: "",
      showPin: false,
      confirmShowPin: false,
      disabled: true,
      toggleBvnInfo: false,
      password: "",
      cpassword: "",
      userid: "",
      organization: organization || "",
    }
  );
  const handleChange = (name: any, value: any) => {
    setuserCredentials({
      ...userCredentials,
      [name]: value,
    });
  };
  
  const [isDisabled, setisDisabled] = React.useState(true);
  const [resendSecondsLeft, setResendSecondsLeft] = React.useState(30);

  const registerMutation = useMutation(registerApi, {
    onError: (error, context, er) => {
      if (axios.isAxiosError(error)) {
        console.error("Error message:", error.message);
        Alert.alert(
          "Error",
          JSON.stringify(error.response?.data?.message).replace(/"/g, "")
        );
      } else {
        Alert.alert("Error", "Error signing in, please try again");
      }
    },
    onSuccess: async (data: any) => {
      console.log(data, "<---  data on api call");
      setuserCredentials({
        ...userCredentials,
        stage: 2,
        userid: data?.data?.id,
      });
      setTimeout(() => {
        setisDisabled(true);
      }, 1200);
    },
  });

  const sendOtpMutation = useMutation(sendOtpApi, {
    onError: (error, context, er) => {
      if (axios.isAxiosError(error)) {
        console.error("Error message:", error.message);
        Alert.alert(
          "Error",
          JSON.stringify(error.response?.data?.message).replace(/"/g, "")
        );
      } else {
        Alert.alert("Error", "Error sending code, please try again");
      }
    },
    onSuccess: async () => {
      setResendSecondsLeft(30);
    },
  });

  const verifyOtpMutation = useMutation(verifyOtpApi, {
    onError: (error, context, er) => {
      if (axios.isAxiosError(error)) {
        console.error("Error message:", error.message);
        Alert.alert(
          "Error",
          JSON.stringify(error.response?.data?.message).replace(/"/g, "")
        );
      } else {
        Alert.alert("Error", "Error signing in, please try again");
      }
    },
    onSuccess: async (data: any) => {
      console.log(data, "<---  data on api call");
      await AsyncStorage.setItem("token", data?.token?.accessToken);
      handleChange("stage", 3);
      
    },
  });
  const addBVNMutation = useMutation(addBVNApi, {
    onError: (error, context, er) => {
      if (axios.isAxiosError(error)) {
        console.error("Error message:", error.message);
        Alert.alert(
          "Error",
          JSON.stringify(error.response?.data?.message).replace(/"/g, "")
        );
      } else {
        Alert.alert("Error", "Error signing in, please try again");
      }
    },
    onSuccess: async (data: any) => {
      console.log(data, "<---  data on api call");
      handleChange("stage", 4);
      setTimeout(() => {
        setisDisabled(true);
      }, 2000);
    },
  });
  const addKYCMutation = useMutation(addKycApi, {
    onError: (error, context, er) => {
      if (axios.isAxiosError(error)) {
        console.error("Error message:", error?.response?.data);
        Alert.alert(
          "Error",
          JSON.stringify(error?.response?.data?.message).replace(/"/g, "")
        );
      } else {
        Alert.alert("Error", "Error completing kyc, please try again");
      }
    },
    onSuccess: async (data: any) => {
      console.log(data, "<---  data on api call");
      handleChange("stage", 4);
      setTimeout(() => {
        setisDisabled(true);
      }, 2000);
    },
  });

  const addPinMutation = useMutation(createPinApi, {
    onError: (error, context, er) => {
      if (axios.isAxiosError(error)) {
        console.error("Error message:", error.message);
        Alert.alert(
          "Error",
          JSON.stringify(error.response?.data?.message).replace(/"/g, "")
        );
      } else {
        Alert.alert("Error", "Error creating pin, please try again");
      }
    },
    onSuccess: async (data: any) => {
      navigation.navigate("Login");
      console.log(data, "<---  data on api call");
      handleChange("stage", 4);
      setTimeout(() => {
        setisDisabled(true);
      }, 3000);
    },
  });

  const handleSubmit = async () => {
    if (userCredentials.stage == 1) {
      if (String(userCredentials.password) !== String(userCredentials.cpassword)) {
        Alert.alert("Error", "Passwords must match");
        return
      }
      registerMutation.mutate({
        phoneNumber: String(userCredentials.phone),
        password: String(userCredentials.password),
      });
    } else if (userCredentials.stage == 2) {
      verifyOtpMutation.mutate({
        otp: String(userCredentials.otp),
        user: String(userCredentials.userid),
      });
    } else if (userCredentials.stage == 3 || stage  == 3) {
       addKYCMutation.mutate({
         nin: String(userCredentials.nin),
         bvn: String(userCredentials.bvn)
       });
    } else if (userCredentials.stage == 4) {
      if (userCredentials.pin !== userCredentials.confirmPin) {
        Alert.alert(
          "Error",
          "Passwords do not match"
        );
        return;
      }
      addPinMutation.mutate({
        pin: String(userCredentials.pin),
        confirm: String(userCredentials.confirmPin),
      });
    } else {
      navigation.navigate("Login");
      handleChange("stage", 1);
      setTimeout(() => {
        setisDisabled(true);
      }, 1200);
    }
  };

  React.useEffect(() => {
    if (userCredentials.stage === 1) {
      if (
        userCredentials.phone.toString().length === 11 &&
        userCredentials.password.toString().length >= 6 &&
        userCredentials.cpassword.toString().length >= 6
      ) {
        setisDisabled(false);
      }
    } else if (userCredentials.stage === 2) {
      if (userCredentials.otp.toString().length === 4) {
        setisDisabled(false);
      }
    } else if (userCredentials.stage === 3) {
      if (
        userCredentials.bvn.toString().length === 11 &&
        userCredentials.nin.toString().length === 11
      ) {
        setisDisabled(false);
      }
    } else if (userCredentials.stage === 4) {
      if (
        userCredentials.pin.toString().length >= 4 &&
        userCredentials.confirmPin.toString().length >= 4
      ) {
        setisDisabled(false);
      }
    }
  }, [userCredentials]);

  React.useEffect(() => {
    if (userCredentials.stage === 2) {
      setResendSecondsLeft((prev) => (prev > 0 ? prev : 30));
      const intervalId = setInterval(() => {
        setResendSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(intervalId);
    } else {
      setResendSecondsLeft(30);
    }
  }, [userCredentials.stage]);

  React.useEffect(() => {
    if (verifyAccount) {
      setuserCredentials({
        ...userCredentials,
        // @ts-ignore
        phone: phoneNuumber,
        stage: 2,
      });
    }
  }, [verifyAccount]);

  React.useEffect(() => {
    if (stage) {
      setuserCredentials({
        ...userCredentials,
        stage: stage,
      });
    }
  }, [stage])

  return (
    <View style={tw`flex-1 bg-white relative`}>
      <Layout header headerBackFunc={() => navigation.navigate("Welcome")}>
        <View
          style={tw`top-4 absolute right-4 flex flex-row items-center gap-x-2`}
        >
          <View style={tw`h-5 w-5 bg-danger rounded-full`}>
            <RNText theme="white" size="sm" style={tw`m-auto`}>
              {userCredentials.stage}
            </RNText>
          </View>
          <View style={tw`w-[100px] h-2 bg-[#E0E0E0] rounded-full`}>
            <View
              style={tw`rounded-full w-${String(
                userCredentials.stage
              )}/4 bg-primary h-full`}
            />
          </View>
        </View>
        <RNScrollView contentContainerStyle={tw``}>
          {userCredentials.stage === 1 && (
            <View style={tw`flex-1`}>
              {organization && (
                <View style={tw`bg-primary01 p-3 rounded-lg mb-4`}>
                  <RNText size="sm" font="outfitmedium">
                    🏢 {organization}
                  </RNText>
                  <RNText size="sm" theme="secondary">
                    Creating account for this organization
                  </RNText>
                </View>
              )}
              <View style={tw`flex flex-row items-center gap-x-2`}>
                <RNText size="lg" font="outfitmedium">
                  Get started with Memonies
                </RNText>
              </View>
              <View style={tw`flex flex-row items-center gap-x-1 mt-1`}>
                <RNText theme="black" style={tw``} size="sm">
                  Enter your phone number
                </RNText>
              </View>

              <View style={tw`w-full flex flex-col relative mt-4 flex-1`}>
                <RNTinput
                  label="Phone number"
                  placeholder="070 0000 3490"
                  keyboardType="phone-pad"
                  onChangeText={(text: string) => handleChange("phone", text)}
                  maxLength={11}
                  value={String(userCredentials.phone)}
                />

                <View style={tw`relative mt-2`}>
                  <RNTinput
                    label="Password"
                    placeholder="Memonies@12?"
                    keyboardType="default"
                    onChangeText={(text: string) =>
                      handleChange("password", text)
                    }
                    value={String(userCredentials.password)}
                    secureTextEntry={showPassword}
                  />
                  <FontAwesome
                    name={showPassword ? "eye-slash" : "eye"}
                    size={24}
                    color={"#CBD1D7"}
                    onPress={() => setShowPassword(!showPassword)}
                    style={tw`absolute right-0 bottom-[30%] flex flex-row items-center justify-center w-10`}
                  />
                </View>

                <View style={tw`relative mt-2`}>
                  <RNTinput
                    label="Confirm Password"
                    placeholder="Memonies@12?"
                    keyboardType="default"
                    onChangeText={(text: string) =>
                      handleChange("cpassword", text)
                    }
                    value={String(userCredentials.cpassword)}
                    secureTextEntry={cshowPassword}
                  />
                  <FontAwesome
                    name={cshowPassword ? "eye-slash" : "eye"}
                    size={24}
                    color={"#CBD1D7"}
                    onPress={() => setcShowPassword(!cshowPassword)}
                    style={tw`absolute right-0 bottom-[30%] flex flex-row items-center justify-center w-10`}
                  />
                </View>

                <View style={tw`mb-5 flex flex-row items-center gap-x-1 mt-1`}>
                  <RNText theme="black" style={tw``} size="sm">
                    Already have an account?
                  </RNText>
                  <RNButton
                    title="Log in"
                    naked
                    nakedTextColor="primary"
                    navigate="Login"
                    textStyle={tw`underline`}
                    style={tw`mb-1`}
                  />
                </View>
              </View>
              <View
                style={tw`mt-[${responsiveScreenFontSize(
                  10
                )}] flex flex-row flex-wrap items-center mb-4`}
              >
                <RNText style={tw`text-sm`} theme="secondary">
                  By continuing, you agree to our{" "}
                </RNText>
                <RNButton
                  title="Terms of Service"
                  naked
                  nakedTextColor="black"
                  //disable={false}
                  //debounceTime={10}
                  onPress={() => Linking.openURL("https://memonies.app/terms")}
                  textStyle={tw`underline text-sm text-primary`}
                />
                <RNText size="sm" theme="secondary">
                  and have read our{" "}
                </RNText>
                <RNButton
                  title="Privacy Policy"
                  naked
                  nakedTextColor="black"
                  disable={false}
                  debounceTime={10}
                  onPress={() => Linking.openURL("https://memonies.app/privacy")}
                  textStyle={tw`underline text-sm text-primary`}
                />
              </View>
              <RNButton
                disable={isDisabled}
                title="Continue"
                style={tw``}
                debounceTime={8000}
                onPress={handleSubmit}
              />
            </View>
          )}
          {userCredentials.stage === 2 && (
            <View style={tw`flex-1 mb-[${responsiveScreenHeight(52)}]`}>
              <View style={tw`flex flex-row items-center gap-x-2`}>
                <RNText size="lg" font="outfitmedium">
                  Verify your number
                </RNText>
              </View>
              <View style={tw`flex flex-row items-center gap-x-1 mt-1`}>
                <RNText theme="black" style={tw``} size="sm">
                  Enter the OTP sent to your phone number
                </RNText>
              </View>

              <View style={tw`w-full flex flex-col relative mt-4 flex-1`}>
                <View style={tw`w-[80%] mx-auto mt-6`}>
                  <RNText theme="black" style={tw`text-center mb-3`} size="sm">
                    Enter the 4 digit code sent to{" "}
                    {String(
                      verifyAccount ? phoneNuumber : userCredentials.phone
                    ).slice(0, 4) +
                      "•••••" +
                      String(
                        verifyAccount ? phoneNuumber : userCredentials.phone
                      ).slice(9)}
                  </RNText>
                  <OTPTextInput
                    autoFocus
                    handleTextChange={(text: string) => {
                      handleChange("otp", text);
                    }}
                    textInputStyle={tw`border-0 border-b rounded-[0px] bg-[#F4F4F4]`}
                    tintColor={colors.primary}
                    containerStyle={tw``}
                    inputCount={4}
                    keyboardType="numeric"
                  />
                  <View style={tw`mt-4 items-center mb-[10%]`}>
                    <RNButton
                      title={
                        sendOtpMutation.isLoading
                          ? "Sending..."
                          : resendSecondsLeft > 0
                          ? `Resend in ${resendSecondsLeft}s`
                          : "Resend code"
                      }
                      disable={resendSecondsLeft > 0}
                      naked
                      nakedTextColor={resendSecondsLeft > 0 ? "grey" : "primary"}
                      debounceTime={5000}
                      onPress={() => {
                        sendOtpMutation.mutate({
                          phoneNumber: String(userCredentials.phone),
                          password: String(userCredentials.password),
                        });
                      }}
                      textStyle={tw`underline`}
                    />
                  </View>
                </View>
              </View>
              <RNButton
                disable={Boolean(userCredentials.otp.toString().length !== 4)}
                title="Continue"
                style={tw``}
                debounceTime={5000}
                onPress={handleSubmit}
              />
            </View>
          )}
          {userCredentials.stage === 3 && (
            <View style={tw`flex-1 mb-[${responsiveScreenHeight(36)}]`}>
              <View style={tw`flex flex-row items-center gap-x-2`}>
                <RNText size="lg" font="outfitmedium">
                  Provide your BVN & NIN
                </RNText>
              </View>
              <View style={tw`flex flex-row items-center gap-x-1 mt-1`}>
                <RNText theme="black" style={tw``} size="sm">
                  Your BVN & NIN would be used to confirm your identity
                </RNText>
              </View>

              <View
                style={tw`relative w-full flex flex-col relative mt-4 flex-1 z-10`}
              >
                <View style={tw`w-full `}>
                  <RNTinput
                    label="Bank Verification Number (BVN)"
                    placeholder="Enter Bank Verification Number"
                    keyboardType="phone-pad"
                    onChangeText={(text: string) => handleChange("bvn", text)}
                    maxLength={11}
                    value={String(userCredentials.bvn)}
                  />
                  <SimpleLineIcons
                    style={tw`right-3 top-10 absolute`}
                    name="question"
                    size={20}
                    color={colors.primary}
                    onPress={() =>
                      handleChange(
                        "toggleBvnInfo",
                        !userCredentials.toggleBvnInfo
                      )
                    }
                  />
                </View>
                <View
                  style={[
                    tw`w-full  mt-2`,
                    {
                      zIndex: 10,
                    },
                  ]}
                >
                  <RNTinput
                    label="National Identity Number"
                    placeholder="National Identity Number (NIN)"
                    keyboardType="phone-pad"
                    onChangeText={(text: string) => handleChange("nin", text)}
                    maxLength={11}
                    style={tw``}
                    value={String(userCredentials.nin)}
                  />
                </View>

                {userCredentials.toggleBvnInfo && (
                  <View
                    style={[
                      tw`w-full px-4 py-5 bg-primary01 absolute top-[${responsiveScreenHeight(
                        2.4
                      )}`,
                      {
                        zIndex: 999,
                      },
                    ]}
                  >
                    <View
                      style={[
                        tw`h-10 w-10 -top-2 right-2 bg-primary01 absolute`,
                        {
                          transform: [
                            {
                              rotate: "45deg",
                            },
                          ],
                        },
                      ]}
                    ></View>
                    <RNText size="sm" font="outfitbold">
                      Why do we ask for your BVN & NIN?
                    </RNText>
                    <RNText size="sm" style={tw`mb-2`}>
                      We request for your BVN & NIN to verify your identity and
                      confirm that the account you registered with is yours. It
                      is also a KYC requirement for al financial institutions by
                      the CBN.
                    </RNText>
                  </View>
                )}

              </View>
              <RNButton
                disable={!(
                  userCredentials.bvn.toString().length === 11 &&
                  userCredentials.nin.toString().length === 11
                )}
                title="Continue"
                style={tw``}
                debounceTime={8000}
                onPress={handleSubmit}
              />
            </View>
          )}
          {userCredentials.stage === 4 && (
            <View style={tw`flex-1 mb-[${responsiveScreenHeight(36)}]`}>
              <View style={tw`flex flex-row items-center gap-x-2`}>
                <RNText size="lg" font="outfitmedium">
                  Create your transaction pin
                </RNText>
              </View>
              <View style={tw`flex flex-row items-center gap-x-1 mt-1`}>
                <RNText theme="black" style={tw``} size="sm">
                  This would be used to securely log into your Memonies account
                </RNText>
              </View>

              <View style={tw`w-full flex flex-col relative mt-4 flex-1`}>
                <View style={tw`w-full relative `}>
                  <RNTinput
                    label="Pin"
                    placeholder="Enter pin"
                    maxLength={4}
                  keyboardType="phone-pad"
                    secureTextEntry={Boolean(!userCredentials.showPin)}
                    onChangeText={(text: string) => handleChange("pin", text)}
                    value={String(userCredentials.pin)}
                  />
                  <Feather
                    name={Boolean(userCredentials.showPin) ? "eye" : "eye-off"}
                    size={20}
                    color={colors.danger}
                    style={tw`absolute right-3 top-11`}
                    onPress={() =>
                      handleChange("showPin", !userCredentials.showPin)
                    }
                  />
                </View>

                <View style={tw`w-full relative `}>
                  <RNTinput
                    label="Confirm pin"
                    placeholder="Enter pin again"
                    maxLength={4}
                  keyboardType="phone-pad"
                    secureTextEntry={Boolean(!userCredentials.confirmShowPin)}
                    onChangeText={(text: string) =>
                      handleChange("confirmPin", text)
                    }
                    value={String(userCredentials.confirmPin)}
                  />
                  <Feather
                    name={
                      Boolean(userCredentials.confirmShowPin)
                        ? "eye"
                        : "eye-off"
                    }
                    size={20}
                    color={colors.danger}
                    style={tw`absolute right-3 top-11`}
                    onPress={() =>
                      handleChange(
                        "confirmShowPin",
                        !userCredentials.confirmShowPin
                      )
                    }
                  />
                </View>
                <View
                  style={tw`flex flex-row gap-x-2 w-full p-3 bg-secondary10 mt-3`}
                >
                  <FontAwesome5
                    name="info-circle"
                    size={24}
                    color={colors.warning}
                  />
                  <RNText style={tw`text-sm`}>
                    Do not share your Memonies password with anyone
                  </RNText>
                </View>
              </View>
              <RNButton
                disable={!(
                  userCredentials.pin.toString().length >= 4 &&
                  userCredentials.confirmPin.toString().length >= 4
                )}
                title="Continue"
                style={tw``}
                debounceTime={5000}
                onPress={handleSubmit}
              />
            </View>
          )}
        </RNScrollView>
      </Layout>
    </View>
  );
};

export default Signup;
