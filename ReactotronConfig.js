import AsyncStorage from '@react-native-community/async-storage'
import Reactotron from 'reactotron-react-native'

const client = Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure()
  .useReactNative() // add all built-in react native plugins
  .connect() // let's connect!

// eslint-disable-next-line no-console
const nativeLog = console.log

// eslint-disable-next-line no-console
console.log = (...args) => {
  nativeLog.call(null, ...args)

  let name = 'CONSOLE.LOG'
  if (typeof args[0] === 'string' && !args[0].startsWith('Running "ChatRn"')) {
    name = args[0] // eslint-disable-line
  }

  client.display({
    name,
    important: true,
    value: args,
    preview: args,
  })
}
