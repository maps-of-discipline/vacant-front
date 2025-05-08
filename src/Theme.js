import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const ThemePreset = definePreset(Aura, {
  semantic: {
    primary: {
      0: '{blue.0}',
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
    colorScheme: {
      light: {
        surface: {
          50: '{gray.50}',
          100: '{gray.100}',
          200: '{gray.200}',
          300: '{gray.300}',
          400: '{gray.400}',
          500: '{gray.500}',
          600: '{gray.600}',
          700: '{gray.700}',
          800: '{gray.800}',
          900: '{gray.900}',
          950: '{gray.950}',
        },
      },
      dark: {
        surface: {
          50: '#ffffff',
          100: '#ffffff',
          200: '#f8f9fa',
          300: '#c8c8c8',
          400: '#afafaf',
          500: '#969696',
          600: '#7d7d7d',
          700: '#464646',
          800: '#323232',
          900: '#1e1e1e',
          950: '#141414',
        },
      },
    },
  },
});

export default ThemePreset;
