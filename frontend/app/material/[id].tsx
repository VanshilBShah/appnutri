import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing, Shadow } from '../../src/theme';
import { Card, Overline, Pill } from '../../src/ui';
import { api, Material } from '../../src/api';

export default function MaterialScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [mat, setMat] = useState<Material | null>(null);
  const router = useRouter();

  useEffect(() => { if (id) api.material(id).then(setMat).catch(() => {}); }, [id]);

  const dissolve = async () => {
    if (!mat) return;
    try {
      await api.dissolve(mat.id, mat.method);
      Alert.alert('Logged', `A ${mat.name.toLowerCase()} has been added to your impact.`, [{ text: 'Nice' }]);
    } catch {
      Alert.alert('Error', 'Could not log dissolve.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']} testID="material-screen">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()} testID="material-back">
          <Ionicons name="chevron-back" size={20} color={Colors.text} />
        </TouchableOpacity>

        {mat && (
          <>
            <Image source={{ uri: mat.image }} style={styles.hero} />
            <View style={styles.body}>
              <Pill label={mat.category} tone="dark" />
              <Text style={styles.title}>{mat.name}</Text>

              <View style={styles.inlineMeta}>
                <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.inlineMetaText}>{mat.dissolve_time}</Text>
                <View style={styles.dot} />
                <Ionicons name="water-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.inlineMetaText}>{mat.method}</Text>
              </View>

              <Text style={styles.sectionHead}>Nutrients released</Text>
              <View style={styles.nutrientRow}>
                {mat.nutrients.map(n => (
                  <View key={n} style={styles.nutrient}><Text style={styles.nutrientText}>{n}</Text></View>
                ))}
              </View>

              <Text style={styles.sectionHead}>How to dissolve</Text>
              <Card style={{ padding: 0 }}>
                {mat.instructions.map((step, i) => (
                  <View key={i} style={[styles.step, i < mat.instructions.length - 1 && styles.stepDivider]}>
                    <View style={styles.stepIndex}><Text style={styles.stepIndexText}>{i + 1}</Text></View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </Card>

              <TouchableOpacity style={styles.cta} onPress={dissolve} testID="dissolve-btn">
                <Ionicons name="checkmark-circle" size={18} color={Colors.onPrimary} />
                <Text style={styles.ctaText}>Mark as dissolved</Text>
              </TouchableOpacity>
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
  hero: { width: '100%', height: 260, backgroundColor: Colors.accent },
  body: { padding: Spacing.l },
  title: { fontFamily: Fonts.bold, fontSize: 28, color: Colors.text, letterSpacing: -0.6, marginTop: 14, lineHeight: 34 },
  inlineMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  inlineMetaText: { fontFamily: Fonts.medium, fontSize: 12, color: Colors.textMuted },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.textSubtle, marginHorizontal: 4 },

  sectionHead: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.text, letterSpacing: -0.3, marginTop: Spacing.xl, marginBottom: Spacing.m },
  nutrientRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  nutrient: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.pill, backgroundColor: Colors.secondaryMuted },
  nutrientText: { fontFamily: Fonts.semibold, fontSize: 12, color: Colors.primary },

  step: { flexDirection: 'row', gap: 12, padding: Spacing.m, alignItems: 'flex-start' },
  stepDivider: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  stepIndex: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  stepIndexText: { fontFamily: Fonts.bold, fontSize: 11, color: Colors.onPrimary },
  stepText: { flex: 1, fontFamily: Fonts.regular, fontSize: 13, color: Colors.text, lineHeight: 19 },

  cta: { marginTop: Spacing.xl, backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Radius.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, ...Shadow.card },
  ctaText: { color: Colors.onPrimary, fontFamily: Fonts.semibold, fontSize: 14 },
});
