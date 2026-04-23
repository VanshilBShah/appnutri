import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { Colors, Fonts, Radius, Spacing } from './theme';

// Corner bracket frame — futuristic scanner/terminal feel
export function Brackets({ children, style, padding = 0, testID }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; padding?: number; testID?: string }) {
  return (
    <View testID={testID} style={[{ padding }, style]}>
      <View style={[styles.corner, styles.tl]} />
      <View style={[styles.corner, styles.tr]} />
      <View style={[styles.corner, styles.bl]} />
      <View style={[styles.corner, styles.br]} />
      {children}
    </View>
  );
}

export function Card({ children, style, testID }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; testID?: string }) {
  return <View testID={testID} style={[styles.card, style]}>{children}</View>;
}

export function Label({ children, color, style, testID }: { children: React.ReactNode; color?: string; style?: StyleProp<TextStyle>; testID?: string }) {
  return <Text testID={testID} style={[styles.label, color ? { color } : null, style]}>{children}</Text>;
}

export function Divider({ vertical }: { vertical?: boolean }) {
  return <View style={vertical ? styles.vdivider : styles.divider} />;
}

export function Progress({ value, color }: { value: number; color?: string }) {
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${clamped * 100}%`, backgroundColor: color || Colors.primary }]} />
    </View>
  );
}

export function Chip({ label, active, tone = 'default' }: { label: string; active?: boolean; tone?: 'default' | 'dim' }) {
  return (
    <View style={[styles.chip, active && styles.chipActive, tone === 'dim' && styles.chipDim]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.l,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  label: {
    fontFamily: Fonts.semibold,
    fontSize: 10,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.border },
  vdivider: { width: StyleSheet.hairlineWidth, backgroundColor: Colors.border, alignSelf: 'stretch' },
  track: { height: 2, borderRadius: 999, overflow: 'hidden', backgroundColor: Colors.border },
  fill: { height: '100%' },

  corner: { position: 'absolute', width: 14, height: 14, borderColor: Colors.primary },
  tl: { top: 0, left: 0, borderTopWidth: 1, borderLeftWidth: 1 },
  tr: { top: 0, right: 0, borderTopWidth: 1, borderRightWidth: 1 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 1, borderLeftWidth: 1 },
  br: { bottom: 0, right: 0, borderBottomWidth: 1, borderRightWidth: 1 },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
  chipDim: { opacity: 0.6 },
  chipActive: { borderColor: Colors.primary, backgroundColor: Colors.overlay },
  chipText: { fontFamily: Fonts.medium, fontSize: 11, color: Colors.textMuted, letterSpacing: 0.5 },
  chipTextActive: { color: Colors.primary },
});
