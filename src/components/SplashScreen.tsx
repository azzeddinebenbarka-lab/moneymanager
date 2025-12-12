// src/components/SplashScreen.tsx - Version moderne minimaliste
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

interface AnimatedSplashProps {
  onFinish: () => void;
}

const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation de pulsation subtile du logo
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Séquence d'animations professionnelle
    Animated.sequence([
      // Phase 1: Apparition élégante avec bounce
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Phase 2: Démarrer la pulsation
      Animated.delay(200),
    ]).start(() => {
      pulseAnimation.start();
      
      // Phase 3: Rotation subtile 360°
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start();
      
      // Phase 4: Sortie élégante après 2.5s
      setTimeout(() => {
        pulseAnimation.stop();
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onFinish();
        });
      }, 2000);
    });
  }, [fadeAnim, scaleAnim, logoRotate, pulseAnim, glowAnim, onFinish]);

  const rotate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <View style={styles.container}>
      {/* Fond dégradé élégant */}
      <View style={styles.gradientBackground} />
      
      {/* Effet de glow animé autour du logo */}
      <Animated.View
        style={[
          styles.glowContainer,
          {
            opacity: glowOpacity,
            transform: [
              { scale: Animated.multiply(scaleAnim, pulseAnim) }
            ],
          },
        ]}
      >
        <View style={styles.glowCircle} />
      </Animated.View>
      
      {/* Logo central animé */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: Animated.multiply(scaleAnim, pulseAnim) },
              { rotate }
            ],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.appIcon}
            resizeMode="contain"
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#5B4EBB', // Couleur violette moderne comme le GIF
  },
  glowContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCircle: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: (width * 0.5) / 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  iconContainer: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: (width * 0.4) / 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
  },
  appIcon: {
    width: '70%',
    height: '70%',
  },
});

export default AnimatedSplash;
