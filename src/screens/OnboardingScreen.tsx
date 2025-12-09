// src/screens/OnboardingScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  backgroundColor: string;
}

const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const slides: OnboardingSlide[] = [
    {
      id: 1,
      title: t.welcomeTitle,
      subtitle: t.welcomeDescription,
      icon: 'wallet-outline',
      color: '#6C63FF',
      backgroundColor: '#F0EFFF',
    },
    {
      id: 2,
      title: t.trackExpensesTitle,
      subtitle: t.trackExpensesDescription,
      icon: 'receipt-outline',
      color: '#FF6B6B',
      backgroundColor: '#FFE8E8',
    },
    {
      id: 3,
      title: t.budgetSavingsTitle,
      subtitle: t.budgetSavingsDescription,
      icon: 'trending-up-outline',
      color: '#4ECDC4',
      backgroundColor: '#E6F9F7',
    },
    {
      id: 4,
      title: t.statisticsTitle,
      subtitle: t.statisticsDescription,
      icon: 'stats-chart-outline',
      color: '#FF9500',
      backgroundColor: '#FFF4E6',
    },
  ];

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const handleSkip = async () => {
    await handleGetStarted();
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
    });

    return (
      <View key={slide.id} style={[styles.slide, { backgroundColor: slide.backgroundColor }]}>
        <View style={styles.content}>
          {/* Icon animé */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale }],
                opacity,
              },
            ]}
          >
            <View style={[styles.iconCircle, { backgroundColor: slide.color }]}>
              <Ionicons name={slide.icon as any} size={80} color="#FFFFFF" />
            </View>
            
            {/* Éléments décoratifs flottants */}
            <Animated.View
              style={[
                styles.floatingElement,
                styles.floatingCoin,
                {
                  transform: [
                    {
                      translateY: scrollX.interpolate({
                        inputRange,
                        outputRange: [20, 0, 20],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Ionicons name="cash" size={24} color={slide.color} />
            </Animated.View>
            
            <Animated.View
              style={[
                styles.floatingElement,
                styles.floatingCard,
                {
                  transform: [
                    {
                      translateY: scrollX.interpolate({
                        inputRange,
                        outputRange: [-20, 0, -20],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Ionicons name="card" size={24} color={slide.color} />
            </Animated.View>
          </Animated.View>

          {/* Texte */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip button */}
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      )}

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
      >
        {slides.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>

      {/* Bottom section */}
      <View style={styles.bottomContainer}>
        {/* Pagination dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => {
            const dotWidth = scrollX.interpolate({
              inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ],
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity,
                    backgroundColor: slides[currentIndex].color,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Button */}
        {currentIndex === slides.length - 1 ? (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: slides[currentIndex].color }]}
            onPress={handleGetStarted}
          >
            <Text style={styles.buttonText}>{t.getStarted}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: slides[currentIndex].color }]}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>{t.next}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  skipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    position: 'relative',
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  floatingElement: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  floatingCoin: {
    top: 20,
    left: 20,
  },
  floatingCard: {
    bottom: 20,
    right: 20,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 30,
    height: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 60,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
});

export default OnboardingScreen;
