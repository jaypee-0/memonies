import { Image, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useNavigation } from '@react-navigation/native';
import tw from '@/lib/tailwind';
import { useDeviceContext } from 'twrnc';
import Layout from '@/components/Layout';
import RNText from '@/components/Text';
import { AntDesign } from '@expo/vector-icons';

const Notification = () => {
  const dispatch = useAppDispatch();
  const navigation: any = useNavigation();
  useDeviceContext(tw);
  const isTokenPresent = useAppSelector((state) => state.auth.token);
  return (
    <Layout header >
      <View style={tw` w-full flex-1`}>
        <RNText theme='black' font='outfitsemi' size='lgl' style={tw`mb-2`}>
          Notifications
        </RNText>
        <View style={tw`flex-1 flex flex-col items-center justify-center`}>
          <RNText style={tw`max-w-[80%]`} size='sm' align='center'>
            No new notification
          </RNText>
        </View>
      </View>
    </Layout>
  );
};

export default Notification;
