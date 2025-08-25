import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Search, MapPin } from 'lucide-react-native';
import { QuickStats } from '@/components/QuickStats';
import { GameificationCard } from '@/components/GameificationCard';
import { ViolationCard } from '@/components/ViolationCard';
import { Button } from '@/components/ui/Button';
import { Violation } from '@/types';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [recentViolations, setRecentViolations] = useState<Violation[]>([]);

  // Mock data - in production, this would come from Supabase
  const mockViolations: Violation[] = [
    {
      id: '1',
      billboard_id: 'bb1',
      reporter_id: 'user1',
      type: 'unauthorized',
      description: 'Large billboard without visible permit number on busy commercial street',
      confidence_score: 0.89,
      photo_url: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=500',
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Main St, New York, NY'
      },
      status: 'pending',
      ai_analysis: {
        detected_violations: ['unauthorized'],
        confidence_scores: { unauthorized: 0.89 },
        permit_extracted: false,
        size_compliance: true,
        location_compliance: false,
        damage_detected: false,
        privacy_processed: true
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      billboard_id: 'bb2',
      reporter_id: 'user1',
      type: 'damaged',
      description: 'Billboard showing significant weather damage and peeling advertisements',
      confidence_score: 0.75,
      photo_url: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=500',
      location: {
        latitude: 40.7580,
        longitude: -73.9855,
        address: '456 Broadway, New York, NY'
      },
      status: 'verified',
      ai_analysis: {
        detected_violations: ['damaged'],
        confidence_scores: { damaged: 0.75 },
        permit_extracted: true,
        permit_number: 'PRM-2024-001',
        size_compliance: true,
        location_compliance: true,
        damage_detected: true,
        privacy_processed: true
      },
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  useEffect(() => {
    setRecentViolations(mockViolations);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2563EB', '#1D4ED8']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good morning!</Text>
            <Text style={styles.subtitle}>Let's keep our city compliant</Text>
          </View>
          <View style={styles.headerIcons}>
            <Bell size={24} color="#FFFFFF" />
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <QuickStats
          totalReports={247}
          pendingViolations={15}
          resolvedViolations={185}
          complianceScore={87}
        />

        <GameificationCard
          points={1250}
          rank={7}
          badgesCount={8}
          weeklyGoal={5}
          weeklyProgress={3}
        />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Button
              title="View All"
              size="small"
              variant="secondary"
              onPress={() => {}}
            />
          </View>

          {recentViolations.map((violation) => (
            <ViolationCard
              key={violation.id}
              violation={violation}
              onPress={() => {}}
            />
          ))}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <Button
              title="Report Billboard"
              variant="primary"
              onPress={() => {}}
              style={styles.actionButton}
            />
            <Button
              title="View Heatmap"
              variant="secondary"
              onPress={() => {}}
              style={styles.actionButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#E0E7FF',
    marginTop: 4,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  quickActions: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  actionButtons: {
    marginTop: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
});