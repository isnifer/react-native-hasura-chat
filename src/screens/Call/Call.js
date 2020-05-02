import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { RTCView } from 'react-native-webrtc'
import { startCase } from 'lodash'
import colors from '@/constants/colors'
import useVideoCall from '@/hooks/useVideoCall'

export default function Call({ route }) {
  const { type } = route.params
  const { localStream, remoteStream, createOffer, createAnswer } = useVideoCall()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{startCase(type)} Call Screen</Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.button, styles.buttonOffer]} onPress={createOffer}>
          <Text style={styles.buttonText}>Offer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonAnswer]} onPress={createAnswer}>
          <Text style={styles.buttonText}>Answer</Text>
        </TouchableOpacity>
      </View>
      {localStream && <RTCView streamURL={localStream} style={styles.myStream} />}
      {remoteStream && <RTCView streamURL={remoteStream} style={styles.remoteStream} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  title: {
    fontSize: 32,
    color: 'white',
    textAlign: 'center',
  },
  myStream: {
    position: 'absolute',
    zIndex: 10,
    top: 100,
    right: 20,
    width: 100,
    height: 150,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  remoteStream: {
    flex: 1,
  },
  buttons: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    width: 150,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOffer: {
    backgroundColor: 'green',
  },
  buttonAnswer: {
    backgroundColor: 'red',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.text,
  },
})
