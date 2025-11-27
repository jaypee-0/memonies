import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useDeviceContext } from 'twrnc';
import tw from '@/lib/tailwind';
import RNText from '../Text';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import RNButton from '../Button';
import RNTinput from '../TextField';
import Checkbox from 'expo-checkbox';

interface Props {
  from?: 'AddCard' | 'ReceiveMoney';
}
const ATMDetailsCard = ({ from }: Props) => {
  useDeviceContext(tw);
  const [userCredentials, setuserCredentials] = React.useReducer(
    (
      prev: Record<string, string | number | boolean>,
      next: Record<string, string | number | boolean>
    ) => ({
      ...prev,
      ...next,
    }),
    {
      cardNo: '',
      expiryDate: '',
      cvv: '',
      isChecked: false,
      pin: '',
      expMonth: '',
      expYear: '',
    }
  );
  const handleChange = (name: any, value: any) => {
    setuserCredentials({
      ...userCredentials,
      [name]: value,
    });
  };
  return (
    <View style={tw`relative w-full flex flex-col relative mt-4 z-10`}>
      <RNTinput
        label='Card number'
        placeholder='0000 0000 0000 0000'
        keyboardType='phone-pad'
        onChangeText={(text: string) => handleChange('cardNo', text)}
        maxLength={16}
        style={tw`bg-secondary10 border-0`}
        value={String(userCredentials.cardNo)}
        returnKeyType='done'
      />
 <View
                  style={tw`flex flex-row w-full items-center justify-between`}
                >
                  <View
                    style={tw`flex flex-row w-[65%] items-center justify-between`}
                  >
                    <View style={tw`w-[63%]`}>
                      <RNTinput
                        label="Expiry Year"
                        placeholder="YYYY"
                        keyboardType="number-pad"
                        onChangeText={(text: string) =>
                          handleChange("expYear", text)
                        }
                        maxLength={4}
                        value={String(userCredentials.expYear)}
                        style={tw`bg-secondary10 border-0 w-full`}
                      />
                    </View>
                    <View style={tw`w-[32%]`}>
                      <RNTinput
                        label="Month"
                        placeholder="MM"
                        keyboardType="number-pad"
                        onChangeText={(text: string) =>
                          handleChange("expMonth", text)
                        }
                        maxLength={2}
                        value={String(userCredentials.expMonth)}
                        style={tw`bg-secondary10 border-0 w-full`}
                      />
                    </View>
                  </View>
                  <View style={tw`w-[32%]`}>
                    <RNTinput
                      label="CVV/CVC"
                      placeholder="123"
                      keyboardType="number-pad"
                      onChangeText={(text: string) => handleChange("cvv", text)}
                      maxLength={3}
                      value={String(userCredentials.cvv)}
                      style={tw`bg-secondary10 border-0 w-full`}
                    />
                  </View>
                </View>

      {from != 'AddCard' && (
        <RNText style={tw`text-sm mt-0`} theme='secondary'>
          This card would be charged at the end of the month
        </RNText>
      )}
      {from != 'AddCard' && (
        <View style={tw`flex flex-row mt-3 items-center`}>
          <Checkbox
            color={colors.primary}
            style={tw`h-4 w-4`}
            value={Boolean(userCredentials.isChecked)}
            onValueChange={() =>
              handleChange('isChecked', !userCredentials.isChecked)
            }
          />
          <RNText
            style={tw`text-sm mt-0 ml-2`}
            font='outfitregular'
            theme='primary'>
            Save card
          </RNText>
        </View>
      )}

      {from == 'AddCard' && (
        <RNTinput
          label='Card pin'
          placeholder='1234'
          keyboardType='phone-pad'
          onChangeText={(text: string) => handleChange('pin', text)}
          maxLength={11}
          style={tw`bg-secondary10 border-0`}
          value={String(userCredentials.pin)}
          returnKeyType='done'
        />
      )}
    </View>
  );
};

export default ATMDetailsCard;
