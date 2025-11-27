import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';

// Dates
export const dateFormat = (str: string) => {
    return new Date(str).toUTCString().slice(0, 16)
}

// Misc
export const toSentenceCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatAmount(number: string | number) {
    const formattedValue = parseFloat(`${number}`).toFixed(2)
    return formattedValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}


export function generateUUID() {
    let dt = new Date().getTime()
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
    return uuid
}

export const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

export function getTransactionStatusTextColor(text: string) {
    if (text === 'pending') {
        return 'text-[#FFA500]';
    } else if (text === 'failed') {
        return 'text-[#FF3A44]';
    } else if (text === 'successful') {
        return 'text-[#0D8436]';
    } else {
        return 'text-[#8D8D8D]';
    }
}

export const copyToClipboard = async (string: string) => {
    try {
        await Clipboard.setString(string);
        Alert.alert('Copied to clipboard');
    } catch (error) {
        Alert.alert('Error copying to clipboard');
    }
};
export function formatDate(txt: string) {
    const date = new Date(txt);
    const options:Intl.DateTimeFormatOptions  = {
        year: "numeric",
        month: "2-digit",
        day: "numeric",
    };
    const humanReadableDate:string = new Intl.DateTimeFormat("en-GB", options).format(date);
    return humanReadableDate;
}

export function formatDateLong(txt: string) {
    const date = new Date(txt);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }
    const options:Intl.DateTimeFormatOptions|any  = {
        year: "numeric",
        month: "short",
        day: "2-digit",
    };
    const humanReadableDate:string = new Intl.DateTimeFormat("en-GB", options).format(date);
    return humanReadableDate;
}

export function generateCreditLimitLabels(creditLimit:number) {
    const labels = [];
    const step = 100000; // Step of ₦100k
  
    for (let i = 0; i <= creditLimit; i += step) {
      if (i >= 1000000) {
        labels.push(`₦${(i / 1000000).toFixed(1)}M`); // Format millions with 'M'
      } else {
        labels.push(`₦${i / 1000}k`); // Format thousands with 'k'
      }
    }
  
    return labels;
  }

export function getPayoutStatusBgColor(text: string) {
    if (text === "APPROVED") {
      return "bg-[#04CA5820]";
    } else if (text === "PENDING") {
      return "bg-[#FFA50020]";
    } else if (text === "COMPLETED") {
      return "bg-[#1D518A20]";
    } else {
      return "bg-[#FF3A4420]";
    }
  }

export function getPayoutStatusTextColor(text: string) {
    if (text === "APPROVED") {
      return "text-[#0D8436]";
    } else if (text === "PENDING") {
      return "text-[#FF9C00]";
    } else if (text === "COMPLETED") {
      return "text-[#1D518A]";
    } else {
      return "text-[#FF3A44]";
    }
  }

export function getPayoutStatusBorderColor(text: string) {
    if (text === "APPROVED") {
      return "border-[#0D843660]";
    } else if (text === "PENDING") {
      return "border-[#FF9C0060]";
    } else if (text === "COMPLETED") {
      return "border-[#1D518A60]";
    } else {
      return "border-[#FF3A4460]";
    }
  }