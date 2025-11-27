import RNButton from "@/components/Button";
import ATMDetailsCard from "@/components/Cards/ATMDetailsCard";
import Layout from "@/components/Layout";
import RNScrollView from "@/components/ScrollView";
import RNText from "@/components/Text";
import tw from "@/lib/tailwind";
import { addCardApi } from "@/utils/api";
import axios from "axios";
import React from "react";
import { Alert, View } from "react-native";
import { useMutation } from "react-query";
import { useDeviceContext } from "twrnc";

const AddCard = () => {
  useDeviceContext(tw);
  const addCardMutation = useMutation(addCardApi, {
    onError: (error, context, er) => {
      console.log(error, "<--- error on addcardMutation");
      const e = JSON.stringify(error?.response?.data?.message).replace(
        /"/g,
        ""
      );
      if (axios.isAxiosError(error)) {
        console.error("Error message:", error.message);
        Alert.alert("Error", e);
      } else {
        Alert.alert("Error", "Error, please try again");
      }
    },
    onSuccess: async (data: any) => {
      console.log(data, "data on add card");
    },
  });

  return (
    <Layout header headerCenterText="Add card">
      <View style={tw`flex-1`}>
        <RNText size="sm" theme="secondary">
          Add <RNText theme="primary">₦1.00 </RNText>
          to your Memonies wallet so we can verify this card and route automated salary payouts.
        </RNText>
        <RNScrollView style={tw`flex-1`} containterStyle={tw``}>
          <ATMDetailsCard from="AddCard" />
          <RNText size="sm" theme="secondary">
            To ensure the security of your funds only bank cards linked to your{" "}
            <RNText theme="black">BVN(2254*****) </RNText>
            and salary account can be added
          </RNText>
        </RNScrollView>
        <RNButton title="Add card" onPress={() => {}} />
      </View>
    </Layout>
  );
};

export default AddCard;
