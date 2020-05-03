import React from 'react'
import getHeaderTitle from '@/utils/getHeaderTitle'
import Header from '@/components/Header'

export default {
  header: ({ scene, previous, navigation }) => {
    const { options } = scene.descriptor
    const title = getHeaderTitle({ options, scene })

    return (
      <Header
        title={title}
        options={options}
        previous={previous}
        navigation={navigation}
        goBack={navigation.goBack}
        routeName={scene.route.name}
        routeParams={scene.route.params}
      />
    )
  },
}
