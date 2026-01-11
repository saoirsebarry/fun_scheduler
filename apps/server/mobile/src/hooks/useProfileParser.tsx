import React, { useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, 
  ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SUGGESTIONS = [
  "I love hiking when it's sunny",
  "Prioritize budget-friendly activities",
  "I'm into baking and jazz",
  "No social events after 8 PM",
  "I like being outdoors"
];

export default function OnboardingScreen({ navigation }) {
  const [bio, setBio] = useState('');

  const handleSuggestionPress = (text) => {
    setBio(prev => prev ? `${prev}. ${text}` : text);
  };

  const handleSubmit = async () => {
    // This will hit your Node.js /api/profile/parse endpoint
    console.log("Sending to Agent:", bio);
    // navigation.navigate('LoadingResults');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Tell Lively about yourself</Text>
        <Text style={styles.subtitle}>
          What do you love doing? Any budget limits? The more detail, the better the agent schedules!
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            multiline
            placeholder="e.g. I love hiking on sunny days, prioritising budget-friendly activities, and I'm really into baking..."
            value={bio}
            onChangeText={setBio}
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.micButton}>
            <Ionicons name="mic" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>

        <View style={styles.suggestionSection}>
          <Text style={styles.suggestionTitle}>Need ideas?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {SUGGESTIONS.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.chip}
                onPress={() => handleSuggestionPress(item)}
              >
                <Text style={styles.chipText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity 
          style={[styles.button, !bio && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={!bio}
        >
          <Text style={styles.buttonText}>Let's Build My Profile</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 24, flex: 1, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6b7280', marginBottom: 24, lineHeight: 22 },
  inputContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: 16,
    height: 200,
    position: 'relative'
  },
  input: { flex: 1, fontSize: 18, color: '#374151' },
  micButton: { position: 'absolute', bottom: 12, right: 12, backgroundColor: '#fff', padding: 8, borderRadius: 20 },
  suggestionSection: { marginTop: 24 },
  suggestionTitle: { fontSize: 14, fontWeight: '600', color: '#9ca3af', marginBottom: 12 },
  chip: { 
    backgroundColor: '#eef2ff', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 20, 
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#c7d2fe'
  },
  chipText: { color: '#4338ca', fontWeight: '500' },
  button: { 
    backgroundColor: '#6366f1', 
    padding: 18, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginTop: 'auto' 
  },
  disabledButton: { backgroundColor: '#a5b4fc' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' }
});