import React, {Component} from 'react'
import {Modal, Select, DatePicker, Button, message} from 'antd'
import AttachTable from './AttachTable'
import {QueryHistoryAttach, QueryProjectListPara} from '../../../../../services/pmsServices'
import moment from 'moment';

class HistoryAttach extends Component {
  state = {
    attachList: [],
    xmjlList: [],
    pageParams: {
      current: 1,
      pageSize: 10,
      paging: 1,
      total: -1,
      sort: ''
    },
    startDate: undefined,
    endDate: undefined,
    scr: undefined,
    tableLoading: false
  }

  componentDidMount() {
    this.queryProjectListPara()
    this.queryHistoryAttach({}, 1)
  }

  queryProjectListPara = () => {
    const {record = {}} = this.props;
    const {xmid, wdlxid} = record;
    QueryProjectListPara({
      paging: -1,
      cxlx: 'WDLBLS,XMID[' + xmid + '],WDLXID[' + wdlxid + ']',
    })
      .then((res = {}) => {
        const {code} = res;
        if (code > 0) {
          this.setState({
            xmjlList: [...JSON.parse(res.projectManagerRecord)],
          });
        }
      }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }

  changeStartDate = (date, str) => {
    this.setState({
      startDate: date ? moment(date) : undefined,
      endDate: date ? moment(date).add(1, 'days') : undefined,
    })
  }

  changeEndDate = (date, str) => {
    this.setState({
      endDate: date ? moment(date) : undefined,
    })
  }

  queryHistoryAttach = (params = {}, type = 2) => {
    const {record = {}} = this.props;
    const {xmid, wdlxid} = record;
    const {pageParams, startDate, endDate, scr} = this.state;
    let param = {
      xmid,
      wdlxid,
      ...pageParams,
      ...params,
      total: -1,
    }
    if (type !== 1) {
      if (endDate.isBefore(startDate)) {
        message.error('开始时间必须早于结束时间！');
        return;
      }
      param = {
        ...param,
        scr,
        kssj: startDate.format('YYYYMMDD'),
        jssj: endDate.format('YYYYMMDD'),
      }
    }
    this.setState({
      tableLoading: true,
    })
    QueryHistoryAttach(param)
      .then((res = {}) => {
        const {code, data = [], total = 0} = res;
        if (code > 0) {
          this.setState({
            attachList: data,
            pageParams: {
              ...pageParams,
              ...params,
              total,
            }
          })
          this.setState({
            tableLoading: false,
          })
        }
      }).catch((e) => {
      this.setState({
        tableLoading: false,
      })
      message.error(!e.success ? e.message : e.note);
    });
  }

  handleReset = () => {
    this.setState({
      startDate: moment(new Date()),
      endDate: moment(new Date()).add(1, 'days'),
      scr: undefined,
    })
  }

  handleXmjl = (v) => {
    this.setState({
      scr: v
    })
  }

  render() {
    const {modalVisible = false} = this.props;
    const {xmjlList = [], scr, attachList = [], tableLoading = false, pageParams, startDate, endDate} = this.state;
    return (<Modal wrapClassName='history-attach-modal' width='60vw'
                   maskClosable={false}
                   zIndex={100}
                   maskStyle={{backgroundColor: 'rgb(0 0 0 / 30%)'}}
                   cancelText='取消'
                   okText='保存'
                   style={{top: '5vh'}}
                   bodyStyle={{padding: '0', overflow: 'hidden'}}
                   title={null}
                   footer={null}
                   visible={modalVisible}
                   onCancel={() => this.props.closeModalVisible()}>
      <div className='body-title-box'>
        <strong>文档历史版本</strong>
      </div>
      <div className='body-cont history-attach-body'>
        <div className="item-box">
          <div className="console-item" style={{width: '25%'}}>
            <div className="item-label">上传人</div>
            <Select
              className="item-selector"
              dropdownClassName={'item-selector-dropdown'}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showSearch
              allowClear
              placeholder="请选择"
              onChange={this.handleXmjl}
              value={scr}
            >
              {xmjlList.map((x, i) => (
                <Select.Option key={i} value={x.ID}>
                  {x.USERNAME}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="console-item" style={{width: '50%'}}>
            <div className="item-label">上传时间</div>
            <div style={{
              paddingLeft: '8px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'row',
              width: 'auto'
            }} id="datePicker">
              <DatePicker format="YYYY-MM-DD"
                          value={startDate}
                          allowClear={true}
                          onChange={this.changeStartDate}
              />
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                padding: '0 12px',
                display: 'flex',
                alignItems: 'center',
              }}>~
              </div>
              <DatePicker format="YYYY-MM-DD"
                          value={endDate}
                          allowClear={true}
                          onChange={this.changeEndDate}
              />
            </div>
          </div>
          <div style={{flex: '1', display: 'flex', flexDirection: 'row-reverse'}}>
            <Button className="btn-reset" onClick={this.handleReset}>
              重置
            </Button>
            <Button
              className="btn-search"
              type="primary"
              onClick={() => this.queryHistoryAttach()}
            >
              查询
            </Button>
          </div>
        </div>
        <AttachTable tableData={attachList} tableLoading={tableLoading} pageParams={pageParams}
                     handleSearch={this.queryHistoryAttach}/>
      </div>
    </Modal>);
  }
}

export default HistoryAttach;
