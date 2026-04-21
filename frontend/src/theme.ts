export const Colors = {
  // Brand
  primary: '#1E4A2F',
  primaryHover: '#173A24',
  secondary: '#5F7F4D',
  secondaryMuted: '#E8EEE3',

  // Backgrounds
  background: '#F9F8F6',
  card: '#FFFFFF',
  accent: '#F0EFEA',

  // Text
  text: '#222222',
  textMuted: '#5C5C5C',
  textSubtle: '#8A8A85',

  // Border
  border: '#E5E4E0',
  borderStrong: '#D4D3CD',

  // Status
  success: '#5F7F4D',
  warning: '#E8B042',
  error: '#D9534F',

  // On-brand whites
  onPrimary: '#FFFFFF',
  overlay: 'rgba(30, 74, 47, 0.08)',
};

export const Radius = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
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
  regular: 'Montserrat_400Regular',
  medium: 'Montserrat_500Medium',
  semibold: 'Montserrat_600SemiBold',
  bold: 'Montserrat_700Bold',
  black: 'Montserrat_900Black',
};

export const Shadow = {
  card: {
    shadowColor: '#1E4A2F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
};

export const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';
