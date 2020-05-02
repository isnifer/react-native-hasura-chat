import { useState, useEffect, useRef } from 'react'
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
} from 'react-native-webrtc'
import io from 'socket.io-client'

export default function useVideoCall() {
  const socket = useRef()
  const pc = useRef()
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)

  function sendToPeer(type, payload) {
    socket.current.emit(type, { payload })
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
  // initiates the creation of SDP
  async function createOffer() {
    const sdp = await pc.current.createOffer()
    pc.current.setLocalDescription(sdp)
    sendToPeer('offerOrAnswer', sdp)
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createAnswer
  // creates an SDP answer to an offer received from remote pc
  async function createAnswer() {
    const sdp = await pc.current.createAnswer()
    pc.current.setLocalDescription(sdp)
    sendToPeer('offerOrAnswer', sdp)
  }

  async function runStream() {
    const isFront = true

    const sourceInfos = await mediaDevices.enumerateDevices()
    let videoSourceId

    for (let i = 0; i < sourceInfos.length; i += 1) {
      const sourceInfo = sourceInfos[i]
      if (
        sourceInfo.kind === 'videoinput' &&
        sourceInfo.facing === (isFront ? 'front' : 'environment')
      ) {
        videoSourceId = sourceInfo.deviceId
      }
    }

    const userStream = await mediaDevices.getUserMedia({
      audio: true,
      video: {
        mandatory: {
          width: 1280, // Provide your own width, height and frame rate here
          height: 720,
          frameRate: 30,
        },
        facingMode: isFront ? 'user' : 'environment',
        optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
      },
    })

    setLocalStream(userStream.toURL())
    pc.current.addStream(userStream)
  }

  useEffect(() => {
    socket.current = io('ws://e9fe30.emporter.eu/webrtcPeer', { path: '/webrtc', query: {} })

    // eslint-disable-next-line no-console
    socket.current.on('connection-success', () => console.log('success'))

    socket.current.on('offerOrAnswer', sdp => {
      // set sdp as remote description
      pc.current.setRemoteDescription(new RTCSessionDescription(sdp))
    })

    socket.current.on('candidate', candidate => {
      pc.current.addIceCandidate(new RTCIceCandidate(candidate))
    })

    pc.current = new RTCPeerConnection({ iceServers: [{ url: 'stun:stun.l.google.com:19302' }] })

    // triggered when a new candidate is returned
    pc.current.onicecandidate = e => {
      if (e.candidate) {
        sendToPeer('candidate', e.candidate)
      }
    }

    // triggered when there is a change in connection state
    pc.current.oniceconnectionstatechange = () => {}

    // triggered when a stream is added to pc, see below - pc.current.addStream(stream)
    pc.current.onaddstream = e => {
      setRemoteStream(e.stream.toURL())
      pc.current.addStream(e.stream)
    }

    runStream()
  }, [])

  return {
    localStream,
    remoteStream,
    createOffer,
    createAnswer,
  }
}
