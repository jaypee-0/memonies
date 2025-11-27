import { useCallback } from 'react';
import { useQuery } from 'react-query';

import {
  applySummarySnapshot,
  setAttendanceFeed,
  setPayoutsData,
  setTeamMembers,
} from '@/redux/slices/edsSlice';
import {
  getAttendanceFeed,
  getCompanyEmployees,
  getEdsSummary,
  getPayoutRuns,
} from '@/utils/api';
import { useAppDispatch, useAppSelector } from '@/hooks';

type QueryResult<TData = any> = ReturnType<typeof useQuery<TData>>;

const unwrap = <T = any>(payload: any): T => {
  if (!payload) {
    return payload;
  }
  if (payload.data !== undefined) {
    return payload.data;
  }
  if (payload.result !== undefined) {
    return payload.result;
  }
  return payload;
};

const ensureArray = <T = any>(value: any): T[] => {
  const data = unwrap(value);
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data?.data)) {
    return data.data;
  }
  return [];
};

const ensurePayoutShape = (value: any) => {
  const data = unwrap(value) || {};
  const upcoming =
    data.upcoming ??
    data.pending ??
    data.next ??
    (Array.isArray(data) ? data : data.data) ??
    [];
  const history = data.history ?? data.past ?? data.completed ?? [];
  return {
    upcoming: Array.isArray(upcoming) ? upcoming : [],
    history: Array.isArray(history) ? history : [],
  };
};

export const useEdsBootstrap = () => {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.eds.role);

  const summaryQuery = useQuery(['eds-summary'], getEdsSummary, {
    onSuccess: (response) => {
      const snapshot = unwrap(response);
      if (snapshot) {
        dispatch(applySummarySnapshot(snapshot));
      }
    },
  });

  const attendanceQuery = useQuery(['eds-attendance'], getAttendanceFeed, {
    onSuccess: (response) => {
      const entries = ensureArray(response);
      if (entries.length) {
        dispatch(setAttendanceFeed(entries));
      }
    },
  });

  const employeesQuery: QueryResult = useQuery(
    ['eds-employees'],
    getCompanyEmployees,
    {
      enabled: role === 'employer',
      onSuccess: (response) => {
        const team = ensureArray(response);
        if (team.length) {
          dispatch(setTeamMembers(team));
        }
      },
    }
  );

  const payoutsQuery = useQuery(['eds-payouts'], getPayoutRuns, {
    onSuccess: (response) => {
      const shape = ensurePayoutShape(response);
      dispatch(setPayoutsData(shape));
    },
  });

  const refreshAll = useCallback(async () => {
    const refetchers = [
      summaryQuery.refetch(),
      attendanceQuery.refetch(),
      payoutsQuery.refetch(),
    ];

    if (role === 'employer') {
      refetchers.push(employeesQuery.refetch());
    }

    await Promise.allSettled(refetchers);
  }, [attendanceQuery, employeesQuery, payoutsQuery, role, summaryQuery]);

  return {
    summaryQuery,
    attendanceQuery,
    employeesQuery,
    payoutsQuery,
    refreshAll,
  };
};

export type UseEdsBootstrapReturn = ReturnType<typeof useEdsBootstrap>;

