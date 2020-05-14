import React, { Fragment } from 'react'
import { View, Text, ImageBackground, SafeAreaView, StyleSheet } from 'react-native'
import auth from '@react-native-firebase/auth'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Form, Field } from 'react-final-form'
import { useMutation, gql } from '@apollo/client'
import { getSyncProfile } from '@/utils/auth/syncProfile'
import arrayToString from '@/utils/arrayToString'
import { UNAUTH_REASONS } from '@/constants'
import colors from '@/constants/colors'
import { FormInput } from '@/components/Input'
import Button from '@/components/Button'

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

const fieldsData = {
  firstName: { label: 'First Name' },
  lastName: { label: 'Last Name' },
  username: { label: 'Username' },
  photo: { label: 'Photo' },
  bio: { label: 'Bio' },
}

const subscription = {
  submitting: true,
  pristine: true,
  invalid: true,
}

function isRequired(value, allValues, meta) {
  return value ? undefined : `${meta.data?.label ?? 'This Field'} is Required`
}

export default function FillProfile({ route }) {
  const { id, phoneNumber: phone } = getSyncProfile()
  const [createProfile] = useMutation(CREATE_PROFILE)

  async function handleCreateProfile(values) {
    try {
      // Create New User in Hasura DB
      await createProfile({ variables: { ...values, id, phone } })

      // Update Firebase User Profile
      await auth().currentUser.updateProfile({
        displayName: arrayToString([values.firstName, values.lastName], ' '),
        photoURL: values.photo,
      })

      // Switch to Application Screen
      route.params.setUnauthReason(null)
    } catch (error) {
      route.params.setUnauthReason(UNAUTH_REASONS.LOGIN)
    }
  }

  return (
    <ImageBackground source={require('@/assets/img/splash.jpg')} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          extraScrollHeight={30}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}>
          <View style={styles.formContainer}>
            <View style={styles.emptyBlock} />
            <Text style={styles.title}>Fill Your Profile</Text>
            <Form
              onSubmit={handleCreateProfile}
              subscription={subscription}
              render={({ handleSubmit, submitting, pristine, invalid }) => (
                <Fragment>
                  <View style={styles.form}>
                    <Field
                      name="firstName"
                      data={fieldsData.firstName}
                      component={FormInput}
                      placeholder={`${fieldsData.firstName.label} *`}
                      validate={isRequired}
                    />
                    <Field
                      name="lastName"
                      data={fieldsData.lastName}
                      component={FormInput}
                      placeholder={fieldsData.lastName.label}
                      enablesReturnKeyAutomatically={false}
                    />
                    <Field
                      name="username"
                      component={FormInput}
                      validate={isRequired}
                      data={fieldsData.username}
                      placeholder={`${fieldsData.username.label} *`}
                      autoCorrect={false}
                      autoCapitalize="none"
                    />
                    <Field
                      name="photo"
                      component={FormInput}
                      validate={isRequired}
                      data={fieldsData.photo}
                      placeholder={`${fieldsData.photo.label} *`}
                      autoCorrect={false}
                      autoCapitalize="none"
                    />
                    <Field
                      name="bio"
                      data={fieldsData.bio}
                      component={FormInput}
                      placeholder={fieldsData.bio.label}
                      enablesReturnKeyAutomatically={false}
                    />
                  </View>
                  <Button
                    title="Create Your Profile"
                    disabled={invalid || pristine || submitting}
                    onPress={handleSubmit}
                  />
                </Fragment>
              )}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: StyleSheet.absoluteFillObject,
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollView: {
    flexGrow: 1,
  },
  formContainer: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 38,
    height: '100%',
    marginTop: '60%',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.text,
  },
  form: {
    marginTop: 20,
    marginBottom: 24,
  },
  emptyBlock: {
    height: 10,
    backgroundColor: 'transparent',
  },
})
