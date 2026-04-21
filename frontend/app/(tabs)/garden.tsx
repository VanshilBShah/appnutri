import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing, Shadow } from '../../src/theme';
import { Card, Overline, Progress } from '../../src/ui';
import { api, Stats } from '../../src/api';

const PLANT_IMAGE = 'https://images.pexels.com/photos/7944395/pexels-photo-7944395.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';

const LEVELS = [
  { level: 1, name: 'Seed',       desc: 'The beginning.' },
  { level: 2, name: 'Sprout',     desc: 'Small, but alive.' },
  { level: 3, name: 'Sapling',    desc: 'Reaching for light.' },
  { level: 4, name: 'Young Tree', desc: 'Roots going deep.' },
  { level: 5, name: 'Grove',      desc: 'An ecosystem of one.' },
];

export default function Garden() {
  const [stats, setStats] = useState<Stats | null>(null);

  const load = useCallback(async () => {
    try { setStats(await api.stats()); } catch (e) { /* noop */ }
  }, []);

  useEffect(() => { load(); }, [load]);

  const dissolve = async () => {
    try {
      const res = await api.dissolve('m1', 'Soil');
      setStats(res.stats);
    } catch (e) { /* noop */ }
  };

  const level = stats?.garden_level ?? 1;
  const levelInfo = LEVELS.find(l => l.level === level) ?? LEVELS[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']} testID="garden-screen">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Overline>Eco-Garden</Overline>
        <Text style={styles.title}>Your living{'\n'}record of repair.</Text>

        {/* Plant hero */}
        <View style={styles.plantCard} testID="plant-hero">
          <Image source={{ uri: PLANT_IMAGE }} style={styles.plantImage} />
          <View style={styles.plantOverlay}>
            <View style={styles.levelBadge}>
              <Ionicons name="leaf" size={12} color={Colors.primary} />
              <Text style={styles.levelBadgeText}>Level {level}</Text>
            </View>
            <Text style={styles.plantName}>{levelInfo.name}</Text>
            <Text style={styles.plantDesc}>{levelInfo.desc}</Text>
          </View>
        </View>

        {/* Progress to next */}
        <Card style={styles.progressCard} testID="garden-progress">
          <View style={styles.progressRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.progressLabel}>Progress to {LEVELS[Math.min(level, LEVELS.length - 1)]?.name}</Text>
              <Text style={styles.progressValue}>{Math.round((stats?.garden_progress ?? 0) * 100)}%</Text>
            </View>
            <View style={styles.progressIcon}>
              <Ionicons name="trending-up" size={18} color={Colors.primary} />
            </View>
          </View>
          <View style={{ marginTop: Spacing.m }}>
            <Progress value={stats?.garden_progress ?? 0} color={Colors.secondary} />
          </View>
        </Card>

        {/* Action */}
        <TouchableOpacity style={styles.primaryBtn} onPress={dissolve} testID="log-dissolve-btn">
          <Ionicons name="water" size={18} color={Colors.onPrimary} />
          <Text style={styles.primaryBtnText}>Log a dissolve</Text>
        </TouchableOpacity>

        {/* Level ladder */}
        <Text style={styles.sectionHead}>Growth stages</Text>
        <View style={{ gap: Spacing.s }}>
          {LEVELS.map(l => {
            const unlocked = level >= l.level;
            const current = level === l.level;
            return (
              <View key={l.level} style={[styles.levelRow, current && styles.levelRowCurrent]} testID={`stage-${l.level}`}>
                <View style={[styles.levelDot, unlocked && styles.levelDotUnlocked]}>
                  {unlocked ? (
                    <Ionicons name="checkmark" size={14} color={Colors.onPrimary} />
                  ) : (
                    <Text style={styles.levelDotText}>{l.level}</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.levelName, !unlocked && { color: Colors.textMuted }]}>{l.name}</Text>
                  <Text style={styles.levelDescText}>{l.desc}</Text>
                </View>
                {current && <View style={styles.nowPill}><Text style={styles.nowPillText}>NOW</Text></View>}
              </View>
            );
          })}
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.l, paddingTop: Spacing.m, paddingBottom: Spacing.xxl },
  title: { fontFamily: Fonts.bold, fontSize: 30, color: Colors.text, letterSpacing: -0.8, marginTop: 6, lineHeight: 34 },

  plantCard: { marginTop: Spacing.l, borderRadius: Radius.xl, overflow: 'hidden', backgroundColor: Colors.primary, ...Shadow.card },
  plantImage: { width: '100%', height: 280 },
  plantOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.l, backgroundColor: 'rgba(23,58,36,0.55)' },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: Colors.onPrimary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill },
  levelBadgeText: { fontFamily: Fonts.bold, fontSize: 10, letterSpacing: 0.8, color: Colors.primary },
  plantName: { fontFamily: Fonts.bold, fontSize: 26, color: Colors.onPrimary, letterSpacing: -0.5, marginTop: 8 },
  plantDesc: { fontFamily: Fonts.medium, fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 },

  progressCard: { marginTop: Spacing.m },
  progressRow: { flexDirection: 'row', alignItems: 'center' },
  progressLabel: { fontFamily: Fonts.medium, fontSize: 12, color: Colors.textMuted, letterSpacing: 0.3 },
  progressValue: { fontFamily: Fonts.bold, fontSize: 26, color: Colors.text, letterSpacing: -0.5, marginTop: 2 },
  progressIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.secondaryMuted, alignItems: 'center', justifyContent: 'center' },

  primaryBtn: { marginTop: Spacing.m, backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Radius.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...Shadow.card },
  primaryBtnText: { color: Colors.onPrimary, fontFamily: Fonts.semibold, fontSize: 14 },

  sectionHead: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.text, letterSpacing: -0.3, marginTop: Spacing.xl, marginBottom: Spacing.m },

  levelRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.m, backgroundColor: Colors.card, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, gap: 14 },
  levelRowCurrent: { borderColor: Colors.secondary, backgroundColor: Colors.secondaryMuted },
  levelDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' },
  levelDotUnlocked: { backgroundColor: Colors.primary },
  levelDotText: { fontFamily: Fonts.bold, fontSize: 13, color: Colors.textMuted },
  levelName: { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.text },
  levelDescText: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  nowPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill, backgroundColor: Colors.primary },
  nowPillText: { fontFamily: Fonts.bold, color: Colors.onPrimary, fontSize: 9, letterSpacing: 1 },
});
