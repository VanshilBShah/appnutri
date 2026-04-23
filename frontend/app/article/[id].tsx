import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing } from '../../src/theme';
import { Label, Divider } from '../../src/ui';
import { api, Article } from '../../src/api';

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const router = useRouter();

  useEffect(() => { if (id) api.article(id).then(setArticle).catch(() => {}); }, [id]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']} testID="article-screen">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.back} testID="article-back">
            <Ionicons name="chevron-back" size={18} color={Colors.text} />
            <Text style={styles.backText}>INDEX</Text>
          </TouchableOpacity>
        </View>

        <Divider />

        {article && (
          <>
            <View style={styles.head}>
              <Label color={Colors.primary}>{article.category.toUpperCase()}</Label>
              <Text style={styles.title}>{article.title}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaDot} />
                <Text style={styles.metaText}>{article.read_time.toUpperCase()}</Text>
              </View>
            </View>

            <Divider />

            <Text style={styles.excerpt}>{article.excerpt}</Text>

            <View style={styles.bodyBlock}>
              <Text style={styles.body}>{article.body}</Text>
            </View>
          </>
        )}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.l, paddingBottom: Spacing.xxl },
  topBar: { paddingVertical: Spacing.m },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  backText: { fontFamily: Fonts.semibold, fontSize: 10, color: Colors.text, letterSpacing: 2 },

  head: { paddingVertical: Spacing.l, gap: 16 },
  title: { fontFamily: Fonts.thin, fontSize: 36, color: Colors.text, letterSpacing: -1.2, lineHeight: 40 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.primary },
  metaText: { fontFamily: Fonts.semibold, fontSize: 10, color: Colors.textMuted, letterSpacing: 2 },

  excerpt: { fontFamily: Fonts.light, fontSize: 18, color: Colors.text, lineHeight: 28, letterSpacing: -0.2, paddingTop: Spacing.l },
  bodyBlock: { paddingTop: Spacing.l, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.border, marginTop: Spacing.l },
  body: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.textMuted, lineHeight: 24 },
});
