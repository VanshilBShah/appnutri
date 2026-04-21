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
        tabBarInactiveTintColor: '#A8A8A3',
        tabBarLabelStyle: { fontFamily: Fonts.semibold, fontSize: 10, letterSpacing: 0.3 },
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: { paddingTop: 6 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabIcon name="home" color={color} focused={focused} testID="tab-home-icon" />,
          tabBarButtonTestID: 'tab-home',
        }}
      />
      <Tabs.Screen
        name="disposal"
        options={{
          title: 'Dissolve',
          tabBarIcon: ({ color, focused }) => <TabIcon name="water-outline" color={color} focused={focused} testID="tab-disposal-icon" />,
          tabBarButtonTestID: 'tab-disposal',
        }}
      />
      <Tabs.Screen
        name="garden"
        options={{
          title: 'Garden',
          tabBarIcon: ({ color, focused }) => <TabIcon name="leaf" color={color} focused={focused} testID="tab-garden-icon" />,
          tabBarButtonTestID: 'tab-garden',
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, focused }) => <TabIcon name="book-outline" color={color} focused={focused} testID="tab-learn-icon" />,
          tabBarButtonTestID: 'tab-learn',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => <TabIcon name="person-outline" color={color} focused={focused} testID="tab-profile-icon" />,
          tabBarButtonTestID: 'tab-profile',
        }}
      />
    </Tabs>
  );
}

function TabIcon({ name, color, focused, testID }: { name: any; color: string; focused: boolean; testID: string }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]} testID={testID}>
      <Ionicons name={name} size={20} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 86 : 72,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 8,
  },
  iconWrap: {
    width: 42,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: Colors.secondaryMuted,
  },
});
