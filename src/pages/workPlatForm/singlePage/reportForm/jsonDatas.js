import React, { Component, Fragment } from 'react';
import { Button, message, Input, Card, Row, Col, Form, Select } from 'antd';
import { Link } from 'dva/router';
import { EyeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import lodash from 'lodash';
// import JSONTree from 'react-json-tree'
import JSONInput from 'react-json-editor-ajrm';
import locale    from 'react-json-editor-ajrm/locale/zh-cn';
import LBDialog from 'livebos-frame/dist/LBDialog';
// import { fetchObject } from '../../../../services/sysCommon/index';
import { FetchObjectQuery } from '../../../../services/sysCommon/index';
import { FetchReportTemplateInfo, FetchReportTemplateSetting } from '../../../../services/reportcenter/index';
import styles from './index.less';

const FormItem = Form.Item;

class JsonDatasContent extends Component {
  constructor(props) {
    super(props);
    const { match: { params: { optTp = '1'} } } = props; // params: 1：新增|2：修改
    this.state = {
      btnLoading: false,
      rptId: '', // 报表ID
      rptNm: '',
      rptJson: {},
      rptCode: '', // 报表对应的过程名
      rptDesc: '',  // 报表描述
      tmplPicId: '', // 模板图片ID
      tmplId: '', // 模板ID
      tmplDesc: '暂无信息!', // 模板描述
      tmplInfos: [], // 模板数据
      optTp: optTp, // 操作类型  1:新增|2:修改|3:删除
    }
  }

  componentDidMount() {
    const { match: { params: { optTp = '1'} } } = this.props; // params: 1：新增|2：修改
    this.fetchTmpl(); // 获取模板信息
    if (optTp === '2') {
      this.fetchReportTemplateInfo(this.getParamString('rptId')); // 获取报表信息
    }
    if (this.props.resizeDialog) {
      const height = this.getParamString('height') || 800;
      const width = this.getParamString('width') || 600;
      this.props.resizeDialog({ width, height });
    }
  }

  // 查询模板信息
  fetchTmpl = () => {
    FetchObjectQuery(
      {
        "cols": "ID,prePic,refJson,tmplDesc,tmplNm",
        "current": 1,
        "cxtj": "",
        "pageSize": 100,
        "paging": 0,
        "serviceid": "tcRepoCentTmpl",
        "sort": "",
        "total": -1
      }
    ).then(res => {
      const { code = 0, data = [] } = res
      if (code > 0) {
        this.setState({ tmplInfos: data });
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    })
    // fetchObject('TC_REPO_CENT_TMPL').then((ret) => {
    //   const { code = 0, records = [] } = ret;
    //   if (code > 0) {
    //     this.setState({
    //       tmplInfos: records,
    //     })
    //   }
    // }).catch((error) => {
    //   message.error(!error.success ? error.message : error.note);
    // });
  }

  // 查询报表信息
  fetchReportTemplateInfo = async (rptId) => {
    await FetchReportTemplateInfo({ rptId }).then(res => {
      const { code = 1, records = [] } = res;
      const rptInfo = lodash.get(records, '[0]', {});
      const { tmplId = '', tmplNm = '', tmplJson = '', rptNm = '', rptJson = '', rptCode = '', rptDesc = '', tmplDesc = '' } = rptInfo;
      this.setState({
        rptId,
        rptNm,
        rptJson: rptJson === '' ? {} : JSON.parse(rptJson),
        tmplPicId: tmplId,
        tmplId,
        rptCode,
        rptDesc,
        tmplDesc: tmplDesc || '暂无信息!',
      });
    }).catch(err => {
      message.error(!err.success ? err.message : err.note);
    })
  }

  // 报表设置
  fetchReportTemplateSetting = (payload) => {
    const { rptNm, rptJson, rptCode } = payload;
    const temp = JSON.parse(rptJson);
    if(!rptNm || rptNm === '') {
      message.error('请输入报表名称!');
      return false;
    } else if (Object.keys(temp).length === 0) {
        message.error('请输入报表JSON!');
        return false;
    } else if (!rptCode || rptCode === '') {
      message.error('请输入扩展页面编码!');
      return false;
    }
    FetchReportTemplateSetting(payload).then(res => {
      const { code = 1 } = res;
      if (code > 0) {
        // liveBos弹框确定
        if (this.props.onSubmitOperate) {
          const result = { code: 1 };
          this.props.onSubmitOperate(result);
        }
      }
    }).catch(err => {
      message.error(!err.success ? err.message : err.note);
    })
  }

  // liveBos弹框关闭
  onCancelOperate = () => {
    if (this.props.onCancelOperate) {
      this.props.onCancelOperate();
    }
  }
  getParamString = (key) => {
    const { location: { query = {} } } = this.props;
    if (Object.keys(query).length > 0) {
      return lodash.get(query, key, '');
    }
    return null;
  }

  inputChange = (e) => {
    this.setState({
      rptNm: e.target.value,
    });
  }

  inputCodeChange = (e) => {
    this.setState({
      rptCode: e.target.value,
    });
  }

  inputDescChange = (e) => {
    this.setState({
      rptDesc: e.target.value,
    });
  }

  jsonChange = ( obj ) => {
    const { json = {} , error} = obj;
    if (!error) {
      this.setState({
        rptJson: JSON.parse(json),
      });
    }
  }

  handleLimit = (value) => {
    const { tmplInfos = [] } = this.state;
    const tmpData = tmplInfos.filter(item => item.ID === value) || [];
    if (value === '') {
      this.setState({
        rptJson: {},
        tmplPicId: '',
        tmplId: '',
        tmplDesc: '',
      });
    } else {
      if (tmpData.length > 0) {
        const refJson = lodash.get(tmpData, '[0].refJson');
        this.setState({
          rptJson: JSON.parse(refJson),
          tmplPicId: lodash.get(tmpData, '[0].ID'),
          tmplId: lodash.get(tmpData, '[0].ID'),
          tmplDesc: lodash.get(tmpData, '[0].tmplDesc'),
        });
      }
    }
  }

  // 取消按钮
  handleCancelClick = () => {
    if (this.props.onCancelOperate) {
      this.props.onCancelOperate();
    }
  }

  handleSubmit = async () => {
    this.setState({ btnLoading: true });
    const { optTp, tmplId, rptId, rptNm, rptJson, rptCode, rptDesc } = this.state;
    const params = { optTp, tmplId, rptId, rptNm, rptJson: JSON.stringify(rptJson), rptCode, rptDesc };
    await this.fetchReportTemplateSetting(params);
    this.setState({ btnLoading: false });
  }
  render() {
    const { btnLoading, tmplInfos = [], tmplId = '', rptNm = '', rptCode, rptDesc, rptJson = {}, tmplPicId = '', optTp = '2', tmplDesc = '' } = this.state;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Fragment>
        {/* <LBDialog trustedOrigin="*"> */}
          <Card
            bordered={false}
            style={{ height: '100%' }}
            bodyStyle={{ padding: 0 }}
          >
            <Form className="m-form">
              <FormItem
                {...formItemLayout}
                label={<span style={{ fontSize: '1.9rem', fontWeight: 600 }}><span style={{ color: 'red' }}>*</span>&nbsp;报表名称</span>}
              >
                <div style={{ width: '500px' }}><Input placeholder="请输入报表名称" value={rptNm} onChange={this.inputChange} /></div>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={<span style={{ fontSize: '1.9rem', fontWeight: 600 }}><span style={{ color: 'red' }}>*</span>&nbsp;扩展页面编码</span>}
              >
                <div style={{ width: '500px' }}><Input placeholder="请输入扩展页面编码" disabled={optTp === '2'}  value={rptCode} onChange={this.inputCodeChange} /></div>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={<span style={{ fontSize: '1.9rem', fontWeight: 600 }}>参考模板</span>}
              >
                <div style={{ width: '500px', display: 'flex' }}>
                  <Select style={{ width: 300 }} onChange={this.handleLimit} value={tmplId}>
                    <Select.Option key={-99} value='' >请选择</Select.Option>
                    {
                      tmplInfos.map((element) => {
                        const { ID, tmplNm = '' } = element;
                        return <Select.Option key={ID} value={ID} >{tmplNm}</Select.Option>;
                      })
                    }
                  </Select>
                  {
                    tmplPicId !== '' && (<div style={{ paddingLeft: '0.5rem' }}><a className="blue" title={tmplDesc} style={{ cursor: 'auto' }}><ExclamationCircleOutlined />&nbsp;参数规则</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>)
                  }
                  {
                    tmplPicId !== '' && (<div style={{ paddingLeft: '0.5rem' }}><Link to={`/single/imgPreview/TC_REPO_CENT_TMPL,prePic,${tmplPicId}`} target="_blank" className="blue"><EyeOutlined />&nbsp;预览</Link></div>)
                  }
                </div>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={<span style={{ fontSize: '1.9rem', fontWeight: 600 }}><span style={{ color: 'red' }}>*</span>&nbsp;报表JSON</span>}
              >
                <div className={styles.jsonInputCss}>
                  <JSONInput
                    id= 'a_unique_id'
                    placeholder={rptJson}
                    colors={{
                      default: 'black',
                      background: 'white',
                      background_warning: '1E1E1E',
                      string: 'black',
                      number: '#DAA520',
                      colon: '#49B8F7',
                      keys: '#9CDCFE',
                      keys_whiteSpace: '#AF74A5',
                      primitive: '#6392C6'
                    }}
                    onKeyPressUpdate={false}
                    locale = { locale }
                    onChange = { this.jsonChange }
                    height = '250px'
                    width = '500px'
                    style = {{
                      labelColumn: { background: 'rgb(241, 241, 241)', width: '35px' },
                      labels: { lineHeight:'18px', width: '30px' },
                      contentBox: {lineHeight:'18px'},
                      container: { border: '1px solid #e5e5e5', borderRadius: '2%' }
                    }}
                  />
                </div>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={<span style={{ fontSize: '1.9rem', fontWeight: 600 }}>说明</span>}
              >
                <div style={{ width: '500px' }}>
                  <Input.TextArea placeholder="请输入报表描述"  value={rptDesc} rows={4} onChange={this.inputDescChange} />
                </div>
              </FormItem>
              <Row className="m-row-form">
                <Col span={24} style={{ textAlign: 'right', paddingRight: '3rem' }}>
                    <Button loading={btnLoading} type="primary" htmlType="submit" onClick={this.handleSubmit}>保存</Button>
                    <Button style={{ marginLeft: '2rem' }} onClick={this.handleCancelClick}>取消</Button>
                </Col>
              </Row>
            </Form>
          </Card>
        {/* </LBDialog> */}
      </Fragment>
    );
  }
}

const JsonDatas = ({ ...props }) => {
  return (
    <LBDialog trustedOrigin="*">
      <JsonDatasContent {...props} />
    </LBDialog>
  );
};

export default JsonDatas;
