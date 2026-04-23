import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../src/theme';
import { Platform, StyleSheet, View } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSubtle,
        tabBarLabelStyle: { fontFamily: Fonts.medium, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 },
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: { paddingTop: 8 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabIcon name="radio-outline" color={color} focused={focused} testID="tab-home-icon" />,
          tabBarButtonTestID: 'tab-home',
        }}
      />
      <Tabs.Screen
        name="disposal"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, focused }) => <TabIcon name="scan-outline" color={color} focused={focused} testID="tab-disposal-icon" />,
          tabBarButtonTestID: 'tab-disposal',
        }}
      />
      <Tabs.Screen
        name="garden"
        options={{
          title: 'Garden',
          tabBarIcon: ({ color, focused }) => <TabIcon name="leaf-outline" color={color} focused={focused} testID="tab-garden-icon" />,
          tabBarButtonTestID: 'tab-garden',
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Index',
          tabBarIcon: ({ color, focused }) => <TabIcon name="grid-outline" color={color} focused={focused} testID="tab-learn-icon" />,
          tabBarButtonTestID: 'tab-learn',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Me',
          tabBarIcon: ({ color, focused }) => <TabIcon name="ellipse-outline" color={color} focused={focused} testID="tab-profile-icon" />,
          tabBarButtonTestID: 'tab-profile',
        }}
      />
    </Tabs>
  );
}

function TabIcon({ name, color, focused, testID }: { name: any; color: string; focused: boolean; testID: string }) {
  return (
    <View style={styles.iconWrap} testID={testID}>
      <Ionicons name={name} size={20} color={color} />
      {focused && <View style={styles.dot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.background,
    borderTopColor: Colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: Platform.OS === 'ios' ? 84 : 68,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 6,
  },
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 3,
  },
});
