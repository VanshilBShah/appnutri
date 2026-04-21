import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing, Shadow } from '../../src/theme';
import { Card, Overline, SectionTitle, Progress } from '../../src/ui';
import { api, Stats, Activity } from '../../src/api';

const LOGO = 'https://customer-assets.emergentagent.com/job_palette-craft-8/artifacts/nkc64vpr_Nutriloop%20Logo.png';

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [s, a] = await Promise.all([api.stats(), api.activities()]);
      setStats(s);
      setActivities(a);
    } catch (e) {
      console.warn('load home failed', e);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

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
            <Image source={{ uri: LOGO }} style={styles.logoImg} />
            <Text style={styles.brandName}>NutriLoop</Text>
          </View>
          <TouchableOpacity style={styles.bell} testID="home-notifications">
            <Ionicons name="notifications-outline" size={20} color={Colors.text} />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Overline>Good morning</Overline>
            <Text style={styles.hello} testID="home-greeting">Hello, Vans</Text>
          </View>
        </View>

        {/* Hero impact card */}
        <View style={styles.hero} testID="impact-hero">
          <Overline color="rgba(255,255,255,0.75)">Your regenerative impact</Overline>
          <View style={styles.heroRow}>
            <Text style={styles.heroValue}>{stats?.packages_dissolved ?? 0}</Text>
            <Text style={styles.heroUnit}>packages{'\n'}dissolved</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroStatsRow}>
            <HeroStat label="CO₂ saved" value={`${stats?.co2_saved_kg ?? 0} kg`} />
            <HeroStat label="Water" value={`${stats?.water_saved_l ?? 0} L`} />
            <HeroStat label="Soil fed" value={`${stats?.soil_enriched_g ?? 0} g`} />
          </View>
        </View>

        {/* Bento metrics */}
        <View style={styles.bento}>
          <Card style={styles.bentoCard} testID="metric-streak">
            <View style={styles.bentoIconWrap}>
              <Ionicons name="flame" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.bentoValue}>{stats?.streak_days ?? 0}</Text>
            <Text style={styles.bentoLabel}>day streak</Text>
          </Card>
          <Card style={styles.bentoCard} testID="metric-garden-level">
            <View style={styles.bentoIconWrap}>
              <Ionicons name="leaf" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.bentoValue}>Lv. {stats?.garden_level ?? 1}</Text>
            <Text style={styles.bentoLabel}>eco-garden</Text>
            <View style={{ marginTop: 10 }}>
              <Progress value={stats?.garden_progress ?? 0} />
            </View>
          </Card>
        </View>

        {/* Activities */}
        <View style={styles.activitiesHeader}>
          <SectionTitle>Recent activity</SectionTitle>
          <Text style={styles.link}>See all</Text>
        </View>

        <Card style={styles.activityList} testID="activity-list">
          {activities.length === 0 ? (
            <Text style={styles.empty}>Your first dissolve is coming soon.</Text>
          ) : (
            activities.slice(0, 5).map((a, idx) => (
              <View key={a.id}>
                <View style={styles.activityRow}>
                  <View style={styles.activityIcon}>
                    <Ionicons name={iconFor(a.icon)} size={16} color={Colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.activityTitle}>{a.title}</Text>
                    <Text style={styles.activitySub}>{a.subtitle} • {a.timestamp}</Text>
                  </View>
                  <Text style={styles.activityImpact}>{a.impact_label}</Text>
                </View>
                {idx < activities.slice(0, 5).length - 1 && <View style={styles.activityDivider} />}
              </View>
            ))
          )}
        </Card>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.heroStatValue}>{value}</Text>
      <Text style={styles.heroStatLabel}>{label}</Text>
    </View>
  );
}

function iconFor(name: string): any {
  switch (name) {
    case 'leaf': return 'leaf-outline';
    case 'water': return 'water-outline';
    case 'book': return 'book-outline';
    case 'star': return 'star-outline';
    default: return 'ellipse-outline';
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.l, paddingBottom: Spacing.xxl },
  brandBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.m },
  brandLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoImg: { width: 28, height: 28, resizeMode: 'contain' },
  brandName: { fontFamily: Fonts.semibold, fontSize: 15, color: Colors.primary, letterSpacing: -0.2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: Spacing.xl, marginBottom: Spacing.l },
  hello: { fontFamily: Fonts.bold, fontSize: 28, color: Colors.text, letterSpacing: -0.6, marginTop: 4 },
  bell: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  dot: { position: 'absolute', top: 11, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.warning, borderWidth: 2, borderColor: Colors.card },

  hero: { backgroundColor: Colors.primary, borderRadius: Radius.xl, padding: Spacing.l, ...Shadow.card },
  heroRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: Spacing.s },
  heroValue: { fontFamily: Fonts.black, fontSize: 72, color: Colors.onPrimary, letterSpacing: -2, lineHeight: 76 },
  heroUnit: { fontFamily: Fonts.medium, fontSize: 13, color: 'rgba(255,255,255,0.8)', marginLeft: 12, marginBottom: 12, lineHeight: 16 },
  heroDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: Spacing.m },
  heroStatsRow: { flexDirection: 'row', gap: Spacing.m },
  heroStatValue: { fontFamily: Fonts.semibold, fontSize: 16, color: Colors.onPrimary, letterSpacing: -0.3 },
  heroStatLabel: { fontFamily: Fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.3, marginTop: 2 },

  bento: { flexDirection: 'row', gap: Spacing.m, marginTop: Spacing.m },
  bentoCard: { flex: 1, padding: Spacing.m },
  bentoIconWrap: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.secondaryMuted, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  bentoValue: { fontFamily: Fonts.bold, fontSize: 22, color: Colors.text, letterSpacing: -0.5 },
  bentoLabel: { fontFamily: Fonts.medium, fontSize: 12, color: Colors.textMuted, marginTop: 2 },

  activitiesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: Spacing.xl, marginBottom: Spacing.m },
  link: { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.secondary },

  activityList: { padding: 0 },
  activityRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.m },
  activityIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.secondaryMuted, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  activityTitle: { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.text },
  activitySub: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  activityImpact: { fontFamily: Fonts.bold, fontSize: 12, color: Colors.primary },
  activityDivider: { height: 1, backgroundColor: Colors.border, marginLeft: Spacing.l + 36 },
  empty: { padding: Spacing.l, textAlign: 'center', fontFamily: Fonts.medium, color: Colors.textMuted },
});
