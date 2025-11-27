import { PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit';

export type UserRole = 'employer' | 'employee';
export type AttendanceStatus = 'present' | 'absent' | 'pending';
export type PayoutStatus = 'scheduled' | 'processing' | 'paid' | 'failed';
export type Destination = 'wallet' | 'bank';

export interface LocationSnapshot {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
}

export interface AttendanceEntry {
  id: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  clockIn?: string;
  clockOut?: string;
  clockInLocation?: LocationSnapshot;
  clockOutLocation?: LocationSnapshot;
  payout: {
    amount: number;
    status: PayoutStatus;
    destination: Destination;
    processedAt?: string;
    reference?: string;
  };
  employerApproved: boolean;
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  dailyRate: number;
  todayStatus: AttendanceStatus;
  earningsToday: number;
  autopayoutDestination: Destination;
  lastClockIn?: string;
  avatar?: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  inviteCode: string;
  walletBalance: number;
  dailyObligation: number;
  monthlyPayout: number;
  autopayoutTime: string;
  autopayoutEnabled: boolean;
  pendingInvites: number;
  walletShortfall: number;
  location: string;
}

export interface PayoutRun {
  id: string;
  date: string;
  totalAmount: number;
  status: PayoutStatus;
  channel: Destination;
  employees: number;
  trigger: 'auto' | 'manual';
  processedAt?: string;
  notes?: string;
}

export interface EdsState {
  role: UserRole;
  dailyRate: number;
  todaysEarning: number;
  autopayoutDestination: Destination;
  autopayoutTime: string;
  autopayoutEnabled: boolean;
  gpsRequired: boolean;
  company: CompanyProfile;
  attendance: AttendanceEntry[];
  activeShiftStart?: string;
  team: TeamMember[];
  payouts: {
    upcoming: PayoutRun[];
    history: PayoutRun[];
  };
  notifications: string[];
}

type SummaryHydrationPayload = Partial<
  Omit<EdsState, 'company' | 'attendance' | 'team' | 'payouts' | 'notifications'>
> & {
  company?: Partial<CompanyProfile>;
  attendance?: AttendanceEntry[];
  team?: TeamMember[];
  payouts?: Partial<EdsState['payouts']>;
  notifications?: string[];
};

const toDateKey = (iso = new Date().toISOString()) => iso.slice(0, 10);

const buildInitialState = (): EdsState => ({
  role: 'employee',
  dailyRate: 22000,
  todaysEarning: 12000,
  autopayoutDestination: 'wallet',
  autopayoutTime: '18:00',
  autopayoutEnabled: true,
  gpsRequired: true,
  company: {
    id: 'comp_pilot',
    name: 'Memonies Pilot Factory',
    inviteCode: 'MEM-48219',
    walletBalance: 1520000,
    dailyObligation: 320000,
    monthlyPayout: 4820000,
    autopayoutTime: '18:00',
    autopayoutEnabled: true,
    pendingInvites: 4,
    walletShortfall: 0,
    location: 'Victoria Island, Lagos',
  },
  attendance: [
    {
      id: 'att-001',
      date: toDateKey(new Date(Date.now() - 86400000).toISOString()),
      status: 'present',
      clockIn: new Date(Date.now() - 86400000).toISOString(),
      clockOut: new Date(Date.now() - 86400000 + 8 * 60 * 60 * 1000).toISOString(),
      payout: {
        amount: 22000,
        status: 'paid',
        destination: 'wallet',
        processedAt: new Date(Date.now() - 86400000 + 10 * 60 * 60 * 1000).toISOString(),
        reference: 'MEM-672913',
      },
      employerApproved: true,
      notes: 'Auto payout completed at 6:00 PM.',
    },
    {
      id: 'att-002',
      date: toDateKey(new Date(Date.now() - 2 * 86400000).toISOString()),
      status: 'present',
      clockIn: new Date(Date.now() - 2 * 86400000).toISOString(),
      clockOut: new Date(Date.now() - 2 * 86400000 + 9 * 60 * 60 * 1000).toISOString(),
      payout: {
        amount: 22000,
        status: 'paid',
        destination: 'bank',
        processedAt: new Date(Date.now() - 2 * 86400000 + 10 * 60 * 60 * 1000).toISOString(),
        reference: 'MEM-672812',
      },
      employerApproved: true,
      notes: 'Employee switched channel to bank transfer.',
    },
  ],
  activeShiftStart: undefined,
  team: [
    {
      id: 'emp-001',
      name: 'Amina Yusuf',
      dailyRate: 18000,
      todayStatus: 'present',
      earningsToday: 18000,
      autopayoutDestination: 'wallet',
      lastClockIn: new Date().toISOString(),
    },
    {
      id: 'emp-002',
      name: 'Chinedu Okafor',
      dailyRate: 20000,
      todayStatus: 'pending',
      earningsToday: 0,
      autopayoutDestination: 'bank',
    },
    {
      id: 'emp-003',
      name: 'Isioma Bello',
      dailyRate: 24000,
      todayStatus: 'present',
      earningsToday: 24000,
      autopayoutDestination: 'wallet',
      lastClockIn: new Date().toISOString(),
    },
  ],
  payouts: {
    upcoming: [
      {
        id: 'run-001',
        date: new Date().toISOString(),
        totalAmount: 320000,
        status: 'scheduled',
        channel: 'wallet',
        employees: 28,
        trigger: 'auto',
      },
    ],
    history: [
      {
        id: 'run-000',
        date: new Date(Date.now() - 86400000).toISOString(),
        totalAmount: 298000,
        status: 'paid',
        channel: 'wallet',
        employees: 26,
        processedAt: new Date(Date.now() - 86400000 + 10 * 60 * 60 * 1000).toISOString(),
        trigger: 'auto',
        notes: 'Auto payout completed in 39 seconds.',
      },
    ],
  },
  notifications: [
    'Clock out before 6:00 PM to qualify for automatic payout.',
    '3 employees have not clocked in today.',
  ],
});

const initialState: EdsState = buildInitialState();

export const edsSlice = createSlice({
  name: 'eds',
  initialState,
  reducers: {
    setAttendanceFeed: (state, action: PayloadAction<AttendanceEntry[]>) => {
      state.attendance = action.payload;
    },
    setTeamMembers: (state, action: PayloadAction<TeamMember[]>) => {
      state.team = action.payload;
      state.company.dailyObligation = action.payload.reduce(
        (sum, member) => sum + member.dailyRate,
        0
      );
    },
    setPayoutsData: (
      state,
      action: PayloadAction<{ upcoming: PayoutRun[]; history: PayoutRun[] }>
    ) => {
      state.payouts = action.payload;
    },
    resetEdsState: (state) => {
      Object.assign(state, buildInitialState());
    },
    setRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload;
    },
    setDailyRate: (state, action: PayloadAction<number>) => {
      state.dailyRate = action.payload;
    },
    setTodaysEarning: (state, action: PayloadAction<number>) => {
      state.todaysEarning = action.payload;
    },
    setAutopayoutDestination: (state, action: PayloadAction<Destination>) => {
      state.autopayoutDestination = action.payload;
    },
    setAutopayoutTime: (state, action: PayloadAction<string>) => {
      state.autopayoutTime = action.payload;
      state.company.autopayoutTime = action.payload;
    },
    toggleAutoPayout: (state, action: PayloadAction<boolean | undefined>) => {
      const next = action.payload ?? !state.autopayoutEnabled;
      state.autopayoutEnabled = next;
      state.company.autopayoutEnabled = next;
    },
    setGpsRequired: (state, action: PayloadAction<boolean>) => {
      state.gpsRequired = action.payload;
    },
    setCompanyProfile: (state, action: PayloadAction<Partial<CompanyProfile>>) => {
      state.company = { ...state.company, ...action.payload };
    },
    upsertTeamMember: (state, action: PayloadAction<TeamMember>) => {
      const index = state.team.findIndex((member) => member.id === action.payload.id);
      if (index > -1) {
        state.team[index] = action.payload;
      } else {
        state.team.unshift(action.payload);
        state.company.dailyObligation += action.payload.dailyRate;
      }
    },
    clockIn: (
      state,
      action: PayloadAction<{ timestamp: string; location?: LocationSnapshot }>
    ) => {
      const dayKey = toDateKey(action.payload.timestamp);
      let entry = state.attendance.find((record) => record.date === dayKey);
      if (!entry) {
        entry = {
          id: `att-${nanoid(6)}`,
          date: dayKey,
          status: 'present',
          clockIn: action.payload.timestamp,
          payout: {
            amount: state.dailyRate,
            status: 'scheduled',
            destination: state.autopayoutDestination,
          },
          employerApproved: state.role === 'employer',
        };
        state.attendance.unshift(entry);
      } else {
        entry.clockIn = action.payload.timestamp;
        entry.status = 'present';
      }
      entry.clockInLocation = action.payload.location;
      entry.payout.destination = state.autopayoutDestination;
      entry.payout.status = 'scheduled';
      state.activeShiftStart = action.payload.timestamp;
      state.todaysEarning = 0;
    },
    clockOut: (
      state,
      action: PayloadAction<{ timestamp: string; location?: LocationSnapshot }>
    ) => {
      const dayKey = toDateKey(action.payload.timestamp);
      const entry = state.attendance.find((record) => record.date === dayKey);
      if (!entry) {
        return;
      }
      entry.clockOut = action.payload.timestamp;
      entry.clockOutLocation = action.payload.location;
      entry.payout.status = 'scheduled';
      entry.payout.destination = state.autopayoutDestination;
      entry.payout.amount = state.dailyRate;
      entry.employerApproved = true;
      state.activeShiftStart = undefined;
      state.todaysEarning = state.dailyRate;
    },
    markAttendanceStatus: (
      state,
      action: PayloadAction<{ attendanceId: string; status: AttendanceStatus; payoutStatus?: PayoutStatus }>
    ) => {
      const entry = state.attendance.find((record) => record.id === action.payload.attendanceId);
      if (!entry) {
        return;
      }
      entry.status = action.payload.status;
      if (action.payload.payoutStatus) {
        entry.payout.status = action.payload.payoutStatus;
        if (action.payload.payoutStatus === 'paid') {
          entry.payout.processedAt = new Date().toISOString();
        }
      }
    },
    schedulePayoutRun: (
      state,
      action: PayloadAction<{ totalAmount: number; employees: number; trigger?: 'auto' | 'manual' }>
    ) => {
      state.payouts.upcoming.unshift({
        id: `run-${nanoid(6)}`,
        date: new Date().toISOString(),
        totalAmount: action.payload.totalAmount,
        employees: action.payload.employees,
        status: 'scheduled',
        channel: state.autopayoutDestination,
        trigger: action.payload.trigger ?? 'manual',
      });
    },
    recordPayoutCompletion: (state, action: PayloadAction<{ runId: string; status?: PayoutStatus }>) => {
      const runIndex = state.payouts.upcoming.findIndex((run) => run.id === action.payload.runId);
      if (runIndex === -1) {
        return;
      }
      const run = state.payouts.upcoming[runIndex];
      state.payouts.upcoming.splice(runIndex, 1);
      run.status = action.payload.status ?? 'paid';
      run.processedAt = new Date().toISOString();
      state.payouts.history.unshift(run);
    },
    setNotifications: (state, action: PayloadAction<string[]>) => {
      state.notifications = action.payload;
    },
    applySummarySnapshot: (state, action: PayloadAction<SummaryHydrationPayload>) => {
      const payload = action.payload;
      if (payload.role) {
        state.role = payload.role;
      }
      if (typeof payload.dailyRate === 'number') {
        state.dailyRate = payload.dailyRate;
      }
      if (typeof payload.todaysEarning === 'number') {
        state.todaysEarning = payload.todaysEarning;
      }
      if (payload.autopayoutDestination) {
        state.autopayoutDestination = payload.autopayoutDestination;
      }
      if (payload.autopayoutTime) {
        state.autopayoutTime = payload.autopayoutTime;
        state.company.autopayoutTime = payload.autopayoutTime;
      }
      if (typeof payload.autopayoutEnabled === 'boolean') {
        state.autopayoutEnabled = payload.autopayoutEnabled;
        state.company.autopayoutEnabled = payload.autopayoutEnabled;
      }
      if (typeof payload.gpsRequired === 'boolean') {
        state.gpsRequired = payload.gpsRequired;
      }
      if (payload.company) {
        state.company = { ...state.company, ...payload.company };
      }
      if (payload.attendance) {
        state.attendance = payload.attendance;
      }
      if (payload.team) {
        state.team = payload.team;
        state.company.dailyObligation = payload.team.reduce(
          (sum, member) => sum + member.dailyRate,
          0
        );
      }
      if (payload.payouts) {
        state.payouts = {
          upcoming: payload.payouts.upcoming ?? state.payouts.upcoming,
          history: payload.payouts.history ?? state.payouts.history,
        };
      }
      if (payload.notifications) {
        state.notifications = payload.notifications;
      }
      if (
        payload.company?.walletBalance !== undefined &&
        payload.company.walletBalance < state.company.dailyObligation
      ) {
        state.company.walletShortfall = state.company.dailyObligation - payload.company.walletBalance;
      } else if (payload.company?.walletBalance !== undefined) {
        state.company.walletShortfall = 0;
      }
    },
  },
});

export const {
  resetEdsState,
  setRole,
  setDailyRate,
  setTodaysEarning,
  setAutopayoutDestination,
  setAutopayoutTime,
  toggleAutoPayout,
  setGpsRequired,
  setCompanyProfile,
  setAttendanceFeed,
  setTeamMembers,
  setPayoutsData,
  upsertTeamMember,
  clockIn,
  clockOut,
  markAttendanceStatus,
  schedulePayoutRun,
  recordPayoutCompletion,
  setNotifications,
  applySummarySnapshot,
} = edsSlice.actions;

export default edsSlice.reducer;

