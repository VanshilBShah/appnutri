import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing, Shadow } from '../../src/theme';
import { Overline, Pill } from '../../src/ui';
import { api, Article } from '../../src/api';

export default function Learn() {
  const [articles, setArticles] = useState<Article[]>([]);
  const router = useRouter();

  useEffect(() => { api.articles().then(setArticles).catch(() => {}); }, []);

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <SafeAreaView style={styles.safe} edges={['top']} testID="learn-screen">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Overline>Education hub</Overline>
        <Text style={styles.title}>Learn the{'\n'}loop.</Text>
        <Text style={styles.sub}>Short reads on circular design, soil health, and regenerative material science.</Text>

        {featured && (
          <TouchableOpacity
            style={styles.feature}
            onPress={() => router.push(`/article/${featured.id}` as any)}
            testID={`article-${featured.id}`}
          >
            <Image source={{ uri: featured.image }} style={styles.featureImg} />
            <View style={styles.featureBody}>
              <Pill label={featured.category} tone="dark" />
              <Text style={styles.featureTitle}>{featured.title}</Text>
              <View style={styles.readTimeRow}>
                <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.readTime}>{featured.read_time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionHead}>More reads</Text>

        <View style={{ gap: Spacing.m }}>
          {rest.map(a => (
            <TouchableOpacity
              key={a.id}
              style={styles.articleCard}
              onPress={() => router.push(`/article/${a.id}` as any)}
              testID={`article-${a.id}`}
            >
              <Image source={{ uri: a.image }} style={styles.articleImg} />
              <View style={{ flex: 1, marginLeft: Spacing.m, justifyContent: 'space-between' }}>
                <View>
                  <Pill label={a.category} />
                  <Text style={styles.articleTitle} numberOfLines={2}>{a.title}</Text>
                </View>
                <View style={styles.readTimeRow}>
                  <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
                  <Text style={styles.readTime}>{a.read_time}</Text>
                </View>
              </View>
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
  scroll: { paddingHorizontal: Spacing.l, paddingTop: Spacing.m, paddingBottom: Spacing.xxl },
  title: { fontFamily: Fonts.bold, fontSize: 30, color: Colors.text, letterSpacing: -0.8, marginTop: 6, lineHeight: 34 },
  sub: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.textMuted, marginTop: 10, lineHeight: 19 },

  feature: { marginTop: Spacing.l, borderRadius: Radius.xl, overflow: 'hidden', backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, ...Shadow.card },
  featureImg: { width: '100%', height: 200 },
  featureBody: { padding: Spacing.l },
  featureTitle: { fontFamily: Fonts.bold, fontSize: 20, color: Colors.text, letterSpacing: -0.4, marginTop: 10, lineHeight: 26 },
  readTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  readTime: { fontFamily: Fonts.medium, fontSize: 11, color: Colors.textMuted },

  sectionHead: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.text, letterSpacing: -0.3, marginTop: Spacing.xl, marginBottom: Spacing.m },

  articleCard: { flexDirection: 'row', backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.m, borderWidth: 1, borderColor: Colors.border, minHeight: 108 },
  articleImg: { width: 84, height: 84, borderRadius: Radius.md, backgroundColor: Colors.accent },
  articleTitle: { fontFamily: Fonts.semibold, fontSize: 14, color: Colors.text, marginTop: 8, letterSpacing: -0.2, lineHeight: 19 },
});
