import RNButton from "@/components/Button";
import ATMDetailsCard from "@/components/Cards/ATMDetailsCard";
import Layout from "@/components/Layout";
import RNScrollView from "@/components/ScrollView";
import RNText from "@/components/Text";
import RNTinput from "@/components/TextField";
import tw from "@/lib/tailwind";
import { areAllValuesPresent } from "@/utils";
import { addCardApi } from "@/utils/api";
import axios from "axios";
import React from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";
import { useMutation } from "react-query";
import { useDeviceContext } from "twrnc";

const LoginPassword = () => {
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

  const [userCredentials, setuserCredentials] = React.useReducer(
    (
      prev: Record<string, string | number | boolean>,
      next: Record<string, string | number | boolean>
    ) => ({
      ...prev,
      ...next,
    }),
    {
      current: "",
      new: "",
      confirm: ""
    }
  );
  const handleChange = (name: any, value: any) => {
    setuserCredentials({
      ...userCredentials,
      [name]: value,
    });
  };

  return (
    <Layout header headerCenterText="Change login password">
      <View style={tw`flex-1`}>
        <RNScrollView style={tw`flex-1`} containterStyle={tw``}>
          <RNTinput
            label="Current login password"
            placeholder="Enter current password"
            keyboardType="default"
            onChangeText={(text: string) => handleChange("current", text)}
            style={tw`bg-secondary10 border-0`}
            value={String(userCredentials.current)}
            returnKeyType="done"
          />
          <RNTinput
            label="New login password"
            placeholder="Enter new password"
            keyboardType="default"
            onChangeText={(text: string) => handleChange("new", text)}
            style={tw`bg-secondary10 border-0`}
            value={String(userCredentials.new)}
            returnKeyType="done"
          />
          <RNTinput
            label="Confirm new login password"
            placeholder="Enter new password again"
            keyboardType="default"
            onChangeText={(text: string) => handleChange("confirm", text)}
            style={tw`bg-secondary10 border-0`}
            value={String(userCredentials.confirm)}
            returnKeyType="done"
          />
        </RNScrollView>
        <RNButton title="Save" onPress={() => {}} disable={!areAllValuesPresent(userCredentials)} />
      </View>
    </Layout>
  );
};

export default LoginPassword;
