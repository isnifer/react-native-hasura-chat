import React from 'react'
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { useMutation, gql } from '@apollo/client'
import { getSyncProfile } from '@/utils/auth/syncProfile'
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
        group {
          id
          name
          picture
        }
      }
    }
  }
`

export default function HeaderGroupCreate({ navigation, scene }) {
  const { id: currentUserId } = getSyncProfile()

  const routeName = scene?.route?.name
  const rightButtonTitle = routeName === FORM_SUBMISSION_SCENE ? 'Done' : 'Next'

  const [createGroup] = useMutation(CREATE_GROUP)
  const [addUsersToGroup] = useMutation(ADD_USERS_TO_GROUP)

  async function handleSubmitRightButton() {
    const { options } = scene?.descriptor ?? {}

    if (routeName !== FORM_SUBMISSION_SCENE) {
      return navigation.navigate('GroupCreateName', { userIds: options?.userIds })
    }

    const { name, picture } = options || {}
    const response = await createGroup({ variables: { name, picture } })

    // eslint-disable-next-line camelcase
    const groupId = response?.data?.insert_groups?.returning[0]?.id
    const userIds = scene?.route?.params?.userIds
    if (groupId) {
      const assignResponse = await addUsersToGroup({
        variables: {
          users: Object.keys(userIds).map(userId => ({ user_id: userId, group_id: groupId })),
        },
      })

      // eslint-disable-next-line camelcase
      const group = assignResponse?.data.insert_groups_users.returning[0].group

      navigation.popToTop()
      navigation.navigate('GroupChat', { group, userId: currentUserId, picture: group.picture })
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
