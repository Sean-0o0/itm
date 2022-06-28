// https://umijs.org/config/
import { resolve } from 'path';
// import { i18n } from './src/utils/config'
const exceptionRoutes = require('./src/routesConfig/Exception');
const exceptionRoutesConfig = exceptionRoutes.routes;
const loginRoutes = require('./src/routesConfig/login');
const loginRoutesConfig = loginRoutes.routes;
const testPageRoutes = require('./src/routesConfig/testPage');
const testPageRoutesConfig = testPageRoutes.routes;
const mainPageRoutes = require('./src/routesConfig/workPlatForm/mainPage');
const mainPageRoutesConfig = mainPageRoutes.routes;
const IconFontRoutes = require('./src/routesConfig/IconFont');
const IconFontRoutesConfig = IconFontRoutes.routes;
const singlePageRoutes = require('./src/routesConfig/workPlatForm/singlePage');
const singlePageRoutesConfig = singlePageRoutes.routes;
const OrgVersionCfgDetailRoutes = require('./src/routesConfig/workPlatForm/EsaPage/OrgVersionCfgDetail');
const OrgVersionCfgDetailRoutesConfig = OrgVersionCfgDetailRoutes.routes;
const SalaryVersionDetailRoutes = require('./src/routesConfig/workPlatForm/EsaPage/SalaryVersionDetail');
const SalaryVersionDetailRoutesConfig = SalaryVersionDetailRoutes.routes;

export default {
  // publicPath: '/c5_basic/',
  outputPath: './c5_esa',
  hash: true, // 是否开启 hash 文件后缀
  history: 'hash', // hash|browser
  ignoreMomentLocale: true,
  targets: { ie: 9 },
  treeShaking: true,
  uglifyJSOptions: {
    parallel: true,
  },
  // devtool: 'source-map',
  devtool: 'eval',
  plugins: [
    [
      // https://umijs.org/plugin/umi-plugin-react.html
      'umi-plugin-react',
      {
        dva: {
          immer: true,
        },
        antd: true,
        dynamicImport: {
          webpackChunkName: true,
          loadingComponent: './components/Loader/Loader',
        },
        locale: {
          default: 'zh-CN',
          baseNavigator: true,
          antd: true,
          enable: true,
        },
        // dll: true,
        dll: {
          include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch', 'antd/es'],
        },
        // pwa: {
        //   manifestOptions: {
        //     srcPath: 'manifest.json',
        //   },
        // },
      },
    ],
  ],
  routes: [
    ...exceptionRoutesConfig, // 异常信息的相关路由信息
    ...loginRoutesConfig, // 登录页面相关路由信息
    ...testPageRoutesConfig, // 测试demo的相关路由信息
    ...IconFontRoutesConfig, // 图标库路由信息
    ...singlePageRoutesConfig, // 单页面的路由信息
    ...OrgVersionCfgDetailRoutesConfig, // 营业部版本详情配置路由
    ...SalaryVersionDetailRoutesConfig,// 版本详情路由
    ...mainPageRoutesConfig, // 主页面相关路由信息
  ],
  theme: './config/theme.config.js',
  // Webpack Configuration
  proxy: {
    '/api': {
      // target: 'http://218.66.59.169:41621/',
      target: 'http://192.168.4.159:8018/',
      // target: 'http://192.168.0.86',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' }
    },
    '/livebos': {
      target: 'http://192.168.4.159:8018/',
      // target: 'http://192.168.0.86',
      changeOrigin: true,
      pathRewrite: { '^/livebos': '/livebos' }
    },
  },
  alias: {
    api: resolve(__dirname, './src/services/'),
    components: resolve(__dirname, './src/components'),
    config: resolve(__dirname, './src/utils/config'),
    models: resolve(__dirname, './src/models'),
    routes: resolve(__dirname, './src/routes'),
    services: resolve(__dirname, './src/services'),
    themes: resolve(__dirname, './src/themes'),
    utils: resolve(__dirname, './src/utils'),
  },
  extraBabelPresets: ['@lingui/babel-preset-react'],
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'lodash',
    ],
  ],
  chainWebpack: function(config, { webpack }) {
    config.loader({ test: /\.js$/, loader: 'babel', query: {compact: false} });
    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'async',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {
            // vendor: {
            //   name: 'vendors',
            //   test: /^.*node_modules[\\/](?!lodash|react-virtualized|react|antd|echarts|highcharts|recharts|draftjs).*$/,
            //   chunks: "all",
            //   priority: 10,
            // },
            virtualized: {
              name: "virtualized",
              test: /[\\/]node_modules[\\/]react-virtualized/,
              chunks: "all",
              priority: 10
            },
            react: {
              name: 'react',
              priority: 20,
              test: /[\\/]node_modules[\\/](react|react-dom|react-dom-router)[\\/]/,
            },
            antd: {
              name: 'antd',
              priority: 20,
              test: /[\\/]node_modules[\\/](antd|@ant-design\/icons|@ant-design\/compatible|ant-design-pro)[\\/]/,
            },
            echarts: {
              name: 'echarts',
              priority: 20,
              test: /[\\/]node_modules[\\/]echarts|echarts-for-react|echarts-gl|echarts-liquidfill[\\/]/,
            },
            highcharts: {
              name: 'highcharts',
              priority: 20,
              test: /[\\/]node_modules[\\/](highcharts-exporting|highcharts-more|react-highcharts)[\\/]/,
            },
            recharts: {
              name: 'recharts',
              priority: 20,
              test: /[\\/]node_modules[\\/](recharts)[\\/]/,
            },
            draftjs: {
              name: 'draftjs',
              priority: 20,
              test: /[\\/]node_modules[\\/](draftjs-to-html|draftjs-to-markdown)[\\/]/,
            },
            lodash: {
              name: "lodash",
              test: /[\\/]node_modules[\\/]lodash[\\/]/,
              chunks: "all",
              priority: -2
            },
            async: {
              chunks: 'async',
              minChunks: 2,
              name: 'async',
              maxInitialRequests: 1,
              minSize: 0,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      },
    })
  },
}
