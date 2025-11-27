import RNButton from '@/components/Button';
import Layout from '@/components/Layout';
import RNScrollView from '@/components/ScrollView';
import RNText from '@/components/Text';
import RNTinput from '@/components/TextField';
import tw from '@/lib/tailwind';
import { colors } from '@/theme/colors';
import { areAllValuesPresent } from '@/utils';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { useDeviceContext } from 'twrnc';

const LoginPin = () => {
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
      accNo: '',
      bankName: '',
    }
  );

  const links = [
    {
      name: 'Change login pin',
      url: () => navigation.navigate("LoginPassword"),
    },
    {
      name: 'Forgot login pin',
      url: () => navigation.navigate("LoginForgot"),
    },
  ];

  return (
    <Layout header headerCenterText='Login pin'>
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

export default LoginPin;
