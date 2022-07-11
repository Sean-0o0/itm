<h1 align="center">AntD Admin</h1>

<div align="center">

一套优秀的中后台前端解决方案

[![antd](https://img.shields.io/badge/antd-^3.10.0-blue.svg?style=flat-square)](https://github.com/ant-design/ant-design)
[![umi](https://img.shields.io/badge/umi-^2.2.1-orange.svg?style=flat-square)](https://github.com/umijs/umi)
[![GitHub issues](https://img.shields.io/github/issues/zuiidea/antd-admin.svg?style=flat-square)](https://github.com/zuiidea/antd-admin/issues)
[![MIT](https://img.shields.io/dub/l/vibe-d.svg?style=flat-square)](http://opensource.org/licenses/MIT)
![Travis (.org)](https://img.shields.io/travis/zuiidea/antd-admin.svg)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/zuiidea/antd-admin/pulls)
[![Gitter](https://img.shields.io/gitter/room/antd-admin/antd-admin.svg)](https://gitter.im/antd-admin/antd-admin)

</div>

- 在线演示 - [https://antd-admin.zuiidea.com](https://antd-admin.zuiidea.com)
- 使用文档 - [https://doc.antd-admin.zuiidea.com/#/zh-cn/](https://doc.antd-admin.zuiidea.com/#/zh-cn/)
- 常见问题 - [https://doc.antd-admin.zuiidea.com/#/zh-cn/faq](https://doc.antd-admin.zuiidea.com/#/zh-cn/faq)
- 更新日志 - [https://doc.antd-admin.zuiidea.com/#/zh-cn/change-log](https://doc.antd-admin.zuiidea.com/#/zh-cn/change-log)

[English](./README.md) | 简体中文

## 特性

- 国际化，源码中抽离翻译字段，按需加载语言包
- 动态权限，不同权限对应不同菜单
- 优雅美观，Ant Design 设计体系
- Mock 数据，本地数据调试


## 快速访问
```bash
$ git clone https://git.apexsoft.com.cn/inno-pro/xyzq/pcteam/pro-cv-fe.git
$ cd c5-fe-umi
$ yarn install
$ npm start          # 访问链接:http://localhost:8000
```

## 开发环境搭建
```bash
$ git config --global core.autocrlf input
$ git config --global core.safecrlf true
$ git config --global user.name 王XX
$ git config --global user.email WXXXXXXX@apexsoft.com.cn # 使用公司邮箱(即用于登录公司git的邮箱)
$ git clone http://username:password@git.apexsoft.com.cn/inno-pro/xyzq/pcteam/pro-cv-fe.git # (git config --global credential.helper store来保存git用户名密码了)
$ cd c5-fe-umi
$ git checkout xxxxx(切换到对应分支,默认dev)
$ git pull
$ yarn install # (需要先安装yarn, 可以使用npm命令安装 $ npm install -g yarn)
$ npm start          # 访问链接:http://localhost:8000
```

4. 启动完成后打开浏览器访问 [http://localhost:8001](http://localhost:8001)，如果需要更改启动端口，可在 `.env` 文件中配置。


> 更多信息请参考 [使用文档](https://doc.antd-admin.zuiidea.com/#/zh-cn/)。


## 支持环境

现代浏览器。

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- | 
|IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions


├── dist/                          // 默认的 build 输出目录
├── mock/                          // mock 文件所在目录，基于 express
├── config/
│    ├── config.js                  // umi 配置，同 .umirc.js，二选一
└── src/                           // 源码目录，可选
│    ├── layouts/index.js           // 全局布局
│    ├── pages/                     // 页面目录，里面的文件即路由
│    │    ├── .umi/                  // dev 临时目录，需添加到 .gitignore
│    │    ├── .umi-production/       // build 临时目录，会自动删除
│    │    ├── document.ejs           // HTML 模板
│    │    ├── 404.js                 // 404 页面
│    │    ├── page1.js               // 页面 1，任意命名，导出 react 组件
│    │    ├── page1.test.js          // 用例文件，umi test 会匹配所有 .test.js 和 .e2e.js 结尾的文件
│    │    └── page2.js               // 页面 2，任意命名
│    ├── global.css                 // 约定的全局样式文件，自动引入，也可以用 global.less
│    ├── global.js                  // 可以在这里加入 polyfill
│    ├── app.js                     // 运行时配置文件
├── .umirc.js                      // umi 配置，同 config/config.js，二选一
├── .env                           // 环境变量
└── package.json
