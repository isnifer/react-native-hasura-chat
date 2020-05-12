import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import useAuth from '@/hooks/useAuth'
import colors from '@/constants/colors'

export default function Login({ route }) {
  const { phone, setPhone, code, setCode, signInWithPhoneNumber } = useAuth(route.params)

  return (
    <ImageBackground source={require('@/assets/img/splash.jpg')} style={styles.backgroundImage}>
      <SafeAreaView style={styles.root}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Sophie Chat</Text>
        </View>
        <KeyboardAwareScrollView
          extraScrollHeight={90}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}>
          <View style={styles.spacer} />
          <View style={styles.container}>
            <Text style={styles.title}>Get Login</Text>
            <View style={styles.buttons}>
              <TextInput
                value={phone}
                numberOfLines={1}
                enablesReturnKeyAutomatically
                clearButtonMode="while-editing"
                placeholder="+7 999 999-99-99"
                placeholderTextColor={colors.textSecondary}
                returnKeyType="send"
                returnKeyLabel="send"
                onChangeText={setPhone}
                style={styles.textInput}
              />
              <TextInput
                value={code}
                numberOfLines={1}
                enablesReturnKeyAutomatically
                clearButtonMode="while-editing"
                placeholder="999999"
                placeholderTextColor={colors.textSecondary}
                returnKeyType="send"
                returnKeyLabel="send"
                onChangeText={setCode}
                style={styles.textInput}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={signInWithPhoneNumber}
                style={styles.button}>
                <Text style={styles.buttonTitle}>Get verification code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-between',
    position: 'relative',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  logoContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
    marginTop: 50,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
    paddingHorizontal: 38,
    height: '100%',
    marginTop: '100%',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.text,
  },
  buttons: {
    marginTop: 20,
  },
  button: {
    height: 47,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.button,
    borderRadius: 30,
    marginTop: 20,
    position: 'relative',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  buttonLogo: {
    width: 45,
    height: 45,
    position: 'absolute',
    top: 0,
    left: 1,
  },
  textInput: {
    height: 45,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.inputSearch,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 10,
    borderRadius: 30,
    marginBottom: 10,
  },
})
