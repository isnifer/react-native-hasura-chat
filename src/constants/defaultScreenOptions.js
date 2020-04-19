import React from 'react'
import getHeaderTitle from '@/utils/getHeaderTitle'
import Header from '@/components/Header'

export default {
  header: ({ scene, previous, navigation }) => {
    const { options } = scene.descriptor
    const title = getHeaderTitle({ options, scene })

    return <Header title={title} previous={previous} goBack={navigation.goBack} />
  },
}
