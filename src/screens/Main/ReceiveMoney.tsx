import { View, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { setToken, setUserDetails } from '@/redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '@/hooks';
import Layout from '@/components/Layout';
import RNText from '@/components/Text';
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import RNButton from '@/components/Button';
import tw from '@/lib/tailwind';
import { useDeviceContext } from 'twrnc';
import * as Linking from 'expo-linking';
//@ts-ignore
import OTPTextInput from 'react-native-otp-textinput';
import { colors } from '@/theme/colors';
import { useMutation } from 'react-query';
import { sendOtpApi } from '@/utils/api';
import AcountNumberCard from '@/components/Cards/AcountNumberCard';
import RNScrollView from '@/components/ScrollView';

const ReceiveMoney = () => {
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
      activeMethod: '',
    }
  );

  const handleChange = (name: any, value: any) => {
    setState({
      ...state,
      [name]: value,
    });
  };
  const [isDisabled, setisDisabled] = React.useState(true);

  const sendOtpMutation = useMutation(sendOtpApi, {
    onError: (error, context, er) => {
      console.log(error, context, er, '<-- Error');
      //Alert.alert('Error', error);
      handleChange('stage', 2);
      setTimeout(() => {
        setisDisabled(true);
      }, 1200);
    },
    onSuccess: async (data: any) => {
      console.log(data, '<---  data on api call');
      handleChange('stage', 2);
      setTimeout(() => {
        setisDisabled(true);
      }, 1200);
    },
  });

  const handleSubmit = async () => {};

  const links = [
    {
      name: 'Bank transfer',
      text: 'Add money via mobile or internet banking',
      icon: <MaterialCommunityIcons name='bank' size={24} color='black' />,
      type: 'bank',
      cards: <AcountNumberCard />,
    },
    // {
    //   name: 'Card deposit',
    //   text: 'Add money via a debit card',
    //   icon: <FontAwesome name='user-circle' size={24} color='black' />,
    //   type: 'card',
    //   cards: <ATMDetailsCard />,
    // },
  ];
  return (
    <Layout header>
      <RNScrollView style={tw` w-full flex-1`}>
        <RNText theme='black' font='outfitsemi' size='lgl' style={tw`mb-2`}>
          Receive money
        </RNText>
        <RNText theme='secondary' style={tw`mb-2`}>
          Select how you want to add money to your account
        </RNText>
        {links.map(({ name, text, icon, type, cards }, index) => {
          return (
            <View style={tw`flex flex w-full`} key={index}>
              <TouchableOpacity
                onPress={() => handleChange('activeMethod', type)}
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
                  name={state.activeMethod === type ? 'down' : 'up'}
                  style={tw`mr-2 absolute right-2`}
                  size={14}
                  color={colors.danger}
                />
              </TouchableOpacity>
              {state.activeMethod === type && cards}
            </View>
          );
        })}
      </RNScrollView>
      {/* <RNText theme='secondary' size='sm' style={tw`text-center mt-2`}>
        Secured by
        <RNText theme='primary'> BNL Consumers LTD </RNText>
      </RNText> */}
    </Layout>
  );
};

export default ReceiveMoney;
