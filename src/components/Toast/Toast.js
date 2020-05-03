import React, { Component } from 'react'
import { StyleSheet, View, Animated, Dimensions, Text, ViewPropTypes, Platform } from 'react-native'
import PropTypes from 'prop-types'

const { height } = Dimensions.get('window')

export const DURATION = {
  LENGTH_SHORT: 500,
  FOREVER: 0,
}

export default class Toast extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShow: false,
      text: '',
      opacityValue: new Animated.Value(this.props.opacity),
    }
  }

  show(text, duration, callback) {
    this.duration = typeof duration === 'number' ? duration : DURATION.LENGTH_SHORT
    this.callback = callback
    this.setState({ text, isShow: true })

    this.animation = Animated.timing(this.state.opacityValue, {
      toValue: this.props.opacity,
      duration: this.props.fadeInDuration,
      useNativeDriver: Platform.OS === 'Android',
    })

    this.animation.start(() => {
      this.isShow = true
      if (duration !== DURATION.FOREVER) this.close()
    })
  }

  close(duration) {
    let delay = typeof duration === 'undefined' ? this.duration : duration

    if (delay === DURATION.FOREVER) delay = this.props.defaultCloseDelay || 250

    if (!this.isShow && !this.state.isShow) return

    if (this.timer) {
      clearTimeout(this.timer)
    }

    this.timer = setTimeout(() => {
      this.animation = Animated.timing(this.state.opacityValue, {
        toValue: 0.0,
        duration: this.props.fadeOutDuration,
        useNativeDriver: Platform.OS === 'Android',
      })

      this.animation.start(() => {
        this.setState({ isShow: false })
        this.isShow = false

        if (typeof this.callback === 'function') {
          this.callback()
        }
      })
    }, delay)
  }

  componentWillUnmount() {
    if (this.animation) {
      this.animation.stop()
    }

    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  render() {
    let top

    switch (this.props.position) {
      case 'top': {
        top = this.props.positionValue
        break
      }

      case 'center': {
        top = height / 2
        break
      }

      case 'bottom': {
        top = height - this.props.positionValue
        break
      }

      default: {
        break
      }
    }

    const view = this.state.isShow ? (
      <View style={[styles.container, { top }]} pointerEvents="none">
        <Animated.View
          style={[styles.content, { opacity: this.state.opacityValue }, this.props.style]}>
          {React.isValidElement(this.state.text) ? (
            this.state.text
          ) : (
            <Text style={this.props.textStyle}>{this.state.text}</Text>
          )}
        </Animated.View>
      </View>
    ) : null
    return view
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    elevation: 999,
    alignItems: 'center',
    zIndex: 10000,
  },
  content: {
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 10,
  },
  text: {
    color: 'white',
  },
})

Toast.propTypes = {
  style: ViewPropTypes.style,
  position: PropTypes.oneOf(['top', 'center', 'bottom']),
  textStyle: Text.propTypes.style,
  positionValue: PropTypes.number,
  fadeInDuration: PropTypes.number,
  fadeOutDuration: PropTypes.number,
  opacity: PropTypes.number,
}

Toast.defaultProps = {
  style: null,
  position: 'bottom',
  textStyle: styles.text,
  positionValue: 120,
  fadeInDuration: 500,
  fadeOutDuration: 500,
  opacity: 1,
}
