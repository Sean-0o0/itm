/*
  eslint-disable
*/
import AES from "./aes_utils";
import axios from 'axios';
import JSON5 from 'json5';

const VERSION = '1.0.0';
const genRandomString = (len) => {
  const text = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const rdmIndex = text => Math.random() * text.length | 0;
  let rdmString = '';
  for (; rdmString.length < len; rdmString += text.charAt(rdmIndex(text)));
  return rdmString;
}

class CountAction {
  constructor() {
    this.pageFunc = "aas.count.page.record";
    this.pageKey = "pageData";
    this.eventKey = "eventData";
    this.eventFunc = "aas.count.event.record";
    this.authPath = "/auth";
    this.clientId = null;
    this.appSecret = null;
    this.userId = "";
    this.channel = "";
    this.appVersion = "";
    this.headerData = {};
    //页面级别标签
    this.pageLabel = {};
    this.baseURL = null;
    this.withCredentials = true;
    this.uid = genRandomString(32) + new Date().getTime();
    try {
      this.sessionLabel = JSON5.parse(sessionStorage.getItem("_label"));
    } catch (e) {
    }
    this.sessionLabel = this.sessionLabel === undefined ? {} : this.sessionLabel;
    this.timer = undefined;
  }

  sendData() {
    let pageData = this.buildData(this.pageKey);
    let eventData = this.buildData(this.eventKey);
    if (pageData.length == 0 && eventData.length == 0) {
      return;
    }
    this.auth().then(() => {
      if (pageData.length > 0) {
        axios.post(this.baseURL + "/service", {
          data: {
            header: this.headerData,
            records: pageData
          }
        }, { headers: { func: this.pageFunc } }).catch((error) => {
          console.log(error);
        }).then(() => {
          localStorage.removeItem(this.pageKey + "Old");
        });
      }
      if (eventData.length > 0) {
        axios.post(this.baseURL + "/service", {
          data: {
            header: this.headerData,
            records: eventData
          }
        }, { headers: { func: this.eventFunc } }).catch((error) => {
          console.log(error);
        }).then(() => {
          localStorage.removeItem(this.eventKey + "Old");
        })
      }
    });
  }

  buildData(dataName) {
    //必须提前移除，提取出来的数据放置到提交备份中
    let dataNewStr = localStorage.getItem(dataName);
    localStorage.removeItem(dataName);
    let dataOldStr = localStorage.getItem(dataName + "Old");
    let dataNew = [];
    let dataOld = [];
    if (dataNewStr != null) {
      dataNew = JSON5.parse(dataNewStr);
    }
    if (dataOldStr != null) {
      dataOld = JSON5.parse(dataOldStr);
    }
    let data = [...dataNew, ...dataOld];
    localStorage.setItem(dataName + "Old", JSON5.stringify(data));
    return data;
  }

  /**
   * 设置埋点服务参数，只需要设置一次
   *  url:埋点服务端地址
   *  appIdentity:服务唯一标识
   *  appSecret:配对秘钥
   *  appVersion:业务服务版本
   *  channel:渠道
   *  timeInterval:上传日志时间间隔，单位秒。默认值5秒
   * */
  config(url, clientId, appSecret, appVersion, channel, timeInterval) {
    this.clientId = clientId;
    this.appSecret = appSecret;
    this.channel = channel;
    this.appVersion = appVersion;
    this.baseURL = url || localStorage.getItem('md');
    this.headerData.channel = channel;
    this.headerData.clientId = clientId;
    this.headerData.appVersion = appVersion;
    this.headerData.resolution = window.screen.width + "x" + window.screen.height;
    this.headerData.mdVersion = VERSION;
    if (this.timer != undefined) {
      clearInterval(this.timer);
    }
    if (timeInterval == undefined) {
      timeInterval = 5000;//5秒
    }
    this.timer = setInterval(this.sendData.bind(this), timeInterval);
  }

  /**
   * 设置埋点报文公共头部，只需要设置一次
   *  header.brand:设备品牌(非必填)
   *  header.model:设备型号(非必填)
   *  header.os:操作系统(非必填)
   *  header.osVersion:操作系统版本(非必填)
   *  header.facilitator:运营商(非必填)
   *  header.reactVersion:React版本(必填)
   *  header.browser:浏览器类型(非必填)
   *  header.browserVersion:浏览器版本(非必填)
   *  header.imei:设备ID（IMEI或者MAC）(非必填)
   *
   * */
  setHeader(header) {
    let data = Object.assign({}, header);
    //品牌
    this.headerData.brand = data.brand == undefined ? "" : data.brand;
    //设备型号
    this.headerData.model = data.model == undefined ? "" : data.model;
    //操作系统
    this.headerData.os = data.os == undefined ? "" : data.os;
    //操作系统版本
    this.headerData.osVersion = data.osVersion == undefined ? "" : data.osVersion;
    //运营商
    this.headerData.facilitator = data.facilitator == undefined ? "" : data.facilitator;
    //React版本
    this.headerData.reactVersion = data.reactVersion == undefined ? "" : data.reactVersion;
    //浏览器类型
    this.headerData.browser = data.browser == undefined ? "" : data.browser;
    //浏览器版本
    this.headerData.browserVersion = data.browserVersion == undefined ? "" : data.browserVersion;
    //设备ID（IMEI或者MAC）
    this.headerData.imei = data.imei == undefined ? "" : data.imei;
  }
  /**
    *  页面访问记录
    *  url:埋点服务端地址
    *  ref_url:上一级页面
    *  ext:扩展信息
    * */
  recordPage(url, ref_url, ext) {
    this.pageLabel = {};
    if (this.clientId == null || this.appSecret == null) {
      console.log("埋点未初始化");
      return;
    }
    let pageData = JSON5.parse(localStorage.getItem("pageData"));

    if (pageData == null) {
      pageData = [];
    }

    pageData.push({
      url: url === undefined ? "" : url,
      ref_url: ref_url === undefined ? "" : ref_url,
      ext: ext === undefined ? "" : ext,
      datetime: new Date().getTime(),
      userId: this.userId,
      uid: this.uid,
      label: Object.assign({}, this.sessionLabel, this.pageLabel)
    });
    try {
      localStorage.setItem("pageData", JSON5.stringify(pageData));
    } catch (e) {
    }

  }

  /**
     *  时间行为记录
     *  event:事件类型
     *  action:具体动作
     *  ext:json格式字符串，扩展信息
     *
     * */
  recordEvent(event, action, ext) {
    if (this.clientId == null || this.appSecret == null) {
      console.log("埋点未初始化");
      return;
    }
    let eventData = JSON5.parse(localStorage.getItem("eventData"));

    if (eventData == null) {
      eventData = [];
    }
    eventData.push({
      event: event === undefined ? "" : event,
      action: action === undefined ? "" : action,
      ext: ext === undefined ? "" : ext,
      datetime: new Date().getTime(),
      userId: this.userId,
      uid: this.uid,
      label: Object.assign({}, this.sessionLabel, this.pageLabel)
    });
    try {
      localStorage.setItem("eventData", JSON5.stringify(eventData));
    } catch (e) {
    }
  }

  auth() {
    AES.setSecret(this.appSecret);
    if (this.clientId == null || this.appSecret == null) {
      console.log("埋点未初始化");
      return;
    }
    let resolution = window.screen.width + "x" + window.screen.height;
    let ext = {
      appVersion: this.appVersion,
      channel: this.channel,
      resolution: resolution
    };
    ext = JSON5.stringify(ext);
    let signatureSource = "ext=" + ext +
      "&timestamp=" + new Date().getTime();
    return axios.post(this.baseURL + this.authPath, {
      clientId: this.clientId,
      signature: AES.encryptBase64(signatureSource),
      mode: "count",
      ext: JSON5.stringify(ext)
    }).catch((error) => {
      console.log(error);
    })
  }

  /**
   *  key:标签类型
   *  value:标签值
   *  scope:作用域，page,session两种
   *
   * */
  setLabel(key, value, scope) {
    if (scope === null || scope === 'page' || scope === undefined) {
      this.pageLabel[key] = value;
    } else if (scope === 'session') {
      this.sessionLabel[key] = value;
      sessionStorage.setItem("_label", JSON5.stringify(this.sessionLabel))
    }
  }
  /**
   *  设置业务用户ID
   *  userId:用户ID
   *
   * */
  setUserId(userId) {
    this.userId = userId;
  }
}

const countAction = new CountAction();
export { countAction as ApexCountAction };
