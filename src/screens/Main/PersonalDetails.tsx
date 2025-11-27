import RNButton from '@/components/Button';
import Layout from '@/components/Layout';
import RNScrollView from '@/components/ScrollView';
import RNText from '@/components/Text';
import RNTinput from '@/components/TextField';
import { useAppSelector } from '@/hooks';
import tw from '@/lib/tailwind';
import { selectUser } from '@/redux/slices/authSlice';
import { colors } from '@/theme/colors';
import { areAllValuesPresent } from '@/utils';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  View,
} from 'react-native';
import { useDeviceContext } from 'twrnc';

const PersonalDetails = () => {
  useDeviceContext(tw);
  const selectedUser = useAppSelector(selectUser);
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
      image: '',
    }
  );
  
  // const pickImage = async () => {
  //   let result: any = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });
  //   setState({
  //     ...state,
  //     image: result.assets[0].uri,
  //   });
  // };
  const details = [
    {
      name: 'Full name',
      value:
        (selectedUser?.firstName ?? 'xxxx') +
        ' ' +
        (selectedUser.lastName ?? 'xxxx'),
      button: false,
      grey: true
      },
    // {
    //   name: 'Personal email',
    //   value: selectedUser?.email ? selectedUser?.email : "---",
    //   button: false,
    //   grey: false
    // },
    {
      name: 'Phone number',
      value: selectedUser?.phoneNumber ? selectedUser?.phoneNumber : 'N/A',
      button: false,
      grey: true
    },
    {
      name: 'Gender',
      value: selectedUser?.gender ?? '---',
      button: false,
      grey: true
    },
    {
      name: 'Date of birth',
      value: selectedUser?.dob ? selectedUser?.dob : '---',
      button: false,
      grey: true
    },
    {
      name: 'BVN ',
      value: "*****",
      button: false,
      grey: true
    },
    {
      name: 'NIN',
      value: "*****",
      button: false,
      grey: true
    },
    
  ];
  //value: selectedUser?.kyc?.nin?.nin ? (selectedUser?.kyc?.nin?.nin?.slice(0, 3) + "*****" + selectedUser?.kyc?.nin?.nin?.slice(8, 10)) : 'N/A',

  return (
    <Layout header headerCenterText='Personal Details'>
      <View style={tw`flex-1`}>
        <RNScrollView style={tw`flex-1`} containterStyle={tw``}>
          <View
            style={tw`w-full flex flex-row justify-between items-center rounded-sm py-2 mt-2 border-[2px] border-secondary10  px-2`}>
            <View style={tw`flex flex-row items-center`}>
              {state.image ? (
                <Image
                  source={{ uri: String(state.image) }}
                  style={tw`mr-4 rounded-full h-12 w-12`}
                />
              ) : (
                <View style={tw`mr-4 rounded-full bg-[#8d8d8d70] h-12 w-12 flex flex-row items-center justify-center`}>
                <RNText style={tw``} font='outfitmedium'>{selectedUser?.firstName?.slice(0, 1) + selectedUser.lastName.slice(0, 1)}</RNText>
                </View>
              )}
              {/* @ts-ignore */}
              <View>
                <RNText style={tw``}>
                  {(selectedUser?.firstName ?? 'xxxx') +
                    ' ' +
                    (selectedUser.lastName ?? 'xxxx')}
                </RNText>
                {/* <View style={tw`flex flex-row gap-x-4`}>
                  <RNText style={tw`text-[#656565]`} size={'sm'}>
                    {selectedUser?.email ? selectedUser?.email : 'Email: N/A'}
                  </RNText>
                </View> */}
              </View>
            </View>
            {/* <RNButton
              naked
              nakedTextColor='primary'
              title='Upload'
              onPress={() => pickImage()}
              style={tw`mt-0 mb-5`}
              textStyle={tw`text-sm text-primary`}
            /> */}
          </View>
          <View
            style={tw`w-full flex flex-col gap-y-6 rounded-sm py-4 mt-3 border-[2px] border-secondary10 px-3`}>
              {
                details.map((detail, index) => (
                  <View key={index} style={tw`flex flex-row items-center justify-between w-full`}>
                    <RNText  style={tw`mr-4`}>{detail.name}</RNText>
                    {
                      detail.button ?
                      <RNButton
                        title={'Update'}
                        onPress={() => {}}
                        style={tw`bg-[#F8F8F8] rounded-md px-2 h-8`}
                        textStyle={tw`text-primary text-xs`} /> 
                        : 
                      <RNText  style={tw`text-[#65656580]`}>{detail.value}</RNText>
                    }
                  </View>
                ))
              }
            </View>
        </RNScrollView>
      </View>
    </Layout>
  );
};

export default PersonalDetails;
