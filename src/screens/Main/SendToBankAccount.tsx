import RNButton from "@/components/Button";
import Layout from "@/components/Layout";
import RNScrollView from "@/components/ScrollView";
import RNText from "@/components/Text";
import RNTinput from "@/components/TextField";
import tw from "@/lib/tailwind";
import { colors } from "@/theme/colors";
import { getBankList, validateAccountApi, withdrawApi } from "@/utils/api";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useDeviceContext } from "twrnc";
//@ts-ignore
import OTPTextInput from "react-native-otp-textinput";
import AnimatedLottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/types';

interface IState {
  accNo: string;
  amount: string;
  bankName: string;
  bankCode: string;
  accountName: string;
  accountNameErr: boolean;
}
//functi
const SendToBankAccount = () => {
  useDeviceContext(tw);
  const [state, setState] = React.useReducer(
    (prev: IState, next: IState) => ({
      ...prev,
      ...next,
    }),
    {
      accNo: "",
      amount: "",
      bankName: "",
      bankCode: "",
      accountName: "",
      accountNameErr: false,
    }
  );
  const [pin, setpin] = React.useState("");
  const [loadingName, setloadingName] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [modalState, setModalState] = useState<'input' | 'loading' | 'error' | 'success'>('input');
  const [modalError, setModalError] = useState('');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [loadingWithdrawal, setloadingWithdrawal] = useState(false)

  const handleClose = () => {
    setShowPinModal(false);
    setModalState('input');
    setModalError('');
    setpin('');
  };
  const handleChange = (name: keyof IState, value: any) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  const { data: banks, error: banksError } = useQuery("banks", getBankList);
  const validateMutation = useMutation(validateAccountApi, {
    onError: (error, context, er) => {
      handleChange("accountNameErr", true);
      if (axios.isAxiosError(error)) {
        console.log(
          "Error message:",
          JSON.stringify(error.response?.data?.message).replace(/"/g, "")
        );
      }
    },
    onSuccess: async (data: any) => {
      console.log(data, "res on validation");
      handleChange("accountName", data?.accountName);
      //navigation.navigate('VerifyPassword', { email: "ssm" });
    },
  });

  const validateAccount = async () => {
    validateMutation.mutate({
      bank: String(state.bankCode),
      account: String(state.accNo),
    });
  };

  const handleSubmit = async () => {
    setShowPinModal(true);
    setModalState('input');
    setModalError('');
    setpin('');
  };

  const handleFunc = async () => {
    setModalState('loading');
    setModalError('');
    const payload = {
      amount: Number(String(state.amount).replace(/,/g, "")),
      idempotentKey: String(
        [...Array(16)]
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join("")
      ),
      accountBank: String(state.bankCode),
      accountNumber: String(state.accNo),
      purpose: "Withdrawal",
      pin: String(pin),
    };
    withdrawApi(payload)
      .then((data) => {
        setModalState('success');
        setTimeout(() => {
          setShowPinModal(false);
          setModalState('input');
          setModalError('');
          setpin('');
          navigation.navigate("TransactionDetails", {
            transaction: data,
            from: 'withdrawal',
          });
        }, 1500);
      })
      .catch((error) => {
        console.log(error, "error")
        setModalState('error');
        setpin('')
        setModalError(
          axios.isAxiosError(error)
            ? JSON.stringify(error?.response?.data?.message).replace(/"/g, "")
            : 'An error occurred. Please try again.'
        );
      });
  };

  React.useEffect(() => {
    if (state.bankCode !== "" && state.accNo.toString().length === 10) {
      validateAccount();
    }
  }, [state.bankCode, state.accNo]);
  
  return (
    <Layout header headerCenterText="Send money to bank account">
      <Modal
        visible={showPinModal}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={tw`flex-1 justify-center items-center bg-black/40`}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={tw`w-full h-full justify-center items-center`}
              keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
            >
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={tw`bg-white rounded-xl p-6 w-4/5 items-center`}>
                  {modalState === 'input' && (
                    <>
                      <RNText
                        style={tw`text-lg mb-6 mt-4`}
                        font="outfitbold"
                        theme="black"
                        align="center"
                      >
                        Enter transaction pin
                      </RNText>
                      <View style={tw`mx-auto w-[80%]`}>
                        <OTPTextInput
                          autoFocus
                          handleTextChange={(text: string) => {
                            setpin(text);
                          }}
                          textInputStyle={tw`border border-b rounded-[8px] bg-white`}
                          tintColor={colors.primary}
                          containerStyle={tw``}
                          inputCount={4}
                          keyboardType="numeric"
                        />
                      </View>
                      <TouchableOpacity
                        disabled={pin.length < 4}
                        onPress={handleFunc}
                        style={tw`${
                          pin.length < 4 ? "bg-[#8c8c8c50]" : "bg-primary"
                        } w-full mb-2 h-12 rounded-sm mt-6`}
                      >
                        <RNText style={tw`m-auto`} size="smB" theme="white">
                          Proceed
                        </RNText>
                      </TouchableOpacity>
                    </>
                  )}
                  {modalState === 'loading' && (
                    <View style={tw`items-center justify-center py-8`}>
                      <ActivityIndicator size="large" color={colors.primary} />
                      <RNText style={tw`mt-4`} theme="primary">
                        Processing withdrawal...
                      </RNText>
                    </View>
                  )}
                  {modalState === 'error' && (
                    <View style={tw`items-center justify-center py-8`}>
                      <RNText style={tw`mb-2`} theme="danger">
                        {modalError}
                      </RNText>
                      <TouchableOpacity onPress={() => setModalState('input')} style={tw`bg-primary px-6 py-2 rounded`}> 
                        <RNText theme="white">Retry</RNText>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleClose} style={tw`mt-2`}>
                        <RNText theme="primary">Cancel</RNText>
                      </TouchableOpacity>
                    </View>
                  )}
                  {modalState === 'success' && (
                    <View style={tw`items-center justify-center py-8`}>
                      <FontAwesome name="check-circle" size={48} color={colors.primary} />
                      <RNText style={tw`mt-4`} theme="primary">
                        Withdrawal successful!
                      </RNText>
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={tw`flex-1`}>
        <RNScrollView style={tw`flex-1`} containterStyle={tw``}>
          <RNTinput
            label="Amount (N)"
            placeholder="Enter an amount"
            keyboardType="phone-pad"
            value={String(state.amount)}
            maxLength={10}
            style={tw`bg-[#F4F4F4] border-0`}
            onChangeText={(text: string) => {
              setState({
                ...state, 
                amount: text
                .replace(/\D/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              })
            }}
          />
          <RNTinput
            label="Recipient's account number"
            placeholder="Enter recipient's account number"
            keyboardType="phone-pad"
            value={String(state.accNo)}
            maxLength={10}
            style={tw`bg-[#F4F4F4] border-0`}
            onChangeText={(text: string) => handleChange("accNo", text)}
          />
          <RNText theme="black" font={"outfitregular"} style={tw`mb-1`}>
            {"Receipient's bank name"}
          </RNText>
          <SelectDropdown
            data={banks?.data ?? []}
            onSelect={(selectedItem, index) => {
              handleChange("bankName", selectedItem?.name);
              handleChange("bankCode", selectedItem?.code);
            }}
            search
            searchInputStyle={tw`border border-[#00000020] rounded-b-sm`}
            searchPlaceHolder={"Search banks"}
            searchPlaceHolderColor={"darkgrey"}
            renderSearchInputLeftIcon={() => {
              return (
                <FontAwesome name={"search"} color={"#8c8c8c80"} size={18} />
              );
            }}
            renderButton={(selectedItem, isOpen) => {
              return (
                <View style={styles.dropdownButtonStyle}>
                  <RNText size="sm" style={styles.dropdownButtonTxtStyle}>
                    {selectedItem?.name || "Select bank"}
                  </RNText>
                  <AntDesign name={isOpen ? "up" : "down"} style={tw``} />
                </View>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View
                  style={{
                    ...styles.dropdownItemStyle,
                    ...(isSelected && { backgroundColor: "#D2D9DF" }),
                  }}
                >
                  <RNText style={styles.dropdownItemTxtStyle}>
                    {item?.name}
                  </RNText>
                </View>
              );
            }}
            dropdownStyle={styles.dropdownMenuStyle}
          />
          {loadingName && (
            <AnimatedLottieView
              source={require("../../assets/animations/dotloader.json")}
              style={tw`w-[200px] -left-[25%] absolute -bottom-3 h-8`}
              autoPlay
              resizeMode="cover"
            />
          )}
          {state.accountName && (
            <RNText
              theme="primary"
              font={"outfitregular"}
              size="sm"
              style={tw`mt-1`}
            >
              {state?.accountName}
            </RNText>
          )}
          {state.accountNameErr && !state.accountName && (
            <RNText
              theme="danger"
              font={"outfitregular"}
              size="sm"
              style={tw`mt-1`}
            >
              {"Incorrect details"}
            </RNText>
          )}
        </RNScrollView>
        
        {
          !showPinModal && <TouchableOpacity
          onPress={handleSubmit}
          style={tw`mt-5 h-[52px] rounded-[4px] bg-black items-center justify-center w-full ${
            String(state?.accountName).length < 1 ? "bg-[#DEE2ED]" : "bg-primary"
          }`}
          disabled={String(state?.accountName).length < 1}
        >
          <RNText theme="white">Continue</RNText>
        </TouchableOpacity>  
        }
      </View>
    </Layout>
  );
};

export default SendToBankAccount;

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: "100%",
    height: 50,
    backgroundColor: "#F4F4F4",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    textAlign: "left",
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
    minHeight: 150,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingVertical: 12,
  },
  dropdownItemTxtStyle: {
    fontSize: 16,
    color: "#151E26",
    textAlign: "left",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  ////////////// dropdown1
  dropdown1ButtonStyle: {
    width: "80%",
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "#444444",
  },
  dropdown1ButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#FFFFFF",
    textAlign: "center",
  },
  dropdown1ButtonArrowStyle: {
    fontSize: 28,
    color: "#FFFFFF",
  },
  dropdown1ButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
    color: "#FFFFFF",
  },
  dropdown1MenuStyle: {
    backgroundColor: "#444444",
    borderRadius: 8,
  },
  dropdown1ItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#B1BDC8",
  },
  dropdown1ItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  dropdown1ItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
    color: "#FFFFFF",
  },
  ////////////// dropdown2
  dropdown2ButtonStyle: {
    width: "80%",
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#B1BDC8",
  },
  dropdown2ButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdown2ButtonArrowStyle: {
    fontSize: 28,
  },
  dropdown2ButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdown2MenuStyle: {
    backgroundColor: "#FFF",
    borderRadius: 8,
  },
  dropdown2ItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#B1BDC8",
  },
  dropdown2ItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdown2ItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
