import React, { useState, useEffect } from 'react'
import { View, Image, TextInput, SafeAreaView, StyleSheet } from 'react-native'
import { useQuery, gql } from '@apollo/client'
import { debounce } from 'lodash'
import { useImmer } from 'use-immer'
import colors from '@/constants/colors'
import ListGroupCreate from './ListGroupCreate'

const USERS = gql`
  query Users($userId: uuid!, $query: String) {
    users(
      where: {
        _and: [
          { id: { _neq: $userId } }
          { _or: [{ first_name: { _ilike: $query } }, { last_name: { _ilike: $query } }] }
        ]
      }
    ) {
      id
      firstName: first_name
      lastName: last_name
      photo
    }
  }
`
const USER_ID = 'c107917b-3537-4b26-9d47-ee3e331c487e'

export default function GroupCreate({ navigation }) {
  const { loading, error, data, refetch } = useQuery(USERS, { variables: { userId: USER_ID } })
  const users = data?.users ?? []

  const [searchValue, setSearchValue] = useState('')
  const searchPeople = debounce(refetch, 600)

  function handleSearchPeople(query) {
    setSearchValue(query)

    searchPeople({ userId: USER_ID, query: `%${query}%` })
  }

  const [selected, updateSelected] = useImmer({})
  function handlePressItem(id) {
    updateSelected(draft => {
      draft[id] = !draft[id]
    })
  }

  useEffect(() => {
    navigation.setOptions({ userIds: { ...selected, [USER_ID]: true } })
  }, [selected])

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.panelSearch}>
        <Image source={require('@/components/Header/img/search.png')} style={styles.iconSearch} />
        <TextInput
          value={searchValue}
          numberOfLines={1}
          blurOnSubmit={false}
          enablesReturnKeyAutomatically
          clearButtonMode="always"
          placeholder="Find a friend"
          placeholderTextColor={colors.textSecondary}
          returnKeyType="search"
          returnKeyLabel="search"
          onChangeText={handleSearchPeople}
          style={styles.inputSearch}
        />
      </View>
      <ListGroupCreate
        loading={loading}
        error={error}
        data={users}
        selected={selected}
        handlePressItem={handlePressItem}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: colors.backgroundColor,
  },
  panelSearch: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'relative',
  },
  iconSearch: {
    position: 'absolute',
    width: 15,
    height: 15,
    top: 20,
    left: 38,
  },
  inputSearch: {
    height: 35,
    fontSize: 13,
    color: colors.text,
    backgroundColor: colors.inputSearch,
    paddingRight: 20,
    paddingLeft: 45,
    borderRadius: 30,
  },
})
