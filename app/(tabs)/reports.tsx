import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, Map, ChartBar as BarChart3, Download } from 'lucide-react-native';
import { ViolationCard } from '@/components/ViolationCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Violation } from '@/types';

export default function ReportsScreen() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'verified' | 'resolved'>('all');
  const [violations, setViolations] = useState<Violation[]>([]);

  // Mock data
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
    },
    {
      id: '3',
      billboard_id: 'bb3',
      reporter_id: 'user1',
      type: 'oversized',
      description: 'Billboard exceeds permitted dimensions for this zoning area',
      confidence_score: 0.92,
      photo_url: 'https://images.pexels.com/photos/164519/pexels-photo-164519.jpeg?auto=compress&cs=tinysrgb&w=500',
      location: {
        latitude: 40.7305,
        longitude: -73.9951,
        address: '789 Fifth Ave, New York, NY'
      },
      status: 'resolved',
      ai_analysis: {
        detected_violations: ['oversized'],
        confidence_scores: { oversized: 0.92 },
        permit_extracted: true,
        permit_number: 'PRM-2024-002',
        size_compliance: false,
        location_compliance: true,
        damage_detected: false,
        privacy_processed: true
      },
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  useEffect(() => {
    setViolations(mockViolations);
  }, []);

  const filteredViolations = violations.filter(violation => 
    activeFilter === 'all' || violation.status === activeFilter
  );

  const filterOptions = [
    { key: 'all', label: 'All Reports' },
    { key: 'pending', label: 'Pending' },
    { key: 'verified', label: 'Verified' },
    { key: 'resolved', label: 'Resolved' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Violation Reports</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Map size={24} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <BarChart3 size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Report Summary</Text>
            <Download size={20} color="#6B7280" />
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{violations.length}</Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: '#EA580C' }]}>
                {violations.filter(v => v.status === 'pending').length}
              </Text>
              <Text style={styles.summaryLabel}>Pending</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: '#DC2626' }]}>
                {violations.filter(v => v.status === 'verified').length}
              </Text>
              <Text style={styles.summaryLabel}>Verified</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: '#059669' }]}>
                {violations.filter(v => v.status === 'resolved').length}
              </Text>
              <Text style={styles.summaryLabel}>Resolved</Text>
            </View>
          </View>
        </Card>

        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filters}>
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.filterButton,
                    activeFilter === option.key && styles.activeFilterButton
                  ]}
                  onPress={() => setActiveFilter(option.key as any)}
                >
                  <Text style={[
                    styles.filterText,
                    activeFilter === option.key && styles.activeFilterText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.reportsList}>
          {filteredViolations.map((violation) => (
            <ViolationCard
              key={violation.id}
              violation={violation}
              onPress={() => {}}
            />
          ))}
        </View>

        {filteredViolations.length === 0 && (
          <Card style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No reports found</Text>
            <Text style={styles.emptyText}>
              {activeFilter === 'all' 
                ? 'Start by capturing your first billboard report'
                : `No ${activeFilter} reports at this time`
              }
            </Text>
          </Card>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    margin: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  filtersContainer: {
    marginBottom: 8,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterButton: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  reportsList: {
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    marginHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});