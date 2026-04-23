import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts, Radius, Spacing } from '../../src/theme';
import { Label, Divider, Chip } from '../../src/ui';
import { api, Material } from '../../src/api';

export default function Disposal() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('ALL');
  const router = useRouter();

  useEffect(() => { api.materials().then(setMaterials).catch(() => {}); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return materials.filter(m =>
      (active === 'ALL' || m.category.toLowerCase() === active.toLowerCase()) &&
      (m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q))
    );
  }, [materials, query, active]);

  const handleScan = () => Alert.alert('Scan mode', 'Camera scan coming online. Select from the index below for now.');

  return (
    <SafeAreaView style={styles.safe} edges={['top']} testID="disposal-screen">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Label>01 · Scan</Label>
            <Text style={styles.title}>Identify{'\n'}material.</Text>
          </View>
        </View>

        <Divider />

        {/* Scanner */}
        <View style={styles.scanner} testID="scanner-card">
          {/* corner markers */}
          {[styles.ctl, styles.ctr, styles.cbl, styles.cbr].map((s, i) => (
            <View key={i} style={[styles.corner, s]} />
          ))}
          <View style={styles.scannerInner}>
            <Ionicons name="scan-outline" size={48} color={Colors.primary} />
            <Text style={styles.scannerText}>Align package QR</Text>
            <View style={styles.scannerHint}>
              <View style={styles.scannerDot} />
              <Text style={styles.scannerHintText}>STANDBY</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.scanBtn} onPress={handleScan} testID="scan-button">
            <Ionicons name="qr-code-outline" size={14} color={Colors.onPrimary} />
            <Text style={styles.scanBtnText}>INITIATE SCAN</Text>
          </TouchableOpacity>
        </View>

        <Divider />

        {/* Search */}
        <View style={styles.searchRow}>
          <Ionicons name="search" size={14} color={Colors.textMuted} />
          <TextInput
            testID="search-input"
            placeholder="Search index..."
            placeholderTextColor={Colors.textSubtle}
            value={query}
            onChangeText={setQuery}
            style={styles.input}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {['ALL', 'Shipping', 'Food'].map(c => (
            <TouchableOpacity key={c} onPress={() => setActive(c)} testID={`chip-${c.toLowerCase()}`}>
              <Chip label={c} active={active === c} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Divider />

        {/* Material index */}
        <View style={styles.sectionHead}>
          <Label>Material Index</Label>
          <Text style={styles.count}>[ {filtered.length} ]</Text>
        </View>

        <View style={styles.list}>
          {filtered.map((m, idx) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.matRow, idx < filtered.length - 1 && styles.matBorder]}
              onPress={() => router.push(`/material/${m.id}` as any)}
              testID={`material-${m.id}`}
            >
              <View style={styles.matIndex}>
                <Text style={styles.matIndexText}>{String(idx + 1).padStart(2, '0')}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.matName}>{m.name}</Text>
                <Text style={styles.matMeta}>{m.category.toUpperCase()} · {m.dissolve_time}</Text>
              </View>
              <Ionicons name="arrow-forward" size={14} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
          {filtered.length === 0 && <Text style={styles.empty}>No matches found.</Text>}
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.l, paddingTop: Spacing.m, paddingBottom: Spacing.xxl },
  headerRow: { paddingVertical: Spacing.l, gap: 12 },
  title: { fontFamily: Fonts.thin, fontSize: 40, color: Colors.text, letterSpacing: -1.2, lineHeight: 44, marginTop: 8 },

  scanner: { marginTop: Spacing.l, marginBottom: Spacing.l, paddingHorizontal: Spacing.l, paddingVertical: Spacing.xl, position: 'relative' },
  corner: { position: 'absolute', width: 16, height: 16, borderColor: Colors.primary },
  ctl: { top: 0, left: 0, borderTopWidth: 1, borderLeftWidth: 1 },
  ctr: { top: 0, right: 0, borderTopWidth: 1, borderRightWidth: 1 },
  cbl: { bottom: 0, left: 0, borderBottomWidth: 1, borderLeftWidth: 1 },
  cbr: { bottom: 0, right: 0, borderBottomWidth: 1, borderRightWidth: 1 },
  scannerInner: { alignItems: 'center', paddingVertical: Spacing.l, gap: 12 },
  scannerText: { fontFamily: Fonts.light, fontSize: 16, color: Colors.text, letterSpacing: 0.5 },
  scannerHint: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  scannerDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.warning },
  scannerHintText: { fontFamily: Fonts.semibold, fontSize: 9, letterSpacing: 2, color: Colors.warning },
  scanBtn: { flexDirection: 'row', alignSelf: 'center', alignItems: 'center', gap: 8, backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: Radius.pill, marginTop: Spacing.l },
  scanBtnText: { fontFamily: Fonts.bold, fontSize: 10, color: Colors.onPrimary, letterSpacing: 2 },

  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: Spacing.m },
  input: { flex: 1, fontFamily: Fonts.regular, fontSize: 14, color: Colors.text, paddingVertical: 10 },
  chips: { gap: 8, paddingVertical: 4 },

  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.l, paddingBottom: Spacing.s },
  count: { fontFamily: Fonts.regular, fontSize: 10, color: Colors.textSubtle, letterSpacing: 1 },
  list: {},
  matRow: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 18 },
  matBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  matIndex: { width: 36 },
  matIndexText: { fontFamily: Fonts.regular, fontSize: 10, color: Colors.textSubtle, letterSpacing: 1 },
  matName: { fontFamily: Fonts.light, fontSize: 18, color: Colors.text, letterSpacing: -0.3 },
  matMeta: { fontFamily: Fonts.regular, fontSize: 10, color: Colors.textMuted, letterSpacing: 1, marginTop: 4, textTransform: 'uppercase' },
  empty: { fontFamily: Fonts.regular, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.l },
});
