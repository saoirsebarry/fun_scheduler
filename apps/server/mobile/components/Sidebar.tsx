import React from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web' && width > 900;

const COLORS = {
  Wellness: '#0EA5E9',
  Adventure: '#F59E0B',
  Social: '#EC4899',
  Agent: '#1E293B',
};

// Reusable Stat Row inside the sidebar
const VibeStat = ({ label, count, color, icon }: any) => (
  <View style={styles.vibeStatRow}>
    <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <View>
      <Text style={styles.vibeCount}>{count}</Text>
      <Text style={styles.vibeLabel}>{label}</Text>
    </View>
  </View>
);

export default function Sidebar() {
  if (!isWeb) return null;

  return (
    <View style={styles.sidebar}>
      <Text style={styles.logoText}>lively<Text style={{ color: COLORS.Wellness }}>.</Text></Text>

      <View style={styles.momentumSection}>
        <Text style={styles.sidebarTitle}>Your Vibe Lately</Text>
        <Text style={styles.sidebarSub}>The highlight reel so far.</Text>

        <VibeStat label="Chill Moments" count={12} color={COLORS.Wellness} icon="leaf" />
        <VibeStat label="Adventures" count={5} color={COLORS.Adventure} icon="bicycle" />
        <VibeStat label="Social Hours" count={8} color={COLORS.Social} icon="heart" />
      </View>

      <View style={styles.agentActiveCard}>
        <Text style={styles.agentStatusText}>AGENT SCOUTING</Text>
        <Text style={styles.agentDiscovery}>
          "Scanning for some <Text style={{ color: COLORS.Social, fontWeight: '700' }}>Social</Text> fun for your Friday night..."
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: { 
    width: 300, 
    backgroundColor: '#FFFFFF', 
    padding: 40, 
    borderRightWidth: 1, 
    borderRightColor: '#F1F5F9',
    height: '100%' 
  },
  logoText: { fontSize: 26, fontWeight: '900', color: '#111827', letterSpacing: -1 },
  sidebarTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginTop: 40 },
  sidebarSub: { fontSize: 13, color: '#94A3B8', marginBottom: 30 },
  momentumSection: { gap: 20 },
  vibeStatRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  vibeCount: { fontSize: 20, fontWeight: '800', color: '#111827' },
  vibeLabel: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  agentActiveCard: { marginTop: 'auto', backgroundColor: '#F8FAFC', borderRadius: 24, padding: 20 },
  agentStatusText: { fontSize: 10, fontWeight: '800', color: COLORS.Agent, letterSpacing: 1, marginBottom: 8 },
  agentDiscovery: { fontSize: 13, color: '#475569', lineHeight: 18 },
});