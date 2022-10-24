import React, {Fragment} from 'react';
import moment from 'moment';
import {Input, Select, DatePicker, Icon, Progress, message} from 'antd';
import {connect} from 'dva';
import {ExportExcel, FetchQueryLifecycleStuff} from "../../../../services/pmsServices";
import {DecryptBase64} from '../../../../components/Common/Encrypt';

import config from '../../../../utils/config';

const {api} = config;
const {pmsServices: {exportExcel}} = api;

class CapitalBudgetExport extends React.Component {
  state = {
    open: false,
    year: '',
  };

  componentWillMount() {
    // const { type = '',} = this.getUrlParams();
    // this.setState({
    //   type:type,
    // })
  }

  // 获取url参数
  getUrlParams = () => {
    const {match: {params: {params: encryptParams = ''}}} = this.props;
    const params = JSON.parse(DecryptBase64(encryptParams));
    console.log("paramsparams", params)
    return params;
  }

  handleCancel = () => {
    this.props.onCancelOperate();
  }

  getExcelFile = () => {
    const myDate = new Date();
    const nextYear = myDate.getFullYear() + 1;
    const {year} = this.state;
    const iframe = this.ifile; // iframe的dom
    const actionUrl = exportExcel;
    // 创建一个表单
    const downloadForm = document.createElement('form');
    downloadForm.id = 'downloadForm';
    downloadForm.name = 'downloadForm';
    // 创建一个输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'year';
    input.value = year ? year : nextYear;
    // 将该输入框插入到 form 中
    downloadForm.appendChild(input);
    // form 的提交方式
    downloadForm.method = 'POST';
    // form 提交路径
    downloadForm.action = actionUrl;
    // 添加到 body 中
    iframe.appendChild(downloadForm);
    // 对该 form 执行提交
    downloadForm.submit();
    // 删除该 form
    iframe.removeChild(downloadForm);
    this.props.onSubmitOperate();
    //TODO 需获取表单回调后显示导出成功
    setTimeout(message.success("导出成功"), 3000)
  }

  getYear = (e) => {
    this.setState({
      year: e.target.value,
    })
  }

  render() {
    const myDate = new Date();
    const nextYear = myDate.getFullYear() + 1;
    return (
      <Fragment>
        <div style={{
          height: '100%',
          padding: '2.381rem 3.571rem 0 2.381rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          fontSize: '2.083rem'
        }}>
          <div style={{height: '100%', position: 'relative', display: 'flex', alignItems: 'center'}}
               className="operationListSelectBox">
            <span style={{fontSize: '2.381rem',}}>
              年份：&nbsp;&nbsp;
            </span>
            <Input defaultValue={nextYear} style={{width: '30%', fontSize: '2.038rem'}}
                   onChange={(e) => this.getYear(e)} placeholder="请输入年份"/>
          </div>
          <div style={{textAlign: 'end', paddingTop: '8.9rem'}}>
            {/*<button class="ant-btn" onClick={this.handleCancel}>取消</button>*/}
            {/*&nbsp;&nbsp;*/}
            <button class="ant-btn ant-btn-primary" onClick={this.getExcelFile}>导出Excel</button>
            <iframe title='下载' id='m_iframe' ref={(c) => {
              this.ifile = c;
            }} style={{display: 'none'}}/>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(({global = {}}) => ({
  authorities: global.authorities,
}))(CapitalBudgetExport);
