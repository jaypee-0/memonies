export type RootStackParamList = {
  Login: undefined;
  Welcome: { organization?: string } | undefined;
  Signup: { organization?: string; verifyAccount?: boolean; phone?: string; stage?: number } | undefined;
  OrganizationInput: undefined;
  //sjsjs: { itemId: number; itemName: string }; 
  TransactionDetails: { transaction: any; from?: string };
};

export type ParamListBase = keyof RootStackParamList;
