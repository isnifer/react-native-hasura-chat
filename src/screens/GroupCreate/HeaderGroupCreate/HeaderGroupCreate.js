import React from 'react'
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { useMutation, gql } from '@apollo/client'
import colors from '@/constants/colors'
import BackButton from '@/components/BackButton'

const FORM_SUBMISSION_SCENE = 'GroupCreateName'

const CREATE_GROUP = gql`
  mutation CreateGroup($name: String!, $picture: String!) {
    insert_groups(objects: { name: $name, picture: $picture }) {
      returning {
        id
      }
    }
  }
`

const ADD_USERS_TO_GROUP = gql`
  mutation AddUsersToGroup($users: [groups_users_insert_input!]!) {
    insert_groups_users(objects: $users) {
      returning {
        user_id
        group_id
      }
    }
  }
`

export default function HeaderGroupCreate({ navigation, scene }) {
  const routeName = scene?.route?.name
  const rightButtonTitle = routeName === FORM_SUBMISSION_SCENE ? 'Done' : 'Next'

  const [createGroup] = useMutation(CREATE_GROUP)
  const [addUsersToGroup] = useMutation(ADD_USERS_TO_GROUP)

  async function handleSubmitRightButton() {
    if (routeName !== FORM_SUBMISSION_SCENE) {
      return navigation.navigate('GroupCreateName')
    }

    const name = 'Architecture'
    const picture =
      'https://images.unsplash.com/photo-1588239705312-02089a287b81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=150&h=150&q=70'

    const response = await createGroup({ variables: { name, picture } })

    // eslint-disable-next-line camelcase
    const groupId = response?.data?.insert_groups?.returning[0]?.id
    if (groupId) {
      await addUsersToGroup({
        variables: {
          users: [
            {
              user_id: 'c107917b-3537-4b26-9d47-ee3e331c487e',
              group_id: groupId,
            },
            {
              user_id: 'd778b90b-e882-47cd-a31e-784c415a57aa',
              group_id: groupId,
            },
            {
              user_id: 'aaef77ec-0b4b-435e-b3da-7d64091f05ba',
              group_id: groupId,
            },
          ],
        },
      })
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <BackButton goBack={navigation.goBack} />
        <Text style={styles.title}>&nbsp;&nbsp;Create Group</Text>
        <TouchableOpacity onPress={handleSubmitRightButton}>
          <Text style={styles.buttonText}>{rightButtonTitle}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

HeaderGroupCreate.propTypes = {
  navigation: PropTypes.object.isRequired,
  scene: PropTypes.object,
}

HeaderGroupCreate.defaultProps = {
  scene: null,
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.primary,
  },
  container: {
    height: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
})
