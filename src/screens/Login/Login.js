import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import useAuth from '@/hooks/useAuth'
import colors from '@/constants/colors'

export default function Login({ route }) {
  const { login, google } = useAuth(route.params)

  return (
    <ImageBackground source={require('@/assets/img/splash.jpg')} style={styles.backgroundImage}>
      <SafeAreaView style={styles.root}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Sophie Chat</Text>
        </View>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}>
          <View style={styles.spacer} />
          <View style={styles.container}>
            <Text style={styles.title}>Get Login</Text>
            <View style={styles.buttons}>
              <TouchableOpacity activeOpacity={0.8} onPress={login} style={styles.button}>
                <Image source={require('./img/Auth0.png')} style={styles.buttonLogo} />
                <Text style={styles.buttonTitle}>Login via Auth0</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={google} style={styles.button}>
                <Image source={require('./img/Google.png')} style={styles.buttonLogo} />
                <Text style={styles.buttonTitle}>Login via Google</Text>
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
    backgroundColor: '#10557F',
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
    paddingTop: 13,
    paddingBottom: 10,
    borderRadius: 30,
    marginBottom: 10,
  },
})
