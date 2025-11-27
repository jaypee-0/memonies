import React from "react";
import { View } from "react-native";
import RNText from "@/components/Text";
import tw from "@/lib/tailwind";
import { useDeviceContext } from "twrnc";

const bullets = (items: string[]) =>
  items.map((copy, index) => (
    <View key={index} style={tw`flex-row gap-x-1`}>
      <RNText size="sm" theme="secondary">
        {index + 1}.
      </RNText>
      <RNText size="sm" theme="secondary" style={tw`flex-1`}>
        {copy}
      </RNText>
    </View>
  ));

const EdsGuidelines = () => {
  useDeviceContext(tw);

  return (
    <View style={tw`pr-1`}>
      <RNText font="outfitmedium">How Memonies payouts work</RNText>
      {bullets([
        "Employers top up the company wallet, invite workers, and set a daily rate before shifts can start.",
        "Employees complete KYC, link a payout destination (wallet or bank), and can only earn after clocking in.",
        "Clock-in and clock-out events capture GPS snapshots when required so every shift has an audit trail.",
        "Attendance marked as present before 6:00 PM is queued for the daily auto payout run.",
        "We debit the employer wallet in one batch and credit each worker wallet or bank account immediately.",
      ])}

      <RNText font="outfitmedium" style={tw`mt-3`}>
        Attendance expectations
      </RNText>
      {bullets([
        "Missed clock-outs pause payouts until an employer resolves the shift.",
        "Employers can manually approve or decline a payout if a worker forgets to clock in.",
        "Presence is measured per calendar day, so double shifts require two clock-in/out sessions.",
      ])}

      <RNText font="outfitmedium" style={tw`mt-3`}>
        Best practices
      </RNText>
      {bullets([
        "Keep wallet balance at least 110% of the daily obligation to avoid payout delays.",
        "Schedule manual payout runs if you need to pay a subset of workers before the auto window.",
        "Enable push and in-app notifications so your team never misses clock-in reminders.",
      ])}
    </View>
  );
};

export default EdsGuidelines;

