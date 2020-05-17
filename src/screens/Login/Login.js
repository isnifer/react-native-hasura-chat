import React, { useState } from 'react'
import { View, Text, ImageBackground, StyleSheet } from 'react-native'
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
      <View style={styles.root}>
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
            <Button disabled={!phone} title="Get verification code" onPress={handleSubmit} />
          </View>
        </KeyboardAwareScrollView>
      </View>
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
})
