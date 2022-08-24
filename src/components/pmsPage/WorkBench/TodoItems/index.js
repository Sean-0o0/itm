import {
  Badge,
  Calendar,
  Col,
  Collapse,
  Card,
  Radio,
  Row,
  Select,
  Table,
  Tooltip,
  Empty,
  Pagination,
  message
} from 'antd';
import React from 'react';
import BridgeModel from "../../../Common/BasicModal/BridgeModel";
import {Link} from 'dva/router';
import {FetchQueryLifecycleStuff, UpdateMesaageReadState} from "../../../../services/pmsServices";

const {Panel} = Collapse;
const {Group, Button} = Radio;

class TodoItems extends React.Component {
  state = {
    //立项流程发起弹窗
    sendVisible: false,
    //立项流程发起url
    sendUrl: '',
    //信息录入
    fillOutVisible: false,
    //信息录入url
    fillOutUrl: '',
    page: 1,
  };

  componentDidMount() {
  }

  onPanelChange = (value, mode) => {
    console.log(value, mode);
  }

  handleUrl = (text) => {
    switch (text) {
      case "周报填写":
        window.location.href = `/#/UIProcessor?Table=ZBYBTX&hideTitlebar=true`;
        break;
      case "合同信息录入":
        this.handleFillOut(text);
        break;
      case "合同签署流程发起":
        this.handleSend(text);
        break;
      case "立项申请流程发起":
        this.handleSend(text);
        break;
    }
  }

  dateCellRender = (value) => {
    const listData = this.getListData(value);
    return (
      <ul style={{margin: '0.1rem', paddingLeft: '1rem'}}>
        {listData.map(item => (
          <li key={item.content}>
            <Tooltip title={item.content}><Badge status={item.type}/></Tooltip>
          </li>
        ))}
      </ul>
    );
  };

  getListData = (value) => {
    //表格数据
    const {data} = this.props;
    let listData = [];

    //可以获取月份
    // console.log("monthmonth22", value.month())
    let content = '';
    data.map((item = {}, index) => {
      let date = item.jzrq.slice(0, 4).concat("-").concat(item.jzrq.slice(4, 6)).concat("-").concat(item.jzrq.slice(6, 8));
      if (value.month() === new Date(date).getMonth()) {
        if (value.date() === new Date(date).getDate()) {
          content = <span>{content}<p>{item.txnr}</p></span>;
          listData = [
            {type: 'warning', content: content},
          ];
        }
      }
    })

    return listData || [];
  };

  handleSend = (name) => {
    let sendUrl = "";
    switch (name) {
      case "合同签署流程发起":
        sendUrl = "/OperateProcessor?operate=TLC_LCFQ_HTLYY&Table=TLC_LCFQ";
        break;
      case "立项申请流程发起":
        sendUrl = "/OperateProcessor?operate=TLC_LCFQ_LXSQLCFQ&Table=TLC_LCFQ";
        break;
    }
    this.setState({
      sendUrl: sendUrl,
    });
    this.setState({
      sendVisible: true,
    });
  };

  handleFillOut = (name) => {
    let fillOutUrl = "";
    switch (name) {
      case "合同信息录入":
        fillOutUrl = "/OperateProcessor?operate=TXMXX_XMXX_ADDCONTRACTAINFO&Table=TXMXX_XMXX";
        break;
    }
    this.setState({
      fillOutUrl: fillOutUrl,
    });
    this.setState({
      fillOutVisible: true,
    });
  };

  closeSendModal = () => {
    this.setState({
      sendVisible: false,
    });
  };

  closeFillOutModal = () => {
    this.setState({
      fillOutVisible: false,
    });
  };

  handPageChange = (e) => {
    this.setState({
      page: e,
    })
    const {fetchQueryOwnerMessage} = this.props;
    fetchQueryOwnerMessage(e)
  }

  updateState = (record) => {
    console.log("recordrecord", record)
    UpdateMesaageReadState({
      sxmc: record.sxmc,
      xmmc: record.xmid,
    }).then((ret = {}) => {
      const {code = 0, note = '', record = []} = ret;
      if (code === 1) {
        const {fetchQueryOwnerMessage} = this.props;
        fetchQueryOwnerMessage(this.state.page)
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 表格当前的列
  renderColumns = () => {
    const cloums = [
      {
        title: '提醒日期',
        dataIndex: 'txrq',
        // key: 'txrq',
      },
      {
        title: '待办事项',
        dataIndex: 'sxmc',
        // key: 'sxmc',
        render: (text, record) => {
          return <span>
            <Tooltip title={record.txnr ? record.txnr : ''}>
              <span style={{display: 'flex', alignItems: 'center'}}>
                {
                  record.ckzt === "2" && <span style={{
                    height: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    width: '2rem'
                  }} onClick={() => this.updateState(record)}><div style={{
                    background: 'rgba(215, 14, 25, 1)',
                    marginRight: '1rem',
                    borderRadius: '50%',
                    height: '1rem',
                    width: '1rem'
                  }}/></span>
                }
                <a style={{color: '#1890ff', paddingRight: '1rem',}}
                   onClick={() => this.handleUrl(text ? text : '')}>{text ? text : ''}</a>
                <div style={{backgroundColor: 'rgba(252, 236, 237, 1)', borderRadius: '10px'}}>
                  {record.xxlx === "1" && <span style={{padding: '0 1rem', color: 'rgba(204, 62, 69, 1)'}}>必做</span>}
                </div>
              </span>
            </Tooltip>
         </span>
        },
      },
      {
        title: '相关项目',
        dataIndex: 'xmmc',
        // key: 'xmmc',
        render: (text, record) => {
          return <Tooltip title={text ? text : ''}><Link style={{color: '#1890ff'}} to={{
            pathname: '/pms/manage/LifeCycleManagement',
            query: {xmid: record.xmid},
          }}>{text}</Link></Tooltip>
        },
      },
      {
        title: '截止日期',
        dataIndex: 'jzrq',
        // key: 'jzrq',
        render: (text) => {
          return <Tooltip title={text ? text : ''}>{text ? text : ''}</Tooltip>
        },
      },
    ];
    return cloums;
  };

  render() {
    const {data, total} = this.props;
    const {sendVisible, sendUrl, fillOutVisible, fillOutUrl} = this.state;
    const sendModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '100rem',
      height: '58rem',
      title: '发起流程',
      style: {top: '30rem'},
      visible: sendVisible,
      footer: null,
    };
    const fillOutModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '100rem',
      height: '58rem',
      title: '信息录入',
      style: {top: '30rem'},
      visible: fillOutVisible,
      footer: null,
    };
    const src_send = localStorage.getItem('livebos') + sendUrl;
    const src_fillOut = localStorage.getItem('livebos') + fillOutUrl;
    return (
      <Row style={{height: '90%', margin: '3rem'}}>
        <Col span={6} style={{height: '82%',}}>
          <div style={{border: '1px solid #d9d9d9', borderRadius: 4, height: '100%',}}>
            <Calendar
              // monthCellRender={this.monthCellRender}
              dateCellRender={this.dateCellRender}
              fullscreen={false}
              headerRender={({value, type, onChange, onTypeChange}) => {
                const start = 0;
                const end = 12;
                const monthOptions = [];

                const current = value.clone();
                const localeData = value.localeData();
                const months = [];
                for (let i = 0; i < 12; i++) {
                  current.month(i);
                  months.push(localeData.monthsShort(current));
                }

                for (let index = start; index < end; index++) {
                  monthOptions.push(
                    <Select.Option className="month-item" key={`${index}`}>
                      {months[index]}
                    </Select.Option>,
                  );
                }
                const month = value.month();

                const year = value.year();
                const options = [];
                for (let i = year - 10; i < year + 10; i += 1) {
                  options.push(
                    <Select.Option key={i} value={i} className="year-item">
                      {i}
                    </Select.Option>,
                  );
                }
                return (
                  <div style={{padding: 10}}>
                    <Row type="flex" justify="space-between">
                      <Col>
                        <Select
                          size="small"
                          dropdownMatchSelectWidth={false}
                          className="my-year-select"
                          onChange={newYear => {
                            const now = value.clone().year(newYear);
                            onChange(now);
                          }}
                          value={String(year)}
                        >
                          {options}
                        </Select>
                        &nbsp;
                        <Select
                          size="small"
                          dropdownMatchSelectWidth={false}
                          value={String(month)}
                          onChange={selectedMonth => {
                            const newValue = value.clone();
                            newValue.month(parseInt(selectedMonth, 10));
                            onChange(newValue);
                          }}
                        >
                          {monthOptions}
                        </Select>
                      </Col>
                    </Row>
                  </div>
                );
              }}
              onPanelChange={this.onPanelChange}
            />
          </div>
        </Col>
        <Col span={18} style={{height: '85%', padding: '0 2rem'}}>
          {/*立项流程发起弹窗*/}
          {sendVisible &&
          <BridgeModel modalProps={sendModalProps} onSucess={this.onSuccess} onCancel={this.closeSendModal}
                       src={src_send}/>}
          {/*信息录入弹窗*/}
          {fillOutVisible &&
          <BridgeModel modalProps={fillOutModalProps} onSucess={this.onSuccess} onCancel={this.closeFillOutModal}
                       src={src_fillOut}/>}
          <Table bordered columns={this.renderColumns()} pagination={false} className="tableStyle"
                 locale={{emptyText: <Empty description={"暂无消息"}/>}} dataSource={data} style={{height: '100%'}}/>
          <Pagination
            style={{textAlign: 'end'}}
            total={total}
            showTotal={total => `共 ${total} 条`}
            defaultPageSize={6}
            onChange={this.handPageChange}
            showQuickJumper={true}
            defaultCurrent={1}
          />
        </Col>
      </Row>
    );
  }
}

export default TodoItems;
