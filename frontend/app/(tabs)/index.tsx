import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing, LOGO } from '../../src/theme';
import { Label, Divider, Progress, Brackets } from '../../src/ui';
import { api, Stats, Activity } from '../../src/api';

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [time, setTime] = useState(fmtTime());

  const load = useCallback(async () => {
    try {
      const [s, a] = await Promise.all([api.stats(), api.activities()]);
      setStats(s); setActivities(a);
    } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const t = setInterval(() => setTime(fmtTime()), 30_000);
    return () => clearInterval(t);
  }, []);

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  return (
    <SafeAreaView style={styles.safe} edges={['top']} testID="home-screen">
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Brand bar */}
        <View style={styles.brandBar} testID="brand-bar">
          <View style={styles.brandLeft}>
            <Image source={{ uri: LOGO }} style={styles.logo} />
            <Text style={styles.brand}>NUTRILOOP</Text>
          </View>
          <Text style={styles.time}>{time}</Text>
        </View>

        <Divider />

        {/* Greeting */}
        <View style={styles.greetBlock}>
          <Label>Operator</Label>
          <Text style={styles.greet} testID="home-greeting">Hello, Vans</Text>
        </View>

        {/* Hero metric */}
        <View style={styles.heroWrap}>
          <Label>Packages dissolved · all-time</Label>
          <View style={styles.heroRow}>
            <Text style={styles.heroValue}>
              {String(stats?.packages_dissolved ?? 0).padStart(3, '0')}
            </Text>
            <View style={styles.heroMeta}>
              <View style={styles.dot} />
              <Text style={styles.heroMetaText}>LIVE</Text>
            </View>
          </View>
          <View style={styles.heroFooter}>
            <Text style={styles.heroFooterText}>
              Regenerative index trending <Text style={{ color: Colors.primary }}>+12%</Text> this cycle.
            </Text>
          </View>
        </View>

        <Divider />

        {/* Stats grid */}
        <View style={styles.grid}>
          <Stat label="CO₂ OFFSET" value={`${stats?.co2_saved_kg ?? 0}`} unit="kg" testID="metric-co2" />
          <View style={styles.vdivider} />
          <Stat label="WATER" value={`${stats?.water_saved_l ?? 0}`} unit="L" testID="metric-water" />
          <View style={styles.vdivider} />
          <Stat label="SOIL FED" value={`${stats?.soil_enriched_g ?? 0}`} unit="g" testID="metric-soil" />
        </View>

        <Divider />

        {/* Streak + Garden */}
        <View style={styles.row}>
          <View style={styles.halfCard} testID="metric-streak">
            <Label>Streak</Label>
            <Text style={styles.halfValue}>{stats?.streak_days ?? 0}<Text style={styles.halfUnit}> d</Text></Text>
            <View style={styles.streakBars}>
              {Array.from({ length: 7 }).map((_, i) => (
                <View key={i} style={[styles.streakBar, i < (stats?.streak_days ?? 0) && styles.streakBarOn]} />
              ))}
            </View>
          </View>
          <View style={styles.vdividerTall} />
          <View style={styles.halfCard} testID="metric-garden-level">
            <Label>Garden</Label>
            <Text style={styles.halfValue}>LV {stats?.garden_level ?? 1}</Text>
            <View style={{ marginTop: 16 }}>
              <Progress value={stats?.garden_progress ?? 0} />
              <Text style={styles.progressText}>
                {Math.round((stats?.garden_progress ?? 0) * 100)}% to next
              </Text>
            </View>
          </View>
        </View>

        <Divider />

        {/* Activity */}
        <View style={styles.sectionHead}>
          <Label>Recent activity</Label>
          <Text style={styles.count}>[ {activities.length} ]</Text>
        </View>

        <View style={styles.activityList} testID="activity-list">
          {activities.slice(0, 5).map((a, idx) => (
            <View key={a.id} style={[styles.activityRow, idx < 4 && styles.activityBorder]}>
              <View style={styles.activityLeft}>
                <View style={styles.activityDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityTitle}>{a.title}</Text>
                  <Text style={styles.activitySub}>{a.subtitle}</Text>
                </View>
              </View>
              <View style={styles.activityRight}>
                <Text style={styles.activityTime}>{a.timestamp.split(',')[0]}</Text>
                <Text style={styles.activityImpact}>{a.impact_label}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, unit, testID }: { label: string; value: string; unit: string; testID?: string }) {
  return (
    <View style={styles.statCol} testID={testID}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}<Text style={styles.statUnit}> {unit}</Text></Text>
    </View>
  );
}

function fmtTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.l, paddingBottom: Spacing.xxl },

  brandBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.m },
  brandLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 22, height: 22, resizeMode: 'contain' },
  brand: { fontFamily: Fonts.semibold, fontSize: 11, letterSpacing: 3, color: Colors.text },
  time: { fontFamily: Fonts.medium, fontSize: 11, color: Colors.textMuted, letterSpacing: 1 },

  greetBlock: { paddingVertical: Spacing.l, gap: 10 },
  greet: { fontFamily: Fonts.thin, fontSize: 40, color: Colors.text, letterSpacing: -1.2, lineHeight: 44 },

  heroWrap: { paddingVertical: Spacing.l, gap: 12 },
  heroRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  heroValue: { fontFamily: Fonts.thin, fontSize: 110, color: Colors.primary, letterSpacing: -6, lineHeight: 110 },
  heroMeta: { alignItems: 'flex-end', gap: 6, paddingBottom: 14 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  heroMetaText: { fontFamily: Fonts.semibold, fontSize: 9, letterSpacing: 2, color: Colors.primary },
  heroFooter: { marginTop: 4 },
  heroFooterText: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.textMuted, lineHeight: 18 },

  grid: { flexDirection: 'row', paddingVertical: Spacing.l, alignItems: 'center' },
  statCol: { flex: 1, gap: 8 },
  statLabel: { fontFamily: Fonts.semibold, fontSize: 9, letterSpacing: 1.5, color: Colors.textSubtle },
  statValue: { fontFamily: Fonts.light, fontSize: 22, color: Colors.text, letterSpacing: -0.5 },
  statUnit: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.textMuted, letterSpacing: 0 },
  vdivider: { width: StyleSheet.hairlineWidth, backgroundColor: Colors.border, height: 36, marginHorizontal: Spacing.m },

  row: { flexDirection: 'row', paddingVertical: Spacing.l },
  halfCard: { flex: 1, gap: 10 },
  halfValue: { fontFamily: Fonts.light, fontSize: 30, color: Colors.text, letterSpacing: -0.8 },
  halfUnit: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.textMuted },
  vdividerTall: { width: StyleSheet.hairlineWidth, backgroundColor: Colors.border, alignSelf: 'stretch', marginHorizontal: Spacing.l },
  streakBars: { flexDirection: 'row', gap: 4, marginTop: 8 },
  streakBar: { flex: 1, height: 3, borderRadius: 2, backgroundColor: Colors.border },
  streakBarOn: { backgroundColor: Colors.primary },
  progressText: { fontFamily: Fonts.regular, fontSize: 10, color: Colors.textMuted, marginTop: 8, letterSpacing: 0.5 },

  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.l, paddingBottom: Spacing.m },
  count: { fontFamily: Fonts.regular, fontSize: 10, color: Colors.textSubtle, letterSpacing: 1 },

  activityList: {},
  activityRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, justifyContent: 'space-between' },
  activityBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  activityLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  activityDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.secondary },
  activityTitle: { fontFamily: Fonts.medium, fontSize: 13, color: Colors.text, letterSpacing: -0.1 },
  activitySub: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.textMuted, marginTop: 3 },
  activityRight: { alignItems: 'flex-end', gap: 3 },
  activityTime: { fontFamily: Fonts.regular, fontSize: 10, color: Colors.textSubtle, letterSpacing: 0.3 },
  activityImpact: { fontFamily: Fonts.semibold, fontSize: 11, color: Colors.primary, letterSpacing: 0.3 },
});
