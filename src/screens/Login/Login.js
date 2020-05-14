import React, { useState } from 'react'
import { View, Text, ImageBackground, SafeAreaView, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import colors from '@/constants/colors'
import Input from '@/components/Input'
import Button from '@/components/Button'

export default function Login({ route }) {
  const [phone, setPhone] = useState('')

  function handleSubmit() {
    return route.params.getVerificationCode(phone)
  }

  return (
    <ImageBackground source={require('@/assets/img/splash.jpg')} style={styles.backgroundImage}>
      <SafeAreaView style={styles.root}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Sophie Chat</Text>
        </View>
        <KeyboardAwareScrollView
          extraScrollHeight={30}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}>
          <View style={styles.spacer} />
          <View style={styles.container}>
            <Text style={styles.title}>Get Login</Text>
            <View style={styles.buttons}>
              <Input value={phone} placeholder="+7 999 999-99-99" onChangeText={setPhone} />
            </View>
            <Button title="Get verification code" onPress={handleSubmit} />
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
    marginVertical: 20,
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
})
