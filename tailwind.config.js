const { colors } = require('@/theme/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
      extend: {
          colors: {
              primary: colors.primary,
              primary2: colors.primary2,
              black: colors.black,
              danger: colors.danger,
              secondary: colors.secondary,
              secondary10: colors.secondary10,
              secondary100: colors.secondary100,
              primary01: colors.primary01,
              success: colors.success,
          },
          screens: {
              xs: '280px',
              sm: '380px',
              md: '420px',
              lg: '680px',
              tab: '1024px'
          },
          padding: {
              xs: '5px',
              sm: '8px',
              md: '16px',
              lg: '24px',
              xl: '48px'
          },
          fontSize: {
              xs: '12px',
              sm: '14px',
              base: '0.95rem',
              md: '1.1rem',
              lg: '1.125rem',
              xl: '1.25rem',
              '2xl': '1.5rem',
              '3xl': '2.2rem'
          },
          textColor: {
            primary: colors.primary,
            black: colors.black,
            danger: colors.danger,
            secondary: colors.secondary,
            secondary10: colors.secondary10,
            secondary100: colors.secondary100,
            primary01: colors.primary01,
            success: colors.success,
          },
          backgroundColor: (theme) => ({
              ...theme('colors'),
              primary: colors.primary,
              white: colors.white,
              black: colors.black,
              grey: colors.grey,
              danger: colors.danger,
              secondary: colors.secondary,
              secondary10: colors.secondary10,
              secondary100: colors.secondary100,
              primary01: colors.primary01,
              success: colors.success,

              graylight: '#F8F8FB',
              backdrop: '#8c8c8c70',
              socialbutton: '#F9F8FC',
              lightButton: '#F5F4F9'
          }),
          borderColor: (theme) => ({
              ...theme('colors'),
              default: theme('colors.gray-light', 'currentColor'),
              white: '#ffffff',
              primary: colors.primary,
              black: colors.black,
              secondary: colors.secondary,
              secondary10: colors.secondary10,
              secondary100: colors.secondary100,
              primary01: colors.primary01,
              success: colors.success,

              graylight: '#F8F8FB',
              graylighter: '#CCCCCC80',
              graymid: '#CCCCCC',
              grey200: '#7B828E'
          }),
          borderRadius: {
              none: '0',
              sm: '0.375rem',
              base: '9px',
              md: '0.5rem',
              lg: '1rem',
              xl: '1.5rem',
              full: '9999px'
          }
      }
  },
  plugins: []
}
