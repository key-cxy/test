
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 192,
      propList: ['*'],
      exclude: /eventManage/ig
    },
  },
}