import React, { Component } from 'react';
import { Form, message, Row, Col, Button, TreeSelect, DatePicker } from 'antd';
import styles from './index.less';
import TreeUtils from '../../../../../../utils/treeUtils';
import TagPicker from '../../../../../Common/TagPicker';
import CommonSelect from '../../../../../Common/Form/Select';
import { FetchSysCommonTable } from '../../../../../../services/sysCommon';
import { fetchUserAuthorityDepartment } from '../../../../../../services/commonbase/userAuthorityDepartment';

class DetailForm extends Component {
  state = {
    tdData: {}, // 团队下拉菜单数据
    zbData: {}, // 指标下拉菜单数据
    // monthData: {}, // 月份下拉菜单数据
    ryData: {}, // 人员、客户、结算人员下拉菜单数据
    yybData: [], // 营业部下拉菜单数据
    xcxmData: {}, // 薪酬项目下拉菜单数据
    jszhData: {}, // 结算账户下拉菜单数据
    khData: {}, // 客户下拉菜单数据
  }

  // 页面加载获取所有下拉菜单数据
  componentDidMount() {
    this.getZbData();
    this.getJszhData();
    // this.getMonthData();
    this.getRyData();
    this.getTdData();
    this.getXcxmData();
    this.getYybData();
    this.getKhData();
  }

  // 获取指标下拉菜单数据
  getZbData = () => {
    FetchSysCommonTable({
      objectName: 'tXTZBDM',
    }).then((ret = {}) => {
      const { records = [] } = ret;
      const zbData = [];
      records.forEach((item) => {
        zbData.push({
          label: item.ZBMC,
          value: item.ID,
        });
      });
      this.setState({
        zbData,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // // 获取月份下拉菜单数据
  // getMonthData = () => {
  //   FetchSysCommonTable({
  //     objectName: 'vYFXX',
  //   }).then((ret = {}) => {
  //     const { records = [] } = ret;
  //     const monthData = [];
  //     records.forEach((item) => {
  //       monthData.push({
  //         label: item.SJD,
  //         value: item.ID,
  //       });
  //     });
  //     this.setState({
  //       monthData,
  //     });
  //   }).catch((error) => {
  //     message.error(!error.success ? error.message : error.note);
  //   });
  // }

  // 获取人员、结算人员下拉菜单数据（数据相同）
  getRyData = () => {
    FetchSysCommonTable({
      objectName: 'viRYXX',
    }).then((ret = {}) => {
      const { records = [] } = ret;
      const ryData = [];
      records.forEach((item) => {
        ryData.push({
          label: item.RYXM,
          value: item.ID,
        });
      });
      this.setState({
        ryData,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 获取客户下拉菜单数据（数据相同）
  getKhData = () => {
    FetchSysCommonTable({
      objectName: 'vKHXX',
    }).then((ret = {}) => {
      const { records = [] } = ret;
      const khData = [];
      records.forEach((item) => {
        khData.push({
          label: item.KHXM,
          value: item.ID,
        });
      });
      this.setState({
        khData,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 获取团队下拉菜单数据
  getTdData = () => {
    FetchSysCommonTable({
      objectName: 'viTD',
    }).then((ret = {}) => {
      const tdData = [];
      const { records = [] } = ret;
      records && records.forEach((item) => {
        tdData.push({
          label: item.TDMC,
          value: item.ID,
        });
      });
      this.setState({
        tdData,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 查询营业部下拉菜单数据
  getYybData = () => {
    fetchUserAuthorityDepartment({
      paging: 0,
      current: 1,
      pageSize: 10,
      total: -1,
      sort: '',
    }).then((data) => {
      const { code = 0, records = [] } = data || {};
      if (code > 0) {
        const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'value' }, true);
        const tmpl = [];
        datas.forEach((item) => {
          const { children } = item;
          tmpl.push(...children);
        });
        this.setState({
          yybData: tmpl,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 获取薪酬项目下拉菜单数据
  getXcxmData = () => {
    FetchSysCommonTable({
      objectName: 'tXCDM',
    }).then((ret = {}) => {
      const { records = [] } = ret;
      const xcxmData = [];
      records.forEach((item) => {
        xcxmData.push({
          label: item.XCMC,
          value: item.ID,
        });
      });
      this.setState({
        xcxmData,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 获取结算账户下拉菜单数据
  getJszhData = () => {
    FetchSysCommonTable({
      objectName: 'TRYJSZH',
    }).then((ret) => {
      const { records } = ret;
      const jszhData = [];
      records.forEach((item) => {
        jszhData.push({
          value: item.JSZH,
          label: item.JSZH,
        });
      });
      this.setState({
        jszhData,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 筛选条件重置
  handleRest = () => {
    const { form: { setFieldsValue } } = this.props;
    setFieldsValue({
      yf: '',
      ryid: '',
      khid: '',
      td: '',
      yyb: '',
      zb: '',
      jsry: '',
      xcxm: '',
      jszh: '',
    });
  }

  // 提交表单
  handleSearch = (e) => {
    let formData;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        formData = values;
      }
    });
    // 调用父组件方法更新父组件state中的列表数据，刷新页面
    this.props.updataTable(formData);
  }

  render() {
    // 取出报表维度用于判断显示哪些筛选条件
    const { dataGran, form: { getFieldDecorator } } = this.props;
    // 取出下拉菜单数据
    const {
      tdData, // 团队下拉菜单数据
      zbData, // 指标下拉菜单数据
      // monthData, // 月份下拉菜单数据
      ryData, // 人员、客户、结算人员下拉菜单数据
      yybData, // 营业部下拉菜单数据
      xcxmData, // 薪酬项目下拉菜单数据
      jszhData, // 结算账户下拉菜单数据
      khData, // 客户下拉菜单数据
    } = this.state;
    // 粒度选择组件参数
    let lidu;
    if (dataGran === '3') {
      lidu = [{ ibm: '1', note: '人员' }, { ibm: '2', note: '团队' }, { ibm: '3', note: '营业部' }];
    } else {
      lidu = [{ ibm: '0', note: '客户' }, { ibm: '1', note: '人员' }, { ibm: '2', note: '团队' }, { ibm: '3', note: '营业部' }];
    }

    return (
      <Form onSubmit={this.onSubmit} className="m-form-default ant-advanced-search-form">
        <Row>

          <Col span={6}>
            <Form.Item className="m-form-item" label="营业部">
              {
                // 营业部id
                getFieldDecorator('yyb', {
                })(<TreeSelect
                  showSearch
                  style={{ Width: '100%' }}
                  dropdownClassName={styles.treeSelectDropdown}
                  dropdownMatchSelectWidth
                  treeData={yybData}
                  placeholder="请选择营业部"
                  searchPlaceholder="搜索..."
                  multiple={false}
                  filterTreeNode={(input, option) => option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={this.handleYYBChange}
                />)
              }
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item className="m-form-item" label="团队">
              {
                // 团队id
                getFieldDecorator('td', {
                })(<CommonSelect style={{ width: '100%' }} datas={tdData} />)
              }
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item className="m-form-item" label="人员">
              {
                // 人员id
                getFieldDecorator('ryid', {
                })(<CommonSelect style={{ width: '100%' }} datas={ryData} />)
              }
            </Form.Item>
          </Col>

          {
          // 报表维度为3时不显示该筛选条件
          (dataGran === '3') || (
            <Col span={6}>
              <Form.Item className="m-form-item" label="客户">
                {
                  // 客户id
                  getFieldDecorator('khid', {
                  })(<CommonSelect style={{ width: '100%' }} datas={khData} />)
                }
              </Form.Item>
            </Col>)
          }

          <Col span={6}>
            <Form.Item className="m-form-item" label="月份">
              {
                // 月份
                getFieldDecorator('yf', {
                })(<DatePicker.RangePicker format="YYYY-MM" style={{ width: '100%' }} />)
              }
            </Form.Item>
          </Col>

          {
          // 只有报表维度为1时显示该筛选条件
          (dataGran === '1') && (
          <Col span={6}>
            <Form.Item className="m-form-item" label="指标">
              {
                // 指标id
                getFieldDecorator('zb', {
                })(<CommonSelect style={{ width: '100%' }} datas={zbData} />)
              }
            </Form.Item>
          </Col>)
          }

          {
            // 只有报表维度为3时显示该筛选条件
            (dataGran === '3') && (
              <Col span={6}>
                <Form.Item className="m-form-item" label="结算人员">
                  {
                    // 结算人员
                    getFieldDecorator('jsry', {
                    })(<CommonSelect style={{ width: '100%' }} datas={ryData} />)
                  }
                </Form.Item>
              </Col>)
          }

          {
            // 只有报表维度为3时显示该筛选条件
            (dataGran === '3') && (
              <Col span={6}>
                <Form.Item className="m-form-item" label="薪酬项目">
                  {
                    // 薪酬项目
                    getFieldDecorator('xcxm', {
                    })(<CommonSelect style={{ width: '100%' }} datas={xcxmData} />)
                  }
                </Form.Item>
              </Col>)
          }

          {
            // 只有报表维度为3时显示该筛选条件
            (dataGran === '3') && (
              <Col span={6}>
                <Form.Item className="m-form-item" label="结算账户">
                  {
                    // 结算账户
                    getFieldDecorator('jszh', {
                    })(<CommonSelect style={{ width: '100%' }} datas={jszhData} />)
                  }
                </Form.Item>
              </Col>)
          }
        </Row>

        <Row>
          <Col span={15}>
            <Form.Item className="m-form-item" label="数据粒度">
              <span className="m-kequn-form-left">数据粒度</span>
              {
                  // 数据粒度 0/1/2/3 分别对应：客户/人员/团队/营业部
                    getFieldDecorator('lidu', {
                      initialValue: '1',
                    })(<TagPicker
                      tagClassName="ant-tag ant-tag-checkable m-tag m-tag-marginB"
                      rowKey="ibm"
                      titleKey="note"
                      allTagData={{ show: false }}
                      dataSource={lidu}
                    />)
                }
            </Form.Item>
          </Col>

          <Col span={9} style={{ paddingLeft: '4.666rem', float: 'right' }}>
            <Button className="m-btn-radius m-btn-headColor" onClick={this.handleSearch}> 查询 </Button>
            <Button className="m-btn-radius m-btn-gray" onClick={this.handleRest}> 重置 </Button>
          </Col>
        </Row>

      </Form>
    );
  }
}
export default Form.create()(DetailForm);
