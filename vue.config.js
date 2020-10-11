module.exports = {
  publicPath: '/three-page/',
  configureWebpack: {
    externals: {
      AMap: 'AMap'
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        cacheGroups: {
          element: {
            test: /[\\/]element-ui[\\/]/,
            priority: -5
          },
          three: {
            test: /[\\/]three[\\/]/,
            priority: -5
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    }
  }
}
