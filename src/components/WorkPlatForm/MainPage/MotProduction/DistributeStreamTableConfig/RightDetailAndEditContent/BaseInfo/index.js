import React from 'react';
import { Form, Select, Input, Row, Col, Tooltip } from 'antd';

const ctcUrlReg = {
  '1': /^jdbc:oracle:thin:(?<ctcUrl_user>.*?)\/(?<ctcUrl_pwd>.*?)@\/\/(?<ctcUrl_host>.*)$/i,
  '2': /^jdbc:mysql:\/\/(?<ctcUrl_host>.*)\?user=(?<ctcUrl_user>.*?)&password=(?<ctcUrl_pwd>.*)$/i,
  '4': /^jdbc:sqlserver:\/\/(?<ctcUrl_host>.*);database=(?<ctcUrl_database>.*?);user=(?<ctcUrl_user>.*?);password=(?<ctcUrl_pwd>.*)$/i,
}

class BaseInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSrc: '',
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.isEdit !== this.props.isEdit) {
      this.setState({
        dataSrc: nextProps.isEdit && nextProps.addType !== '2' ? this.props.tableDetail.dataSrcTp : ''
      })
    }
  }

  handleDataSrcChange=(e) => {
    const { handleDataSrcChange } = this.props;
    if (typeof handleDataSrcChange === 'function') {
      handleDataSrcChange(e);
    }
    this.setState({ dataSrc: e });
  }

  validateForm=() => {
    const { validateFieldsAndScroll } = this.props.form;
    let fields = {};
    validateFieldsAndScroll(null, { scroll: { offsetTop: 80 } }, (err, values) => {
      if (!err) {
        // fields = this.renderFields(values);
        fields = values;
        const {dataSrcTp, ctcUrl_user, ctcUrl_pwd, ctcUrl_host, ctcUrl_database} = fields;
        let ctcUrl = '';
        if (dataSrcTp === '1') {
          ctcUrl = `jdbc:oracle:thin:${ctcUrl_user}/${ctcUrl_pwd}@//${ctcUrl_host}`;
        } else if (dataSrcTp === '2') {
          ctcUrl = `jdbc:mysql://${ctcUrl_host}?user=${ctcUrl_user}&password=${ctcUrl_pwd}`;
        } else if (dataSrcTp === '4') {
          ctcUrl = `jdbc:sqlserver://${ctcUrl_host};database=${ctcUrl_database};user=${ctcUrl_user};password=${ctcUrl_pwd}`
        }
        fields.ctcUrl = ctcUrl;
      }
    });
    return fields;
  }
  numberValidator = (rule, value, callback) => {
    if (!value) {
      callback('请输入采集频率！');
    } else if (Number.isNaN(Number(value))) {
      callback('请输入数字');
    } else {
      callback();
    }
  }

  render() {
    const { dataSrc } = this.state;
    const { form: { getFieldDecorator, getFieldsValue, getFieldValue }, tableDetail = {}, isEdit = false, urlExample = [], addType = '', motCtcTblTp = [], motDataSrc = [] } = this.props;
    let {ctcUrl=''} = tableDetail;
    let ctcUrlInitValue = {};
    let reg = ctcUrlReg[dataSrc || tableDetail.dataSrcTp];
    if (reg != null) {
      const matchResult = ctcUrl.match(reg);
      if (matchResult && matchResult.groups) {
        ctcUrlInitValue = matchResult.groups;
        if (ctcUrlInitValue.ctcUrl_pwd) {
          let star = '';
          for (let i = 0; i < ctcUrlInitValue.ctcUrl_pwd.length; i++) {
            star += '*';
          }
          switch (dataSrc || tableDetail.dataSrcTp) {
            case '1':
              ctcUrl = tableDetail.ctcUrl.replace(/\/(.*)@/, '/' + star + '@');
              break;
            case '2':
            case '4':
              ctcUrl = tableDetail.ctcUrl.replace(/password=(.*)$/, 'password=' + star);
              break;
            default:
              break;
          }
        }
      }
    }
    const {ctcUrl_user=ctcUrlInitValue.ctcUrl_user, ctcUrl_host=ctcUrlInitValue.ctcUrl_host, ctcUrl_database=ctcUrlInitValue.ctcUrl_database} = getFieldsValue();
    return (
      <React.Fragment>
        <Form className="m-form" labelAlign="right" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} colon={false}>
          <Row className={isEdit ? 'mot-prod-info-form-edit' : 'mot-prod-info-form-read'}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} >
              <Form.Item label="描述" >
                {
                  isEdit ?
                  getFieldDecorator('tblDesc', {
                    initialValue: tableDetail.tblDesc || '',
                    rules: [{ required: true, message: '请输入描述！' }],
                  })(<Input />) :
                  <div>{tableDetail.tblDesc || '--'}</div>
                }
              </Form.Item>
            </Col>
            {
              (addType === '1' || tableDetail.topicNm) && (
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item label="TOPIC名称">
                  {
                    isEdit ?
                    getFieldDecorator('topicNm', {
                      initialValue: tableDetail.topicNm || '',
                      rules: [{ required: true, message: '请输入TOPIC名称！' }],
                    })(<Input />) :
                    <div>{tableDetail.topicNm || '--'}</div>
                  }
                </Form.Item>
              </Col>
            )}
            {
              (addType === '1' || tableDetail.jsonFmtCfg) && (
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item label="JSON格式配置">
                  {
                    isEdit ?
                    getFieldDecorator('jsonFmtCfg', {
                      initialValue: tableDetail.jsonFmtCfg || '',
                    })(<Input.TextArea />) :
                    <div>{tableDetail.jsonFmtCfg || '--'}</div>
                  }
                </Form.Item>
              </Col>
            )}
            {
              (addType === '2' || (tableDetail.dataSrcTp && tableDetail.dataSrcTp !== '3')) && (
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item label="数据源类型">
                  {
                    isEdit ?
                    getFieldDecorator('dataSrcTp', {
                      initialValue: tableDetail.dataSrcTp || undefined,
                      rules: [{ required: true, message: '请选择数据源类型！' }],
                    })(<Select onChange={this.handleDataSrcChange} getPopupContainer={node => node}>
                      {motDataSrc.map(item => <Select.Option key={item.ibm}>{item.note}</Select.Option>)}
                      {/* eslint-disable-next-line react/jsx-indent */ }
                       </Select>) :
                    <div>{motDataSrc.find(item => item.ibm === tableDetail.dataSrcTp)?.note || '--'}</div>
                  }
                </Form.Item>
              </Col>
            )}
            {
              (addType === '2' || tableDetail.tblTp) && (
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item label="表类型">
                  {
                    isEdit ?
                    getFieldDecorator('tblTp', {
                      initialValue: tableDetail.tblTp || undefined,
                      rules: [{ required: true, message: '请选择表类型！' }],
                    })(<Select getPopupContainer={node => node}>
                      {
                        motCtcTblTp.map(item => <Select.Option key={item.ibm}>{item.note}</Select.Option>)
                      }
                      {/* eslint-disable-next-line react/jsx-indent */ }
                       </Select>) :
                    <div>{motCtcTblTp.find(item => item.ibm === tableDetail.tblTp)?.note || '--'}</div>
                  }
                </Form.Item>
              </Col>
            )}
            {
              (addType === '2' || tableDetail.pollIntvl) && (
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item label="采集频率(毫秒)" required={isEdit}>
                  {
                    isEdit ?
                    getFieldDecorator('pollIntvl', {
                      initialValue: tableDetail.pollIntvl || '',
                      rules: [{ validator: this.numberValidator }],
                    })(<Input />) :
                    <div>{tableDetail.pollIntvl || '--'}</div>
                  }
                </Form.Item>
              </Col>
            )}
            {
              (addType === '2' || tableDetail.ctcUrl) && (
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item className="ctcUrl-input-group" label="连接URL" labelCol={{ span: 3 }} wrapperCol={{ span: 18 }}>
                  {
                    isEdit ?
                      (
                        (dataSrc || tableDetail.dataSrcTp) === '1' &&
                          (
                            <Input.Group compact>
                              <Form.Item>
                                <Tooltip trigger={['focus']} title={ctcUrl_user || 'USER'} placement="top">
                                  {getFieldDecorator('ctcUrl_user', {
                                    initialValue: ctcUrlInitValue.ctcUrl_user || '',
                                    rules: [{ required: true, message: '请输入连接URL的用户名部分！' }],
                                  })(
                                    <Input className="group-first" style={{ width: '320px' }}
                                           addonBefore="jdbc:oracle:thin:" autoComplete="off"/>)}
                                </Tooltip>
                              </Form.Item>
                              <Form.Item>
                                {getFieldDecorator('ctcUrl_pwd', {
                                  initialValue: ctcUrlInitValue.ctcUrl_pwd || '',
                                  rules: [{ required: true, message: '请输入连接URL的密码部分！' }],
                                })(<Input.Password className="group-second" style={{ width: '230px' }} addonBefore="/"
                                                   visibilityToggle={false}/>)}
                              </Form.Item>
                              <Form.Item>
                                <Tooltip trigger={['focus']} title={ctcUrl_host || 'HOST'} placement="top">
                                  {getFieldDecorator('ctcUrl_host', {
                                    initialValue: ctcUrlInitValue.ctcUrl_host || '',
                                    rules: [{ required: true, message: '请输入连接URL的数据库地址部分！' }],
                                  })(<Input className="group-third" style={{ width: '395px' }} addonBefore="@//" autoComplete="off"/>)}
                                </Tooltip>
                              </Form.Item>
                            </Input.Group>
                          )
                      ) || ((dataSrc || tableDetail.dataSrcTp) === '2' && (
                          <Input.Group compact>
                            <Form.Item>
                              <Tooltip trigger={['focus']} title={ctcUrl_host || 'HOST'} placement="top">
                                {getFieldDecorator('ctcUrl_host', {
                                  initialValue: ctcUrlInitValue.ctcUrl_host || '',
                                  rules: [{ required: true, message: '请输入连接URL的数据库地址部分！' }],
                                })(<Input className="group-first" style={{ width: '430px' }}
                                          addonBefore="jdbc:mysql://" autoComplete="off"/>)}
                              </Tooltip>
                            </Form.Item>
                            <Form.Item>
                              <Tooltip trigger={['focus']} title={ctcUrl_user || 'USER'} placement="top">
                                {getFieldDecorator('ctcUrl_user', {
                                  initialValue: ctcUrlInitValue.ctcUrl_user || '',
                                  rules: [{ required: true, message: '请输入连接URL的用户名部分！' }],
                                })(<Input className="group-second" style={{ width: '255px' }} addonBefore="?user=" autoComplete="off"/>)}
                              </Tooltip>
                            </Form.Item>
                            <Form.Item>
                              {getFieldDecorator('ctcUrl_pwd', {
                                initialValue: ctcUrlInitValue.ctcUrl_pwd || '',
                                rules: [{ required: true, message: '请输入连接URL的密码部分！' }],
                              })(<Input.Password className="group-third" style={{ width: '260px' }}
                                                 addonBefore="&password=" visibilityToggle={false}/>)}
                            </Form.Item>
                          </Input.Group>
                        )
                      ) || ((dataSrc || tableDetail.dataSrcTp) === '4' && (
                          <Input.Group compact>
                            <Form.Item>
                              <Tooltip trigger={['focus']} title={ctcUrl_host || 'HOST'} placement="top">
                                {getFieldDecorator('ctcUrl_host', {
                                  initialValue: ctcUrlInitValue.ctcUrl_host || '',
                                  rules: [{ required: true, message: '请输入连接URL的数据库地址部分！' }],
                                })(<Input className="group-first" style={{ width: '425px' }}
                                          addonBefore="jdbc:sqlserver://" autoComplete="off"/>)}
                              </Tooltip>
                            </Form.Item>
                            <Form.Item>
                              <Tooltip trigger={['focus']} title={ctcUrl_database || 'DATABASE'} placement="top">
                                {getFieldDecorator('ctcUrl_database', {
                                  initialValue: ctcUrlInitValue.ctcUrl_database || '',
                                  rules: [{ required: true, message: '请输入连接URL的database部分！' }],
                                })(<Input className="group-second" style={{ width: '175px' }} addonBefore=";database=" autoComplete="off"/>)}
                              </Tooltip>
                            </Form.Item>
                            <Form.Item>
                              <Tooltip trigger={['focus']} title={ctcUrl_user || 'USER'} placement="top">
                                {getFieldDecorator('ctcUrl_user', {
                                  initialValue: ctcUrlInitValue.ctcUrl_user || '',
                                  rules: [{ required: true, message: '请输入连接URL的用户名部分！' }],
                                })(<Input className="group-second" style={{ width: '125px' }} addonBefore=";user=" autoComplete="off"/>)}
                              </Tooltip>
                            </Form.Item>
                            <Form.Item>
                              {getFieldDecorator('ctcUrl_pwd', {
                                initialValue: ctcUrlInitValue.ctcUrl_pwd || '',
                                rules: [{ required: true, message: '请输入连接URL的密码部分！' }],
                              })(<Input.Password className="group-third" style={{ width: '220px' }}
                                                 addonBefore=";password=" visibilityToggle={false}/>)}
                            </Form.Item>
                          </Input.Group>
                        )
                      )
                      : <div>{ctcUrl || '--'}</div>}
                  <div style={{ fontSize: '1rem', color: '#999', margin: isEdit ? '-14px 0 14px 0' : '0' }}>
                    示例：
                    {
                      dataSrc ? urlExample.find(item => item.datesrctp === dataSrc)?.ctcurlexmp :
                      urlExample.find(item => item.datesrctp === tableDetail.dataSrcTp)?.ctcurlexmp
                    }
                  </div>
                </Form.Item>
              </Col>
            )}
            {
              (getFieldValue('tblTp') || tableDetail.tblTp) === '3'  && (
                <Col span={24}>
                  <Form.Item label="查询SQL" labelCol={{span: 3}} wrapperCol={{span: 18}}>
                    {isEdit ? getFieldDecorator('qrySql', {
                        initialValue: tableDetail.qrySql || '',
                        rules: [{ required: true, message: '请输入查询SQL！' }],
                      })(<Input.TextArea />)
                      : <div>{tableDetail.qrySql || '--'}</div>
                    }
                  </Form.Item>
                </Col>
              )
            }
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
export default Form.create()(BaseInfo);

