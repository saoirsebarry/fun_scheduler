import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Dimensions, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '../../components/Sidebar'; 

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web' && width > 900;

// Expanded Palette
const COLORS = {
  Wellness: '#0EA5E9',  
  Adventure: '#F59E0B', 
  Social: '#EC4899',    
  Agent: '#1E293B',
  Busy: '#E2E8F0',      // For calendar events
  Available: '#FFFFFF', // Empty slots
  Selected: '#F59E0B',  // Slots user marked for fun
};

export default function LivelyFun() {
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'summary'>('week');
  
  // NEW: State for Calendar Integration
  const [isCalendarSynced, setIsCalendarSynced] = useState(false);
  const [markedSlots, setMarkedSlots] = useState<string[]>([]); // Format: "DayIndex-Hour"

  // Toggle a slot: If it's busy, do nothing. If selected, unselect. Else, select.
  const handleSlotPress = (dayIdx: number, hour: number, isBusy: boolean) => {
    if (isBusy && isCalendarSynced) return; 

    const key = `${dayIdx}-${hour}`;
    if (markedSlots.includes(key)) {
      setMarkedSlots(prev => prev.filter(k => k !== key));
    } else {
      setMarkedSlots(prev => [...prev, key]);
    }
  };

  return (
    <View style={styles.container}>
      <Sidebar />

      <View style={styles.main}>
        {/* HEADER */}
        <View style={styles.header}>
          {!isWeb && <Text style={styles.logoText}>lively<Text style={{color: COLORS.Wellness}}>.</Text></Text>}
          
          <View style={styles.segmentedControl}>
            <TabBtn label="Week" active={viewMode === 'week'} onPress={() => setViewMode('week')} />
            <TabBtn label="Month" active={viewMode === 'month'} onPress={() => setViewMode('month')} />
            <TabBtn label="Summary" active={viewMode === 'summary'} onPress={() => setViewMode('summary')} />
          </View>

          <View style={styles.headerActions}>
             <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {viewMode === 'summary' ? (
            <VibeSummaryView />
          ) : (
            <>
              <View style={styles.introRow}>
                <View>
                  <Text style={styles.welcomeText}>
                    {viewMode === 'week' ? "Plan Your Fun" : "Upcoming Fun"}
                  </Text>
                  <Text style={styles.subtext}>
                     {viewMode === 'week' ? "Tap slots to let the agent know you're free." : "Auckland • Optimized for good vibes"}
                  </Text>
                </View>
                
                {/* CALENDAR TOGGLE (Only visible in week view) */}
                {viewMode === 'week' && (
                  <View style={styles.syncContainer}>
                    <Text style={styles.syncLabel}>Sync Calendar</Text>
                    <Switch 
                      value={isCalendarSynced} 
                      onValueChange={setIsCalendarSynced}
                      trackColor={{ false: '#E2E8F0', true: COLORS.Agent }}
                      thumbColor={'#FFF'}
                    />
                  </View>
                )}
              </View>

              {viewMode === 'week' ? (
                <CalendarWeekView 
                  isSynced={isCalendarSynced} 
                  markedSlots={markedSlots} 
                  onSlotPress={handleSlotPress} 
                />
              ) : (
                <View style={styles.monthView}>
                  <Text style={styles.monthTitle}>December</Text>
                  {MOCK_MONTH.map((item, idx) => <MonthRow key={idx} item={item} />)}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

// --- NEW COMPONENT: WEEK GRID ---
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; // 9am to 8pm
const DAYS = ['Mon 26', 'Tue 27', 'Wed 28', 'Thu 29', 'Fri 30', 'Sat 01', 'Sun 02'];

const CalendarWeekView = ({ isSynced, markedSlots, onSlotPress }: any) => {
  return (
    <View style={styles.calendarContainer}>
      {DAYS.map((day, dayIdx) => (
        <View key={day} style={styles.dayRow}>
          {/* Day Label */}
          <View style={styles.dayLabelContainer}>
            <Text style={styles.dayName}>{day.split(' ')[0]}</Text>
            <Text style={styles.dayNum}>{day.split(' ')[1]}</Text>
          </View>

          {/* Horizontal Scroll of Hours */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingRight: 20}}>
            {HOURS.map((hour) => {
              // MOCK LOGIC: Simulate random busy slots if calendar is synced
              // In a real app, you would check actual calendar events here
              const isBusy = isSynced && ((dayIdx + hour) % 5 === 0 || (dayIdx === 0 && hour === 10)); 
              const isSelected = markedSlots.includes(`${dayIdx}-${hour}`);

              // Determine Style
              let bg = COLORS.Available;
              let border = '#F1F5F9';
              let text = '#94A3B8';
              
              if (isBusy) {
                bg = COLORS.Busy;
                text = '#CBD5E1';
              } else if (isSelected) {
                bg = COLORS.Selected;
                border = COLORS.Selected;
                text = '#FFF';
              }

              return (
                <TouchableOpacity 
                  key={hour} 
                  activeOpacity={isBusy ? 1 : 0.7}
                  onPress={() => onSlotPress(dayIdx, hour, isBusy)}
                  style={[styles.timeSlot, { backgroundColor: bg, borderColor: border }]}
                >
                  <Text style={[styles.timeText, { color: text }]}>
                    {hour > 12 ? `${hour-12}pm` : `${hour}am`}
                  </Text>
                  {isSelected && <Ionicons name="sparkles" size={12} color="white" style={{marginTop: 4}} />}
                  {isBusy && <Ionicons name="ban" size={12} color="#94A3B8" style={{marginTop: 4, opacity: 0.5}} />}
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      ))}
      
      {/* Footer Info */}
      <View style={styles.gridFooter}>
        <Ionicons name="information-circle-outline" size={16} color="#94A3B8" />
        <Text style={styles.gridFooterText}>
          {markedSlots.length > 0 
            ? `${markedSlots.length} slots marked. The agent will find activities for these times.` 
            : "Tap empty slots to mark them as free for fun."}
        </Text>
      </View>
    </View>
  );
};

// --- EXISTING SUB-COMPONENTS (With minor tweaks) ---

const TabBtn = ({ label, active, onPress }: any) => (
  <TouchableOpacity style={[styles.segment, active && styles.activeSegment]} onPress={onPress}>
    <Text style={[styles.segmentText, active && styles.activeSegmentText]}>{label}</Text>
  </TouchableOpacity>
);

const VibeSummaryView = () => (
  <View style={styles.summaryCard}>
    <View style={styles.summaryHeader}>
      <Text style={styles.summaryTitle}>This Week's Vibe</Text>
      <Text style={styles.summaryDate}>Dec 20 - Dec 26</Text>
    </View>
    <View style={styles.summaryGrid}>
      <View style={[styles.vibeBox, { backgroundColor: COLORS.Wellness + '25' }]}>
        <Text style={[styles.vibeBoxNum, { color: COLORS.Wellness }]}>3</Text>
        <Text style={styles.vibeBoxLabel}>Chill Sessions</Text>
      </View>
      <View style={[styles.vibeBox, { backgroundColor: COLORS.Adventure + '25' }]}>
        <Text style={[styles.vibeBoxNum, { color: COLORS.Adventure }]}>1</Text>
        <Text style={styles.vibeBoxLabel}>Big Outing</Text>
      </View>
      <View style={[styles.vibeBox, { backgroundColor: COLORS.Social + '25' }]}>
        <Text style={[styles.vibeBoxNum, { color: COLORS.Social }]}>2</Text>
        <Text style={styles.vibeBoxLabel}>Social Fixes</Text>
      </View>
    </View>
    <Text style={styles.summaryQuote}>"You're leaning into wellness lately. The agent is noticing a mood boost!"</Text>
  </View>
);

const MonthRow = ({ item }: any) => (
    <View style={styles.monthRow}>
      <Text style={styles.monthDateNum}>{item.day}</Text>
      <View style={[styles.monthCard, { backgroundColor: COLORS[item.category as keyof typeof COLORS] + '08' }]}>
        <Text style={[styles.monthCardTitle, { color: COLORS[item.category as keyof typeof COLORS] }]}>{item.name}</Text>
      </View>
    </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', flexDirection: 'row' },
  main: { flex: 1 },
  header: { height: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 30, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  logoText: { fontSize: 26, fontWeight: '900', color: '#111827', letterSpacing: -1 },
  segmentedControl: { flexDirection: 'row', backgroundColor: '#F1F5F9', padding: 4, borderRadius: 14, width: 260 },
  segment: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  activeSegment: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  segmentText: { fontSize: 13, fontWeight: '700', color: '#94A3B8' },
  activeSegmentText: { color: '#111827' },
  avatar: { width: 35, height: 35, borderRadius: 18, backgroundColor: COLORS.Agent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  scrollContent: { padding: isWeb ? 50 : 25, paddingTop: 40 },
  
  // Intro & Controls
  introRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30 },
  welcomeText: { fontSize: 32, fontWeight: '800', color: '#111827' },
  subtext: { color: '#94A3B8', fontSize: 16, marginTop: 4, maxWidth: 400 },
  syncContainer: { alignItems: 'center' },
  syncLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', marginBottom: 5, textTransform: 'uppercase' },

  // Calendar / Grid Styles
  calendarContainer: { paddingBottom: 40 },
  dayRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  dayLabelContainer: { width: 60, alignItems: 'center', marginRight: 10 },
  dayName: { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' },
  dayNum: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  
  timeSlot: { 
    width: 65, height: 60, 
    borderRadius: 16, 
    borderWidth: 1, 
    marginRight: 8, 
    justifyContent: 'center', alignItems: 'center' 
  },
  timeText: { fontSize: 12, fontWeight: '700' },
  gridFooter: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginTop: 10, alignSelf: 'flex-start' },
  gridFooterText: { marginLeft: 8, color: '#64748B', fontSize: 13, fontWeight: '500' },

  // Summary & Month Views
  monthView: { gap: 10 },
  monthTitle: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 15 },
  monthRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 15 },
  monthDateNum: { fontSize: 18, fontWeight: '800', color: '#CBD5E1', width: 30 },
  monthCard: { flex: 1, padding: 15, borderRadius: 15 },
  monthCardTitle: { fontWeight: '700', fontSize: 15 },
  summaryCard: { backgroundColor: COLORS.Agent, borderRadius: 32, padding: 30 },
  summaryHeader: { marginBottom: 25 },
  summaryTitle: { color: 'white', fontSize: 24, fontWeight: '800' },
  summaryDate: { color: '#94A3B8', fontSize: 14, marginTop: 4 },
  summaryGrid: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  vibeBox: { flex: 1, padding: 15, borderRadius: 20, alignItems: 'center' },
  vibeBoxNum: { fontSize: 24, fontWeight: '800' },
  vibeBoxLabel: { fontSize: 10, fontWeight: '700', marginTop: 4, textAlign: 'center' },
  summaryQuote: { color: '#CBD5E1', fontSize: 15, fontStyle: 'italic', lineHeight: 22, textAlign: 'center' }
});

const MOCK_MONTH = [
  { day: '26', name: 'Coastal Meditation', category: 'Wellness' },
  { day: '27', name: 'Waitakere Scouting', category: 'Adventure' },
  { day: '31', name: 'NYE Celebration', category: 'Social' },
];