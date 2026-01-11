import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, TextInput, TouchableOpacity, ScrollView, 
  KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator 
} from 'react-native';
import { Text, View } from '@/components/Themed'; // Assuming this is your path
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '../../components/Sidebar';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web' && width > 900;
const API_URL = 'http://localhost:3000/api'; // Use your machine IP if on physical device
const USER_ID = 'user_123'; // Hardcoded for demo

const COLORS = {
  Wellness: '#0EA5E9',
  Adventure: '#F59E0B',
  Social: '#EC4899',
  Agent: '#1E293B',
};

export default function ProfileScreen() {
  const [interest, setInterest] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [discoveries, setDiscoveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data on Load
  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/profile/${USER_ID}`);
      const data = await res.json();
      setTags(data.interests);
      setDiscoveries(data.discoveries);
      setLoading(false);
    } catch (err) {
      console.error("Backend error:", err);
    }
  };

  useEffect(() => {
    fetchData();
    // Optional: Poll every 5 seconds to see if Agent found something
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // 2. Add Tag
  const addTag = async () => {
    if (interest.trim() && !tags.includes(interest)) {
      const newTag = interest.trim();
      
      // Optimistic UI Update (update screen before server responds)
      setTags([newTag, ...tags]);
      setInterest('');

      try {
        await fetch(`${API_URL}/profile/${USER_ID}/interest`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ interest: newTag })
        });
        // We don't strictly need to refetch here because of the optimistic update,
        // but the polling will catch the "Discovery" results later.
      } catch (err) {
        alert("Failed to save interest");
      }
    }
  };

  // 3. Remove Tag
  const removeTag = async (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove)); // Optimistic
    setDiscoveries(discoveries.filter(d => d.relatedInterest !== tagToRemove));

    await fetch(`${API_URL}/profile/${USER_ID}/interest`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interest: tagToRemove })
    });
  };

  return (
    <View style={styles.container}>
      <Sidebar />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.mainArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Your Vibe</Text>
            <Text style={styles.subtitle}>The agent uses your interests to scout the city for you.</Text>
          </View>

          {/* INPUT */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a new passion (e.g., Hiking)..."
              placeholderTextColor="#94A3B8"
              value={interest}
              onChangeText={setInterest}
              onSubmitEditing={addTag}
            />
            <TouchableOpacity style={[styles.addButton, {backgroundColor: COLORS.Wellness}]} onPress={addTag}>
              <Ionicons name="sparkles" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* TAGS */}
          <View style={styles.tagCloud}>
            {loading && <ActivityIndicator color={COLORS.Agent} />}
            {!loading && tags.map((tag, index) => (
              <TouchableOpacity key={index} style={[styles.tag, { borderColor: COLORS.Agent + '20' }]} onPress={() => removeTag(tag)}>
                <Text style={styles.tagText}>{tag}</Text>
                <Ionicons name="close-circle" size={14} color="#CBD5E1" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            ))}
          </View>

          {/* DISCOVERIES */}
          <Text style={styles.sectionTitle}>Agent Scouting Report</Text>
          
          {discoveries.map((discovery, index) => (
              <TouchableOpacity key={index} style={styles.discoveryCard}>
                <View style={[styles.iconCircle, { backgroundColor: discovery.color + '15' }]}>
                  <Ionicons name={discovery.icon} size={20} color={discovery.color} />
                </View>
                <View style={styles.discoveryContent}>
                  <View style={styles.discoveryHeader}>
                    <Text style={styles.discoveryTag}>INSPIRED BY "{discovery.relatedInterest.toUpperCase()}"</Text>
                  </View>
                  <Text style={styles.discoveryTitle}>{discovery.title}</Text>
                  <Text style={styles.discoveryBody}>{discovery.description}</Text>
                  <View style={styles.actionRow}>
                    <Text style={[styles.actionLink, { color: discovery.color }]}>Add to Timeline</Text>
                    <Ionicons name="chevron-forward" size={14} color={discovery.color} />
                  </View>
                </View>
              </TouchableOpacity>
          ))}

          {discoveries.length === 0 && !loading && (
             <View style={styles.metaCard}>
                <Ionicons name="search" size={20} color={COLORS.Agent} />
                <Text style={styles.metaText}>Add some interests above and the agent will start scouting...</Text>
             </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (Same styles as your original file)
  container: { flex: 1, backgroundColor: '#FFFFFF', flexDirection: 'row' },
  mainArea: { flex: 1 },
  scrollContent: { padding: isWeb ? 50 : 24, paddingTop: 60 },
  header: { marginBottom: 30 },
  title: { fontSize: 32, fontWeight: '900', color: COLORS.Agent, letterSpacing: -1 },
  subtitle: { fontSize: 16, color: '#64748B', marginTop: 4, lineHeight: 22 },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, height: 60, backgroundColor: '#F1F5F9', borderRadius: 20, paddingHorizontal: 20, fontSize: 16, fontWeight: '600', color: COLORS.Agent },
  addButton: { width: 60, height: 60, borderRadius: 20, marginLeft: 12, alignItems: 'center', justifyContent: 'center' },
  tagCloud: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 40 },
  tag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 100, marginRight: 8, marginBottom: 8, borderWidth: 1, backgroundColor: '#FFF' },
  tagText: { fontWeight: '700', fontSize: 14, color: COLORS.Agent },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 },
  discoveryCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  iconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  discoveryContent: { flex: 1 },
  discoveryHeader: { marginBottom: 4 },
  discoveryTag: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5 },
  discoveryTitle: { fontSize: 18, fontWeight: '700', color: COLORS.Agent, marginBottom: 4 },
  discoveryBody: { fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 12 },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  actionLink: { fontSize: 14, fontWeight: '700', marginRight: 4 },
  metaCard: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#F8FAFC', borderRadius: 20, gap: 12 },
  metaText: { flex: 1, fontSize: 13, color: '#64748B', fontStyle: 'italic' }
});