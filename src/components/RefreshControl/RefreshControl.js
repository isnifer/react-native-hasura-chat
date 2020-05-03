import React, { useState, useCallback } from 'react'
import { RefreshControl as RNRefreshControl } from 'react-native'
import PropTypes from 'prop-types'
import colors from '@/constants/colors'

export default function RefreshControl({ handleRefresh }) {
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true)
      await handleRefresh()
    } finally {
      setRefreshing(false)
    }
  }, [refreshing])

  return (
    <RNRefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.textSecondary}
      progressBackgroundColor={colors.textSecondary}
    />
  )
}

RefreshControl.propTypes = {
  handleRefresh: PropTypes.func.isRequired,
}
