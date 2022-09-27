import React from "react"
import FileViewer from 'react-file-viewer';
import * as WPS from '../../../jwps.es.js'


export default class ViewFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      simpleMode: false,
      // url: sessionStorage.wpsUrl,
      token: sessionStorage.token
    }
  }

  componentDidMount() {
    // this.openWps(this.state.url,this.state.token);
    this.openWps("https://wwo.wps.cn/office/w/789d82a58aa74c848db9a396b48c805b?_w_userid=-1&_w_filetype=web&_w_filepath=http://api.idocv.com/data/doc/manual.docx&_w_tokentype=1&_w_appid=5b8f173bd752464d81b7aa78001c697f&_w_redirectkey=123456&_w_signature=WWByCTQMkzLNZKWbEZK3aV6C1GQ%3D", '789d82a58aa74c848db9a396b48c805b');
  }

  openWps = (url, token) => {
    const wps = WPS.config({
      mode: this.state.simpleMode ? 'simple' : 'normal',
      mount: document.querySelector('#root'),
      wpsUrl: url,
    });
    wps.setToken({token});
    let app = wps.Application;
    console.log("111", JSON.stringify(app))
  };

  render() {
    return <div/>
    {/*<FileViewer*/
    }
    {/*  fileType='docx'//文件类型*/
    }
    {/*  filePath={require("../../../1.DOCX")} //文件地址（后台给返的二进制流也可以）*/
    }
    {/*  // onError={this.onError.bind(this)} //函数[可选]：当文件查看器在获取或呈现请求的资源时发生错误时将调用的函数。在这里可以传递日志记录实用程序的回调。*/
    }
    {/*  // errorComponent={console.log("出现错误")} //[可选]：发生错误时呈现的组件，而不是react-file-viewer随附的默认错误组件。*/
    }
    {/*  // unsupportedComponent={console.log("不支持")} //[可选]：在不支持文件格式的情况下呈现的组件。*/
    }
    {/*/>*/
    }
  }

}
