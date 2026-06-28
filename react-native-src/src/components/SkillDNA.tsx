import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SkillsDNAProps {
  skills: {
    precision: number;
    safety: number;
    problemSolving: number;
    speed: number;
    communication: number;
  };
}

export const SkillDNA: React.FC<SkillsDNAProps> = ({ skills }) => {
  const dnaMetrics = [
    { label: 'Precision', value: skills.precision, color: '#3B82F6' },
    { label: 'Safety Practices', value: skills.safety, color: '#10B981' },
    { label: 'Problem Solving', value: skills.problemSolving, color: '#8B5CF6' },
    { label: 'Speed & Workflow', value: skills.speed, color: '#EC4899' },
    { label: 'Communication', value: skills.communication, color: '#F59E0B' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚡ SKILL DNA DIAGNOSTIC</Text>
      
      {dnaMetrics.map((item, index) => (
        <View key={index} style={styles.metricRow}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}%</Text>
          </View>
          
          <View style={styles.track}>
            <View 
              style={[
                styles.fill, 
                { width: `${item.value}%`, backgroundColor: item.color }
              ]} 
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  metricRow: {
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#64748B',
  },
  value: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '700',
  },
  track: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 99,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 99,
  },
});
