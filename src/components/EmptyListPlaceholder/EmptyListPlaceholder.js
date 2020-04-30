import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import colors from '@/constants/colors'

export default function EmptyListPlaceholder(props) {
  return (
    <View style={styles.container}>
      <Image source={props.image} />
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.subtitle}>{props.subtitle}</Text>
      <TouchableOpacity onPress={props.actionHandler}>
        <Text style={styles.openSearch}>{props.actionTitle}</Text>
      </TouchableOpacity>
    </View>
  )
}

EmptyListPlaceholder.propTypes = {
  image: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  actionTitle: PropTypes.string.isRequired,
  actionHandler: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginTop: 25,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 15,
  },
  openSearch: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.link,
    marginTop: 15,
  },
})
