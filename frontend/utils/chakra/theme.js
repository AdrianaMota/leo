import { extendTheme } from '@chakra-ui/react';

import components from './components';

const defaultTheme = extendTheme({
  fontSizes: {
    xxxl: '10rem',
    xxl: '7.5rem',
    xl: '5rem',
    l: '3rem',
    m: '2rem',
    s: '1rem',
  },
  colors: {
    background: {
      default: '#333333',
      50: '#A6A6A6',
      100: '#999999',
      200: '#808080',
      300: '#666666',
      400: '#4D4D4D',
      500: '#333333',
      600: '#1A1A1A',
      700: '#000000',
      800: '#000000',
      900: '#000000',
    },
    primaryBlue: {
      default: '#037F8C',
      50: '#78F0FC',
      100: '#5FEDFC',
      200: '#2DE7FB',
      300: '#05DAF0',
      400: '#04ACBE',
      500: '#037F8C',
      600: '#02525A',
      700: '#012428',
      800: '#000000',
      900: '#000000',
    },
    blue: {
      default: '#03A6A6',
      50: '#91FDFD',
      100: '#78FDFD',
      200: '#46FCFC',
      300: '#14FBFB',
      400: '#04D8D8',
      500: '#03A6A6',
      600: '#027474',
      700: '#014242',
      800: '#001010',
      900: '#000000',
    },
    primaryYellow: {
      default: '#F2D544',
      50: '#FFFFFF',
      100: '#FFFFFF',
      200: '#FCF5D3',
      300: '#F9EAA3',
      400: '#F5E074',
      500: '#F2D544',
      600: '#EFCA14',
      700: '#C2A40E',
      800: '#937C0A',
      900: '#635407',
    },
    yellow: {
      default: '#D9A918',
      50: '#FBF3DB',
      100: '#F9ECC4',
      200: '#F3DC97',
      300: '#EECD69',
      400: '#E9BE3B',
      500: '#D9A918',
      600: '#AB8513',
      700: '#7D610E',
      800: '#4F3E09',
      900: '#211A04',
    },
    lightGray: {
      default: '#D9D8D7',
      50: '#FFFFFF',
      100: '#FFFFFF',
      200: '#FFFFFF',
      300: '#FFFFFF',
      400: '#F2F2F1',
      500: '#D9D8D7',
      600: '#C0BFBD',
      700: '#A7A5A3',
      800: '#8E8B89',
      900: '#75726F',
    },
  },
  fonts: {
    main:
      "'Poppins', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    heading: "'Merriweather', serif",
  },
  styles: {
    global: {
      html: {
        fontSize: '10px',
      },
      body: {
        fontSize: 's',
        fontWeight: '400',
      },
      'html, body': {
        fontFamily: 'main',
        bg: 'background.500',
        color: 'white',
      },
    },
  },
  components,
});

export default defaultTheme;
