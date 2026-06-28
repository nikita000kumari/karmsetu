import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';

interface ResumeCardProps {
  name: string;
  skill: string;
  experience: string;
  location: string;
  skillsDNA: Record<string, number>;
  verifiedSkills: string[];
}

export const ResumeCard: React.FC<ResumeCardProps> = ({
  name,
  skill,
  experience,
  location,
  skillsDNA,
  verifiedSkills,
}) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `KarmSetu Verified Professional Profile:\nName: ${name}\nTrade: ${skill}\nExperience: ${experience}\nLocation: ${location}\nTrust Score: ${skillsDNA.safety} (Avg)`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <ScrollView style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>KARMSETU VERIFIED PROFILE</Text>
          <Text style={styles.subtitle}>National Vocational Grid Mapped</Text>
        </View>
        <TouchableOpacity style={styles.btnShare} onPress={handleShare}>
          <Text style={styles.btnText}>Share profile</Text>
        </TouchableOpacity>
      </View>

      {/* Grid Details */}
      <View style={styles.grid}>
        <View style={styles.section}>
          <Text style={styles.secTitle}>Personal Details</Text>
          <Text style={styles.text}>Name: {name}</Text>
          <Text style={styles.text}>Trade: {skill}</Text>
          <Text style={styles.text}>Experience: {experience}</Text>
          <Text style={styles.text}>Location: {location}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.secTitle}>Skills DNA Rating</Text>
          {Object.entries(skillsDNA).map(([key, val]) => (
            <Text key={key} style={styles.text}>
              • {key.toUpperCase()}: {val}%
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.secTitle}>Verified Credentials</Text>
        <View style={styles.badgeRow}>
          {verifiedSkills.map((badge, idx) => (
            <View key={idx} style={styles.badge}>
              <Text style={styles.badgeText}>✓ {badge}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1E40AF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E40AF',
  },
  subtitle: {
    fontSize: 10,
    color: '#64748B',
  },
  btnShare: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 12,
  },
  section: {
    flex: 1,
  },
  secTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E40AF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 2,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 11,
    color: '#475569',
    marginVertical: 1,
  },
  bottomSection: {
    marginTop: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  badgeText: {
    color: '#065F46',
    fontSize: 9,
    fontWeight: '600',
  },
});
