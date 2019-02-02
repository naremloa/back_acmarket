module.exports = {
  devServer: {
    proxy: {
      '/v1/api': {
        target: 'http://localhost:5000/',
      },
    },
  },
  chainWebpack: (config) => {
    // config
    //   .plugin('html')
    //   .tap((args) => {
    //     args[0].chunksSortMode = 'none';
    //     return args;
    //   });
    config
      .plugin('define')
      .tap((args) => {
        // if (args[0]['process.env'].VUE_APP_MODE_ENV !== '"PRODUCTION"') {
        //   args[0]['process.env'].BUILD_TIME = `${Date.now()}`;
        // }
        args[0]['process.env'].BUILD_TIME = `${Date.now()}`;
        return args;
      });
    config
      .devServer.port(8080);
  },
};
