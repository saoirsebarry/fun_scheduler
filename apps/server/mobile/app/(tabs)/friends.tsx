import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FRIENDS_DATA = [
  { id: '1', name: 'Sarah Miller', sync: true, avatar: 'https://i.pravatar.cc/100?u=sarah' },
  { id: '2', name: 'Chloe Chen', sync: true, avatar: 'https://i.pravatar.cc/100?u=chloe' },
  { id: '3', name: 'Mike Ross', sync: false, avatar: 'https://i.pravatar.cc/100?u=mike' },
];

export default function FriendListScreen() {
  const [search, setSearch] = useState('');

  const renderFriend = ({ item }) => (
    <View style={styles.friendCard}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={item.sync ? styles.syncOn : styles.syncOff}>
          {item.sync ? 'Calendar Synced' : 'Awaiting Calendar Access'}
        </Text>
      </View>
      <Ionicons name="chatbubble-ellipses-outline" size={24} color="#6366f1" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search friends..."
          value={search}
          onChangeText={setSearch}
        />
      </View>
      
      <FlatList
        data={FRIENDS_DATA.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))}
        renderItem={renderFriend}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  list: { paddingBottom: 20 },
  friendCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  friendInfo: { flex: 1, marginLeft: 15 },
  friendName: { fontSize: 16, fontWeight: '700', color: '#1f2937' },
  syncOn: { fontSize: 12, color: '#10b981' },
  syncOff: { fontSize: 12, color: '#f59e0b' }
});