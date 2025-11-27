export const AUTH_API = 'AuthApi'

// Auth
export const REGISTER = '/api/v1/auth/user/register'
export const CREATE_USER = REGISTER
export const LOGIN = '/api/v1/auth/user/login'
export const FORGOT = '/api/v1/auth/user/forgot-password'
export const RESET = '/api/v1/auth/user/reset-password'
export const VERIFY_SIGN_UP_OTP = '/api/v1/auth/user/verify-registration'
export const GENERATE_OTP = '/api/v1/auth/user/generate-otp'

// Identity & security
export const ADD_KYC = '/api/v1/user/add-kyc'
export const ADD_NIN = '/api/v1/user/add-nin'
export const ADD_BVN = '/api/v1/user/add-bvn'
export const CREATE_T_PIN = '/api/v1/payment/transaction-pin'
export const ADD_SECONDARYNO = '/api/v1/user/me/secondary-phone'

// Organization & workforce
export const ORGANIZATION = '/api/v1/organization'
export const JOIN_ORGANIZATION = '/api/v1/user/join-organization'
export const INVITE_COMPANY = '/api/v1/organization/store-company-info'
export const EDS_COMPANY_EMPLOYEES = '/api/v1/organization/employees'
export const EDS_INVITE_CODE = '/api/v1/organization/invite'

// Earned Daily Salary (EDS)
export const EDS_SUMMARY = '/api/v1/eds/summary'
export const EDS_ATTENDANCE = '/api/v1/eds/attendance'
export const EDS_CLOCK_IN = '/api/v1/eds/attendance/clock-in'
export const EDS_CLOCK_OUT = '/api/v1/eds/attendance/clock-out'
export const EDS_PAYOUTS = '/api/v1/eds/payouts'
export const EDS_TRIGGER_PAYOUT = '/api/v1/eds/payouts/run'

// Financial services
export const GET_WORK = '/api/v1/user/work'
export const BANK_LIST = '/api/v1/payment/bank-list'
export const GET_WALLET_INFO = '/api/v1/payment/account-info'
export const VALIDATE_BANKACCOUNT = '/api/v1/payment/validate-account'
export const WITHDRAW = '/api/v1/payment/withdraw'
export const ACTIVATE_MANDATE = '/api/v1/user/activate-mandate'
export const TRANSACTIONS = '/api/v1/payment/transactions'
export const ADD_CARD = '/api/v1/payment/add-card'
export const FUNDS_SENT = '/api/v1/user/funds-sent'
export const ADD_TOKEN = '/api/v1/user/token'
export const SEND_FORGOT_TOKEN = '/api/v1/payment/reset-txpin'
export const FETCH_STORE = '/api/v1/storefront/items'