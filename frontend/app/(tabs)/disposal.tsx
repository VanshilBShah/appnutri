import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts, Radius, Spacing, Shadow } from '../../src/theme';
import { Overline, Pill } from '../../src/ui';
import { api, Material } from '../../src/api';

export default function Disposal() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    api.materials().then(setMaterials).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    if (!query) return materials;
    const q = query.toLowerCase();
    return materials.filter(m => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
  }, [materials, query]);

  const categories = ['All', 'Shipping', 'Food'];
  const [active, setActive] = useState('All');

  const visible = active === 'All' ? filtered : filtered.filter(m => m.category === active);

  const handleScan = () => {
    Alert.alert(
      'Camera scan',
      'Point your camera at the NutriLoop QR on the package to auto-detect the material. (Demo: pick a material from the list below)',
      [{ text: 'Got it' }],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']} testID="disposal-screen">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Overline>Dissolve guide</Overline>
        <Text style={styles.title}>Where waste{'\n'}becomes life.</Text>
        <Text style={styles.sub}>Scan a package or pick from the list to see exactly how to dissolve it.</Text>

        {/* Scanner card */}
        <View style={styles.scanner} testID="scanner-card">
          <View style={styles.scannerFrame}>
            <Ionicons name="scan-outline" size={64} color={Colors.onPrimary} />
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <TouchableOpacity style={styles.scanBtn} onPress={handleScan} testID="scan-button">
            <Ionicons name="qr-code-outline" size={18} color={Colors.primary} />
            <Text style={styles.scanBtnText}>Scan package</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.search} testID="search-input-wrap">
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search materials..."
            placeholderTextColor={Colors.textSubtle}
            style={styles.input}
            testID="search-input"
          />
        </View>

        {/* Category chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={{ gap: 8 }}>
          {categories.map(c => (
            <TouchableOpacity
              key={c}
              onPress={() => setActive(c)}
              style={[styles.chip, active === c && styles.chipActive]}
              testID={`chip-${c.toLowerCase()}`}
            >
              <Text style={[styles.chipText, active === c && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Materials list */}
        <View style={{ gap: Spacing.m, marginTop: Spacing.m }}>
          {visible.map(m => (
            <TouchableOpacity
              key={m.id}
              style={styles.materialCard}
              onPress={() => router.push(`/material/${m.id}` as any)}
              testID={`material-${m.id}`}
            >
              <Image source={{ uri: m.image }} style={styles.materialImg} />
              <View style={{ flex: 1, marginLeft: Spacing.m, justifyContent: 'space-between' }}>
                <View>
                  <Pill label={m.category} />
                  <Text style={styles.materialName} numberOfLines={1}>{m.name}</Text>
                </View>
                <View style={styles.materialMeta}>
                  <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
                  <Text style={styles.materialMetaText}>{m.dissolve_time}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSubtle} />
            </TouchableOpacity>
          ))}
          {visible.length === 0 && <Text style={styles.empty}>No materials found.</Text>}
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

  scanner: { marginTop: Spacing.l, backgroundColor: Colors.primary, borderRadius: Radius.xl, padding: Spacing.l, alignItems: 'center', ...Shadow.card },
  scannerFrame: { width: '100%', aspectRatio: 1.4, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)', position: 'relative' },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: Colors.onPrimary },
  cornerTL: { top: 14, left: 14, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 6 },
  cornerTR: { top: 14, right: 14, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 6 },
  cornerBL: { bottom: 14, left: 14, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: 6 },
  cornerBR: { bottom: 14, right: 14, borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: 6 },
  scanBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: Spacing.m, backgroundColor: Colors.onPrimary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: Radius.pill },
  scanBtnText: { fontFamily: Fonts.semibold, color: Colors.primary, fontSize: 13 },

  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.pill, paddingHorizontal: 16, marginTop: Spacing.l, borderWidth: 1, borderColor: Colors.border },
  input: { flex: 1, fontFamily: Fonts.medium, color: Colors.text, paddingVertical: 14, paddingHorizontal: 10, fontSize: 14 },

  chips: { marginTop: Spacing.m, flexGrow: 0 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.pill, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontFamily: Fonts.semibold, fontSize: 12, color: Colors.textMuted, letterSpacing: 0.3 },
  chipTextActive: { color: Colors.onPrimary },

  materialCard: { flexDirection: 'row', backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.m, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  materialImg: { width: 64, height: 64, borderRadius: Radius.md, backgroundColor: Colors.accent },
  materialName: { fontFamily: Fonts.bold, fontSize: 15, color: Colors.text, marginTop: 8, letterSpacing: -0.2 },
  materialMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  materialMetaText: { fontFamily: Fonts.medium, fontSize: 11, color: Colors.textMuted },
  empty: { fontFamily: Fonts.medium, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.l },
});
