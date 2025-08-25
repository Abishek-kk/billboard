import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChartBar as BarChart3, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock } from 'lucide-react-native';
import { Card } from './ui/Card';

interface QuickStatsProps {
  totalReports: number;
  pendingViolations: number;
  resolvedViolations: number;
  complianceScore: number;
}

export function QuickStats({ 
  totalReports, 
  pendingViolations, 
  resolvedViolations, 
  complianceScore 
}: QuickStatsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Overview</Text>
      
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <BarChart3 size={24} color="#2563EB" />
          <Text style={styles.statValue}>{totalReports}</Text>
          <Text style={styles.statLabel}>Total Reports</Text>
        </Card>

        <Card style={styles.statCard}>
          <AlertTriangle size={24} color="#DC2626" />
          <Text style={styles.statValue}>{pendingViolations}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </Card>

        <Card style={styles.statCard}>
          <CheckCircle size={24} color="#059669" />
          <Text style={styles.statValue}>{resolvedViolations}</Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </Card>

        <Card style={styles.statCard}>
          <Clock size={24} color="#EA580C" />
          <Text style={styles.statValue}>{complianceScore}%</Text>
          <Text style={styles.statLabel}>Compliance</Text>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    marginHorizontal: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
});