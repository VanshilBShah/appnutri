import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing, LOGO } from '../../src/theme';
import { Label, Divider, Progress } from '../../src/ui';
import { api, Profile as ProfileT, Challenge, Badge, Stats } from '../../src/api';

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

  return (
    <SafeAreaView style={styles.safe} edges={['top']} testID="profile-screen">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Label>04 · Profile</Label>
          <Text style={styles.title}>Operator.</Text>
        </View>

        <Divider />

        {/* Avatar block */}
        <View style={styles.profileBlock} testID="profile-card">
          <View style={styles.avatar}>
            <Image source={{ uri: LOGO }} style={styles.avatarImg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{profile?.name ?? '—'}</Text>
            <Text style={styles.tagline}>{profile?.tagline ?? ''}</Text>
            <View style={styles.rankRow}>
              <View style={styles.rankDot} />
              <Text style={styles.rankText}>{(profile?.rank ?? '—').toUpperCase()} · SINCE {(profile?.member_since ?? '').toUpperCase()}</Text>
            </View>
          </View>
        </View>

        <Divider />

        {/* Stat strip */}
        <View style={styles.statsRow}>
          <StatCol label="POINTS" value={profile?.total_points ?? 0} />
          <View style={styles.vd} />
          <StatCol label="DISSOLVED" value={stats?.packages_dissolved ?? 0} />
          <View style={styles.vd} />
          <StatCol label="STREAK" value={`${stats?.streak_days ?? 0}d`} />
        </View>

        <Divider />

        {/* Challenges */}
        <View style={styles.sectionHead}>
          <Label>Active challenges</Label>
          <Text style={styles.count}>[ {challenges.filter(c => !c.completed).length} ]</Text>
        </View>

        <View>
          {challenges.map((c, idx) => (
            <View key={c.id} style={[styles.challengeRow, idx < challenges.length - 1 && styles.rowBorder]} testID={`challenge-${c.id}`}>
              <View style={styles.challengeHead}>
                <Text style={styles.challengeIdx}>{String(idx + 1).padStart(2, '0')}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.challengeTitle}>{c.title}</Text>
                  <Text style={styles.challengeDesc}>{c.description}</Text>
                </View>
                <Text style={[styles.challengeReward, c.completed && { color: Colors.textSubtle, textDecorationLine: 'line-through' }]}>
                  +{c.reward_points}
                </Text>
              </View>
              <View style={styles.challengeFooter}>
                <Progress value={c.progress} color={c.completed ? Colors.secondary : Colors.primary} />
                <Text style={styles.challengeStatus}>{c.current}/{c.target} {c.completed ? '· COMPLETE' : ''}</Text>
              </View>
            </View>
          ))}
        </View>

        <Divider />

        {/* Badges */}
        <View style={styles.sectionHead}>
          <Label>Badges</Label>
          <Text style={styles.count}>[ {badges.filter(b => b.unlocked).length}/{badges.length} ]</Text>
        </View>

        <View style={styles.badgeGrid}>
          {badges.map(b => (
            <View key={b.id} style={[styles.badge, !b.unlocked && styles.badgeLocked]} testID={`badge-${b.id}`}>
              <View style={[styles.badgeIcon, b.unlocked && styles.badgeIconOn]}>
                <Ionicons
                  name={iconFor(b.icon)}
                  size={18}
                  color={b.unlocked ? Colors.primary : Colors.textSubtle}
                />
              </View>
              <Text style={[styles.badgeName, !b.unlocked && { color: Colors.textSubtle }]}>{b.name.toUpperCase()}</Text>
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

function StatCol({ label, value }: { label: string; value: any }) {
  return (
    <View style={{ flex: 1, gap: 6 }}>
      <Text style={styles.colLabel}>{label}</Text>
      <Text style={styles.colValue}>{value}</Text>
    </View>
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
  scroll: { paddingHorizontal: Spacing.l, paddingBottom: Spacing.xxl },
  headerRow: { paddingVertical: Spacing.l, gap: 12 },
  title: { fontFamily: Fonts.thin, fontSize: 40, color: Colors.text, letterSpacing: -1.2, lineHeight: 44, marginTop: 8 },

  profileBlock: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: Spacing.l },
  avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: Colors.surface },
  avatarImg: { width: 48, height: 48, resizeMode: 'contain' },
  name: { fontFamily: Fonts.light, fontSize: 24, color: Colors.text, letterSpacing: -0.6 },
  tagline: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  rankDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary },
  rankText: { fontFamily: Fonts.semibold, fontSize: 9, color: Colors.textMuted, letterSpacing: 1.5 },

  statsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.l },
  colLabel: { fontFamily: Fonts.semibold, fontSize: 9, color: Colors.textSubtle, letterSpacing: 1.5 },
  colValue: { fontFamily: Fonts.light, fontSize: 26, color: Colors.text, letterSpacing: -0.6 },
  vd: { width: StyleSheet.hairlineWidth, backgroundColor: Colors.border, height: 40, marginHorizontal: Spacing.m },

  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.l, paddingBottom: Spacing.s },
  count: { fontFamily: Fonts.regular, fontSize: 10, color: Colors.textSubtle, letterSpacing: 1 },

  challengeRow: { paddingVertical: 16 },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  challengeHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  challengeIdx: { fontFamily: Fonts.regular, fontSize: 10, color: Colors.textSubtle, letterSpacing: 1, width: 24, marginTop: 4 },
  challengeTitle: { fontFamily: Fonts.medium, fontSize: 14, color: Colors.text, letterSpacing: -0.1 },
  challengeDesc: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.textMuted, marginTop: 4, lineHeight: 16 },
  challengeReward: { fontFamily: Fonts.bold, fontSize: 13, color: Colors.primary, letterSpacing: 0.3 },
  challengeFooter: { marginTop: 12, marginLeft: 36 },
  challengeStatus: { fontFamily: Fonts.regular, fontSize: 10, color: Colors.textMuted, letterSpacing: 1, marginTop: 6 },

  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: Spacing.s },
  badge: { width: '47%', padding: Spacing.m, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, position: 'relative', minHeight: 120 },
  badgeLocked: { opacity: 0.6 },
  badgeIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.hairline },
  badgeIconOn: { backgroundColor: Colors.secondaryMuted, borderWidth: 1, borderColor: Colors.primaryDim },
  badgeName: { fontFamily: Fonts.semibold, fontSize: 11, color: Colors.text, letterSpacing: 1.5, marginTop: 12 },
  badgeDesc: { fontFamily: Fonts.regular, fontSize: 10, color: Colors.textMuted, marginTop: 4, lineHeight: 14 },
  lockTag: { position: 'absolute', top: 12, right: 12 },
});
