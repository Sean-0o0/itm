/* eslint-disable react/jsx-indent */
import React from 'react';
import { Row, Col, Card, Form, Checkbox, Popover, Table, message, Icon } from 'antd';
import { fetchSysParam } from '../../../../../services/commonbase/sysParam';
import { FetchQueryCurrentEngineIp } from '../../../../../services/motProduction';

let timer;
class DisPatchHead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentEngineIp: [], // mot Ip地址
      codeZt: '',
      noteIp: '',
      onlySpvs: true, // 仅部署MOT督导配置
    };
  }
  componentDidMount() {
    //获取系统参数  /api/commonbase/v1/sysParam
    fetchSysParam({ csmc: 'MOT.WHTR_ONLY_SPVS' }).then(res => {
      const { code, records = [] } = res;
      if (records.length === 0 ) {
          //this.queryCurrentEngineIp();
          this.addTimer();
          //this.setState({ onlySpvs: false })
      }
      if (records[0] && records[0].csz === 0) {
        //this.queryCurrentEngineIp();
        this.addTimer();
        //this.setState({ onlySpvs: false })
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  componentWillUnmount() {
    clearInterval(timer);
  }

  // 获取人员id
  queryCurrentEngineIp = () => {
    FetchQueryCurrentEngineIp({}).then((response) => {
      const { records, code, note } = response;
      this.setState({
        CurrentEngineIp: records,
        codeZt: code,
        noteIp: note,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  addTimer = () => {
    timer = setInterval(() => {
      //this.queryCurrentEngineIp();
      this.props.taskChange();
    }, 5000);
  }
  render() {
    const { MOT_CMPT_MODE: motCmptModeDict = [], MOT_TGT_TP: motTgtTpDict = [] } = this.props.dictionary;
    const cmptMode = [];
    let hasRealTimeTask = false;
    let hasOnTimeTask = false;
    motCmptModeDict.forEach((val, index, array) => {
      if (val.ibm === '1') {
        cmptMode.push('1');
        hasOnTimeTask = true;
      } else if (val.ibm === '2') {
        cmptMode.push('2', '4');
        hasRealTimeTask = true;
      }
    });
    const tgtTp = motTgtTpDict.map(dict => dict.ibm);
    const { getFieldDecorator } = this.props.form;
    const { CurrentEngineIp, codeZt, noteIp, onlySpvs } = this.state;
    const dataSource = CurrentEngineIp;
    const columns = [
      {
        title: 'MOT主机服务器',
        dataIndex: 'ip',
        key: 'ip',
        align: 'center',
      },
      {
        title: '主机名称',
        dataIndex: 'host',
        key: 'host',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'engSt',
        key: 'engSt',
        align: 'center',
        render: (text, row) => {
          // return `${row.ZQMC}(${row.ZQDM})`;
          return row.engSt === '0' ? <div><Icon type="question-circle" theme="filled" style={{ color: 'grey' }} />待机中</div> : row.engSt === '-1' ? <div><Icon type="exclamation-circle" theme="filled" style={{ color: 'red' }} />异常 </div> : <div><Icon type="check-circle" theme="filled" style={{ color: '#17c5a6' }} />运行中</div>;
        },
      },
    ];
    let colorZt = '';
    let note = '';
    if (codeZt === 1 && noteIp === '') {
      colorZt = 'grey';
      note = 'MOT引擎未启动';
    } else if (codeZt === 1 && noteIp !== '') {
      for (let i = 0; CurrentEngineIp.length > i; i++) {
        if (CurrentEngineIp[i].engSt === '-1') {
          colorZt = 'orange';
          note = 'MOT引擎存在隐患';
          break;
        } else {
          colorZt = '#17c5a6';
          note = 'MOT引擎运行正常';
        }
      }
    } else if (codeZt === 2) {
      colorZt = 'red';
      note = 'MOT引擎运行异常';
    }
    return (
      <React.Fragment>
        <Row>
          <Col span={24}>
            <Card className="m-card default" style={{ padding: '.5rem' }}>
              <Form layout="inline">
                <Row >
                  <Col xs={24} sm={18} lg={18} xl={18} >
                    <Form.Item name="schdSt">
                      {getFieldDecorator('schdSt')(<Checkbox.Group>
                        <Checkbox value="-1">只看异常</Checkbox>
                      </Checkbox.Group>)}
                    </Form.Item>
                    <Form.Item name="cmptMode" >
                      {getFieldDecorator('cmptMode', { initialValue: cmptMode })(<Checkbox.Group>
                        {hasRealTimeTask ? <Checkbox value="2" >实时任务</Checkbox> : ''}
                        {hasOnTimeTask ? <Checkbox value="1" >定时任务</Checkbox> : ''}
                        {/* {hasRealTimeTask ? <Checkbox value="4" >实时分发</Checkbox> : ''} */}
                      </Checkbox.Group>)}
                    </Form.Item>

                    <Form.Item name="tgtTp">
                      {getFieldDecorator('tgtTp', { initialValue: tgtTp })(<Checkbox.Group>
                        {motTgtTpDict.map(dict => (<Checkbox value={dict.ibm}>{dict.note}MOT</Checkbox>))}
                      </Checkbox.Group>)}
                    </Form.Item>

                  </Col>
                  {/* {onlySpvs ? '' : (
                    <Popover
                      overlayClassName="m-ant-popover-top"
                      placement="bottomRight"
                      content={
                        <Table dataSource={dataSource} columns={columns} size="middle" pagination={false} />
                      }
                      trigger="hover"
                    >
                      <Col xs={24} sm={6} lg={6} xl={6} style={{ lineHeight: '4rem', textAlign: 'right', paddingRight: '2rem' }}>
                        <div style={{ height: '1rem', width: '1rem', borderRadius: '50%', backgroundColor: colorZt, display: 'inline-block' }} />
                        {note}
                        <Icon type="down" style={{ marginLeft: '1rem' }} />

                      </Col>
                    </Popover>
                  )} */}
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </React.Fragment >
    );
  }
}

export default Form.create({
  onValuesChange(props, changeValues, allValues) {
    props.getFormChange(allValues);
  },
})(DisPatchHead);
