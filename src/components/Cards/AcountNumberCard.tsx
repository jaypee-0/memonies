import { Alert, Share, View } from 'react-native';
import React from 'react';
import { useDeviceContext } from 'twrnc';
import tw from '@/lib/tailwind';
import RNText from '../Text';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import RNButton from '../Button';
import { useAppSelector } from '@/hooks';
import { selectCardDetails } from '@/redux/slices/authSlice';
import { copyToClipboard } from '@/utils';

const AcountNumberCard = () => {
  useDeviceContext(tw);
  const cardDetails = useAppSelector(selectCardDetails);

  const onShare = async ({ title, acc }: { title: string; acc: string }) => {
    try {
      const result = await Share.share({
        title: title,
        message: acc,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <View>
      <View style={tw`bg-[#EBF4FF] mt-2 p-3 rounded-md`}>
        <RNText size='sm' style={tw``} theme='secondary'>
          Account Number:
        </RNText>
        <View style={tw`flex flex-row items-center`}>
          <RNText theme='black' font='outfitsemi' style={tw`text-2xl`}>
            {cardDetails?.accountNumber ?? 'xxxx xxxx xx'}
          </RNText>
          {cardDetails?.accountNumber && (
            <Ionicons
              name='copy'
              size={16}
              color={colors.secondary}
              onPress={() => copyToClipboard(cardDetails?.accountNumber)}
            />
          )}
        </View>
        <View style={tw`mt-3 flex flex-row justify-between w-full`}>
          <View style={tw`w-[48%]`}>
            <RNText size='sm' theme='secondary'>
              Bank Name:
            </RNText>
            <RNText size='sm' theme='secondary'>
              Account Name:
            </RNText>
          </View>
          <View style={tw`w-[48%]`}>
            <RNText size='sm' align='right' theme='black'>
              {cardDetails?.bankName ?? 'N/A'}
            </RNText>
            <RNText size='sm' align='right' theme='black'>
              {cardDetails?.accountName ?? 'N/A'}
            </RNText>
          </View>
        </View>
      </View>

      {cardDetails?.accountNumber && (
        <View style={tw`flex flex-row mt-2 w-full justify-between`}>
          <RNButton
            title='Copy number'
            style={tw`w-[48%]`}
            onPress={() => copyToClipboard(cardDetails?.accountNumber)}
          />
          <RNButton
            onPress={() =>
              onShare({
                title: cardDetails?.bankName,
                acc: cardDetails?.accountNumber,
              })
            }
            title='Share details'
            textStyle={tw`text-primary`}
            style={tw`w-[48%] bg-white border-primary border-[1px]`}
          />
        </View>
      )}
    </View>
  );
};

export default AcountNumberCard;
