import RNButton from '@/components/Button';
import Layout from '@/components/Layout';
import RNScrollView from '@/components/ScrollView';
import RNText from '@/components/Text';
import RNTinput from '@/components/TextField';
import tw from '@/lib/tailwind';
import { selectUser } from '@/redux/slices/authSlice';
import { colors } from '@/theme/colors';
import { areAllValuesPresent } from '@/utils';
import { sendfrPinCodeApi } from '@/utils/api';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { useDeviceContext } from 'twrnc';

const PaymentPin = () => {
  useDeviceContext(tw);
  const navigation: any = useNavigation();
  const user = useSelector(selectUser)
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
      accNo: '',
      bankName: '',
    }
  );


  const pinMutation = useMutation(sendfrPinCodeApi, {
    onError: (error, context, er) => {
      if (axios.isAxiosError(error)) {
        console.error('Error message:', error.message);
        Alert.alert('Error', JSON.stringify(error.response?.data?.message).replace(/"/g, ''))
      } else {
        Alert.alert('Error', 'Error on forgot password');
      }
    },
    onSuccess: async (data: any) => {
      console.log(data, 'res on sending pin code');
      navigation.navigate('PinForgot', {
        phone: String(user?.phoneNumber)
      });
    },
  });

  const links = [
    // {
    //   name: 'Change payment pin',
    //   url: () => {},
    // },
    {
      name: 'Forgot payment pin',
      url: () => pinMutation.mutate({
        phoneNumber: String(user?.phoneNumber),
      }),
    },
  ];

  return (
    <Layout header headerCenterText='Payment pin'>
      <View style={tw`flex-1`}>
        <RNScrollView style={tw`flex-1`} containterStyle={tw``}>
          {links.map(({ name, url }, index) => {
            return (
              <View style={tw`flex flex w-full`} key={index}>
                <TouchableOpacity
                  onPress={url}
                  style={tw`w-full flex flex-row justify-between items-center bg-white rounded-xl py-5 mb-2 rounded-md border-[1px] border-secondary10 px-2`}>
                  <View style={tw`flex flex-row items-center`}>
                    <View style={tw`w-full`}>
                      <RNText style={tw``}>{name}</RNText>
                      <View style={tw`w-[55%]`}></View>
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
        </RNScrollView>
      </View>
    </Layout>
  );
};

export default PaymentPin;
