import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Trophy, Target, Award } from 'lucide-react-native';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

interface GameificationCardProps {
  points: number;
  rank: number;
  badgesCount: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

export function GameificationCard({ 
  points, 
  rank, 
  badgesCount, 
  weeklyGoal, 
  weeklyProgress 
}: GameificationCardProps) {
  const progressPercentage = Math.min((weeklyProgress / weeklyGoal) * 100, 100);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        <Badge text={`Rank #${rank}`} variant="info" />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Trophy size={24} color="#EA580C" />
          <Text style={styles.statValue}>{points}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>

        <View style={styles.statItem}>
          <Award size={24} color="#2563EB" />
          <Text style={styles.statValue}>{badgesCount}</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>

        <View style={styles.statItem}>
          <Target size={24} color="#059669" />
          <Text style={styles.statValue}>{weeklyProgress}/{weeklyGoal}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.progressTitle}>Weekly Challenge Progress</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progressPercentage)}%</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    minWidth: 35,
  },
});