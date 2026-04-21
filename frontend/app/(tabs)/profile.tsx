import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing, Shadow } from '../../src/theme';
import { Card, Overline, Progress, Pill } from '../../src/ui';
import { api, Profile as ProfileT, Challenge, Badge, Stats } from '../../src/api';

const LOGO = 'https://customer-assets.emergentagent.com/job_palette-craft-8/artifacts/nkc64vpr_Nutriloop%20Logo.png';

export default function Profile() {
  const [profile, setProfile] = useState<ProfileT | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const load = useCallback(async () => {
    try {
      const [p, c, b, s] = await Promise.all([api.profile(), api.challenges(), api.badges(), api.stats()]);
      setProfile(p); setChallenges(c); setBadges(b); setStats(s);
    } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const initials = profile?.name?.slice(0, 1) ?? 'N';

  return (
    <SafeAreaView style={styles.safe} edges={['top']} testID="profile-screen">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Overline>Profile</Overline>

        {/* Profile header */}
        <View style={styles.profileCard} testID="profile-card">
          <View style={styles.avatar}>
            <Image source={{ uri: LOGO }} style={styles.avatarLogo} />
          </View>
          <Text style={styles.name}>{profile?.name ?? '—'}</Text>
          <Text style={styles.tagline}>{profile?.tagline ?? ''}</Text>
          <View style={styles.profileMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{profile?.total_points ?? 0}</Text>
              <Text style={styles.metaLabel}>points</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{profile?.rank ?? '—'}</Text>
              <Text style={styles.metaLabel}>rank</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{stats?.packages_dissolved ?? 0}</Text>
              <Text style={styles.metaLabel}>dissolved</Text>
            </View>
          </View>
        </View>

        {/* Challenges */}
        <Text style={styles.sectionHead}>Active challenges</Text>
        <View style={{ gap: Spacing.m }}>
          {challenges.map(c => (
            <Card key={c.id} style={styles.challengeCard} testID={`challenge-${c.id}`}>
              <View style={styles.challengeHead}>
                <View style={[styles.challengeIcon, c.completed && { backgroundColor: Colors.primary }]}>
                  <Ionicons name={iconFor(c.icon)} size={18} color={c.completed ? Colors.onPrimary : Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.challengeTitle}>{c.title}</Text>
                  <Text style={styles.challengeDesc}>{c.description}</Text>
                </View>
                {c.completed ? (
                  <Pill label="Done" tone="dark" />
                ) : (
                  <Text style={styles.challengeReward}>+{c.reward_points}</Text>
                )}
              </View>
              <View style={{ marginTop: Spacing.m }}>
                <Progress value={c.progress} color={c.completed ? Colors.primary : Colors.secondary} />
                <Text style={styles.challengeMeta}>{c.current}/{c.target}</Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Badges */}
        <Text style={styles.sectionHead}>Badges</Text>
        <View style={styles.badgeGrid}>
          {badges.map(b => (
            <View key={b.id} style={[styles.badge, !b.unlocked && styles.badgeLocked]} testID={`badge-${b.id}`}>
              <View style={[styles.badgeIcon, b.unlocked ? { backgroundColor: Colors.secondaryMuted } : { backgroundColor: Colors.accent }]}>
                <Ionicons name={iconFor(b.icon)} size={22} color={b.unlocked ? Colors.primary : Colors.textSubtle} />
              </View>
              <Text style={[styles.badgeName, !b.unlocked && { color: Colors.textMuted }]} numberOfLines={1}>{b.name}</Text>
              <Text style={styles.badgeDesc} numberOfLines={2}>{b.description}</Text>
              {!b.unlocked && (
                <View style={styles.lockTag}>
                  <Ionicons name="lock-closed" size={9} color={Colors.textSubtle} />
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function iconFor(name: string): any {
  switch (name) {
    case 'flame': return 'flame-outline';
    case 'book': return 'book-outline';
    case 'sprout': return 'leaf-outline';
    case 'leaf': return 'leaf';
    case 'tree': return 'git-branch-outline';
    case 'forest': return 'earth-outline';
    case 'waves': return 'water-outline';
    default: return 'ribbon-outline';
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.l, paddingTop: Spacing.m, paddingBottom: Spacing.xxl },

  profileCard: { marginTop: Spacing.m, backgroundColor: Colors.card, borderRadius: Radius.xl, padding: Spacing.l, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, ...Shadow.card },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.secondaryMuted, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarLogo: { width: 56, height: 56, resizeMode: 'contain' },
  avatarText: { fontFamily: Fonts.bold, fontSize: 28, color: Colors.onPrimary },
  name: { fontFamily: Fonts.bold, fontSize: 22, color: Colors.text, letterSpacing: -0.4, marginTop: 12 },
  tagline: { fontFamily: Fonts.medium, fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  profileMeta: { flexDirection: 'row', marginTop: Spacing.l, alignItems: 'center', backgroundColor: Colors.accent, borderRadius: Radius.lg, paddingVertical: Spacing.m, paddingHorizontal: Spacing.m, alignSelf: 'stretch' },
  metaItem: { flex: 1, alignItems: 'center' },
  metaValue: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.text, letterSpacing: -0.3 },
  metaLabel: { fontFamily: Fonts.medium, fontSize: 10, color: Colors.textMuted, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 2 },
  metaDivider: { width: 1, height: 24, backgroundColor: Colors.border },

  sectionHead: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.text, letterSpacing: -0.3, marginTop: Spacing.xl, marginBottom: Spacing.m },

  challengeCard: {},
  challengeHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  challengeIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.secondaryMuted, alignItems: 'center', justifyContent: 'center' },
  challengeTitle: { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.text },
  challengeDesc: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  challengeReward: { fontFamily: Fonts.bold, fontSize: 13, color: Colors.primary },
  challengeMeta: { fontFamily: Fonts.medium, fontSize: 11, color: Colors.textMuted, marginTop: 6 },

  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.m },
  badge: { width: '47.5%', backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.m, alignItems: 'flex-start', borderWidth: 1, borderColor: Colors.border, position: 'relative' },
  badgeLocked: { backgroundColor: Colors.accent, borderColor: Colors.border },
  badgeIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  badgeName: { fontFamily: Fonts.bold, fontSize: 13, color: Colors.text, marginTop: 10, letterSpacing: -0.2 },
  badgeDesc: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.textMuted, marginTop: 2, lineHeight: 15 },
  lockTag: { position: 'absolute', top: 12, right: 12, width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
});
