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

  client.display({
    name: 'CONSOLE.LOG',
    important: true,
    value: args,
    preview: args,
  })
}
