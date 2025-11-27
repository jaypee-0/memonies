import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import RNButton from "@/components/Button";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { colors } from "@/theme/colors";
import tw from "@/lib/tailwind";
import { useDeviceContext } from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { selectUser, setCardDetails } from "@/redux/slices/authSlice";
import RNText from "@/components/Text";
import RNScrollView from "@/components/ScrollView";
import { AntDesign, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "react-query";
import {
  activateMandate,
  getLoanEligibility,
  getLoanHistory,
  getWalletInfo,
  getWorkApi,
} from "@/utils/api";
import { copyToClipboard, formatAmount } from "@/utils";
import AnimatedLottieView from "lottie-react-native";
import { useIsFocused } from "@react-navigation/native";
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import { usePushNotification } from "@/hooks/usePushNotification";
import axios from "axios";

export const loanTranches = [
  { amount: 0, disbursed: true },
  { amount: 200000, disbursed: false },
  { amount: 400000, disbursed: false },
  { amount: 600000, disbursed: false },
  { amount: 800000, disbursed: false },
  { amount: 1000000, disbursed: false },
];
const Home = () => {
  usePushNotification();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const navigation: any = useNavigation();
  useDeviceContext(tw);
  const selectedUser = useAppSelector(selectUser);
  const [toggleBalance, settoggleBalance] = useState(false);
  const [mandateLoading, setmandateLoading] = useState(false);

  let links = [
    // {
    //   name: "Complete your profile",
    //   text: "Upgrade your profile to apply for a loan",
    //   icon: <AntDesign name="arrowup" size={24} color="#006F2F" />,
    //   url: () => navigation.navigate("PersonalDetails"),
    //   bgColor: "#006F2F",
    //   buttonText: "Go",
    // },
    {
      name: "Get a loan in 3 minutes",
      text: "",
      //text: "Up to N1,000,000 available to your account",
      icon: <FontAwesome name="bolt" size={24} color="#DB1716" />,
      url: () => navigation.navigate("Loans"),
      bgColor: "#DB1716",
      buttonText: "Apply",
    },
  ];

  const {
    data: walletData,
    isLoading: walletDataLoading,
    isError: walletDataError,
    isFetching: walletFetching,
    refetch: refetchWallet,
  } = useQuery("walletInfo", getWalletInfo);

  const {
    data: eligibilityData,
    isLoading: eligibilityLoading,
    isError: eligibilityError,
    refetch: refetchEligibility,
    error,
  } = useQuery("loanEligibility", getLoanEligibility);

  useEffect(() => {
    if (walletData) {
      dispatch(setCardDetails(walletData.data));
    }
  }, [walletData]);

  const {
    data: loanHistory,
    isLoading: historyLoading,
    error: historyError,
    isFetching,
    refetch: refetchLoans,
  } = useQuery("loanHistory", getLoanHistory);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e: any) => {
      refetchWallet();
      refetchLoans();
    });
    return unsubscribe;
  }, [navigation]);

  const {
    data: workData,
    isLoading: workLoading,
    isError: woorkError,
    refetch: refetchWork,
  } = useQuery("workings", getWorkApi);
  React.useEffect(() => {
    if (isFocused) {
      refetchWallet();
      refetchLoans();
      refetchEligibility();
      refetchWork();
    }
  }, [isFocused]);
  const creditLeft = walletData?.data?.credit?.canLoan;
  const creditTaken = walletData?.data?.credit?.principalDept;
  const creditLimit = walletData?.data?.eligibility?.amount;
  const activateMandate01 = useMutation(activateMandate, {
    onError: (error, context, er) => {
      if (axios.isAxiosError(error)) {
        const message = JSON.stringify(error?.response?.data?.message).replace(/"/g, "");
        console.log("Error", message);
        if (message?.toLowerCase?.()?.includes("bvn mobile number")) {
  
          navigation.navigate("SecondaryPhone", { reason: message });
        } else {
          Alert.alert("Error", message);
        }
      } else {
        Alert.alert("Error", "Error, please try again");
      }
    },
    onSuccess: async (data: any) => {
      console.log(data, "mandate data");
      navigation.navigate("Mandate", {
        //instruction: data?.data + fincra,
        instruction: data?.data,
      });
    },
  });

  async function handleSubmit() {
    await activateMandate01.mutate({
      work: String(eligibilityData?.data?.work),
    });
  }

  const handleMandate = async () => {
    setmandateLoading(true);
    try {
      await handleSubmit?.();
      setTimeout(() => {
        setmandateLoading(false);
      }, 8000);
    } catch (err) {
      setmandateLoading(false);
      console.log(err, "<-- err");
    }
  };

  const handleRefresh = async () => {
    refetchEligibility();
    refetchWallet();
    refetchWork();
    refetchLoans();
  };

  return (
    <Layout bg={"#fff"}>
      <View style={tw` w-full flex-1`}>
        {/* Navigation bar */}
        <View
          style={tw`w-full flex flex-row justify-between items-center rounded-xl pt-2 mt-3 pb-1`}
        >
          <View style={tw`flex flex-row items-center`}>
            <View
              style={tw`mr-4 rounded-full bg-[#8d8d8d70] h-12 w-12 flex flex-row items-center justify-center`}
            >
              <RNText style={tw``} font="outfitmedium">
                {selectedUser?.firstName?.slice(0, 1) +
                  selectedUser.lastName.slice(0, 1)}
              </RNText>
            </View>
            {/* @ts-ignore */}
            <TouchableOpacity
              onPress={() => navigation.navigate("PersonalDetails")}
            >
              <RNText style={tw``}>
                Hey, {selectedUser?.firstName + " " + selectedUser.lastName}
              </RNText>
              <View style={tw`flex flex-row gap-x-2`}>
                {/* <RNText style={tw`text-[#656565]`} size={"sm"}>
                  {selectedUser?.email ? selectedUser?.email : "Email: N/A"}
                </RNText> */}

                {/* <TouchableOpacity
                  style={tw`bg-[#E2FFEC] rounded-full px-3 py-1 flex flex-row items-center gap-x-1`}>
                  <AntDesign name='checkcircle' size={10} color='#0D8436' />
                  <RNText style={tw`text-xs text-[#0D8436]`}>{'Tier 1'}</RNText>
                </TouchableOpacity> */}
              </View>
            </TouchableOpacity>
          </View>
          <Ionicons
            name="notifications-outline"
            size={32}
            color="black"
            onPress={() => navigation.navigate("Notification")}
          />
        </View>

        {/* Main slider */}
        <RNScrollView
          horizontal
          style={tw`mt-3 h-[${responsiveScreenHeight(7)}]`}
        >
          <View
            style={tw`mr-3 min-h-[${responsiveScreenHeight(
              4
            )}] w-[${responsiveScreenWidth(
              21
            )}] flex flex-col justify-between bg-[#EBF4FF] rounded-md p-4 pt-5 pb-2 relative`}
          >
            <Image
              source={require("@/assets/images/cardicon.png")}
              style={tw`absolute`}
            />
            <View style={tw`w-full`}>
              <View
                style={tw`flex flex-row items-center w-full justify-between mb-3`}
              >
                <RNText theme="secondary" size="sm">
                  Balance
                </RNText>
                <RNButton
                  naked
                  nakedTextColor="primary"
                  title="Transaction History"
                  navigate="TransactionHistory"
                  style={tw`mt-0`}
                  textStyle={tw`text-sm text-primary ml-auto`}
                />
              </View>
              {walletFetching ? (
                <AnimatedLottieView
                  source={require("../../assets/animations/dotloader.json")}
                  style={tw`w-[250px] h-10 absolute -left-[30%] top-6`}
                  autoPlay
                  resizeMode="cover"
                />
              ) : (
                <View style={tw`flex flex-row items-center gap-x-2 `}>
                  <RNText theme="secondary" font="outfitsemi" size="lg">
                    ₦
                  </RNText>

                  <RNText theme="black" font="outfitsemi" size="lg">
                    {toggleBalance
                      ? "XXX"
                      : formatAmount(walletData?.data?.availableBalance || 0)}
                  </RNText>
                  <AntDesign
                    name="eye"
                    size={18}
                    color={colors.secondary}
                    onPress={() => settoggleBalance(!toggleBalance)}
                  />
                </View>
              )}
            </View>
            <View style={tw`-mt-2 relative`}>
              <RNText theme="secondary" align="right" size="sm">
                Wallet number:
              </RNText>
              <View style={tw`flex flex-row justify-end items-center -mt-2`}>
                <RNText
                  theme="black"
                  font="outfitsemi"
                  style={tw`text-[1.5rem]`}
                >
                  {walletData?.data?.accountNumber ?? "xxxx xxxx xx"}
                </RNText>
                <Ionicons
                  name="copy"
                  size={16}
                  color={colors.secondary}
                  onPress={() =>
                    copyToClipboard(
                      walletData?.data?.accountNumber ?? "xxxx xxxx xx"
                    )
                  }
                />
              </View>
            </View>
          </View>
          <View
            style={tw`mr-3 flex flex-col min-h-[${responsiveScreenHeight(
              4
            )}] w-[${responsiveScreenWidth(
              21
            )}] justify-between bg-[#EBF4FF] rounded-md p-4 pt-5 pb-2 relative`}
          >
            <Image
              source={require("@/assets/images/cardicon.png")}
              style={tw`absolute`}
            />
            <View style={tw`w-full`}>
              <View
                style={tw`flex flex-row items-center w-full justify-between mb-3`}
              >
                <RNText theme="black" size="md" font="outfitbold">
                  Outstanding balance
                </RNText>
              </View>
              {walletFetching ? (
                <AnimatedLottieView
                  source={require("../../assets/animations/dotloader.json")}
                  style={tw`w-[250px] h-10 absolute -left-[30%] top-6`}
                  autoPlay
                  resizeMode="cover"
                />
              ) : (
                <View style={tw`flex flex-row items-center gap-x-2 `}>
                  <RNText theme="secondary" font="outfitsemi" size="lg">
                    ₦
                  </RNText>

                  <RNText theme="black" font="outfitsemi" size="lg">
                    {toggleBalance
                      ? "XXX"
                      : formatAmount(walletData?.data?.credit?.dept || 0)}
                  </RNText>
                  <AntDesign
                    name="eye"
                    size={18}
                    color={colors.secondary}
                    onPress={() => settoggleBalance(!toggleBalance)}
                  />
                </View>
              )}
              <RNText
                theme="secondary"
                size="sm"
                style={tw`leading-4 max-w-[90%]`}
              >
                The amount of money that is owed to Credx.
              </RNText>
            </View>
          </View>
        </RNScrollView>

        <RNScrollView
          style={tw`mt-3 h-full`}
          refreshControl={
            <RefreshControl
              refreshing={walletDataLoading}
              colors={[colors.primary]}
              onRefresh={handleRefresh}
            />
          }
        >
          {/* Action buttons */}
          <View style={tw`flex flex-row justify-between mt-2`}>
            <RNButton
              icon={
                <View style={tw`rounded-full bg-[#FFFFFF20]`}>
                  <AntDesign
                    name="plus"
                    color={"#ffffff"}
                    size={16}
                    style={tw`p-1`}
                  />
                </View>
              }
              title="Account"
              style={tw`rounded-md h-12 w-[31%]`}
              theme="black"
              onPress={() =>
                navigation.navigate("Account", {
                  wallet: walletData,
                })
              }
              debounceTime={1000}
              textStyle={tw`text-sm`}
            />
            <RNButton
              icon={
                <View style={tw`rounded-full bg-[#FFFFFF20]`}>
                  <AntDesign
                    name="plus"
                    color={"#ffffff"}
                    size={16}
                    style={tw`p-1`}
                  />
                </View>
              }
              title="Fund"
              style={tw`rounded-md h-12 w-[31%]`}
              theme="black"
              navigate="ReceiveMoney"
              debounceTime={1000}
              textStyle={tw`text-sm`}
            />
            <RNButton
              icon={
                <View style={tw`rounded-full bg-[#FFFFFF20]`}>
                  <Feather
                    name="arrow-up-right"
                    color={"#ffffff"}
                    size={16}
                    style={tw`p-1`}
                  />
                </View>
              }
              title="Send"
              style={tw`rounded-md h-12 w-[31%]`}
              theme="black"
              navigate="SendMoney"
              debounceTime={1000}
              textStyle={tw`text-sm`}
            />
          </View>
          {/* AWAITING HR APPROVAL */}
          {eligibilityData?.data?.eligible === "PENDING" && (
            <View
              style={tw`rounded-md bg-[#E2EEFC] py-2 px-4 mt-3 w-full
             mr-2`}
            >
              <View style={tw`flex flex-row items-center justify-between mb-2`}>
                <View>
                  <RNText style={tw`-mb-1`} font="outfitmedium" theme="primary">
                    Loan Approval
                  </RNText>
                  <RNText size="sm" theme="black">
                    Your loan application is being processed
                  </RNText>
                </View>
                <Image source={require("@/assets/images/bag.png")} />
              </View>
              <View style={tw`h-2 bg-gray-300 rounded-full mb-2 relative`}>
                <View
                  style={[tw`h-full bg-red-500 rounded-full`, { width: `70%` }]}
                />
              </View>
            </View>
          )}
          {/* AWAITING MANDATE ACTIVATION */}
          {workData?.work?.status?.status === "PRNDING_MANDATE_ATIVATION" && workData?.work?.mandateStatus === "PENDING" && (
            <View
              style={tw`rounded-md bg-[#E2EEFC] py-2 px-4 mt-3 mb-2 w-full
             mr-2`}
            >
              <View>
                <RNText style={tw``} font="outfitmedium" theme="primary">
                  Activate mandate
                </RNText>
                <RNText theme="black" size="sm" style={tw`mt-3 leading-[1rem]`}>
                  We charge a fee to activate a mandate, enabling us to
                  automatically debit your account if a loan payment defaults
                </RNText>
                <TouchableOpacity
                  onPress={handleMandate}
                  style={tw`mt-5 h-[52px] rounded-[4px] bg-black items-center justify-center w-full ${
                    activateMandate01.isLoading ? "bg-[#DEE2ED]" : "bg-black"
                  }`}
                  disabled={activateMandate01.isLoading}
                >
                  {activateMandate01.isLoading ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <RNText theme="white">Activate</RNText>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
          {creditLimit > 0 && (
            <View
              style={tw`rounded-md bg-[#0C142815] py-2 px-4 mt-3 w-full
             mr-2`}
            >
              <View style={tw`flex flex-row items-center justify-between mb-2`}>
                <View>
                  <View>
                    <RNText size="sm">Credit Left </RNText>
                    <RNText
                      style={tw`-mt-2 text-[1.4rem]`}
                      font="outfitmedium"
                      theme="black"
                    >
                      ₦{formatAmount(creditLeft ?? 0)}
                    </RNText>
                  </View>

                  <View style={tw`mt-3`}>
                    <RNText size="sm">Credit Taken </RNText>
                    <RNText
                      style={tw`-mt-2 text-[1.02rem]`}
                      font="outfitmedium"
                      theme="primary"
                    >
                      ₦{formatAmount(creditTaken ?? 0)}
                    </RNText>
                  </View>
                </View>
                <View style={tw`flex flex-col items-end`}>
                  <Image source={require("@/assets/images/bag.png")} />
                  <View style={tw`mt-1`}>
                    <RNText size="sm" align="right">
                      Credit Limit{" "}
                    </RNText>
                    <RNText
                      style={tw`-mt-2 text-[1.02rem]`}
                      font="outfitmedium"
                      theme="primary"
                    >
                      ₦{formatAmount(creditLimit ?? 0)}
                    </RNText>
                  </View>
                </View>
              </View>

              <View style={tw`h-3 bg-gray-300 rounded-full my-5 relative`}>
                <View
                  style={[
                    tw`h-full bg-red-500 rounded-full`,
                    { width: `${(creditTaken / creditLimit) * 100}%` },
                  ]}
                />
              </View>
            </View>
          )}
          {/* ONGOING LOANS */}
          <View style={tw`w-full flex flex-col flex-1 mt-2 relative`}>
            {loanHistory?.data?.data.filter(
              (data: any) => data?.status?.status === "APPROVED"
            )?.length > 0 && (
              <View style={tw`w-full`}>
                <View style={tw`flex flex-row items-center justify-between`}>
                  <RNText style={tw`text-sm text-secondary100 mb-1`}>
                    Ongoing loans
                  </RNText>
                </View>
                <RNScrollView horizontal>
                  {loanHistory?.data?.data
                    .filter((data: any) => data?.status?.status === "APPROVED")
                    .map((loan: any, index: number) => {
                      return (
                        <View
                          key={index}
                          style={tw`rounded-md bg-[#0C142815] p-4 w-${responsiveScreenWidth(
                            21
                          )} mr-2`}
                        >
                          <View
                            style={tw`flex flex-row items-center justify-between mb-2`}
                          >
                            <View>
                              <RNText
                                size="md"
                                style={tw`-mb-1`}
                                font="outfitmedium"
                                theme="primary"
                              >
                                ₦{formatAmount(loan?.amount)}
                              </RNText>
                              <RNText size="sm">
                                Duration:{" "}
                                {`${loan?.tenors?.length} month${
                                  loan?.tenors?.length > 1 ? "s" : ""
                                }`}
                              </RNText>
                            </View>
                            <Image
                              source={require("@/assets/images/bag.png")}
                            />
                          </View>
                          <RNText style={tw`text-sm text-secondary100 mb-1`}>
                            Monthly repayment for ongoing plan
                          </RNText>
                          <View
                            style={tw`flex flex-row items-center justify-between mb-0 rounded-full w-full h-[6px] relative mb-1 bg-[#75757530] z-50`}
                          >
                            <View
                              style={tw`h-[7px] w-[7px] bg-danger rounded-full z-30`}
                            />
                            {loan?.tenors.map((_: any, index: number) => (
                              <View
                                key={index}
                                style={tw`h-[7px] w-[7px] bg-danger rounded-full z-30`}
                              />
                            ))}

                            {loan?.tenors.map((_: any, index: number) => {
                              const total = loan?.tenors?.length;
                              const unpaid = loan?.tenors?.filter(
                                (data: any) =>
                                  data?.status?.status !== "COMPLETED"
                              )?.length;

                              const dividend = ((total - unpaid) / total) * 100;

                              return _.status.status === "COMPLETED" ? (
                                <View
                                  key={index}
                                  style={tw`z-20 left-0 absolute -top-[0.1] h-[6px] w-[${Number(
                                    dividend
                                  )}%] bg-success rounded-full`}
                                ></View>
                              ) : (
                                <View key={index} style={tw`z-40 absolute`} />
                              );
                            })}
                          </View>
                          <View
                            style={tw`flex flex-row w-full items-center justify-between`}
                          >
                            <RNText style={tw``} size="sm">
                              N0
                            </RNText>
                            {loan?.tenors.map((_: any, index: number) => {
                              return (
                                <View key={index} style={tw``}>
                                  <RNText style={tw``} size="sm">
                                    N{Math.round(_?.amount)}
                                  </RNText>
                                </View>
                              );
                            })}
                          </View>
                          <RNButton
                            onPress={() =>
                              navigation.navigate("LoanDetails", {
                                loan: loan,
                              })
                            }
                            title="View details"
                            style={tw`rounded-full bg-transparent border border-primary h-10 mt-4`}
                            textStyle={tw`text-primary`}
                          />
                        </View>
                      );
                    })
                    .reverse()}
                </RNScrollView>
              </View>
            )}
            {/* LINKS */}
            {links.map(
              ({ name, text, icon, url, bgColor, buttonText }, index) => {
                return (
                  <View
                    key={index}
                    style={tw`w-full flex flex-row justify-between items-center bg-white rounded-md py-3 px-2 mt-3 bg-[${bgColor}15] border border-[${bgColor}90]`}
                  >
                    <View style={tw`flex flex-row items-center`}>
                      <View
                        style={tw`mr-2 h-10 w-10 rounded-full bg-[${bgColor}20] flex items-center justify-center`}
                      >
                        {icon}
                      </View>
                      {/* @ts-ignore */}
                      <View style={tw`w-[68%]`}>
                        <RNText style={tw``} font="outfitmedium">
                          {name}
                        </RNText>
                        {/* <RNText style={tw`text-[#656565] mt-1 text-[0.95rem] `}>
                          {text}
                        </RNText> */}
                      </View>
                    </View>
                    <RNButton
                      title={buttonText}
                      onPress={url}
                      theme="black"
                      style={tw`rounded-md h-8 w-auto px-3 rounded-full absolute z-40 right-2`}
                      textStyle={tw`text-sm`}
                    />
                  </View>
                );
              }
            )}
          </View>
        </RNScrollView>
      </View>
    </Layout>
  );
};

export default Home;
