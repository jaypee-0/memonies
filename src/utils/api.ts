import {
    ADD_KYC, ADD_NIN, ADD_BVN,
    REGISTER, LOGIN, VERIFY_SIGN_UP_OTP,
    CREATE_T_PIN,
    ORGANIZATION,
    JOIN_ORGANIZATION,
    BANK_LIST,
    GET_WALLET_INFO,
    FORGOT,
    RESET,
    WITHDRAW,
    ACTIVATE_MANDATE,
    GET_WORK,
    FUNDS_SENT,
    ADD_TOKEN,
    INVITE_COMPANY,
    SEND_FORGOT_TOKEN,
    ADD_SECONDARYNO,
    VALIDATE_BANKACCOUNT,
    TRANSACTIONS,
    ADD_CARD,
    EDS_SUMMARY,
    EDS_ATTENDANCE,
    EDS_CLOCK_IN,
    EDS_CLOCK_OUT,
    EDS_PAYOUTS,
    EDS_TRIGGER_PAYOUT,
    EDS_COMPANY_EMPLOYEES,
    EDS_INVITE_CODE,
} from '@/services/url'
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const url = `https://api.memonies.app`

// Queries
export const fetchOrganizations = async () => {
    const response = await axios.get(`${url}${ORGANIZATION}`);
    return response?.data;
}
export const getEdsSummary = async () => {
    const token = await AsyncStorage.getItem('token')
    const response = await axios.get(`${url}${EDS_SUMMARY}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response?.data;
}
export const getWorkApi = async () => {
    const token = await AsyncStorage.getItem('token')
    const response = await axios.get(`${url}${GET_WORK}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response?.data;
}
export const getPayoutRuns = async () => {
    const token = await AsyncStorage.getItem('token')
    const response = await axios.get(`${url}${EDS_PAYOUTS}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response?.data;
}

export const getAttendanceFeed = async () => {
    const token = await AsyncStorage.getItem('token')
    const response = await axios.get(`${url}${EDS_ATTENDANCE}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response?.data;
}

export const clockInApi = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
    const response = await axios.post(`${url}${EDS_CLOCK_IN}`, data, { headers });
    return response?.data;
}

export const clockOutApi = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
    const response = await axios.post(`${url}${EDS_CLOCK_OUT}`, data, { headers });
    return response?.data;
}

export const triggerPayoutApi = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
    const response = await axios.post(`${url}${EDS_TRIGGER_PAYOUT}`, data, { headers });
    return response?.data;
}

export const getCompanyEmployees = async () => {
    const token = await AsyncStorage.getItem('token')
    const response = await axios.get(`${url}${EDS_COMPANY_EMPLOYEES}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response?.data;
}
export const getBankList = async () => {
    const token = await AsyncStorage.getItem('token')
    const response = await axios.get(`${url}${BANK_LIST}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response?.data;
}

export const getWalletInfo = async () => {
    const token = await AsyncStorage.getItem('token')
    const response = await axios.get(`${url}${GET_WALLET_INFO}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response?.data;
}
export const getTransactionHistoryApi = async ({ queryKey }: any) => {
    const [_, id] = queryKey
    const token = await AsyncStorage.getItem('token')
    const response = await axios.get(`${url + TRANSACTIONS + `?user=${id}&orderBy=createdAt:desc&limit=100`}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response?.data;
}


// Mutations
export const registerApi = async (data: any) => {
    const response = await axios.post(`${url}${REGISTER}`, data);
    return response?.data;
}
export const loginApi = async (data: any) => {
    const response = await axios.post(`${url}${LOGIN}`, data);
    return response.data
}

export const forgotApi = async (data: any) => {
    const response = await axios.post(`${url}${FORGOT}`, data);
    return response.data
}

export const resetPasswordApi = async (data: any) => {
    const response = await axios.post(`${url}${RESET}`, data);
    return response.data
}

export const sendOtpApi = async (data: any) => {
    const response = await axios.post(`${url}${REGISTER}`, data);
    return response?.data;
}
export const verifyOtpApi = async (data: any) => {
    const response = await axios.post(`${url}${VERIFY_SIGN_UP_OTP}`, data);
    return response?.data;
}
export const addNINApi = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const response = await axios.post(`${url}${ADD_NIN}`, data, { headers });
    return response?.data;
}
export const addTokenApi = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const response = await axios.post(`${url}${ADD_TOKEN}`, data, { headers });
    return response?.data
}

export const addBVNApi = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const response = await axios.post(`${url}${ADD_BVN}`, data, { headers });
    return response?.data;
}
export const addKycApi = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const response = await axios.post(`${url}${ADD_KYC}`, data, { headers });
    return response?.data;
}
export const createPinApi = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const response = await axios.patch(`${url}${CREATE_T_PIN}`, data, { headers });
    return response?.data;
}
export const joinOrgApi = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const response = await axios.post(`${url}${JOIN_ORGANIZATION}`, data, { headers });
    return response?.data;
}
export const inviteCompanyApi = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const response = await axios.post(`${url}${INVITE_COMPANY}`, data, { headers });
    return response?.data;
}
export const applyLoanApi = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const response = await axios.post(`${url}${APPLY_LOAN}`, data, { headers });
    return response?.data;
}
export const addCardApi = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const response = await axios.post(`${url}${ADD_CARD}`, data, { headers });
    return response?.data;
}
export const loanSummary = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const response = await axios.post(`${url}${LOAN_CHECK}`, data, { headers });
    return response?.data;
}
export const repayApi = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const response = await axios.post(`${url}${REPAY_LOAN}`, data, { headers });
    return response?.data;
}
export const validateAccountApi = async (data: any) => {
    const response = await axios.post(`${url}${VALIDATE_BANKACCOUNT}`, data);
    return response?.data;
}
export const withdrawApi = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const response = await axios.post(`${url}${WITHDRAW}`, data, { headers });
    return response?.data;
}
export const activateMandate = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const response = await axios.post(`${url}${ACTIVATE_MANDATE}`, data, { headers });
    return response?.data;
}
export const addSecondaryNumber = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const response = await axios.post(`${url}${ADD_SECONDARYNO}`, data, { headers });
    return response?.data;
}
export const confirmSentFunds = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const response = await axios.post(`${url}${FUNDS_SENT}`, data, { headers });
    return response?.data;
}
export const sendfrPinCodeApi = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const response = await axios.post(`${url}${SEND_FORGOT_TOKEN}`, data, { headers });
    return response?.data;
}
export const verifyfrPinCodeApi = async (data: any) => {
    const token = await AsyncStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const response = await axios.patch(`${url}${SEND_FORGOT_TOKEN}`, data, { headers });
    return response?.data;
}
