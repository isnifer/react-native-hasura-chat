module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [['transform-inline-environment-variables', { include: ['CHAT_APP_GIPHY_API_KEY'] }]],
}
