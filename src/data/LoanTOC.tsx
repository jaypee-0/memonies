import RNText from '@/components/Text'
import tw from '@/lib/tailwind'
import React from 'react'
import { View } from 'react-native'
import { useDeviceContext } from 'twrnc'

const LoanTOC = () => {
  useDeviceContext(tw);
  return (
    <View style={tw`pr-6`}>
      <RNText font='outfitmedium'>Daily salary payouts</RNText>
      <View style={tw`flex flex-row gap-x-1`}>
        <RNText size='sm' theme='secondary'>1.</RNText>
        <RNText size='sm' theme='secondary'>
          Employers create a company wallet, invite workers, and assign daily rates before anyone can clock in.
        </RNText>
      </View>
      <View style={tw`flex flex-row gap-x-1`}>
        <RNText size='sm' theme='secondary'>2.</RNText>
        <RNText size='sm' theme='secondary'>
          Employees must complete KYC and link a preferred payout destination (wallet or bank) to receive funds automatically.
        </RNText>
      </View>
      <View style={tw`flex flex-row gap-x-1`}>
        <RNText size='sm' theme='secondary'>3.</RNText>
        <RNText size='sm' theme='secondary'>
          A clock-in and clock-out pair plus employer approval is required before a shift can be paid.
        </RNText>
      </View>
      <View style={tw`flex flex-row gap-x-1`}>
        <RNText size='sm' theme='secondary'>4.</RNText>
        <RNText size='sm' theme='secondary'>
          Company wallets must have enough balance to cover daily obligations; Memonies warns employers about funding gaps.
        </RNText>
      </View>
      <View style={tw`flex flex-row gap-x-1`}>
        <RNText size='sm' theme='secondary'>5.</RNText>
        <RNText size='sm' theme='secondary'>
          Automatic payouts run at the configured autopay time (default 6 PM) and debit the employer wallet in one batch.
        </RNText>
      </View>

      <RNText font='outfitmedium' style={tw`mt-2`}>Attendance expectations</RNText>
      <View style={tw`flex flex-row gap-x-1`}>
        <RNText size='sm' theme='secondary'>1.</RNText>
        <RNText size='sm' theme='secondary'>
          GPS snapshots are captured when enabled to produce audit-friendly attendance logs.
        </RNText>
      </View>
      <View style={tw`flex flex-row gap-x-1`}>
        <RNText size='sm' theme='secondary'>2.</RNText>
        <RNText size='sm' theme='secondary'>
          Missed clock-outs pause payouts until the employer resolves the attendance record.
        </RNText>
      </View>

      <RNText font='outfitmedium' style={tw`mt-2`}>Improving payouts</RNText>
      <View style={tw`flex flex-row gap-x-1`}>
        <RNText size='sm' theme='secondary'>1.</RNText>
        <RNText size='sm' theme='secondary'>
          Keep wallet funding above 110% of daily obligation to guarantee uninterrupted automation.
        </RNText>
      </View>
      <View style={tw`flex flex-row gap-x-1`}>
        <RNText size='sm' theme='secondary'>2.</RNText>
        <RNText size='sm' theme='secondary'>
          Encourage workers to enable biometric login and notifications so they never miss a clock-in reminder.
        </RNText>
      </View>
    </View>
  );
};

export default LoanTOC;
 


  