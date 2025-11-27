import React, { useState } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Layout from '@/components/Layout';
import RNScrollView from '@/components/ScrollView';
import RNText from '@/components/Text';
import RNTinput from '@/components/TextField';
import RNButton from '@/components/Button';
import tw from '@/lib/tailwind';
import { useDeviceContext } from 'twrnc';
import { responsiveScreenHeight } from 'react-native-responsive-dimensions';
import axios from 'axios';
const OrganizationInput = () => {
  useDeviceContext(tw);
  const navigation: any = useNavigation();
  const [organization, setOrganization] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showLoginOption, setShowLoginOption] = useState(true);

  React.useEffect(() => {
    // Enable continue button if organization name has at least 2 characters
    setIsDisabled(organization.trim().length < 2);
  }, [organization]);


  const [supportedCompanies, setSupportedCompanies] = useState<string[]>([]);

  const fetchSupportedCompanies = async () => {
    try {
      // If axios is not imported, assume it's available in the project context
      const response = await axios.get('https://web-production-f310.up.railway.app/api/v1/organization/supported-companies');
      if (Array.isArray(response?.data?.data)) {
        const companies = response?.data?.data?.map((company: any) => company?.code);
        console.log(companies)
        setSupportedCompanies(companies);
      }
    } catch (error) {
      console.log(error)
      // Optionally handle error (e.g., show alert or log)
      // console.error('Failed to fetch supported companies:', error);
    }
  };

  React.useEffect(() => {
    fetchSupportedCompanies();
  }, []);

  const isApprovedCompany = (inputOrg: string): boolean => {
    const lowerInput = inputOrg.toLowerCase().trim();
    return supportedCompanies.some(company => 
      lowerInput.includes(company)
    );
  };


  const handleContinue = () => {
    if (organization.trim().length < 2) {
      Alert.alert('Error', 'Please enter a valid organization name');
      return;
    }
    
    const isApproved = isApprovedCompany(organization);
    
    if (isApproved) {
      // Navigate to Welcome screen with organization data
      navigation.navigate('Signup', { organization: organization.trim() });
      //navigation.navigate('Welcome', { organization: organization.trim() });
    } else {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      
      // Hide login option after first failed attempt
      if (newFailedAttempts === 1) {
        setShowLoginOption(false);
      }
      
      // Show login option again after 3 failed attempts
      if (newFailedAttempts >= 3) {
        setShowLoginOption(true);
      }
      
      Alert.alert(
        'Organization Not Found', 
        `We couldn't find "${organization}" in our approved organizations list. Please check the spelling or contact support.${newFailedAttempts >= 3 ? '\n\nYou can now sign in if you already have an account.' : ''}`
      );
    }
  };

  const handleSkipToLogin = () => {
    // Navigate directly to Login for existing users
    navigation.navigate('Login');
  };

  return (
    <View style={tw`flex-1 bg-white relative`}>
      <Layout >
      {/* <Layout header headerBackFunc={() => navigation.navigate('OnBoard')}> */}
        <KeyboardAvoidingView 
          style={tw`flex-1`}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <RNScrollView contentContainerStyle={tw`flex-1`}>
            <View style={tw`flex-1 px-1`}>
              {/* Header Section */}
              <View style={tw`mt-8 mb-8`}>
                <RNText size="lg" font="outfitmedium" style={tw`mb-2`}>
                  Enter Your Organization
                </RNText>
                <RNText theme="secondary" size="sm">
                  Help us personalize your experience by entering your organization name
                </RNText>
              </View>

              {/* Input Section */}
              <View style={tw`flex-1`}>
                <RNTinput
                  label="Organization Name"
                  placeholder="e.g. Dangote, FBN, GTBank"
                  value={organization}
                  onChangeText={setOrganization}
                  autoCapitalize="words"
                  style={tw`mb-4`}
                />

                {/* Info Section */}
                <View style={tw`bg-blue-50 p-4 rounded-lg mb-6`}>
                  <RNText size="sm" theme="secondary">
                    💡 This helps us customize features and connect you with colleagues from your organization
                  </RNText>
                </View>

                {/* Failed attempts indicator */}
                {failedAttempts > 0 && failedAttempts < 3 && (
                  <View style={tw`bg-red-50 p-3 rounded-lg mb-4 border-l-4 border-red-400`}>
                    <RNText size="sm" theme="secondary">
                      ⚠️ Please contact support at support@memonies.app for assistance
                    </RNText>
                  </View>
                )}
              </View>

              {/* Buttons Section */}
              <View style={tw`mb-[${responsiveScreenHeight(4)}]`}>
                <RNButton
                  title="Continue"
                  onPress={handleContinue}
                  disable={isDisabled}
                  style={tw`mb-4`}
                />
                
                {showLoginOption && (
                  <View style={tw`flex flex-row items-center justify-center`}>
                    <RNText theme="secondary" size="sm" style={tw`mr-1`}>
                      Already have an account?
                    </RNText>
                    <RNButton
                      title="Sign in"
                      naked
                      nakedTextColor="primary"
                      onPress={handleSkipToLogin}
                      textStyle={tw`underline`}
                    />
                  </View>
                )}
              </View>
            </View>
          </RNScrollView>
        </KeyboardAvoidingView>
      </Layout>
    </View>
  );
};

export default OrganizationInput; 