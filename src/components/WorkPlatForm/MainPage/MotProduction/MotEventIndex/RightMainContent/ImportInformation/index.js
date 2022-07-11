/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react';
import { Row, Col, Button, Table, Form, Modal, Progress, Upload, message } from 'antd';
import BasicModal from '../../../../../../Common/BasicModal';
import config from '../../../../../../../utils/config';
import { getVersion } from '../../../../../../../utils/request';

/**
 * 导入信息
 */
const { api } = config;
const { motProduction: { motDataImport } } = api;
const taskDataReturnImportversion = getVersion(motDataImport); // 因为走蚂蚁的组件，需要在这边设置请求头

class ImportInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modalVisible: false,
      percent: 0,
      uuid: '',
    };
  }
  componentDidMount() {
  }
  onAdd = () => {
    this.setState({ visible: true });
    this.guid();
  }
  fetchYYBColums = () => {
    const { mblx } = this.props;
    const columns = [
      {
        title: mblx === '1' ? '客户号' : '员工账号',
        dataIndex: 'objId',
        key: 'objId',
        align: 'center',
      },
      {
        title: mblx === '1' ? '客户姓名' : '员工姓名',
        dataIndex: 'objNm',
        key: 'objNm',
        align: 'center',
      },
      {
        title: '导入日期',
        dataIndex: 'impDt',
        key: 'impDt',
        align: 'center',
      },
    ];
    return columns;
  }
  // 生成uuid
  guid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    this.setState({ uuid: `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}` });
  };
  // 上传进度实现方法，上传过程中会频繁调用该方法
  progressFunction = (uuid) => {
    this.setState({ modalVisible: true });
    const exportPercentUtl = '/api/motconfig/v1/exportPercent';
    if (typeof EventSource !== 'undefined') {
      // 浏览器支持 Server-Sent
      setTimeout(() => {
        // this.setState({ percent: 0 });
        const source = new EventSource(`${exportPercentUtl}?uuid=${uuid}`);
        source.onmessage = (event) => {
          const { data: percent = 0 } = event;
          if (percent === '100') {
            source.close();
            this.setState({ percent: 100 });
            setTimeout(() => {
              this.setState({ modalVisible: false, percent: 0 });
            }, 1000);
          } else {
            this.setState({ percent });
          }
          // handle message
        };
        let errorTimes = 0;
        source.onerror = () => {
          errorTimes++;
          if (errorTimes >= 3) {
            source.close();
            this.uploadFailed();
          }
        };
      }, 500);
    } else {
      // 浏览器不支持 Server-Sent..
      this.setState({ modalVisible: false });
    }
  }
  // 上传失败
  uploadFailed = () => {
    this.setState({ modalVisible: false });
    // message.error('上传失败');
  }
  // 上传结束
  uploadComplete = (response) => {
    const { code, note } = response;
    if (code > 0) {
      const { FetchqueryEventImportDetail } = this.props;
      if (FetchqueryEventImportDetail) {
        FetchqueryEventImportDetail(this.props.sjID, this.props.mblx);
      }
      this.setState({ visible: false });
    } else {
      message.error(note);
      this.setState({ modalVisible: false });
    }
  }
  render() {
    const { visible, modalVisible, percent, uuid } = this.state;
    const { type, Data, sjID, mblx } = this.props;
    const progressFunction = this.progressFunction; // eslint-disable-line
    const uploadComplete = this.uploadComplete; // eslint-disable-line
    const props = {
      action: `${motDataImport}?evntId=${sjID}&tgtTp=${mblx}&uuid=${uuid}`,
      headers: {
        apiVersion: taskDataReturnImportversion,
      },
      onChange(info) {
        const { file: { size } } = info;
        // if (info.file.status === 'uploading') {
        //   progressFunction(uuid); // 上传进度条
        // }
        if (info.file.status === 'done') {
          uploadComplete(info.file.response); // 上传结束
        } else if (info.file.status === 'error') {
          message.error('上传失败!');
        }
      },
      accept: '.xls,.xlsx',
    };
    const pagination = {
      pageSize: 10,
      total: Data.length,
    };
    return (
      <Fragment>
        <Row style={{ paddingBottom: 20 }}>
          <div className="factor-content-title">导入信息</div>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className="factor-item">
              {
                type ? <Button className="factor-bottom m-btn-table-headColor" onClick={this.onAdd} >导入</Button> : ''
              }
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className="factor-item">
              <Table
                className="factor-table"
                style={{ minWidth: '300px', width: '60%', marginRight: '2.6rem' }}
                columns={this.fetchYYBColums()}
                dataSource={Data}
                pagination={false}
                size="middle "
                bordered
                // eslint-disable-next-line react/jsx-no-duplicate-props
                pagination={pagination}
              />
            </div>
          </Col>
          <BasicModal
            title="提示"
            visible={visible}
            onCancel={() => { this.setState({ visible: false }); }}
            footer={[
              <Upload key="1" {...props} showUploadList={false}><Button className="fcbtn m-btn-border m-btn-small m-btn-border-headColor ant-btn btn-1c">确定</Button></Upload>,
              <Button key="2" style={{ marginLeft: '2rem' }} onClick={() => { this.setState({ visible: false }); }}>取消</Button>,
          ]}
          >
            <div style={{ padding: '2rem' }} className="m-task-tck-claim">要求
              <br />1、所选文件必须为EXCEL格式。若无法确认EXCEL格式，请下载模板再行导入。
              <br />2、系统将自动读取表格的第一行为表头。第一个字段必须为“客户号”（或“员工账号”）；表头各字段请尽量规范，并与所定义指标名称相同，勿含各种标点符号，每列不允许超过30个字，以免系统无法解析导致报错。
              <br />3、请确保所导入客户号（或员工账号）正确无误，系统将据此生成MOT事件。
            </div>
          </BasicModal>
          <Modal
            title="系统处理中,请稍候..."
            centered
            destroyOnClose
            afterClose={() => { const { handleScrollBottom } = this.props; if (handleScrollBottom) handleScrollBottom(); }}
            closable={false}
            maskClosable={false}
            visible={modalVisible}
            footer={null}
          >
            <Row>
              <Col span={2}>进度:</Col>
              <Col span={22}><Progress percent={parseInt(percent, 10)} status={percent === '100' ? 'success' : 'active'} /></Col>
            </Row>
          </Modal>
        </Row>
      </Fragment>
    );
  }
}
export default Form.create()(ImportInformation);
