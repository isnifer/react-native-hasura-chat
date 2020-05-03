import React, { useState, useCallback } from 'react'
import { RefreshControl as RNRefreshControl } from 'react-native'
import PropTypes from 'prop-types'
import colors from '@/constants/colors'

export default function RefreshControl({ handleRefresh, title }) {
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
      enabled={refreshing}
      refreshing={refreshing}
      onRefresh={onRefresh}
      title={title}
      tintColor={colors.textSecondary}
      titleColor={colors.textSecondary}
      progressBackgroundColor={colors.textSecondary}
    />
  )
}

RefreshControl.propTypes = {
  handleRefresh: PropTypes.func.isRequired,
  title: PropTypes.string,
}

RefreshControl.defaultProps = {
  title: 'Pull to Refresh',
}
