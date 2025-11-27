export interface CreateUser {
    email: string
    password: string
    authType: string
}

export interface VerifyEmailOTP {
    email: string
    token: string
}

export interface SignInUser {
    email: string
    password: string
}

export interface Email {
    email: string
}

export interface VerifyForgotOTP {
    email: string
    code: string
}

export interface ResetPassword {
    token: string
    password: string
}

export interface UserProfile {
    id?: string
    firstName?: string
    lastName?: string
    userName?: string
    pushToken?: string
    transactinPin?: string
    notificationEnabled?: boolean
    avatar?: string
}
