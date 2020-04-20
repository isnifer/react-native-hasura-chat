module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [['transform-inline-environment-variables', { include: ['CHAT_APP_X_HASURA_ID'] }]],
}
