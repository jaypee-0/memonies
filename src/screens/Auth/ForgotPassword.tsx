import { View, Image, Alert } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
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
import { forgotApi } from '@/utils/api';
import axios from 'axios';

interface User {
  phone: string;
}

const ForgotPassword = () => {
  useDeviceContext(tw);
  const navigation: any = useNavigation();
  const [user, setUser] = React.useState<User>({
    phone: '',
  });

  const forgotMutation = useMutation(forgotApi, {
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
      navigation.navigate('ChangePassword', {
        user: data?.user
      });
    },
  });

  const handleSubmit = async () => {
    forgotMutation.mutate({
      phoneNumber: String(user.phone),
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
      <Layout header headerBackFunc={() => navigation.goBack()}>
        <RNScrollView style={tw`h-full relative `}>
          <View style={tw`flex-1`}>
            <View style={tw`flex flex-row items-center gap-x-2`}>
              <RNText size='lg' font='outfitmedium'>
                Forgot password{' '}
              </RNText>
            </View>
            <View style={tw`flex flex-row items-center gap-x-1 mt-1`}>
              <RNText style={tw``} size='sm' theme='black'>
                A 4-digit code will be sent to your phone number below
              </RNText>
            </View>

            <View style={tw`w-full flex flex-col relative mt-8`}>
              <>
                <RNTinput
                  label='Phone number'
                  placeholder='080 0002 28282'
                  onChangeText={(text: string) => handleChange('phone', text)}
                  keyboardType='phone-pad'
                  value={user.phone}
                  maxLength={11}
                />

                <RNButton
                  title='Continue'
                  onPress={handleSubmit}
                  debounceTime={3500}
                  disable={user.phone.length < 11}
                />

                <RNButton
                  naked
                  nakedTextColor='black'
                  orientation='center'
                  title='Back to Login'
                  navigate='Login'
                  style={tw`mt-5`}
                  textStyle={tw`underline text-sm`}
                />
              </>
            </View>
          </View>
        </RNScrollView>
      </Layout>
    </View>
  );
};

export default ForgotPassword;
