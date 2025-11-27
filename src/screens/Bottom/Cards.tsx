import { FlatList, Image, TouchableOpacity, View, Modal } from 'react-native';
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
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
  Entypo,
} from '@expo/vector-icons';
import RNScrollView from '@/components/ScrollView';
import RNTinput from '@/components/TextField';
// @ts-ignore
import _debounce from 'lodash/debounce';
import { allItems } from '@/data';
import { useNavigation } from '@react-navigation/native';
import { GlobalIcon, SafeIcon, ZeroIcon } from '@/assets/icons';

const Cards = () => {
  useDeviceContext(tw);
  const navigation: any = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [state, setstate] = React.useReducer(
    (
      prev: Record<string, string | number | boolean>,
      next: Record<string, string | number | boolean>
    ) => ({
      ...prev,
      ...next,
    }),
    {
      activeCurr: 'USD',
      phone: '',
      otp: '',
      bvn: '',
      pin: '',
      confirmPin: '',
      showPin: false,
      confirmShowPin: false,
      disabled: true,
      toggleBvnInfo: false,
    }
  );
  const links = [
    {
      title: 'Global payments',
      text: 'One card for all your subscriptions, no hassle.',
      icon: <MaterialIcons name='bolt' size={24} color='#DB1716' />,
      color: '#DB171620',
    },
    {
      title: 'Safe and secure',
      text: 'Safety is guaranteed with Memonies cards',
      icon: (
        <Ionicons name='shield-checkmark-sharp' size={24} color='#006F2F' />
      ),
      color: '#006F2F20',
    },
    {
      title: '0% charges',
      text: 'Use your cards with ease and pay no extra charges.',
      icon: (
        <MaterialCommunityIcons
          name='credit-card-edit'
          size={24}
          color='black'
        />
      ),
      color: '#00000020',
    },
  ];

  return (
    <Layout>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={tw`flex-1 items-center justify-center bg-[#00000090]`}>
          <View
            style={tw`h-[250px] px-4 pb-4 pt-10 rounded-md flex flex-col items-center justify-center bg-white`}>
            <AntDesign
              name='close'
              size={20}
              color='black'
              style={tw`ml-auto -mt-4`}
              onPress={() => {
                setModalVisible(false);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Profile');
              }}
              style={tw`bg-[#323B5410] rounded-full h-12 w-12 flex flex-row items-center justify-center`}>
              <Entypo name='plus' size={30} color='black' />
            </TouchableOpacity>
            <RNText theme='black' font='outfitbold' style={tw`my-4 text-md`}>
              Please update to Tier 2
            </RNText>
            <RNText style={tw`max-w-[80%]`} size='sm' align='center'>
              Add and verify your BVN to your account to enjoy the full benefit
              of your account
            </RNText>
            <RNButton
              naked
              nakedTextColor='primary'
              title='Proceed to upgrade'
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Profile');
              }}
              style={tw`mt-0 mb-5`}
              textStyle={tw`text-sm text-primary mt-4`}
            />
          </View>
        </View>
      </Modal>
      <RNScrollView style={tw`w-full flex-1`}>
        <RNText theme='black' font='outfitsemi' size='lgl' style={tw`mb-2`}>
          Cards
        </RNText>

        <View
          style={tw`bg-secondary10 rounded-md p-1 w-full flex flex-row mb-4`}>
          <TouchableOpacity
            onPress={() => {
              setstate({ activeCurr: 'USD' });
            }}
            style={tw`w-[50%] rounded-md ${
              state.activeCurr === 'USD' ? 'bg-white' : 'bg-secondary10'
            }`}>
            <RNText
              theme={state.activeCurr === 'USD' ? 'primary' : 'black'}
              font='outfitsemi'
              style={tw`text-center py-2`}>
              USD
            </RNText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setstate({ activeCurr: 'NGN' });
            }}
            style={tw`w-[50%] rounded-md ${
              state.activeCurr === 'NGN' ? 'bg-white' : 'bg-secondary10'
            }`}>
            <RNText
              theme={state.activeCurr === 'NGN' ? 'primary' : 'black'}
              font='outfitsemi'
              style={tw`text-center py-2`}>
              NGN
            </RNText>
          </TouchableOpacity>
        </View>

        <View style={tw`mb-14 relative`}>
          <Image
            source={require('@/assets/images/cardfront.png')}
            style={tw`mx-auto w-[100%] h-[200px]`}
            resizeMode='contain'
          />
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={tw`absolute -bottom-4 bg-danger rounded-full h-12 w-12 flex flex-row items-center justify-center right-[44%]`}>
            <AntDesign name='plus' size={24} color='white' />
          </TouchableOpacity>
        </View>
        {links.map((link, index) => {
          return (
            <View
              key={index}
              style={tw`flex bg-white flex-row items-center justify-between py-3 px-4 border-[1px] mb-3 rounded-md border-[#00000010]`}>
              <View style={tw`flex flex-row items-center`}>
                <View
                  style={tw`bg-[${link.color}] rounded-full h-10 w-10 flex flex-row justify-center items-center`}>
                  {link.icon}
                </View>
                <View style={tw`ml-4`}>
                  <RNText
                    theme='black'
                    font='outfitsemi'
                    style={tw`text-lg mb-2`}>
                    {link.title}
                  </RNText>
                  <RNText style={tw`max-w-[98%]`} size='sm'>
                    {link.text}
                  </RNText>
                </View>
              </View>
            </View>
          );
        })}
        <RNButton
          disable={false}
          title='Create card'
          style={tw`mt-2`}
          debounceTime={2}
          onPress={() => setModalVisible(true)}
        />
      </RNScrollView>
    </Layout>
  );
};

export default Cards;
