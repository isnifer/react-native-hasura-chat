export default function getHeaderTitle({ options, scene }) {
  const { routeNames, index } = scene?.route?.state ?? {}
  if (routeNames) {
    const routeName = routeNames[index]
    const routeTitles = {
      'Home.Profile': 'Profile',
      'Home.Chats': 'All Chats',
      'Home.Settings': 'Settings',
    }

    return routeTitles[routeName] || routeName
  }

  if (options.title) {
    return options.title
  }

  if (options.headerTitle) {
    return options.headerTitle
  }

  return scene.route.name
}
