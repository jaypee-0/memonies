import { View, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { setToken, setUserDetails } from '@/redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from '@/hooks';
import Layout from '@/components/Layout';
import RNScrollView from '@/components/ScrollView';
import RNText from '@/components/Text';
import { areAllValuesPresent, errorHandler } from '@/utils';
import RNTinput from '@/components/TextField';
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import RNButton from '@/components/Button';
import tw from '@/lib/tailwind';
import { useDeviceContext } from 'twrnc';
import * as Linking from 'expo-linking';
//@ts-ignore
import OTPTextInput from 'react-native-otp-textinput';
import { colors } from '@/theme/colors';
import { useMutation } from 'react-query';

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

const SendMoney = () => {
  useDeviceContext(tw);
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  //console.log(user?.id, 'user', token, 'token')
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
      activeMethod: '',
    }
  );

  const handleChange = (name: any, value: any) => {
    setState({
      ...state,
      [name]: value,
    });
  };
  const handleSubmit = async () => {};

  const links = [
    {
      name: 'Send to Memonies user',
      text: 'Pay teammates on Memonies instantly.',
      icon: <MaterialCommunityIcons name='bank' size={24} color='black' />,
      url: ()=>Alert.alert('Coming soon'),
    },
    {
      name: 'Send to bank account',
      text: 'Send money easily to any bank account',
      icon: <MaterialCommunityIcons name='bank' size={24} color='black' />,
      url: () => navigation.navigate('SendToBankAccount'),
    },
  ];

  return (
    <Layout header>
      <View style={tw` w-full flex-1`}>
        <RNText theme='black' font='outfitsemi' size='lgl' style={tw`mb-2`}>
          Send money
        </RNText>
        <RNText theme='secondary' style={tw`mb-2`}>
          Select how you want to send money to a recipient
        </RNText>
        {links?.map(({ name, text, icon, url }, index) => {
          return (
            <View style={tw`flex flex w-full`} key={index}>
              <TouchableOpacity
                onPress={url}
                style={tw`w-full flex flex-row justify-between items-center bg-white rounded-xl py-2 mt-3 rounded-md border-[1px] border-primary px-2`}>
                <View style={tw`flex flex-row items-center`}>
                  <View
                    style={tw`mr-4 h-10 w-10 rounded-full bg-[#EFF4FF] flex items-center justify-center`}>
                    {icon}
                  </View>
                  <View style={tw`w-full`}>
                    <RNText style={tw``}>{name}</RNText>
                    <View style={tw`w-[55%]`}>
                      <RNText style={tw`text-[#656565] w-[80%]`} size={'sm'}>
                        {text}
                      </RNText>
                    </View>
                  </View>
                </View>
                <AntDesign
                  name={'right'}
                  style={tw`mr-2 absolute right-2`}
                  size={14}
                  color={colors.danger}
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      {/* <RNText theme='secondary' size='sm' style={tw`text-center mt-2`}>
        Secured by
        <RNText theme='primary'> BNL Consumers LTD </RNText>
      </RNText> */}
    </Layout>
  );
};

export default SendMoney;
