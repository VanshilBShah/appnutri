import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { Colors, Fonts, Radius, Spacing } from './theme';

export function Card({ children, style, testID }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; testID?: string }) {
  return <View testID={testID} style={[styles.card, style]}>{children}</View>;
}

export function Overline({ children, color, style }: { children: React.ReactNode; color?: string; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.overline, { color: color || Colors.secondary }, style]}>{children}</Text>;
}

export function SectionTitle({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.sectionTitle, style]}>{children}</Text>;
}

export function Progress({ value, color, track }: { value: number; color?: string; track?: string }) {
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <View style={[styles.track, { backgroundColor: track || Colors.border }]}>
      <View style={[styles.fill, { width: `${clamped * 100}%`, backgroundColor: color || Colors.primary }]} />
    </View>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

export function Pill({ label, tone = 'default' }: { label: string; tone?: 'default' | 'dark' | 'muted' }) {
  const colors = tone === 'dark'
    ? { bg: Colors.primary, fg: Colors.onPrimary }
    : tone === 'muted'
    ? { bg: Colors.accent, fg: Colors.textMuted }
    : { bg: Colors.secondaryMuted, fg: Colors.primary };
  return (
    <View style={[styles.pill, { backgroundColor: colors.bg }]}>
      <Text style={[styles.pillText, { color: colors.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.l,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  overline: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  track: { height: 6, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.m },
  pill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.pill, alignSelf: 'flex-start' },
  pillText: { fontFamily: Fonts.semibold, fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase' },
});
