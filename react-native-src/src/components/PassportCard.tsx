import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';

interface PassportCardProps {
  name: string;
  skill: string;
  experience: string;
  trustScore: number;
  avatarUrl: string;
}

export const PassportCard: React.FC<PassportCardProps> = ({
  name,
  skill,
  experience,
  trustScore,
  avatarUrl,
}) => {
  return (
    <View style={styles.cardContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>Karm<Text style={styles.brandAccent}>Setu</Text></Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>VERIFIED</Text>
        </View>
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarRow}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <View style={styles.workerInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.skill}>{skill}</Text>
        </View>
      </View>

      {/* Trust Score & QR Section */}
      <View style={styles.scoreRow}>
        <View style={styles.scoreCol}>
          <Text style={styles.scoreLabel}>TRUST INDEX</Text>
          <Text style={styles.scoreVal}>
            {trustScore}
            <Text style={styles.scoreDenom}>/100</Text>
          </Text>
          <View style={styles.starsRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Text key={i} style={styles.star}>★</Text>
            ))}
          </View>
        </View>

        <View style={styles.qrContainer}>
          {/* Mock QR code using SVG */}
          <Svg width={64} height={64} viewBox="0 0 100 100">
            <Rect width={100} height={100} fill="white" />
            <Path d="M10 10h30v30H10zm5 5h20v20H15zm45-5h30v30H60zm5 5h20v20H65zM10 60h30v30H10zm5 5h20v20H15zm50 15h10v10H65zm10-10h15v10H75zm-15-5h15v10H60zm25 0h5v10H85zm-15 15h5v5h-5z" fill="black" />
          </Svg>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Experience</Text>
          <Text style={styles.footerVal}>{experience}</Text>
        </View>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Certificates</Text>
          <Text style={styles.footerVal}>NSQF Level 4</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 12,
    marginBottom: 14,
  },
  brand: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  brandAccent: {
    color: '#F59E0B',
  },
  badge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 1,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  workerInfo: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  skill: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
  },
  scoreCol: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 9,
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  scoreVal: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 32,
    marginTop: 2,
  },
  scoreDenom: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '400',
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  star: {
    color: '#F59E0B',
    fontSize: 12,
    marginRight: 2,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 4,
    borderRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    marginTop: 14,
    paddingTop: 12,
  },
  footerItem: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 8,
    color: '#64748B',
    textTransform: 'uppercase',
  },
  footerVal: {
    fontSize: 11,
    color: '#F1F5F9',
    fontWeight: '600',
    marginTop: 2,
  },
});
