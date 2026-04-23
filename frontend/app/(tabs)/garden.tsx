import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing } from '../../src/theme';
import { Label, Divider, Progress } from '../../src/ui';
import { api, Stats } from '../../src/api';

const LEVELS = [
  { level: 1, name: 'SEED',       desc: 'origin' },
  { level: 2, name: 'SPROUT',     desc: 'awakened' },
  { level: 3, name: 'SAPLING',    desc: 'ascending' },
  { level: 4, name: 'YOUNG TREE', desc: 'rooted' },
  { level: 5, name: 'GROVE',      desc: 'ecosystem' },
];

export default function Garden() {
  const [stats, setStats] = useState<Stats | null>(null);

  const load = useCallback(async () => { try { setStats(await api.stats()); } catch {} }, []);
  useEffect(() => { load(); }, [load]);

  const dissolve = async () => {
    try { const r = await api.dissolve('m1', 'Soil'); setStats(r.stats); } catch {}
  };

  const level = stats?.garden_level ?? 1;
  const progress = stats?.garden_progress ?? 0;
  const current = LEVELS.find(l => l.level === level) ?? LEVELS[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']} testID="garden-screen">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Label>02 · Eco-Garden</Label>
          <Text style={styles.title}>Living{'\n'}record.</Text>
        </View>

        <Divider />

        {/* Pulse visualization */}
        <View style={styles.pulseWrap} testID="plant-hero">
          <View style={[styles.ring, styles.ring3]} />
          <View style={[styles.ring, styles.ring2]} />
          <View style={[styles.ring, styles.ring1]} />
          <View style={styles.core}>
            <Ionicons name="leaf" size={32} color={Colors.primary} />
          </View>
          <View style={styles.pulseLabel}>
            <Text style={styles.levelText}>LV{level}</Text>
            <Text style={styles.levelName}>{current.name}</Text>
            <Text style={styles.levelDesc}>// {current.desc}</Text>
          </View>
        </View>

        <Divider />

        {/* Progress */}
        <View style={styles.progressBlock} testID="garden-progress">
          <View style={styles.progressRow}>
            <Label>Next stage</Label>
            <Text style={styles.progressPct}>{String(Math.round(progress * 100)).padStart(2, '0')}%</Text>
          </View>
          <View style={{ marginTop: 12 }}>
            <Progress value={progress} />
          </View>
          <Text style={styles.progressSub}>
            {Math.round((1 - progress) * 7) + 1} more dissolves to {LEVELS[Math.min(level, LEVELS.length - 1)]?.name}
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.cta} onPress={dissolve} testID="log-dissolve-btn">
          <View style={styles.ctaInner}>
            <Ionicons name="add" size={16} color={Colors.onPrimary} />
            <Text style={styles.ctaText}>LOG DISSOLVE</Text>
          </View>
        </TouchableOpacity>

        <Divider />

        {/* Ladder */}
        <View style={styles.sectionHead}>
          <Label>Growth stages</Label>
          <Text style={styles.count}>[ {level}/5 ]</Text>
        </View>

        <View>
          {LEVELS.map((l, idx) => {
            const unlocked = level >= l.level;
            const isCurrent = level === l.level;
            return (
              <View key={l.level} style={[styles.stageRow, idx < LEVELS.length - 1 && styles.stageBorder]} testID={`stage-${l.level}`}>
                <Text style={[styles.stageIndex, !unlocked && { color: Colors.textSubtle }]}>{String(l.level).padStart(2, '0')}</Text>
                <View style={styles.stageLine}>
                  <View style={[styles.stageDot, unlocked && styles.stageDotOn]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.stageName, !unlocked && { color: Colors.textSubtle }]}>{l.name}</Text>
                  <Text style={styles.stageDesc}>// {l.desc}</Text>
                </View>
                {isCurrent && (
                  <View style={styles.nowTag}>
                    <View style={styles.nowDot} />
                    <Text style={styles.nowText}>NOW</Text>
                  </View>
                )}
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
  scroll: { paddingHorizontal: Spacing.l, paddingBottom: Spacing.xxl },
  headerRow: { paddingVertical: Spacing.l, gap: 12 },
  title: { fontFamily: Fonts.thin, fontSize: 40, color: Colors.text, letterSpacing: -1.2, lineHeight: 44, marginTop: 8 },

  pulseWrap: { height: 300, alignItems: 'center', justifyContent: 'center', marginVertical: Spacing.l },
  ring: { position: 'absolute', borderRadius: 9999, borderWidth: StyleSheet.hairlineWidth, borderColor: Colors.primaryDim },
  ring1: { width: 120, height: 120 },
  ring2: { width: 180, height: 180, borderColor: Colors.border },
  ring3: { width: 240, height: 240, borderColor: Colors.hairline },
  core: { width: 70, height: 70, borderRadius: 35, borderWidth: 1, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surface },
  pulseLabel: { position: 'absolute', bottom: 0, alignItems: 'center', gap: 2 },
  levelText: { fontFamily: Fonts.thin, fontSize: 34, color: Colors.primary, letterSpacing: -1 },
  levelName: { fontFamily: Fonts.semibold, fontSize: 11, letterSpacing: 3, color: Colors.text },
  levelDesc: { fontFamily: Fonts.regular, fontSize: 10, color: Colors.textMuted, letterSpacing: 0.5 },

  progressBlock: { paddingVertical: Spacing.l },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  progressPct: { fontFamily: Fonts.thin, fontSize: 32, color: Colors.text, letterSpacing: -1 },
  progressSub: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.textMuted, marginTop: 10 },

  cta: { marginVertical: Spacing.m, borderWidth: 1, borderColor: Colors.primary, borderRadius: Radius.pill, overflow: 'hidden' },
  ctaInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, backgroundColor: Colors.primary },
  ctaText: { fontFamily: Fonts.bold, fontSize: 11, color: Colors.onPrimary, letterSpacing: 2.5 },

  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.l, paddingBottom: Spacing.s },
  count: { fontFamily: Fonts.regular, fontSize: 10, color: Colors.textSubtle, letterSpacing: 1 },

  stageRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 16 },
  stageBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  stageIndex: { fontFamily: Fonts.regular, fontSize: 10, color: Colors.text, letterSpacing: 1, width: 24 },
  stageLine: { width: 12, alignItems: 'center' },
  stageDot: { width: 6, height: 6, borderRadius: 4, backgroundColor: Colors.border },
  stageDotOn: { backgroundColor: Colors.primary },
  stageName: { fontFamily: Fonts.medium, fontSize: 13, color: Colors.text, letterSpacing: 1 },
  stageDesc: { fontFamily: Fonts.regular, fontSize: 10, color: Colors.textSubtle, letterSpacing: 0.3, marginTop: 2 },
  nowTag: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: Colors.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.pill },
  nowDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary },
  nowText: { fontFamily: Fonts.bold, fontSize: 9, color: Colors.primary, letterSpacing: 1.5 },
});
