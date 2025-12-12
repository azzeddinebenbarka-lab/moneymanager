// src/screens/auth/RegisterScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

// Liste complète des pays
const COUNTRIES = [
  'Afghanistan', 'Afrique du Sud', 'Albanie', 'Algérie', 'Allemagne', 'Andorre', 'Angola',
  'Arabie Saoudite', 'Argentine', 'Arménie', 'Australie', 'Autriche', 'Azerbaïdjan',
  'Bahamas', 'Bahreïn', 'Bangladesh', 'Barbade', 'Belgique', 'Belize', 'Bénin', 'Bhoutan',
  'Biélorussie', 'Bolivie', 'Bosnie-Herzégovine', 'Botswana', 'Brésil', 'Brunei', 'Bulgarie',
  'Burkina Faso', 'Burundi', 'Cambodge', 'Cameroun', 'Canada', 'Cap-Vert', 'Chili', 'Chine',
  'Chypre', 'Colombie', 'Comores', 'Congo', 'Corée du Nord', 'Corée du Sud', 'Costa Rica',
  'Côte d\'Ivoire', 'Croatie', 'Cuba', 'Danemark', 'Djibouti', 'Dominique', 'Égypte',
  'Émirats arabes unis', 'Équateur', 'Érythrée', 'Espagne', 'Estonie', 'Eswatini', 'États-Unis',
  'Éthiopie', 'Fidji', 'Finlande', 'France', 'Gabon', 'Gambie', 'Géorgie', 'Ghana', 'Grèce',
  'Grenade', 'Guatemala', 'Guinée', 'Guinée-Bissau', 'Guinée équatoriale', 'Guyana', 'Haïti',
  'Honduras', 'Hongrie', 'Inde', 'Indonésie', 'Irak', 'Iran', 'Irlande', 'Islande', 'Israël',
  'Italie', 'Jamaïque', 'Japon', 'Jordanie', 'Kazakhstan', 'Kenya', 'Kirghizistan', 'Kiribati',
  'Koweït', 'Laos', 'Lesotho', 'Lettonie', 'Liban', 'Libéria', 'Libye', 'Liechtenstein',
  'Lituanie', 'Luxembourg', 'Madagascar', 'Malaisie', 'Malawi', 'Maldives', 'Mali', 'Malte',
  'Maroc', 'Maurice', 'Mauritanie', 'Mexique', 'Micronésie', 'Moldavie', 'Monaco', 'Mongolie',
  'Monténégro', 'Mozambique', 'Myanmar', 'Namibie', 'Nauru', 'Népal', 'Nicaragua', 'Niger',
  'Nigéria', 'Norvège', 'Nouvelle-Zélande', 'Oman', 'Ouganda', 'Ouzbékistan', 'Pakistan',
  'Palaos', 'Panama', 'Papouasie-Nouvelle-Guinée', 'Paraguay', 'Pays-Bas', 'Pérou', 'Philippines',
  'Pologne', 'Portugal', 'Qatar', 'République centrafricaine', 'République démocratique du Congo',
  'République dominicaine', 'République tchèque', 'Roumanie', 'Royaume-Uni', 'Russie', 'Rwanda',
  'Saint-Kitts-et-Nevis', 'Saint-Marin', 'Saint-Vincent-et-les-Grenadines', 'Sainte-Lucie',
  'Salomon (Îles)', 'Salvador', 'Samoa', 'Sao Tomé-et-Principe', 'Sénégal', 'Serbie', 'Seychelles',
  'Sierra Leone', 'Singapour', 'Slovaquie', 'Slovénie', 'Somalie', 'Soudan', 'Soudan du Sud',
  'Sri Lanka', 'Suède', 'Suisse', 'Suriname', 'Syrie', 'Tadjikistan', 'Tanzanie', 'Tchad',
  'Thaïlande', 'Timor oriental', 'Togo', 'Tonga', 'Trinité-et-Tobago', 'Tunisie', 'Turkménistan',
  'Turquie', 'Tuvalu', 'Ukraine', 'Uruguay', 'Vanuatu', 'Vatican', 'Venezuela', 'Vietnam',
  'Yémen', 'Zambie', 'Zimbabwe'
];

const RegisterScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { register } = useAuth();
  const { t, changeLanguage } = useLanguage();
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'fr' | 'en' | 'ar'>('fr');
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ 
    name?: string;
    country?: string;
    email?: string; 
    password?: string; 
    confirmPassword?: string;
  }>({});

  // Filtrer les pays selon la recherche
  const filteredCountries = COUNTRIES.filter(c => 
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const selectCountry = (selectedCountry: string) => {
    setCountry(selectedCountry);
    setShowCountryModal(false);
    setCountrySearch('');
    if (errors.country) setErrors({ ...errors, country: undefined });
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    // Validation nom
    if (!name.trim()) {
      newErrors.name = t.nameRequired;
    }
    
    // Validation pays
    if (!country.trim()) {
      newErrors.country = t.countryRequired;
    }
    
    // Validation email
    if (!email.trim()) {
      newErrors.email = t.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t.emailInvalid;
    }
    
    // Validation mot de passe
    if (!password) {
      newErrors.password = t.passwordRequired;
    } else if (password.length < 6) {
      newErrors.password = t.passwordMinLength;
    }
    
    // Validation confirmation
    if (!confirmPassword) {
      newErrors.confirmPassword = t.passwordRequired;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t.passwordsNotMatch;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});

    try {
      // Appliquer la langue choisie AVANT l'inscription
      await changeLanguage(selectedLanguage);
      
      const result = await register(email.trim(), password);
      if (result.success) {
        // Sauvegarder le nom et le pays dans AsyncStorage
        await AsyncStorage.setItem('userName', name.trim());
        await AsyncStorage.setItem('userCountry', country.trim());
        
        // L'utilisateur sera automatiquement redirigé vers le dashboard
        // grâce à la navigation conditionnelle dans App.tsx
        console.log('✅ Inscription réussie avec langue:', selectedLanguage);
      } else {
        Alert.alert('Erreur', result.error || t.cannotCreateAccount);
      }
    } catch (err: any) {
      Alert.alert('Erreur', err?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    if (navigation) {
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header avec bouton retour */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={goToLogin} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#17233C" />
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="person-add" size={32} color="#6C63FF" />
          </View>
          <Text style={styles.title}>{t.createAccount}</Text>
          <Text style={styles.subtitle}>{t.welcomeDescription}</Text>
        </View>

        <View style={styles.form}>
          {/* Nom */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.fullName}</Text>
            <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
              <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t.fullName}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                autoCapitalize="words"
                placeholderTextColor="#bdbdbd"
                editable={!loading}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Pays */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.country}</Text>
            <TouchableOpacity 
              style={[styles.inputWrapper, errors.country && styles.inputError]}
              onPress={() => setShowCountryModal(true)}
              disabled={loading}
            >
              <Ionicons name="globe-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <Text style={[styles.input, !country && styles.placeholderText]}>
                {country || t.selectCountry}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
            {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
          </View>

          {/* Langue préférée */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Langue / Language / اللغة</Text>
            <View style={styles.languageSelector}>
              <TouchableOpacity
                style={[styles.languageButton, selectedLanguage === 'fr' && styles.languageButtonActive]}
                onPress={() => setSelectedLanguage('fr')}
                disabled={loading}
              >
                <Text style={[styles.languageFlag, selectedLanguage === 'fr' && styles.languageTextActive]}>🇫🇷</Text>
                <Text style={[styles.languageText, selectedLanguage === 'fr' && styles.languageTextActive]}>Français</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.languageButton, selectedLanguage === 'en' && styles.languageButtonActive]}
                onPress={() => setSelectedLanguage('en')}
                disabled={loading}
              >
                <Text style={[styles.languageFlag, selectedLanguage === 'en' && styles.languageTextActive]}>🇬🇧</Text>
                <Text style={[styles.languageText, selectedLanguage === 'en' && styles.languageTextActive]}>English</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.languageButton, selectedLanguage === 'ar' && styles.languageButtonActive]}
                onPress={() => setSelectedLanguage('ar')}
                disabled={loading}
              >
                <Text style={[styles.languageFlag, selectedLanguage === 'ar' && styles.languageTextActive]}>🇸🇦</Text>
                <Text style={[styles.languageText, selectedLanguage === 'ar' && styles.languageTextActive]}>العربية</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.email}</Text>
            <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
              <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t.email}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#bdbdbd"
                editable={!loading}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Mot de passe */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.password}</Text>
            <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t.passwordMinLength}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                secureTextEntry={!showPassword}
                placeholderTextColor="#bdbdbd"
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons 
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'} 
                  size={20} 
                  color="#6B7280" 
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Confirmation mot de passe */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.confirmPassword}</Text>
            <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={t.confirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                }}
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#bdbdbd"
                editable={!loading}
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)} 
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} 
                  size={20} 
                  color="#6B7280" 
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          {/* Bouton d'inscription */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister} 
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>{t.createAccount}</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          {/* Lien vers connexion */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>{t.alreadyHaveAccount}</Text>
            <TouchableOpacity onPress={goToLogin} disabled={loading}>
              <Text style={styles.linkText}>{t.signIn}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal de sélection de pays */}
      <Modal
        visible={showCountryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.selectCountry}</Text>
              <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                <Ionicons name="close" size={24} color="#17233C" />
              </TouchableOpacity>
            </View>

            {/* Barre de recherche */}
            <View style={styles.searchWrapper}>
              <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={t.searchCountry}
                value={countrySearch}
                onChangeText={setCountrySearch}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#bdbdbd"
              />
              {countrySearch.length > 0 && (
                <TouchableOpacity onPress={() => setCountrySearch('')}>
                  <Ionicons name="close-circle" size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>

            {/* Liste des pays */}
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => selectCountry(item)}
                >
                  <Text style={styles.countryText}>{item}</Text>
                  {country === item && (
                    <Ionicons name="checkmark" size={20} color="#6C63FF" />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={() => (
                <View style={styles.emptyList}>
                  <Text style={styles.emptyText}>{t.noCountryFound}</Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f6f7fb' },
  container: { flexGrow: 1, padding: 24 },
  
  topBar: {
    marginBottom: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  header: { alignItems: 'center', marginBottom: 32 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8E5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#17233c' },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 6, textAlign: 'center' },

  form: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 24, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 3 
  },
  
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, color: '#374151', marginBottom: 8, fontWeight: '600' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
  },
  inputError: { borderColor: '#EF4444' },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#17233C',
  },
  placeholderText: {
    color: '#bdbdbd',
  },
  eyeIcon: { padding: 4 },
  errorText: { fontSize: 12, color: '#EF4444', marginTop: 4 },

  button: {
    marginTop: 8,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#6C63FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  linkText: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '600',
    marginLeft: 4,
  },

  // Styles pour le modal de sélection de pays
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#17233C',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#17233C',
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  countryText: {
    fontSize: 16,
    color: '#17233C',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
  },
  emptyList: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  
  // Styles pour le sélecteur de langue
  languageSelector: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  languageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    gap: 6,
  },
  languageButtonActive: {
    borderColor: '#6C63FF',
    backgroundColor: '#F0EDFF',
  },
  languageFlag: {
    fontSize: 20,
  },
  languageText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  languageTextActive: {
    color: '#6C63FF',
  },
});

export default RegisterScreen;
