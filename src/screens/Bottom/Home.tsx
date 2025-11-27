import React from "react";
import {
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import Layout from "@/components/Layout";
import RNScrollView from "@/components/ScrollView";
import RNText from "@/components/Text";
import RNButton from "@/components/Button";
import { useDeviceContext } from "twrnc";
import tw from "@/lib/tailwind";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { selectUser } from "@/redux/slices/authSlice";
import { colors } from "@/theme/colors";
import { formatAmount, formatDateLong } from "@/utils/formatting";
import { copyToClipboard } from "@/utils";
import { setRole, UserRole } from "@/redux/slices/edsSlice";
import { useEdsBootstrap } from "@/hooks/useEdsBootstrap";
import EdsGuidelines from "@/data/EdsGuidelines";

type QuickAction = {
  label: string;
  description: string;
  icon: React.ReactNode;
  onPress: () => void;
};

const SectionContainer = ({
  title,
  actionText,
  onActionPress,
  children,
}: {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
  children: React.ReactNode;
}) => (
  <View style={tw`mt-6`}>
    <View style={tw`flex-row items-center justify-between mb-3`}>
      <RNText font="outfitsemi" theme="black">
        {title}
      </RNText>
      {actionText && onActionPress && (
        <TouchableOpacity onPress={onActionPress}>
          <RNText theme="primary" size="sm">
            {actionText}
          </RNText>
        </TouchableOpacity>
      )}
    </View>
    {children}
  </View>
);

const Home = () => {
  useDeviceContext(tw);
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const {
    role,
    todaysEarning,
    dailyRate,
    autopayoutTime,
    autopayoutDestination,
    autopayoutEnabled,
    attendance,
    team,
    payouts,
    company,
    notifications,
  } = useAppSelector((state) => state.eds);
  const {
    refreshAll,
    summaryQuery,
    attendanceQuery,
    payoutsQuery,
    employeesQuery,
  } = useEdsBootstrap();

  const refreshing =
    summaryQuery.isFetching ||
    attendanceQuery.isFetching ||
    payoutsQuery.isFetching ||
    employeesQuery.isFetching;

  const handleRefresh = React.useCallback(() => {
    refreshAll();
  }, [refreshAll]);

  const greetings = user?.firstName ? user.firstName : "there";
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayRecord = attendance.find((entry) => entry.date === todayKey);
  const todaysProgress =
    dailyRate > 0 ? Math.min(1, todaysEarning / dailyRate) : 0;
  const autopDestinationLabel =
    autopayoutDestination === "wallet" ? "Memonies wallet" : "Bank transfer";
  const upcomingRun = payouts.upcoming[0];
  const lastRun = payouts.history[0];
  const recentAttendance = attendance.slice(0, 3);
  const visibleTeam = team.slice(0, 4);
  const sevenDayWindow = attendance.slice(0, 7);
  const presentSeven = sevenDayWindow.filter(
    (entry) => entry.status === "present"
  ).length;
  const inviteCode = company?.inviteCode ?? "N/A";

  const changeRole = (nextRole: UserRole) => {
    if (role !== nextRole) {
      dispatch(setRole(nextRole));
    }
  };

  const quickActions: QuickAction[] =
    role === "employer"
      ? [
          {
            label: "Fund wallet",
            description: "Top up company balance",
            icon: (
              <MaterialCommunityIcons
                name="bank-transfer"
                size={20}
                color={colors.primary}
              />
            ),
            onPress: () => navigation.navigate("SendMoney"),
          },
          {
            label: "Invite team",
            description: "Copy invite code",
            icon: (
              <Feather name="users" size={20} color={colors.primary} />
            ),
            onPress: () => copyToClipboard(inviteCode),
          },
          {
            label: "Review attendance",
            description: "Approve shifts",
            icon: (
              <Feather name="check-circle" size={20} color={colors.primary} />
            ),
            onPress: () => navigation.navigate("Attendance"),
          },
          {
            label: "Trigger payout",
            description: `Pay ${team.length} staff`,
            icon: <Feather name="zap" size={20} color={colors.primary} />,
            onPress: () => navigation.navigate("Attendance"),
          },
        ]
      : [
          {
            label: todayRecord?.clockIn ? "Clock out" : "Clock in",
            description: "Open attendance",
            icon: <Feather name="clock" size={20} color={colors.primary} />,
            onPress: () => navigation.navigate("Attendance"),
          },
          {
            label: "Withdraw funds",
            description: "Send to bank",
            icon: (
              <Feather
                name="arrow-down-circle"
                size={20}
                color={colors.primary}
              />
            ),
            onPress: () => navigation.navigate("SendToBankAccount"),
          },
          {
            label: "View wallet",
            description: "Cards & history",
            icon: (
              <Feather name="credit-card" size={20} color={colors.primary} />
            ),
            onPress: () => navigation.navigate("Account"),
          },
          {
            label: "Notifications",
            description: "Payroll alerts",
            icon: (
              <Ionicons
                name="notifications-outline"
                size={20}
                color={colors.primary}
              />
            ),
            onPress: () => navigation.navigate("Notification"),
          },
        ];

  return (
    <Layout bg="#F8FCFF">
      <RNScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`pb-16`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            colors={[colors.primary]}
            onRefresh={handleRefresh}
          />
        }
      >
        <View style={tw`w-full`}>
          <View style={tw`flex-row items-start justify-between`}>
            <View>
              <RNText theme="secondary" size="sm">
                Hi {greetings},
              </RNText>
              <RNText font="outfitsemi" size="lgl">
                Daily salary control
              </RNText>
              <RNText theme="secondary" size="sm" style={tw`mt-1`}>
                {role === "employer"
                  ? "Fund, approve, and automate payouts."
                  : "Track your earnings and daily payouts."}
              </RNText>
            </View>
            <View
              style={tw`flex-row bg-white border border-[#DDE2EF] rounded-full overflow-hidden`}
            >
              {(["employee", "employer"] as UserRole[]).map((type) => {
                const active = role === type;
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => changeRole(type)}
                    style={[
                      tw`px-3 py-1`,
                      active ? tw`bg-primary` : tw`bg-transparent`,
                    ]}
                  >
                    <RNText
                      size="sm"
                      theme={active ? "white" : "secondary"}
                      font={active ? "outfitsemi" : "outfitregular"}
                    >
                      {type === "employee" ? "Employee" : "Employer"}
                    </RNText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View
            style={tw`mt-6 rounded-3xl p-5 ${
              role === "employer" ? "bg-[#0D1B3D]" : "bg-primary"
            }`}
          >
            {role === "employer" ? (
              <>
                <RNText theme="white" size="sm">
                  Company wallet
                </RNText>
                <RNText theme="white" font="outfitbold" size="lgl">
                  ₦{formatAmount(company.walletBalance)}
                </RNText>
                <RNText theme="white" size="sm" style={tw`mt-2 opacity-80`}>
                  Daily obligation ₦{formatAmount(company.dailyObligation)} •{" "}
                  Auto payout {autopayoutTime}
                </RNText>
                {company.walletShortfall > 0 && (
                  <RNText theme="danger" size="sm" style={tw`mt-2`}>
                    Wallet shortfall ₦{formatAmount(company.walletShortfall)}.
                    Fund before {autopayoutTime}.
                  </RNText>
                )}
                <View style={tw`flex-row mt-4`}>
                  <RNButton
                    title="Fund wallet"
                    onPress={() => navigation.navigate("SendMoney")}
                    style={tw`flex-1 mr-3 bg-white`}
                    textStyle={tw`text-[#0D1B3D]`}
                    theme="white"
                  />
                  <RNButton
                    title="Manage team"
                    onPress={() => navigation.navigate("Attendance")}
                    style={tw`flex-1 bg-transparent border border-white`}
                    textStyle={tw`text-white`}
                    theme="transparent"
                  />
                </View>
              </>
            ) : (
              <>
                <RNText theme="white" size="sm">
                  Today’s earnings
                </RNText>
                <RNText theme="white" font="outfitbold" size="lgl">
                  ₦{formatAmount(todaysEarning)}
                </RNText>
                <RNText theme="white" size="sm" style={tw`mt-1 opacity-80`}>
                  Daily rate ₦{formatAmount(dailyRate)} • Auto payout{" "}
                  {autopayoutTime}
                </RNText>
                <View style={tw`h-2 bg-white/40 rounded-full mt-4`}>
                  <View
                    style={[
                      tw`h-full bg-white rounded-full`,
                      { width: `${todaysProgress * 100}%` },
                    ]}
                  />
                </View>
                <RNText theme="white" size="sm" style={tw`mt-2`}>
                  Destination: {autopDestinationLabel}
                </RNText>
                <RNButton
                  title="View attendance"
                  onPress={() => navigation.navigate("Attendance")}
                  style={tw`mt-4 bg-white`}
                  textStyle={tw`text-primary`}
                  theme="white"
                />
              </>
            )}
          </View>

          <SectionContainer title="Quick actions">
            <View style={tw`flex-row flex-wrap justify-between`}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.label}
                  onPress={action.onPress}
                  style={tw`w-[48%] bg-white border border-[#E4E8F2] rounded-2xl p-4 mb-3`}
                >
                  <View
                    style={tw`h-10 w-10 rounded-full bg-primary01 items-center justify-center mb-3`}
                  >
                    {action.icon}
                  </View>
                  <RNText font="outfitmedium">{action.label}</RNText>
                  <RNText theme="secondary" size="sm" style={tw`mt-1`}>
                    {action.description}
                  </RNText>
                </TouchableOpacity>
              ))}
            </View>
          </SectionContainer>

          {role === "employer" ? (
            <SectionContainer
              title="Team overview"
              actionText="View all"
              onActionPress={() => navigation.navigate("Attendance")}
            >
              {visibleTeam.length === 0 ? (
                <View style={tw`bg-white rounded-2xl p-4 border border-dashed border-[#D7DBE0]`}>
                  <RNText theme="secondary" size="sm">
                    Invite your first employee to start accruing attendance and payouts.
                  </RNText>
                </View>
              ) : (
                visibleTeam.map((member) => (
                  <View
                    key={member.id}
                    style={tw`flex-row justify-between items-center bg-white rounded-2xl p-4 mb-3 border border-[#EEF1F4]`}
                  >
                    <View>
                      <RNText font="outfitmedium">{member.name}</RNText>
                      <RNText theme="secondary" size="sm">
                        Daily rate ₦{formatAmount(member.dailyRate)}
                      </RNText>
                    </View>
                    <View style={tw`items-end`}>
                      <RNText
                        theme={
                          member.todayStatus === "present" ? "success" : "secondary"
                        }
                        size="sm"
                      >
                        {member.todayStatus === "present" ? "Present" : member.todayStatus}
                      </RNText>
                      <RNText theme="secondary" size="sm">
                        {member.autopayoutDestination === "wallet"
                          ? "Wallet"
                          : "Bank"}
                      </RNText>
                    </View>
                  </View>
                ))
              )}
              <View style={tw`bg-[#0D1B3D] rounded-2xl p-4 mt-2`}>
                <RNText theme="white" font="outfitmedium">
                  Attendance health
                </RNText>
                <RNText theme="white" size="sm" style={tw`mt-1 opacity-80`}>
                  {presentSeven} of {sevenDayWindow.length} workdays marked present in the last week.
                </RNText>
              </View>
            </SectionContainer>
          ) : (
            <SectionContainer
              title="Recent attendance"
              actionText="Open logs"
              onActionPress={() => navigation.navigate("Attendance")}
            >
              {recentAttendance.length === 0 ? (
                <View style={tw`bg-white rounded-2xl p-4 border border-dashed border-[#D7DBE0]`}>
                  <RNText theme="secondary" size="sm">
                    Clock in to start generating daily salary payouts.
                  </RNText>
                </View>
              ) : (
                recentAttendance.map((record) => (
                  <View
                    key={record.id}
                    style={tw`flex-row justify-between items-center bg-white rounded-2xl p-4 mb-3 border border-[#EEF1F4]`}
                  >
                    <View>
                      <RNText font="outfitmedium">
                        {formatDateLong(record.date)}
                      </RNText>
                      <RNText theme="secondary" size="sm">
                        {record.clockIn ? "Clocked in" : "Pending clock-in"}
                      </RNText>
                    </View>
                    <View style={tw`items-end`}>
                      <RNText
                        theme={
                          record.payout.status === "paid" ? "success" : "warning"
                        }
                        size="sm"
                      >
                        {record.payout.status === "paid" ? "Paid" : "Scheduled"}
                      </RNText>
                      <RNText theme="secondary" size="sm">
                        ₦{formatAmount(record.payout.amount || dailyRate)}
                      </RNText>
                    </View>
                  </View>
                ))
              )}
            </SectionContainer>
          )}

          <SectionContainer title="Payout timeline">
            <View style={tw`bg-white rounded-2xl p-4 border border-[#EEF1F4]`}>
              <View style={tw`flex-row justify-between items-center`}>
                <RNText font="outfitmedium">
                  {upcomingRun ? "Next auto payout" : "No scheduled payout"}
                </RNText>
                {upcomingRun && (
                  <RNText theme="secondary" size="sm">
                    {new Date(upcomingRun.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </RNText>
                )}
              </View>
              {upcomingRun ? (
                <>
                  <RNText theme="secondary" size="sm" style={tw`mt-1`}>
                    ₦{formatAmount(upcomingRun.totalAmount)} • {upcomingRun.employees} employees •{" "}
                    {upcomingRun.trigger === "auto" ? "Auto" : "Manual"}
                  </RNText>
                  <RNButton
                    title="Mark once paid"
                    onPress={() => navigation.navigate("Attendance")}
                    style={tw`mt-3`}
                  />
                </>
              ) : (
                <RNText theme="secondary" size="sm" style={tw`mt-1`}>
                  Payouts run automatically at {autopayoutTime}. Clock in to be included.
                </RNText>
              )}
            </View>
            {lastRun && (
              <View style={tw`bg-white rounded-2xl p-4 border border-[#EEF1F4] mt-3`}>
                <RNText font="outfitmedium">Last payout</RNText>
                <RNText theme="secondary" size="sm" style={tw`mt-1`}>
                  {formatDateLong(lastRun.date)} • ₦{formatAmount(lastRun.totalAmount)} paid to{" "}
                  {lastRun.employees} team members
                </RNText>
              </View>
            )}
          </SectionContainer>

          <SectionContainer
            title="Wallet & statements"
            actionText="Transaction history"
            onActionPress={() => navigation.navigate("TransactionHistory")}
          >
            <View style={tw`bg-white rounded-2xl p-4 border border-[#EEF1F4]`}>
              <RNText theme="secondary" size="sm">
                Monthly payout summary
              </RNText>
              <RNText font="outfitbold" size="lg">
                ₦{formatAmount(company.monthlyPayout)}
              </RNText>
              <RNText theme="secondary" size="sm" style={tw`mt-1`}>
                Based on all approved attendance and wallet debits.
              </RNText>
            </View>
          </SectionContainer>

          <SectionContainer title="Notifications">
            {notifications.length === 0 ? (
              <View style={tw`bg-white rounded-2xl p-4 border border-dashed border-[#D7DBE0]`}>
                <RNText theme="secondary" size="sm">
                  You’re all caught up. Clock-ins, payouts, and employer notices will appear here.
                </RNText>
              </View>
            ) : (
              notifications.slice(0, 4).map((note, index) => (
                <View
                  key={`${note}-${index}`}
                  style={tw`flex-row items-start bg-white rounded-2xl p-4 mb-2 border border-[#EEF1F4]`}
                >
                  <View
                    style={tw`h-8 w-8 rounded-full bg-primary01 items-center justify-center mr-3`}
                  >
                    <Ionicons name="notifications-outline" size={16} color={colors.primary} />
                  </View>
                  <RNText style={tw`flex-1`}>{note}</RNText>
                </View>
              ))
            )}
          </SectionContainer>

          <SectionContainer title="How Memonies works">
            <View style={tw`bg-white rounded-2xl p-4 border border-[#EEF1F4]`}>
              <EdsGuidelines />
            </View>
          </SectionContainer>
        </View>
      </RNScrollView>
    </Layout>
  );
};

export default Home;


