import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useImmer } from 'use-immer'
import { useMutation, gql } from '@apollo/client'
import { getSyncProfile } from '@/utils/auth/syncProfile'
import colors from '@/constants/colors'

const CREATE_PROFILE = gql`
  mutation CreateProfile(
    $id: String!
    $photo: String!
    $phone: String!
    $username: String!
    $firstName: String!
    $lastName: String
    $bio: String
  ) {
    insert_users(
      objects: [
        {
          id: $id
          photo: $photo
          phone: $phone
          username: $username
          first_name: $firstName
          last_name: $lastName
          bio: $bio
        }
      ]
    ) {
      returning {
        id
      }
    }
  }
`

export default function FillProfile({ route }) {
  const { id, phoneNumber: phone } = getSyncProfile()
  const [person, updatePerson] = useImmer({
    firstName: '',
    lastName: '',
    username: '',
    photo: '',
    bio: '',
  })

  function updateField(field, value) {
    updatePerson(draft => {
      draft[field] = value
    })
  }

  const [createProfile] = useMutation(CREATE_PROFILE)

  // TODO — UPDATE FIREBASE USER PROFILE
  async function handleCreateProfile() {
    try {
      await createProfile({ variables: { ...person, id, phone } })
      route.params.setUnauthReason(null)
    } catch (error) {
      route.params.setUnauthReason('Please authenticate')
    }
  }

  return (
    <ImageBackground source={require('@/assets/img/splash.jpg')} style={styles.backgroundImage}>
      <SafeAreaView style={styles.root}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Sophie Chat</Text>
        </View>
        <KeyboardAwareScrollView
          extraScrollHeight={90}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}>
          <View style={styles.spacer} />
          <View style={styles.container}>
            <Text style={styles.title}>Fill Your Profile</Text>
            <View style={styles.buttons}>
              <TextInput
                value={person.firstName}
                numberOfLines={1}
                enablesReturnKeyAutomatically
                clearButtonMode="while-editing"
                placeholder="First Name*"
                placeholderTextColor={colors.textSecondary}
                returnKeyType="send"
                returnKeyLabel="send"
                onChangeText={value => updateField('firstName', value)}
                style={styles.textInput}
              />
              <TextInput
                value={person.lastName}
                numberOfLines={1}
                enablesReturnKeyAutomatically
                clearButtonMode="while-editing"
                placeholder="Last Name"
                placeholderTextColor={colors.textSecondary}
                returnKeyType="send"
                returnKeyLabel="send"
                onChangeText={value => updateField('lastName', value)}
                style={styles.textInput}
              />
              <TextInput
                value={person.username}
                numberOfLines={1}
                enablesReturnKeyAutomatically
                clearButtonMode="while-editing"
                placeholder="Username*"
                placeholderTextColor={colors.textSecondary}
                returnKeyType="send"
                returnKeyLabel="send"
                onChangeText={value => updateField('username', value)}
                style={styles.textInput}
              />
              <TextInput
                value={person.photo}
                numberOfLines={1}
                enablesReturnKeyAutomatically
                clearButtonMode="while-editing"
                placeholder="Photo*"
                placeholderTextColor={colors.textSecondary}
                returnKeyType="send"
                returnKeyLabel="send"
                onChangeText={value => updateField('photo', value)}
                style={styles.textInput}
              />
              <TextInput
                value={person.bio}
                enablesReturnKeyAutomatically
                clearButtonMode="while-editing"
                placeholder="Bio"
                placeholderTextColor={colors.textSecondary}
                returnKeyType="send"
                returnKeyLabel="send"
                onChangeText={value => updateField('bio', value)}
                style={styles.textInput}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCreateProfile}
                style={styles.button}>
                <Text style={styles.buttonTitle}>Create Your Profile</Text>
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
    marginTop: '50%',
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
  textInput: {
    height: 45,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.inputSearch,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 10,
    borderRadius: 30,
    marginBottom: 10,
  },
})
