import { Stack } from 'expo-router';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_900Black } from '@expo-google-fonts/montserrat';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../src/theme';

export default function RootLayout() {
  const [loaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_900Black,
  });

  if (!loaded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="article/[id]" options={{ presentation: 'card', animation: 'slide_from_right' }} />
        <Stack.Screen name="material/[id]" options={{ presentation: 'card', animation: 'slide_from_right' }} />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
});
