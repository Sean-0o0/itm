/* eslint-disable react/jsx-closing-tag-location */
import React, { Component, Fragment } from 'react';
import { Form, Input, Select, Tooltip } from 'antd';
import BasicModal from '../../../../../Common/BasicModal';

class AddStreamTableModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSrc: '',
    };
  }
  handleCancel =() => {
    const { handleAddCancel } = this.props;
    if (typeof handleAddCancel === 'function') {
      handleAddCancel();
    }
  }

  handleOk=() => {
    const { form: { getFieldsValue }, handleAddOk } = this.props;
    if (typeof handleAddOk === 'function') {
      const fieldsValue = getFieldsValue();
      const {dataSrcTp, ctcUrl_user='', ctcUrl_pwd='', ctcUrl_host='', ctcUrl_database=''} = fieldsValue;
      let ctcUrl = '';
      if (dataSrcTp === '1') {
        ctcUrl = `jdbc:oracle:thin:${ctcUrl_user}/${ctcUrl_pwd}@//${ctcUrl_host}`;
      } else if (dataSrcTp === '2') {
        ctcUrl = `jdbc:mysql://${ctcUrl_host}?user=${ctcUrl_user}&password=${ctcUrl_pwd}`;
      } else if (dataSrcTp === '4') {
        ctcUrl = `jdbc:sqlserver://${ctcUrl_host};database=${ctcUrl_database};user=${ctcUrl_user};password=${ctcUrl_pwd}`
      }
      fieldsValue.ctcUrl = ctcUrl;
      handleAddOk(fieldsValue);
    }
  }

  handleChange=(dataSrc) => {
    const { fetchQueryStreamTableDataType, form: {setFieldsValue} } = this.props;
    if (typeof fetchQueryStreamTableDataType === 'function') {
      fetchQueryStreamTableDataType(dataSrc);
      setFieldsValue({ctcUrl_user: '', ctcUrl_pwd: '', ctcUrl_host: ''})
    }
    this.setState({ dataSrc });
  }

  render() {
    const { visible = false, addType = '', form, urlExample = [], motDataSrc = [], motCtcTblTp = [] } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const {ctcUrl_user='', ctcUrl_host='', dataSrcTp, tblTp} = getFieldsValue();
    const modalProps = {
      className: 'mot-prod-scrollbar',
      bodyStyle: { height: addType === '1' ? '22rem' : '36rem', overflow: 'auto' },
      width: '97rem',
      title: '添加流数据表',
      visible,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
    };
    return (
      <BasicModal {...modalProps}>
        <Form className="m-form" labelAlign="right" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
          <Form.Item label="表名">
            {
              getFieldDecorator('tblNm', {})(<Input />)
            }
          </Form.Item>
          <Form.Item label="描述">
            {
              getFieldDecorator('tblDesc', {})(<Input />)
            }
          </Form.Item>
          {
            addType === '1' && (
            <Fragment>
              <Form.Item label="TOPIC名称">
                {
                  getFieldDecorator('topicNm', {})(<Input />)
                }
              </Form.Item>
              <Form.Item label="JSON格式配置">
                {
                  getFieldDecorator('jsonFmtCfg', {})(<Input />)
                }
              </Form.Item>
            </Fragment>
            )
          }
          {
            addType === '2' && (
            <Fragment>
              <Form.Item label="数据源">
                {
                  getFieldDecorator('dataSrcTp', {
                    initialValue: '1',
                  })(<Select getPopupContainer={node => node} onChange={this.handleChange}>
                    {
                      motDataSrc.map(item => <Select.Option key={item.ibm}>{item.note}</Select.Option>)
                    }
                    {/* eslint-disable-next-line react/jsx-indent */ }
                  </Select>)
                }
              </Form.Item>
              <Form.Item label="表类型">
                {
                  getFieldDecorator('tblTp', {

                  })(<Select getPopupContainer={node => node} onChange={this.handleChange}>
                    {
                        motCtcTblTp.map(item => <Select.Option key={item.ibm}>{item.note}</Select.Option>)
                    }
                    {/* eslint-disable-next-line react/jsx-indent */ }
                  </Select>)
                }
              </Form.Item>
              <Form.Item label="采集频率(毫秒)">
                {
                  getFieldDecorator('pollIntvl', { initialValue:'5000' })(<Input />)
                }
              </Form.Item>
              <Form.Item className="ctcUrl-input-group" label="连接URL" style={{ marginBottom: 0 }}>
                {
                  dataSrcTp === '1' && (
                    <Input.Group compact>
                      <Form.Item>
                        <Tooltip trigger={['focus']} title={ctcUrl_user || 'USER'} placement="top">
                          {getFieldDecorator('ctcUrl_user', {})(<Input className="group-first" style={{width: '310px'}} addonBefore="jdbc:oracle:thin:" autoComplete="off"/>)}
                        </Tooltip>
                      </Form.Item>
                      <Form.Item>
                        {getFieldDecorator('ctcUrl_pwd', {})(<Input.Password className="group-second" style={{width: '219px'}} addonBefore="/" visibilityToggle={false}/>)}
                      </Form.Item>
                      <Form.Item>
                        <Tooltip trigger={['focus']} title={ctcUrl_host || 'HOST'} placement="top">
                          {getFieldDecorator('ctcUrl_host', {})(<Input className="group-third" style={{width: '404px'}} addonBefore="@//" autoComplete="off"/>)}
                        </Tooltip>
                      </Form.Item>
                    </Input.Group>
                  )
                }
                {
                  dataSrcTp === '2' && (
                    <Input.Group compact>
                      <Form.Item>
                        <Tooltip trigger={['focus']} title={ctcUrl_host || 'HOST'} placement="top">
                          {getFieldDecorator('ctcUrl_host', {})(<Input className="group-first" style={{width: '400px'}} addonBefore="jdbc:mysql://" autoComplete="off"/>)}
                        </Tooltip>
                      </Form.Item>
                      <Form.Item>
                        <Tooltip trigger={['focus']} title={ctcUrl_user || 'USER'} placement="top">
                          {getFieldDecorator('ctcUrl_user', {})(<Input className="group-second" style={{width: '243px'}} addonBefore="?user=" autoComplete="off"/>)}
                        </Tooltip>
                      </Form.Item>
                      <Form.Item>
                        {getFieldDecorator('ctcUrl_pwd', {})(<Input.Password className="group-third" style={{width: '290px'}} addonBefore="&password=" visibilityToggle={false}/>)}
                      </Form.Item>
                    </Input.Group>
                  )
                }
                {
                  dataSrcTp === '4' && (
                    <Input.Group compact>
                      <Form.Item>
                        <Tooltip trigger={['focus']} title={ctcUrl_host || 'HOST'} placement="top">
                          {getFieldDecorator('ctcUrl_host', {})(<Input className="group-first" style={{width: '400px'}} addonBefore="jdbc:sqlserver://" autoComplete="off"/>)}
                        </Tooltip>
                      </Form.Item>
                      <Form.Item>
                        <Tooltip trigger={['focus']} title={ctcUrl_host || 'database'} placement="top">
                          {getFieldDecorator('ctcUrl_database', {})(<Input className="group-first" style={{width: '180px'}} addonBefore=";database=" autoComplete="off"/>)}
                        </Tooltip>
                      </Form.Item>
                      <Form.Item>
                        <Tooltip trigger={['focus']} title={ctcUrl_user || 'USER'} placement="top">
                          {getFieldDecorator('ctcUrl_user', {})(<Input className="group-second" style={{width: '155px'}} addonBefore=";user=" autoComplete="off"/>)}
                        </Tooltip>
                      </Form.Item>
                      <Form.Item>
                        {getFieldDecorator('ctcUrl_pwd', {})(<Input.Password className="group-third" style={{width: '199px'}} addonBefore=";password=" visibilityToggle={false}/>)}
                      </Form.Item>
                    </Input.Group>
                  )
                }
                <div style={{ fontSize: '1rem', color: '#999', marginTop: '-14px' }}>
                  示例：
                  {
                    urlExample.find(item => item.datesrctp === dataSrcTp)?.ctcurlexmp
                  }
                </div>
              </Form.Item>
              {
                tblTp === '3' && (
                  <Form.Item label="查询SQL">
                    {getFieldDecorator('qrySql', {
                      initialValue: '',
                    })(<Input.TextArea />)}
                  </Form.Item>
                )
              }
            </Fragment>
            )
          }
        </Form>
      </BasicModal>
    );
  }
}

export default Form.create()(AddStreamTableModal);
