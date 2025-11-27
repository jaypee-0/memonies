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

const VerifyEmail = () => {
  useDeviceContext(tw);
  const navigation: any = useNavigation();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = React.useState(true);
  const [user, setUser] = React.useState<User>({
    email: '',
    password: '',
  });

  const handleSubmit = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const result: any = {};
      // const result: any = await signInUser({
      //     email,
      //     password
      // })
      const { data, error } = result;
      if (error) {
        throw error?.data?.message;
      } else {
        const res = data?.data?.data;
        console.log(data, 'res on login');
        if (data) {
          if (
            data?.message.includes('Please complete your profile data') ||
            res?.user.status === 'unverified'
          ) {
            navigation.navigate('Otp', { email: user.email });
          } else {
            dispatch(setToken(res?.accessToken));
            await AsyncStorage.setItem('token', res?.accessToken);
          }
        }
      }
    } catch (error) {
      console.log(error, 'error from the api2');
    }
  };

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
      setTimeLeft(0);
    }
  }, [timeLeft]);

  return (
    <View style={tw`flex-1 bg-white `}>
      <Layout>
        <RNScrollView style={tw`h-full relative `}>
          <View style={tw`flex-1 -mt-2`}>
            <Image
              source={require('../../assets/images/logo.jpg')}
              resizeMode='contain'
              style={tw`h-20 w-20 -ml-5`}
            />

            <View style={tw`flex flex-row items-center gap-x-2`}>
              <RNText size='lg' font='outfitmedium'>
                Verify your email address
              </RNText>
            </View>
            <View style={tw`flex flex-row items-center gap-x-1 mt-1`}>
              <RNText theme='secondary' style={tw`max-w-[90%]`}>
                Please click the link in the email sent to{' '}
                <RNText theme='black' font={'outfitmedium'}>
                  {'example@email.com'}
                </RNText>{' '}
                to verify your account.
              </RNText>
            </View>

            <View style={tw`w-full flex flex-col relative mt-8`}>
              <>
                <OTPTextInput
                  autoFocus
                  handleTextChange={(text: string) => {
                    setUser({ ...user });
                  }}
                  textInputStyle={tw`border border-b rounded-[8px] bg-white`}
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

                <RNButton
                  title='Continue'
                  navigate='Login'
                  style={tw`mt-5`}
                />

                <View
                  style={tw`flex flex-row items-center gap-x-1 mt-4 justify-center`}>
                  <RNText theme='secondary' style={tw``}>
                    You didn't receive a code?
                  </RNText>
                  <RNButton
                    title='Resend'
                    navigate='Signup'
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

export default VerifyEmail;
