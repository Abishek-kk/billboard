import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Trophy, 
  Award, 
  Target, 
  TrendingUp, 
  Settings, 
  Bell,
  Shield,
  MapPin,
  Calendar
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function ProfileScreen() {
  const [user] = useState({
    name: 'Alex Guardian',
    email: 'alex@example.com',
    role: 'citizen',
    points: 1250,
    rank: 7,
    reportsCount: 23,
    accuracy: 94
  });

  const [badges] = useState([
    { id: '1', name: 'Early Detector', description: 'First to report 5 violations', icon: 'shield', earned: true },
    { id: '2', name: 'Compliance Champion', description: 'Achieved 95% accuracy', icon: 'award', earned: true },
    { id: '3', name: 'City Guardian', description: 'Report 50 violations', icon: 'trophy', earned: false },
    { id: '4', name: 'Perfect Week', description: 'Complete weekly challenge', icon: 'target', earned: true },
  ]);

  const [challenges] = useState([
    {
      id: '1',
      title: 'Weekly Reporter',
      description: 'Report 5 violations this week',
      progress: 3,
      target: 5,
      points: 100,
      expires: '2 days'
    },
    {
      id: '2',
      title: 'Accuracy Master',
      description: 'Maintain 90% accuracy for 10 reports',
      progress: 7,
      target: 10,
      points: 250,
      expires: '1 week'
    }
  ]);

  const earnedBadges = badges.filter(badge => badge.earned);
  const availableBadges = badges.filter(badge => !badge.earned);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#059669', '#047857']}
        style={styles.profileHeader}
      >
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.split(' ').map(n => n[0]).join('')}</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userRole}>{user.role.toUpperCase()}</Text>
            <View style={styles.rankContainer}>
              <Trophy size={16} color="#FCD34D" />
              <Text style={styles.rankText}>Rank #{user.rank}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsValue}>{user.points}</Text>
          <Text style={styles.pointsLabel}>Points</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>Performance Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.reportsCount}</Text>
              <Text style={styles.statLabel}>Reports</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.accuracy}%</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{earnedBadges.length}</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>#{user.rank}</Text>
              <Text style={styles.statLabel}>Rank</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Active Challenges</Text>
            <Target size={20} color="#6B7280" />
          </View>
          {challenges.map((challenge) => (
            <View key={challenge.id} style={styles.challengeItem}>
              <View style={styles.challengeHeader}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Badge text={`${challenge.points} pts`} variant="info" size="small" />
              </View>
              <Text style={styles.challengeDescription}>{challenge.description}</Text>
              <View style={styles.challengeProgress}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${(challenge.progress / challenge.target) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {challenge.progress}/{challenge.target}
                </Text>
              </View>
              <Text style={styles.challengeExpires}>Expires in {challenge.expires}</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Earned Badges</Text>
            <Award size={20} color="#6B7280" />
          </View>
          <View style={styles.badgesGrid}>
            {earnedBadges.map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <View style={styles.badgeIcon}>
                  <Award size={24} color="#059669" />
                </View>
                <Text style={styles.badgeName}>{badge.name}</Text>
                <Text style={styles.badgeDescription}>{badge.description}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.cardTitle}>Settings</Text>
          <View style={styles.settingsItems}>
            <TouchableOpacity style={styles.settingItem}>
              <Bell size={20} color="#6B7280" />
              <Text style={styles.settingText}>Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Shield size={20} color="#6B7280" />
              <Text style={styles.settingText}>Privacy Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <MapPin size={20} color="#6B7280" />
              <Text style={styles.settingText}>Location Preferences</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Settings size={20} color="#6B7280" />
              <Text style={styles.settingText}>General Settings</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <View style={styles.logoutContainer}>
          <Button
            title="Sign Out"
            variant="danger"
            onPress={() => {}}
            style={styles.logoutButton}
          />
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
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userRole: {
    fontSize: 12,
    color: '#D1FAE5',
    fontWeight: '500',
    marginTop: 2,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  rankText: {
    fontSize: 14,
    color: '#FCD34D',
    fontWeight: '600',
    marginLeft: 4,
  },
  pointsContainer: {
    alignItems: 'center',
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#D1FAE5',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    marginTop: 16,
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  challengeItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  challengeDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  challengeProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  challengeExpires: {
    fontSize: 10,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeItem: {
    width: '48%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 14,
  },
  settingsItems: {
    gap: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 16,
  },
  logoutContainer: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  logoutButton: {
    marginTop: 16,
  },
});