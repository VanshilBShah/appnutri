import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing } from '../../src/theme';
import { Label, Divider } from '../../src/ui';
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
      Alert.alert('Logged', `${mat.name} added to your impact record.`);
    } catch {
      Alert.alert('Error', 'Could not log dissolve.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']} testID="material-screen">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.back} testID="material-back">
            <Ionicons name="chevron-back" size={18} color={Colors.text} />
            <Text style={styles.backText}>INDEX</Text>
          </TouchableOpacity>
        </View>

        <Divider />

        {mat && (
          <>
            <View style={styles.head}>
              <Label color={Colors.primary}>{mat.category.toUpperCase()}</Label>
              <Text style={styles.title}>{mat.name}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{mat.dissolve_time.toUpperCase()} · {mat.method.toUpperCase()}</Text>
              </View>
            </View>

            <Divider />

            <View style={styles.sectionHead}><Label>Nutrients released</Label></View>
            <View style={styles.nutrientRow}>
              {mat.nutrients.map(n => (
                <View key={n} style={styles.nutrient}>
                  <View style={styles.nutrientDot} />
                  <Text style={styles.nutrientText}>{n.toUpperCase()}</Text>
                </View>
              ))}
            </View>

            <Divider />

            <View style={styles.sectionHead}><Label>Dissolution protocol</Label></View>
            <View>
              {mat.instructions.map((step, i) => (
                <View key={i} style={[styles.step, i < mat.instructions.length - 1 && styles.stepBorder]}>
                  <Text style={styles.stepIdx}>{String(i + 1).padStart(2, '0')}</Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.cta} onPress={dissolve} testID="dissolve-btn">
              <Ionicons name="checkmark" size={14} color={Colors.onPrimary} />
              <Text style={styles.ctaText}>MARK DISSOLVED</Text>
            </TouchableOpacity>
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

  head: { paddingVertical: Spacing.l, gap: 12 },
  title: { fontFamily: Fonts.thin, fontSize: 36, color: Colors.text, letterSpacing: -1.2, lineHeight: 40 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  metaText: { fontFamily: Fonts.semibold, fontSize: 10, color: Colors.textMuted, letterSpacing: 1.5 },

  sectionHead: { paddingTop: Spacing.l, paddingBottom: Spacing.m },
  nutrientRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  nutrient: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: Colors.primaryDim, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.pill },
  nutrientDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary },
  nutrientText: { fontFamily: Fonts.semibold, fontSize: 10, color: Colors.primary, letterSpacing: 1.5 },

  step: { flexDirection: 'row', gap: 14, paddingVertical: 16, alignItems: 'flex-start' },
  stepBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  stepIdx: { fontFamily: Fonts.regular, fontSize: 10, color: Colors.primary, letterSpacing: 1, width: 24, marginTop: 3 },
  stepText: { flex: 1, fontFamily: Fonts.regular, fontSize: 13, color: Colors.text, lineHeight: 20 },

  cta: { marginTop: Spacing.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Radius.pill },
  ctaText: { fontFamily: Fonts.bold, fontSize: 11, color: Colors.onPrimary, letterSpacing: 2.5 },
});
