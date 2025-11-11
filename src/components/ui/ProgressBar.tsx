// src/components/ui/ProgressBar.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface ProgressBarProps {
  progress: number;
  height?: number;
  showLabel?: boolean;
  color?: string;
  trackColor?: string;
}

export const ProgressBar = ({ 
  progress, 
  height = 8, 
  showLabel = false,
  color,
  trackColor
}: ProgressBarProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const progressWidth = Math.max(0, Math.min(100, progress));

  const progressColor = color || (progress >= 100 ? '#34C759' : '#007AFF');
  const backgroundColor = trackColor || (isDark ? '#38383a' : '#f0f0f0');

  return (
    <View style={styles.container}>
      <View style={[styles.track, { height, backgroundColor }]}>
        <View 
          style={[
            styles.progress, 
            { 
              width: `${progressWidth}%`,
              height,
              backgroundColor: progressColor
            }
          ]} 
        />
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>
          {progress.toFixed(0)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 30,
  },
});

export default ProgressBar;