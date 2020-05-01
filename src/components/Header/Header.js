import React from 'react'
import { View, SafeAreaView, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import colors from '@/constants/colors'
import BackButton from '@/components/BackButton'

function LeftButtonsDefault({ previous, goBack, title, routeParams }) {
  return (
    <View style={styles.leftButtons}>
      {!!previous && <BackButton goBack={goBack} />}
      {routeParams.picture && (
        <Image source={{ uri: routeParams.picture }} style={styles.picture} />
      )}
      <Text style={[styles.title, previous && styles.titleInner]}>{title}</Text>
    </View>
  )
}

function RightButtonsProfile() {
  return (
    <View style={styles.rightButtons}>
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  )
}

function RightButtonsSettings() {
  return (
    <View style={styles.rightButtons}>
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  )
}

function RightButtonsChats() {
  return (
    <View style={styles.rightButtons}>
      <TouchableOpacity onPress={() => {}}>
        <Image source={require('./img/person.png')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}} style={styles.buttonSearch}>
        <Image source={require('./img/search.png')} />
      </TouchableOpacity>
    </View>
  )
}

function RightButtonsGroupCreateName() {
  return (
    <View style={styles.rightButtons}>
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function Header({ title, goBack, previous, routeParams }) {
  const LeftButtons = LeftButtonsDefault
  let RightButtons

  switch (title) {
    case 'Profile': {
      RightButtons = RightButtonsProfile
      break
    }

    case 'Settings': {
      RightButtons = RightButtonsSettings
      break
    }

    case 'GroupCreateName': {
      RightButtons = RightButtonsGroupCreateName
      break
    }

    default: {
      RightButtons = RightButtonsChats
      break
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <LeftButtons previous={previous} goBack={goBack} title={title} routeParams={routeParams} />
        <RightButtons />
      </View>
    </SafeAreaView>
  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  // routeName: PropTypes.string.isRequired,
  previous: PropTypes.object,
  routeParams: PropTypes.object,
}

Header.defaultProps = {
  previous: null,
  routeParams: {},
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
  picture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 15,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.text,
  },
  titleSmall: {
    fontSize: 16,
    fontWeight: '500',
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
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
})
