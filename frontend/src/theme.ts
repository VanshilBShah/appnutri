export const Colors = {
  // Brand → futuristic roles
  primary: '#B8E4A1',        // sprout glow (bright accent for data)
  secondary: '#5F7F4D',      // seaweed (mid accent)
  primaryDim: '#3A5C28',     // dimmed accent for borders/tracks

  // Surfaces
  background: '#0A0D0B',     // deep near-black forest
  surface: '#10140F',        // card
  surfaceRaised: '#161B15',  // elevated card
  overlay: 'rgba(184, 228, 161, 0.06)',

  // Text
  text: '#EAEEE8',
  textMuted: '#8A948A',
  textSubtle: '#5A645B',

  // Border
  border: '#1D231C',
  borderStrong: '#2A3128',
  hairline: '#141813',

  // Status
  success: '#B8E4A1',
  warning: '#E8B042',
  error: '#E07E6A',

  onPrimary: '#0A0D0B',
  card: '#10140F',
  accent: '#161B15',
  secondaryMuted: '#1A2217',
};

export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 22,
  pill: 999,
};

export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const Fonts = {
  thin: 'Montserrat_100Thin',
  extraLight: 'Montserrat_200ExtraLight',
  light: 'Montserrat_300Light',
  regular: 'Montserrat_400Regular',
  medium: 'Montserrat_500Medium',
  semibold: 'Montserrat_600SemiBold',
  bold: 'Montserrat_700Bold',
  black: 'Montserrat_900Black',
};

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 4,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 1,
  },
};

export const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

export const LOGO = 'https://customer-assets.emergentagent.com/job_palette-craft-8/artifacts/nkc64vpr_Nutriloop%20Logo.png';
