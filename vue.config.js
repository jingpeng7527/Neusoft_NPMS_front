module.exports = {
  publicPath: './',
  outputDir: process.env.outputDir, 
  //baseUrl: './',

  /** 区分打包环境与开发环境,
   * process.env.NODE_ENV==='production'  (打包环境)
   * process.env.NODE_ENV==='development' (开发环境)
   * baseUrl: process.env.NODE_ENV==='production'?"https://cdn.didabisai.com/front/":'front/',
   */

  // 项目部署的基础路径

  // 我们默认假设你的应用将会部署在域名的根部,

  // 例如 https://www.my-app.com/

  // 如果你的应用部署在一个子路径下，那么你需要在这里

  // 指定子路径。比如将你的应用部署在

  // https://www.foobar.com/my-app/

  // 那么将这个值改为 '/my-app/'

  // baseUrl: "./", // 构建好的文件输出到哪里

  outputDir: "dist", // where to put static assets (js/css/img/font/...) // 是否在保存时使用‘eslint-loader’进行检查 // 有效值: true | false | 'error' // 当设置为‘error’时，检查出的错误会触发编译失败

  lintOnSave: true, // 使用带有浏览器内编译器的完整构建版本 // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only

  runtimeCompiler: false, // babel-loader默认会跳过`node_modules`依赖. // 通过这个选项可以显示转译一个依赖

  transpileDependencies: ['vuetify'],

  productionSourceMap: false, // 调整内部的webpack配置. // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md

  chainWebpack: () => {},

  configureWebpack: () => {}, // CSS 相关选项

  css: {
      // 将组件内部的css提取到一个单独的css文件（只用在生产环境）

      // 也可以是传递给 extract-text-webpack-plugin 的选项对象

      extract: true, // 允许生成 CSS source maps?

      sourceMap: false, // pass custom options to pre-processor loaders. e.g. to pass options to // sass-loader, use { sass: { ... } }

      loaderOptions: {}, // Enable CSS modules for all css / pre-processor files. // This option does not affect *.vue files.

      modules: false
  }, // use thread-loader for babel & TS in production build // enabled by default if the machine has more than 1 cores

  parallel: require("os").cpus().length > 1, // PWA 插件相关配置 // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa

  pwa: {}, // configure webpack-dev-server behavior

  devServer: {
      open: process.platform === "darwin",
      //disableHostCheck: true, 
      //如果是true，则只能访问本地的127.0.0.1
      //初始的是true
      host: "127.0.0.1",

      // port: 12000,

      https: false,

      hotOnly: false, // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
      
      // assetsSubDirectory: 'static',
      // assetsPublicPath: '/',
      // proxy: null // string | Object
      proxy: {
        //全部替换完毕
        '/npmsChance': {
          target: 'http://47.98.166.180:14000',
          // ws: true,
          //是否跨域：是
          changeOrigin: true,
          pathRewrite: { '^/npmsChance': '' },
        },
        //全部替换完毕
        '/npmsTrace' : {
          target: 'http://8.140.46.173:19000',
          // target: 'http://192.168.43.251:8080',
          // ws: true,
          //是否跨域：是
          changeOrigin: true,
          pathRewrite: { '^/npmsTrace': '' },
        },
        //全部替换完毕
        '/npmsSales': {
          target: 'http://8.140.46.173:12000',
          changeOrigin: true,
          pathRewrite: {'^/npmsSales': '' }
        },


        //全部替换完毕
        '/pjLogin': {
          target: 'http://47.98.166.180:18000',
          // target: 'http://192.168.43.251:8080',
          // ws: true,
          //是否跨域：是
          changeOrigin: true,
          pathRewrite: { '^/pjLogin': '' },
        },
        //全部替换完毕
        '/pj': {
          target: 'http://8.140.46.173:16000',
          // target: 'http://192.168.43.251:8080',
          // ws: true,
          //是否跨域：是
          changeOrigin: true,
          pathRewrite: { '^/pj': '' },
        },
      },
      
      // proxy: 'http://127.0.0.1:8081',
      // before: app => {}
  }, // 第三方插件配置

  pluginOptions: {
      // ...
      
  }
};