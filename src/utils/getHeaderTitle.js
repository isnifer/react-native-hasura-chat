import { get } from 'lodash'

export default function getHeaderTitle({ options, scene }) {
  const routeState = get(scene, ['route', 'state'])
  if (routeState) {
    return routeState.routeNames[routeState.index]
  }

  if (options.headerTitle) {
    return options.headerTitle
  }

  if (options.title) {
    return options.title
  }

  return scene.route.name
}
