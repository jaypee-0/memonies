import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import RNButton from '@/components/Button';
import { useAppDispatch } from '@/hooks';
import { logout } from '@/redux/slices/authSlice';
import { colors } from '@/theme/colors';
import tw from '@/lib/tailwind';
import RNText from '@/components/Text';
import { useDeviceContext } from 'twrnc';
import {
  Ionicons,
  Fontisto,
  MaterialCommunityIcons,
  FontAwesome,
} from '@expo/vector-icons';
import RNScrollView from '@/components/ScrollView';
import RNTinput from '@/components/TextField';
// @ts-ignore
import _debounce from 'lodash/debounce';
import { allItems } from '@/data';
import { useNavigation } from '@react-navigation/native';

const Lifestyle = () => {
  useDeviceContext(tw);
  const navigation = useNavigation();
  const links = [
    {
      title: 'Airtime',
      text: 'Buy airtime for all networks',
      bgColor: '#F0FAF4',
      iconBgColor: '#E2F3E9',
      iconColor: '#048239',
      icon: <Fontisto name='tablet-alt' size={24} color='#048239' />,
      icon2: <Fontisto name='tablet-alt' size={60} color='#04823950' />,
    },
    {
      title: 'Data',
      text: 'Buy data for all networks',
      bgColor: '#FBF6FF',
      iconBgColor: '#5A1D8A10',
      iconColor: '#5A1D8A',
      icon: <FontAwesome name='wifi' size={20} color='#5A1D8A' />,
      icon2: <FontAwesome name='wifi' size={50} color='#5A1D8A50' />,
    },
    {
      title: 'Tickets',
      text: 'Get your plane & cinema tickets',
      bgColor: '#F4F4F4',
      iconBgColor: '#1D518A10',
      iconColor: '#1D518A',
      icon: (
        <MaterialCommunityIcons
          name='ticket-confirmation'
          size={24}
          color='#1D518A'
        />
      ),
      icon2: (
        <MaterialCommunityIcons
          name='ticket-confirmation'
          size={50}
          color='#1D518A50'
        />
      ),
    },
    {
      title: 'Electricity',
      text: 'Pay for your electricity',
      bgColor: '#FFEFEF',
      iconBgColor: '#DB171610',
      iconColor: '#DB1716',
      icon: (
        <MaterialCommunityIcons
          name='lightbulb-on-outline'
          size={24}
          color='#DB1716'
        />
      ),
      icon2: (
        <MaterialCommunityIcons
          name='lightbulb-on-outline'
          size={50}
          color='#DB171650'
        />
      ),
    },
    {
      title: 'Cable TV',
      text: 'Pay for subscriptions',
      bgColor: '#FBF6FF',
      iconBgColor: '#5A1D8A10',
      iconColor: '#5A1D8A',
      icon: <Ionicons name='tv' size={24} color='#5A1D8A' />,
      icon2: <Ionicons name='tv' size={50} color='#5A1D8A50' />,
    },
    {
      title: 'Transport & Toll',
      text: 'Pay your transport or toll bill',
      bgColor: '#F0FAF4',
      iconBgColor: '#E2F3E9',
      iconColor: '#048239',
      icon: (
        <MaterialCommunityIcons name='bus-side' size={24} color='#048239' />
      ),
      icon2: (
        <MaterialCommunityIcons name='bus-side' size={60} color='#04823950' />
      ),
    },
    {
      title: 'Coupons & Vouchers',
      text: 'For shopping',
      bgColor: '#FFEFEF',
      iconBgColor: '#DB171610',
      iconColor: '#DB1716',
      icon: <FontAwesome name='tags' size={24} color='#DB1716' />,
      icon2: <FontAwesome name='tags' size={50} color='#DB171650' />,
    },
    {
      title: 'E-commerce',
      text: 'Shop from supported platforms',
      bgColor: '#F4F4F4',
      iconBgColor: '#1D518A10',
      iconColor: '#1D518A',
      icon: <FontAwesome name='shopping-bag' size={24} color='#1D518A' />,
      icon2: <FontAwesome name='shopping-bag' size={60} color='#1D518A50' />,
    },
  ];

  return (
    <Layout>
      <View style={tw` w-full flex-1`}>
        <RNText theme='black' font='outfitsemi' size='lgl' style={tw`mb-2`}>
          Lifestyle payments
        </RNText>
        <RNText theme='secondary' style={tw`mb-2`}>
          Pay your bills, get coupons and more
        </RNText>
        <RNScrollView style={tw`pt-3 h-full`}>
          <View
            style={tw`w-full flex flex-row flex-wrap justify-between flex-1 relative`}>
            {links.map(
              (
                { title, text, bgColor, iconColor, icon, icon2, iconBgColor },
                index
              ) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={tw`overflow-hidden relative px-3 py-4 rounded-[8px] border-[1px] mb-4 border-[${iconColor}20] bg-[${bgColor}] w-[48%]`}>
                    <View
                      style={tw`rounded-full bg-[${iconBgColor}] mr-auto h-10 w-10 flex items-center justify-center mb-4`}>
                      {icon}
                    </View>
                    <RNText style={tw`mt-auto mb-1`}>{title}</RNText>
                    <RNText
                      size='sm'
                      theme='secondary'
                      style={[
                        tw``,
                        {
                          lineHeight: 16,
                        },
                      ]}>
                      {text}
                    </RNText>
                    <View
                      style={[
                        tw`absolute -bottom-4 -right-2`,
                        {
                          transform: [{ rotate: '-30deg' }],
                        },
                      ]}>
                      {icon2}
                    </View>
                  </TouchableOpacity>
                );
              }
            )}
          </View>
        </RNScrollView>
      </View>
    </Layout>
  );
};

export default Lifestyle;
