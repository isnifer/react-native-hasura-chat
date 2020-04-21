import React, { useState } from 'react'
import { View, Text, TextInput, ImageBackground, SafeAreaView, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import useAuth from '@/hooks/useAuth'
import colors from '@/constants/colors'

export default function Login({ route }) {
  const { loading, loadVerificationCode, loginViaEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')

  async function handleSubmitVerificationCode() {
    if (loading) {
      return false
    }

    const response = await loginViaEmail({ email, code: verificationCode })
    if (response) {
      return route.params.handleSuccessLogin()
    }
  }

  async function handleSubmitEmail() {
    if (loading) {
      return false
    }

    return loadVerificationCode({ email })
  }

  return (
    <ImageBackground source={require('@/assets/img/splash.jpg')} style={styles.backgroundImage}>
      <SafeAreaView style={styles.root}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Brand New Chat</Text>
        </View>
        <KeyboardAwareScrollView style={styles.scrollView}>
          <View style={styles.spacer} />
          <View style={styles.container}>
            <Text style={styles.title}>Get Login</Text>
            <TextInput
              enablesReturnKeyAutomatically
              autoCompleteType="email"
              autoCorrect={false}
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onSubmitEditing={handleSubmitEmail}
              keyboardType="email-address"
              clearButtonMode="while-editing"
              placeholder="john@appleseed.com"
              placeholderTextColor={colors.textSecondary}
              returnKeyType="send"
              returnKeyLabel="Get Code"
              style={styles.textInput}
            />
            <TextInput
              enablesReturnKeyAutomatically
              value={verificationCode}
              onChangeText={setVerificationCode}
              onSubmitEditing={handleSubmitVerificationCode}
              keyboardType="number-pad"
              clearButtonMode="while-editing"
              placeholder="Verification Code"
              placeholderTextColor={colors.textSecondary}
              returnKeyType="send"
              returnKeyLabel="Get Code"
              style={styles.textInput}
            />
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
    flex: 1,
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
    marginBottom: 30,
  },
  buttonGoogle: {
    width: '100%',
    height: 47,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10557F',
    borderRadius: 30,
  },
  buttonTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  textInput: {
    height: 45,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.inputSearch,
    paddingHorizontal: 22,
    paddingTop: 13,
    paddingBottom: 10,
    borderRadius: 30,
    marginBottom: 10,
  },
})
