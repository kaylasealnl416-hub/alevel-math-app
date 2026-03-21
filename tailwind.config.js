/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Google Material palette
        primary: {
          50: '#e8f0fe',
          100: '#d2e3fc',
          200: '#aecbfa',
          300: '#8ab4f8',
          400: '#669df6',
          500: '#1a73e8',
          600: '#1967d2',
          700: '#185abc',
          800: '#174ea6',
          900: '#1a3664',
        },
        surface: {
          DEFAULT: '#ffffff',
          dim: '#f8f9fa',
          border: '#dadce0',
        },
        on: {
          surface: '#202124',
          'surface-variant': '#5f6368',
        },
        success: {
          50: '#e6f4ea',
          100: '#ceead6',
          300: '#81c995',
          500: '#188038',
          600: '#137333',
          700: '#0d652d',
        },
        warning: {
          50: '#fef7e0',
          100: '#feefc3',
          300: '#fdd663',
          500: '#f9ab00',
          600: '#e37400',
          700: '#b06000',
        },
        error: {
          50: '#fce8e6',
          100: '#fad2cf',
          200: '#f5bcba',
          500: '#d93025',
          600: '#c5221f',
          700: '#a50e0e',
        },
        info: {
          50: '#e8f0fe',
          100: '#d2e3fc',
          500: '#1a73e8',
          700: '#185abc',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'google': '8px',
        'google-lg': '16px',
      },
      boxShadow: {
        'google-sm': '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
        'google': '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
        'google-lg': '0 1px 3px 0 rgba(60,64,67,0.3), 0 8px 16px 4px rgba(60,64,67,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'fade-in-down': 'fadeInDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
