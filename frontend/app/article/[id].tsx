import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing } from '../../src/theme';
import { Overline, Pill } from '../../src/ui';
import { api, Article } from '../../src/api';

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const router = useRouter();

  useEffect(() => { if (id) api.article(id).then(setArticle).catch(() => {}); }, [id]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']} testID="article-screen">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()} testID="article-back">
          <Ionicons name="chevron-back" size={20} color={Colors.text} />
        </TouchableOpacity>

        {article && (
          <>
            <Image source={{ uri: article.image }} style={styles.hero} />
            <View style={styles.body}>
              <Pill label={article.category} tone="dark" />
              <Text style={styles.title}>{article.title}</Text>
              <View style={styles.meta}>
                <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.metaText}>{article.read_time}</Text>
              </View>
              <Text style={styles.excerpt}>{article.excerpt}</Text>
              <View style={styles.divider} />
              <Text style={styles.bodyText}>{article.body}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: Spacing.xxl },
  back: { position: 'absolute', top: Spacing.m, left: Spacing.m, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  hero: { width: '100%', height: 280, backgroundColor: Colors.accent },
  body: { padding: Spacing.l },
  title: { fontFamily: Fonts.bold, fontSize: 28, color: Colors.text, letterSpacing: -0.6, marginTop: 14, lineHeight: 34 },
  meta: { flexDirection: 'row', gap: 4, alignItems: 'center', marginTop: 10 },
  metaText: { fontFamily: Fonts.medium, fontSize: 12, color: Colors.textMuted },
  excerpt: { fontFamily: Fonts.medium, fontSize: 16, color: Colors.text, marginTop: 16, lineHeight: 24, letterSpacing: -0.2 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.l },
  bodyText: { fontFamily: Fonts.regular, fontSize: 15, color: Colors.text, lineHeight: 25 },
});
