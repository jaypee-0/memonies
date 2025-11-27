import { View, Image } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { setToken, setUserDetails } from '@/redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '@/hooks';
import Layout from '@/components/Layout';
import RNScrollView from '@/components/ScrollView';
import RNText from '@/components/Text';
import { areAllValuesPresent, errorHandler, formatTime } from '@/utils';
import RNTinput from '@/components/TextField';
import { FontAwesome } from '@expo/vector-icons';
import RNButton from '@/components/Button';
import tw from '@/lib/tailwind';
import { useDeviceContext } from 'twrnc';
//@ts-ignore
import OTPTextInput from 'react-native-otp-textinput';
import { colors } from '@/theme/colors';

interface User {
  email: string;
  password: string;
}

const LoginForgot = () => {
  useDeviceContext(tw);
  const navigation: any = useNavigation();
  const [savedUser, setsavedUser] = React.useState<any>({});

  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(true);
  const [user, setUser] = React.useState<User>({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (areAllValuesPresent(user) === true) {
      setIsDisabled(false);
    }
  }, [user]);

  const handleChange = (name: any, value: any) => {
    setUser({
      ...user,
      [name]: value,
    });
  };

  const [timeLeft, setTimeLeft] = React.useState(30);
  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime: number) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setIsDisabled(false);
      setTimeLeft(0);
    }
  }, [timeLeft]);

  return (
    <View style={tw`flex-1 bg-white android:pt-8`}>
      <Layout header headerBackFunc={() => navigation.goBack()} headerCenterText=' Forgot login password'>
        <RNScrollView style={tw`h-full relative `}>
          <View style={tw`flex-1`}>

              <RNText style={tw`text-2xl text-center`} font='outfitmedium'>
               
                Verify your phone number
              </RNText>
            <View style={tw`flex flex-row items-center gap-x-1 mt-2`}>
              <RNText theme='secondary' style={tw`max-w-[70%] mx-auto text-center`}>
              Enter the OTP sent to to your phone number
              </RNText>
            </View>

            <View style={tw`w-full flex flex-col relative mt-8 max-w-[80%] mx-auto`}>
              <>
                <OTPTextInput
                  autoFocus
                  handleTextChange={(text: string) => {
                    setUser({ ...user });
                  }}
                  textInputStyle={tw` border-b-2 bg-[#F4F4F4]`}
                  tintColor={colors.primary}
                  containerStyle={tw``}
                  inputCount={4}
                  keyboardType='numeric'
                />

                <View style={tw`flex w-full flex-row mt-2 justify-center`}>
                  {timeLeft > 0 ? (
                    <RNText theme='black'>{formatTime(timeLeft)}</RNText>
                  ) : (
                    <RNText theme='grey'>00:00</RNText>
                  )}
                </View>

              

                <View
                  style={tw`flex flex-row items-center gap-x-1 mt-4 justify-center`}>
                  {/* <RNText theme='secondary' style={tw``}>
                    You didn't receive a code?
                  </RNText> */}
                  <RNButton
                    title='Resend code'
                    onPress={() => setTimeLeft(30)}
                    naked
                    orientation='center'
                    nakedTextColor='primary'
                    textStyle={tw`underline`}
                  />
                </View>
              </>
            </View>
          </View>
        </RNScrollView>
      </Layout>
    </View>
  );
};

export default LoginForgot;
