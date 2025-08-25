import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  text: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'small' | 'medium' | 'large';
}

export function Badge({ text, variant = 'neutral', size = 'medium' }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant], styles[size]]}>
      <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`]]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  success: {
    backgroundColor: '#D1FAE5',
  },
  warning: {
    backgroundColor: '#FEF3C7',
  },
  danger: {
    backgroundColor: '#FEE2E2',
  },
  info: {
    backgroundColor: '#DBEAFE',
  },
  neutral: {
    backgroundColor: '#F3F4F6',
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  medium: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  large: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  text: {
    fontWeight: '500',
    fontSize: 12,
  },
  successText: {
    color: '#065F46',
  },
  warningText: {
    color: '#92400E',
  },
  dangerText: {
    color: '#991B1B',
  },
  infoText: {
    color: '#1E40AF',
  },
  neutralText: {
    color: '#374151',
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
});