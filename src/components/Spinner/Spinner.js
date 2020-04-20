import React from 'react'
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

export default function Spinner(props) {
  return (
    <SafeAreaView style={[styles.container, props.flex && styles.containerFlex]}>
      <ActivityIndicator />
    </SafeAreaView>
  )
}

Spinner.propTypes = {
  flex: PropTypes.bool,
}

Spinner.defaultProps = {
  flex: false,
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerFlex: {
    flex: 1,
  },
})
