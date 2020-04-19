import React from 'react'
import { View, SafeAreaView, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import colors from '@/constants/colors'
import BackButton from '@/components/BackButton'

export default function Header({ title, goBack, previous }) {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <View style={styles.leftButtons}>
          {!!previous && <BackButton goBack={goBack} />}
          <Text style={[styles.title, previous && styles.titleInner]}>{title}</Text>
        </View>
        <View style={styles.rightButtons}>
          <TouchableOpacity onPress={() => {}}>
            <Image source={require('./img/person.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.buttonSearch}>
            <Image source={require('./img/search.png')} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  previous: PropTypes.object,
}

Header.defaultProps = {
  previous: null,
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.primary,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  titleInner: {
    marginLeft: 10,
  },
  leftButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonSearch: {
    marginLeft: 20,
  },
})
