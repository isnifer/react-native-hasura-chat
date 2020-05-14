import React, { Fragment, useState } from 'react'
import { View, Text, ImageBackground, SafeAreaView, Animated, StyleSheet } from 'react-native'
import auth from '@react-native-firebase/auth'
import { Form, Field } from 'react-final-form'
import { useMutation, gql } from '@apollo/client'
import useKeyboardAvoid from '@/hooks/useKeyboardAvoid'
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
  const [formHeight, setFormHeight] = useState()
  const [focusedInputPosition, setFocusedInputPosition] = useState(0)
  const { animatedHeight } = useKeyboardAvoid(focusedInputPosition.current)

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

  function handleInputFocus(orderNumber, extra = 0) {
    setFocusedInputPosition(formHeight - 30 - 40 - 20 - 45 - 30 + orderNumber * (45 + 10) + extra)
  }

  function handleFormLayout(formNode) {
    if (!formHeight) {
      setFormHeight(formNode.nativeEvent.layout.height)
    }
  }

  return (
    <ImageBackground source={require('@/assets/img/splash.jpg')} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <Animated.View
          onLayout={handleFormLayout}
          style={[styles.formContainer, { marginBottom: animatedHeight }]}>
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
                    onInputFocus={() => handleInputFocus(0)}
                  />
                  <Field
                    name="lastName"
                    data={fieldsData.lastName}
                    component={FormInput}
                    placeholder={fieldsData.lastName.label}
                    enablesReturnKeyAutomatically={false}
                    onInputFocus={() => handleInputFocus(1)}
                  />
                  <Field
                    name="username"
                    component={FormInput}
                    validate={isRequired}
                    data={fieldsData.username}
                    placeholder={`${fieldsData.username.label} *`}
                    autoCorrect={false}
                    autoCapitalize="none"
                    onInputFocus={() => handleInputFocus(2, -95)}
                  />
                  <Field
                    name="photo"
                    component={FormInput}
                    validate={isRequired}
                    data={fieldsData.photo}
                    placeholder={`${fieldsData.photo.label} *`}
                    autoCorrect={false}
                    autoCapitalize="none"
                    onInputFocus={() => handleInputFocus(3, -95)}
                  />
                  <Field
                    name="bio"
                    data={fieldsData.bio}
                    component={FormInput}
                    placeholder={fieldsData.bio.label}
                    enablesReturnKeyAutomatically={false}
                    onInputFocus={() => handleInputFocus(4, 45)}
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
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: StyleSheet.absoluteFillObject,
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  formContainer: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 38,
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
})
