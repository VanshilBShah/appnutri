import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing } from '../../src/theme';
import { Label, Divider } from '../../src/ui';
import { api, Article } from '../../src/api';

export default function Learn() {
  const [articles, setArticles] = useState<Article[]>([]);
  const router = useRouter();

  useEffect(() => { api.articles().then(setArticles).catch(() => {}); }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']} testID="learn-screen">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Label>03 · Index</Label>
          <Text style={styles.title}>Learn the{'\n'}loop.</Text>
        </View>

        <Divider />

        <View style={styles.sectionHead}>
          <Label>Knowledge base</Label>
          <Text style={styles.count}>[ {articles.length} ]</Text>
        </View>

        <View>
          {articles.map((a, idx) => (
            <TouchableOpacity
              key={a.id}
              style={[styles.row, idx < articles.length - 1 && styles.rowBorder]}
              onPress={() => router.push(`/article/${a.id}` as any)}
              testID={`article-${a.id}`}
            >
              <Text style={styles.idx}>{String(idx + 1).padStart(2, '0')}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cat}>{a.category.toUpperCase()}</Text>
                <Text style={styles.title2}>{a.title}</Text>
                <Text style={styles.excerpt} numberOfLines={2}>{a.excerpt}</Text>
                <View style={styles.meta}>
                  <View style={styles.metaDot} />
                  <Text style={styles.metaText}>{a.read_time.toUpperCase()}</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={14} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
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

  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.l, paddingBottom: Spacing.s },
  count: { fontFamily: Fonts.regular, fontSize: 10, color: Colors.textSubtle, letterSpacing: 1 },

  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, paddingVertical: 20 },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  idx: { fontFamily: Fonts.regular, fontSize: 10, color: Colors.textSubtle, letterSpacing: 1, width: 24, marginTop: 4 },
  cat: { fontFamily: Fonts.semibold, fontSize: 9, color: Colors.primary, letterSpacing: 2 },
  title2: { fontFamily: Fonts.light, fontSize: 19, color: Colors.text, letterSpacing: -0.4, lineHeight: 25, marginTop: 6 },
  excerpt: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.textMuted, lineHeight: 18, marginTop: 8 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.textSubtle },
  metaText: { fontFamily: Fonts.medium, fontSize: 9, color: Colors.textMuted, letterSpacing: 1.5 },
});
