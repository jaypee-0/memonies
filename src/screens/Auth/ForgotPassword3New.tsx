import { View, Image, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { setToken, setUserDetails } from '@/redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '@/hooks';
import Layout from '@/components/Layout';
import RNScrollView from '@/components/ScrollView';
import RNText from '@/components/Text';
import { areAllValuesPresent, errorHandler } from '@/utils';
import RNTinput from '@/components/TextField';
import { FontAwesome } from '@expo/vector-icons';
import RNButton from '@/components/Button';
import tw from '@/lib/tailwind';
import { useDeviceContext } from 'twrnc';
import { useMutation } from 'react-query';
import axios from 'axios';
import { resetPasswordApi } from '@/utils/api';

interface User {
  otp: string;
  password: string;
  cpassword: string;
}

const ChangePassword = ({route}:any) => {
  const {user:userid} = route?.params
  useDeviceContext(tw);
  const navigation: any = useNavigation();
  const [showPassword, setShowPassword] = React.useState(true);
  const [cshowPassword, setcShowPassword] = React.useState(true);
  const [user, setUser] = React.useState<User>({
    otp: '',
    password: '',
    cpassword: '',
  });

  const mutation = useMutation(resetPasswordApi, {
    onError: (error, context, er) => {
      if (axios.isAxiosError(error)) {
        console.error('Error message:', error.message);
        Alert.alert('Error', JSON.stringify(error.response?.data?.message).replace(/"/g, ''))
      } else {
        Alert.alert('Error', 'Error on forgot password');
      }
    },
    onSuccess: async (data: any) => {
      console.log(data, 'res on login');
      Alert.alert('Success', 'Password changed successfully');
      navigation.navigate('Login');
    },
  });

  const handleSubmit = async () => {
    mutation.mutate({
      token: String(user.otp),
      password: String(user.password),
      confirmPassword: String(user.cpassword),
      user: String(userid)
    });
  };

  const handleChange = (name: any, value: any) => {
    setUser({
      ...user,
      [name]: value,
    });
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <Layout header>
        <RNScrollView style={tw`h-full relative `}>
          <View style={tw`flex-1 `}>
      

            <View style={tw`flex flex-row items-center gap-x-2`}>
              <RNText size='lg' font='outfitmedium'>
                New Password
              </RNText>
            </View>
            <View style={tw`flex flex-row items-center gap-x-1 mt-1`}>
              <RNText theme='secondary' style={tw``}>
                Create a new password
              </RNText>
            </View>

            <View style={tw`w-full flex flex-col relative mt-8`}>
              <>
                <View style={tw`relative`}>
                  <RNTinput
                    label='OTP Token'
                    onChangeText={(text: string) =>
                      handleChange('otp', text)
                    }
                    value={user.otp}
                    placeholder='XXXX'
                  />
                </View>
                <View style={tw`relative`}>
                  <RNTinput
                    label='Password'
                    onChangeText={(text: string) =>
                      handleChange('password', text)
                    }
                    value={user.password}
                    placeholder='Atleast 8 characters'
                    secureTextEntry={showPassword}
                  />
                  <FontAwesome
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={24}
                    color={'#CBD1D7'}
                    onPress={() => setShowPassword(!showPassword)}
                    style={tw`absolute right-0 bottom-[30%] flex flex-row items-center justify-center w-10`}
                  />
                </View>
                <View style={tw`relative mb-5`}>
                  <RNTinput
                    label='Confirm Password'
                    onChangeText={(text: string) =>
                      handleChange('cpassword', text)
                    }
                    value={user.cpassword}
                    placeholder='Hello!@23456'
                    secureTextEntry={cshowPassword}
                  />
                  <FontAwesome
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={24}
                    color={'#CBD1D7'}
                    onPress={() => setcShowPassword(!cshowPassword)}
                    style={tw`absolute right-0 bottom-[30%] flex flex-row items-center justify-center w-10`}
                  />
                </View>
                <RNButton title='Change password' onPress={handleSubmit} disable={!areAllValuesPresent(user)} />
              </>
            </View>
          </View>
        </RNScrollView>
      </Layout>
    </View>
  );
};

export default ChangePassword;
