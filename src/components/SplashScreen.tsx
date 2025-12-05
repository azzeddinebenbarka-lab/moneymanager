// src/components/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashProps {
  onFinish: () => void;
}

// Composant pour une pièce qui tombe
const FallingCoin: React.FC<{ delay: number; x: number; type: number }> = ({ delay, x, type }) => {
  const fallAnim = useRef(new Animated.Value(-200)).current; // Commence bien au-dessus de l'écran
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.timing(fallAnim, {
          toValue: height + 150,
          duration: 2500 + Math.random() * 1500,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Pièces en or avec effet 3D - symboles alternés
  const symbols = ['$', '€', '$', '€']; // Alterne dollar et euro
  const symbol = symbols[type % symbols.length];
  
  const coinStyle = { 
    bg: '#D4AF37', 
    border: '#B8860B', 
    textColor: '#8B7355' 
  };

  return (
    <Animated.View
      style={[
        styles.coin,
        {
          left: x,
          transform: [{ translateY: fallAnim }, { rotate }],
        },
      ]}
    >
      <View style={[styles.coinInner, { backgroundColor: coinStyle.bg, borderColor: coinStyle.border }]}>
        <View style={styles.coinCenter}>
          <Text style={[styles.coinSymbol, { color: coinStyle.textColor }]}>{symbol}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  // Générer des positions aléatoires pour les pièces (30 pièces pour effet plus dense)
  const coins = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * (width - 50),
    delay: Math.random() * 2500,
    type: i,
  }));

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Terminer après 2.5 secondes
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background gradient moderne - simulé avec couleur unie */}
      <View style={styles.gradientBackground} />

      {/* Pièces qui tombent */}
      {coins.map((coin) => (
        <FallingCoin key={coin.id} x={coin.x} delay={coin.delay} type={coin.type} />
      ))}

      {/* Contenu principal */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
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
        <Text style={styles.title}>MoneyManager</Text>
        <Text style={styles.subtitle}>Gestion intelligente de vos finances</Text>
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
    backgroundColor: '#764ba2', // Couleur principale du gradient
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
  },
  appIcon: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Styles pour les pièces
  coin: {
    position: 'absolute',
    width: 50,
    height: 50,
    zIndex: 1,
  },
  coinInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#B8860B',
  },
  coinCenter: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DAA520',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B8860B',
  },
  coinSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B7355',
  },
});

export default AnimatedSplash;
