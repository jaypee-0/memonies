import {
  ActivityIndicator,
  Image,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import tw from "@/lib/tailwind";
import { useDeviceContext } from "twrnc";
import Layout from "@/components/Layout";
import RNText from "@/components/Text";
import {
  describeTransactionPurpose,
  formatAmount,
  formatDate,
  getTransactionStatusTextColor,
} from "@/utils";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/slices/authSlice";
import { useQuery } from "react-query";
import { getTransactionHistoryApi } from "@/utils/api";
import RNScrollView from "@/components/ScrollView";
import { colors } from "@/theme/colors";

const TransactionHistory = () => {
  const navigation: any = useNavigation();
  const user = useSelector(selectUser);
  const generateQueryKey = (id: string) => ["transactions", id];
  const {
    data: transactionsData,
    isFetching,
    error: transactionError,
    refetch: refetchTransactions,
  } = useQuery(generateQueryKey(user?.id), getTransactionHistoryApi, {
    enabled: false,
  });

  const [transactions, settransactions] = React.useState([]);
  useDeviceContext(tw);
  React.useEffect(() => {
    if (user) {
      refetchTransactions();
    }
    if (transactionsData?.transactions?.data) {
      settransactions(transactionsData?.transactions?.data);
    }
  }, [transactionsData]);

  return (
    <Layout header headerCenterText="Transaction History">
      <RNScrollView
        style={tw` w-full flex-1`}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            colors={[colors.primary]}
            onRefresh={() => refetchTransactions()}
          />
        }
      >
        {isFetching === true ? (
          <View style={tw`mx-auto`}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : transactions?.length < 1 ? (
          <View style={tw`flex-1 flex flex-row items-center justify-center`}>
            <RNText style={tw`mt-32`}>No transactions yet</RNText>
          </View>
        ) : (
          transactions.map((transaction: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={tw`flex-row justify-between items-center py-4 border-b border-gray-200`}
              onPress={() =>
                navigation.navigate("TransactionDetails", {
                  transaction: transaction,
                })
              }
            >
              <View style={tw`flex-row items-center max-w-[62%]`}>
                <Image source={require("@/assets/eds/payout.png")} />
                <View style={tw`ml-4`}>
                  <RNText style={tw``}>
                    {describeTransactionPurpose(transaction)}
                  </RNText>
                  <RNText size="sm" theme="secondary">
                    {formatDate(transaction?.createdAt)}
                  </RNText>
                </View>
              </View>
              <View style={tw`flex-col flex`}>
                <RNText style={tw``} align="right">
                  ₦{formatAmount(transaction?.amount)}
                </RNText>
                <RNText
                  style={[
                    tw`text-right ${getTransactionStatusTextColor(
                      transaction?.status?.toLowerCase()
                    )}`,
                  ]}
                  size="sm"
                  font="outfitregular"
                >
                  {transaction?.status}
                </RNText>
              </View>
            </TouchableOpacity>
          ))
        )}
      </RNScrollView>
    </Layout>
  );
};

export default TransactionHistory;
