import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Violation } from '@/types';

interface ViolationCardProps {
  violation: Violation;
  onPress?: () => void;
}

export function ViolationCard({ violation, onPress }: ViolationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'verified': return 'danger';
      case 'resolved': return 'success';
      case 'false_positive': return 'neutral';
      default: return 'neutral';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return '#DC2626'; // High confidence - red
    if (score >= 0.6) return '#EA580C'; // Medium confidence - orange
    return '#10B981'; // Low confidence - green
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <AlertTriangle size={20} color="#DC2626" />
            <Text style={styles.title}>{violation.type.replace('_', ' ').toUpperCase()}</Text>
          </View>
          <Badge 
            text={violation.status} 
            variant={getStatusColor(violation.status)} 
          />
        </View>

        {violation.photo_url && (
          <Image source={{ uri: violation.photo_url }} style={styles.image} />
        )}

        <Text style={styles.description} numberOfLines={2}>
          {violation.description}
        </Text>

        <View style={styles.metadata}>
          <View style={styles.metaRow}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.metaText} numberOfLines={1}>
              {violation.location.address}
            </Text>
          </View>
          
          <View style={styles.metaRow}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.metaText}>
              {formatDate(violation.created_at)}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Confidence:</Text>
            <View style={[styles.confidenceBar, { backgroundColor: getConfidenceColor(violation.confidence_score) }]}>
              <Text style={styles.confidenceText}>
                {Math.round(violation.confidence_score * 100)}%
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  metadata: {
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  confidenceBar: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});