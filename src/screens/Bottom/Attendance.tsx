import React, { useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import Layout from "@/components/Layout";
import RNButton from "@/components/Button";
import RNText from "@/components/Text";
import RNScrollView from "@/components/ScrollView";
import tw from "@/lib/tailwind";
import { useDeviceContext } from "twrnc";
import { colors } from "@/theme/colors";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { formatAmount, formatDateLong } from "@/utils/formatting";
import {
  clockIn,
  clockOut,
  recordPayoutCompletion,
  schedulePayoutRun,
  setGpsRequired,
} from "@/redux/slices/edsSlice";
import * as Location from "expo-location";

const Attendance = () => {
  useDeviceContext(tw);
  const dispatch = useAppDispatch();
  const {
    role,
    attendance,
    gpsRequired,
    autopayoutTime,
    autopayoutDestination,
    activeShiftStart,
    team,
    payouts,
    company,
    dailyRate,
  } = useAppSelector((state) => state.eds);

  const [locationLoading, setLocationLoading] = useState(false);

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayRecord = useMemo(
    () => attendance.find((record) => record.date === todayKey),
    [attendance, todayKey]
  );

  const upcomingRun = payouts.upcoming[0];
  const lastRun = payouts.history[0];

  const presentCount = useMemo(
    () => team.filter((member) => member.todayStatus === "present").length,
    [team]
  );

  const requestLocation = async () => {
    if (!gpsRequired) {
      return undefined;
    }
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Location permission needed",
        "We attach a GPS snapshot to every attendance event for employer compliance."
      );
      return undefined;
    }
    const coords = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      latitude: coords.coords.latitude,
      longitude: coords.coords.longitude,
      accuracy: coords.coords.accuracy,
    };
  };

  const handleClockIn = async () => {
    try {
      setLocationLoading(true);
      const location = await requestLocation();
      dispatch(
        clockIn({
          timestamp: new Date().toISOString(),
          location,
        })
      );
    } catch (error) {
      Alert.alert("Unable to clock in", "Please try again in a moment.");
    } finally {
      setLocationLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setLocationLoading(true);
      const location = await requestLocation();
      dispatch(
        clockOut({
          timestamp: new Date().toISOString(),
          location,
        })
      );
    } catch (error) {
      Alert.alert("Unable to clock out", "Please try again in a moment.");
    } finally {
      setLocationLoading(false);
    }
  };

  const handleTriggerPayroll = () => {
    const total = team.reduce((sum, worker) => sum + worker.dailyRate, 0);
    dispatch(
      schedulePayoutRun({
        totalAmount: total,
        employees: team.length,
        trigger: "manual",
      })
    );
    Alert.alert(
      "Payroll scheduled",
      "We'll debit the company wallet at 6:00 PM."
    );
  };

  const handleMarkPaid = () => {
    if (!upcomingRun) {
      return;
    }
    dispatch(
      recordPayoutCompletion({
        runId: upcomingRun.id,
        status: "paid",
      })
    );
    Alert.alert("Payout confirmed", "Employees have been credited.");
  };

  const formatTime = (iso?: string) => {
    if (!iso) {
      return "--:--";
    }
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shiftOngoing = Boolean(activeShiftStart && !todayRecord?.clockOut);

  return (
    <Layout bg="#fff">
      <RNScrollView style={tw`flex-1`}>
        <View style={tw`w-full`}>
          <RNText theme="black" font="outfitsemi" size="lgl">
            Attendance & payouts
          </RNText>
          <RNText theme="secondary" style={tw`mb-3`}>
            Clock in/out from the app, then let Memonies handle earned daily
            salary payouts automatically.
          </RNText>

          <View
            style={tw`w-full rounded-xl bg-[#F4F6FD] p-4 mb-4 border border-[#D6E0FF]`}
          >
            <RNText font="outfitmedium" theme="black">
              {shiftOngoing ? "You're clocked in" : "Tap to start your workday"}
            </RNText>
            <RNText theme="secondary" size="sm" style={tw`mt-1`}>
              Auto payout scheduled for {autopayoutTime} via{" "}
              {autopayoutDestination === "wallet"
                ? "Memonies wallet"
                : "bank transfer"}
              .
            </RNText>
            <View style={tw`flex-row items-center justify-between mt-4`}>
              <View>
                <RNText size="sm" theme="secondary">
                  Clock in
                </RNText>
                <RNText font="outfitsemi">{formatTime(todayRecord?.clockIn)}</RNText>
              </View>
              <View>
                <RNText size="sm" theme="secondary">
                  Clock out
                </RNText>
                <RNText font="outfitsemi">
                  {todayRecord?.clockOut ? formatTime(todayRecord?.clockOut) : "—"}
                </RNText>
              </View>
              <View>
                <RNText size="sm" theme="secondary">
                  Payout status
                </RNText>
                <RNText font="outfitsemi" theme="black">
                  {todayRecord?.payout?.status
                    ? todayRecord?.payout?.status.toUpperCase()
                    : "SCHEDULED"}
                </RNText>
              </View>
            </View>
          </View>

          <View style={tw`flex-row justify-between mb-4`}>
            <RNButton
              title={shiftOngoing ? "Clocked in" : "Clock in"}
              disable={shiftOngoing || locationLoading}
              onPress={handleClockIn}
              style={tw`w-[48%]`}
            />
            <RNButton
              title={shiftOngoing ? "Clock out" : "Clocked out"}
              theme={shiftOngoing ? "black" : "white"}
              disable={!shiftOngoing || locationLoading}
              onPress={handleClockOut}
              style={tw`w-[48%] ${
                shiftOngoing ? "" : "border border-[#0C142830]"
              }`}
              textStyle={shiftOngoing ? undefined : tw`text-[#0C1428]`}
            />
          </View>

          <View
            style={tw`flex-row items-center justify-between bg-white border border-[#E4E8F2] rounded-lg px-4 py-3 mb-4`}
          >
            <View style={tw`flex-1 pr-4`}>
              <RNText font="outfitsemi">GPS snapshots</RNText>
              <RNText size="sm" theme="secondary">
                {gpsRequired
                  ? "Location data is attached to each clock-in/out for compliance."
                  : "Location capture is disabled for this device."}
              </RNText>
            </View>
            <Switch
              value={gpsRequired}
              onValueChange={(val) => dispatch(setGpsRequired(val))}
              trackColor={{ false: "#E4E8F2", true: "#D6E0FF" }}
              thumbColor={gpsRequired ? colors.primary : "#f4f3f4"}
            />
          </View>

          {role === "employer" ? (
            <View
              style={tw`bg-[#0D1B3D] rounded-2xl p-4 mb-4 border border-[#24386E]`}
            >
              <RNText theme="white" font="outfitmedium">
                Team attendance overview
              </RNText>
              <RNText theme="white" size="sm" style={tw`opacity-70 mt-1`}>
                {presentCount} / {team.length} employees clocked in today. Auto
                payout will debit ₦{formatAmount(company.dailyObligation)} at{" "}
                {company.autopayoutTime}.
              </RNText>
              <View style={tw`flex-row justify-between mt-4`}>
                <View>
                  <RNText theme="white" size="sm" style={tw`opacity-70`}>
                    Daily obligation
                  </RNText>
                  <RNText theme="white" font="outfitsemi">
                    ₦{formatAmount(company.dailyObligation)}
                  </RNText>
                </View>
                <View>
                  <RNText theme="white" size="sm" style={tw`opacity-70`}>
                    Wallet balance
                  </RNText>
                  <RNText
                    theme={company.walletShortfall > 0 ? "danger" : "white"}
                    font="outfitsemi"
                  >
                    ₦{formatAmount(company.walletBalance)}
                  </RNText>
                </View>
                <View>
                  <RNText theme="white" size="sm" style={tw`opacity-70`}>
                    Pending invites
                  </RNText>
                  <RNText theme="white" font="outfitsemi">
                    {company.pendingInvites}
                  </RNText>
                </View>
              </View>
              <View style={tw`flex-row mt-4`}>
                <RNButton
                  title="Trigger manual payout"
                  onPress={handleTriggerPayroll}
                  style={tw`flex-1 mr-2 bg-white`}
                  textStyle={tw`text-[#0D1B3D]`}
                  theme="white"
                />
                <RNButton
                  title="Mark as paid"
                  disable={!upcomingRun}
                  onPress={handleMarkPaid}
                  style={tw`flex-1`}
                />
              </View>
            </View>
          ) : (
            <View
              style={tw`border border-[#E4E8F2] rounded-2xl p-4 mb-4 bg-white`}
            >
              <RNText font="outfitmedium" theme="black">
                Today’s earnings
              </RNText>
              <RNText size="sm" theme="secondary" style={tw`mt-1`}>
                We accrue earnings in real time once you clock in.
              </RNText>
              <View style={tw`flex-row items-center mt-4`}>
                <View style={tw`flex-1`}>
                  <RNText theme="secondary" size="sm">
                    Daily rate
                  </RNText>
                  <RNText font="outfitsemi" size="lg">
                    ₦{formatAmount(dailyRate)}
                  </RNText>
                </View>
                <View style={tw`flex-1`}>
                  <RNText theme="secondary" size="sm">
                    Destination
                  </RNText>
                  <RNText font="outfitsemi">
                    {autopayoutDestination === "wallet"
                      ? "Memonies wallet"
                      : "Bank transfer"}
                  </RNText>
                </View>
              </View>
            </View>
          )}

          <View style={tw`mb-2 flex-row items-center justify-between`}>
            <RNText font="outfitsemi" theme="black">
              Attendance history
            </RNText>
            <TouchableOpacity
              onPress={() => Linking.openURL("https://memonies.app/help/attendance")}
            >
              <RNText theme="primary" size="sm">
                Export logs
              </RNText>
            </TouchableOpacity>
          </View>

          <View>
            {attendance.slice(0, 10).map((record) => (
              <View
                key={record.id}
                style={tw`mb-3 border border-[#E4E8F2] rounded-xl p-3 bg-white`}
              >
                <View style={tw`flex-row justify-between items-center`}>
                  <View style={tw`flex-row items-center`}>
                    <View
                      style={tw`h-9 w-9 rounded-full bg-[#F4F6FD] items-center justify-center mr-3`}
                    >
                      <Feather name="clock" color={colors.primary} size={18} />
                    </View>
                    <View>
                      <RNText font="outfitmedium">
                        {formatDateLong(record.date)}
                      </RNText>
                      <RNText size="sm" theme="secondary">
                        {record.status === "present"
                          ? "Marked present"
                          : record.status}
                      </RNText>
                    </View>
                  </View>
                  <View
                    style={tw`px-3 py-1 rounded-full ${
                      record.payout.status === "paid"
                        ? "bg-[#04CA5820]"
                        : "bg-[#FFA50020]"
                    }`}
                  >
                    <RNText
                      size="sm"
                      theme={
                        record.payout.status === "paid" ? "success" : "warning"
                      }
                    >
                      {record.payout.status === "paid" ? "Paid" : "Scheduled"}
                    </RNText>
                  </View>
                </View>
                <View style={tw`flex-row justify-between mt-3`}>
                  <View>
                    <RNText theme="secondary" size="sm">
                      Clock in
                    </RNText>
                    <RNText font="outfitsemi">
                      {formatTime(record.clockIn)}
                    </RNText>
                  </View>
                  <View>
                    <RNText theme="secondary" size="sm">
                      Clock out
                    </RNText>
                    <RNText font="outfitsemi">
                      {formatTime(record.clockOut)}
                    </RNText>
                  </View>
                  <View>
                    <RNText theme="secondary" size="sm">
                      Amount
                    </RNText>
                    <RNText font="outfitsemi">
                      ₦{formatAmount(record.payout.amount || 0)}
                    </RNText>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {lastRun && (
            <View
              style={tw`mt-2 mb-6 border border-[#E4E8F2] rounded-xl p-4 bg-white`}
            >
              <View style={tw`flex-row justify-between items-center`}>
                <RNText font="outfitmedium" theme="black">
                  Last payout run
                </RNText>
                <View style={tw`flex-row items-center`}>
                  <Ionicons name="checkmark-circle" size={18} color="#04CA58" />
                  <RNText theme="success" style={tw`ml-1`} size="sm">
                    {lastRun.status}
                  </RNText>
                </View>
              </View>
              <View style={tw`flex-row justify-between mt-3`}>
                <View>
                  <RNText theme="secondary" size="sm">
                    Date
                  </RNText>
                  <RNText font="outfitsemi">
                    {formatDateLong(lastRun.date)}
                  </RNText>
                </View>
                <View>
                  <RNText theme="secondary" size="sm">
                    Employees
                  </RNText>
                  <RNText font="outfitsemi">{lastRun.employees}</RNText>
                </View>
                <View>
                  <RNText theme="secondary" size="sm">
                    Total paid
                  </RNText>
                  <RNText font="outfitsemi">
                    ₦{formatAmount(lastRun.totalAmount)}
                  </RNText>
                </View>
              </View>
            </View>
          )}
        </View>
      </RNScrollView>
    </Layout>
  );
};

export default Attendance;
