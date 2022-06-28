import React, { Component } from 'react';
import { Form, Row, Col, DatePicker, message, TreeSelect, Select } from 'antd';
import { FetchSysCommonTable } from '../../../../../../../services/sysCommon';
import TreeUtils from '../../../../../../../utils/treeUtils';
import classnames from 'classnames';
import moment from 'moment';
import 'moment/locale/zh-cn';
const { Option } = Select;

const FormItem = Form.Item;

/* 头部搜索项 */
class SearchItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orgData: {
        isloading: true,
        dataLoaded: false,
        searchValue: '',
        datas: [],
        selected: this.props.value && this.props.value.gxyyb ? this.props.value.gxyyb : [],
      },
      yearOpen: false, //年度日期面板
      mode: 'year',
    };
  }
  componentDidMount() {
    this.fetchOrganization();
  }

  //获取组织机构
  fetchOrganization = (orgData = this.state.orgData) => {
    const gxyybCurrent = orgData;
    FetchSysCommonTable({ objectName: 'TPRFM_ORG' }).then((res) => {
      const { code, records = [] } = res;
      if (code > 0) {
        const datas = TreeUtils.toTreeData(records, { keyName: 'ID', pKeyName: 'FID', titleName: 'Name', normalizeTitleName: 'label', normalizeKeyName: 'value' }, true);
        gxyybCurrent.datas = [];
        datas.forEach((item) => {
          const { children } = item;
          gxyybCurrent.datas.push(...children);
        });
        gxyybCurrent.dataLoaded = true;
        this.setState({ orgData: gxyybCurrent });
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    })
    FetchSysCommonTable({ objectName: 'TPRFM_PGM' }).then((res) => {
      const { code, records = [] } = res;
      if (code > 0) {
        const pgmList = [];
        records.forEach((item) => {
          const list = {
            ibm: item.PGM_NO,
            note: item.PGM_NAME,
          }
          pgmList.push(list);
        })
        this.setState({ pgmList });
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    })
  }

  //年度日期改变
  handleYear = (value, mode) => {
    const { yearChange } = this.props;
    if (typeof (yearChange) === "function") {
      yearChange(moment(value).format('YYYY'))
    }
    if (mode === "decade" || mode === "year") {
      this.setState({
        mode,
      });
    } else {
      this.setState({
        mode: 'year',
        yearOpen: false,
      });
    }
  }

  handleYearOpenChange = (status) => {
    this.setState({ yearOpen: status });
  }

  // 清空日期选择
  clearYearValue = () => {
    const { yearChange } = this.props;
    if (typeof (yearChange) === "function") {
      yearChange("")
    }
  }

  handleOrgChange = (value) => {
    const { zzjgChange } = this.props;
    if (zzjgChange) {
      zzjgChange(value);
    }
  };

  handlePgmChange = (value) => {
    const { khfaChange } = this.props;
    if (khfaChange) {
      khfaChange(value);
    }
  };

  render() {
    const { examParams: { orgId, yr, pgmId }, pgmList, id = '' } = this.props;
    const { yearOpen, orgData, mode } = this.state;
    return (
      <Form className={classnames('m-form-default m-form esa-evaluate-form')} >
        <Row>
          <Col xs={6} sm={6} lg={6} xl={6} id='esa-evaluate-treeSelect'>
            <FormItem
              label="组织机构"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
            >
              <TreeSelect
                showSearch
                style={{ width: '100%' }}
                value={orgId}
                treeData={orgData.datas}
                dropdownMatchSelectWidth={false}
                dropdownClassName='esa-evaluate-treeSelect'
                dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
                treeNodeFilterProp="title"
                placeholder="请选择组织机构"
                // allowClear
                treeDefaultExpandAll
                onChange={this.handleOrgChange}
              />
            </FormItem>
          </Col>
          <Col xs={6} sm={6} lg={6} xl={6}>
            <FormItem
              label="年度"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
            >
              <DatePicker
                className="esa-evaluate-datepicker"
                mode={mode}
                format="YYYY"
                placeholder="请选择"
                value={moment(yr, 'YYYY-MM-DD')}
                onPanelChange={this.handleYear}
                onOpenChange={this.handleYearOpenChange}
                onChange={this.clearYearValue}
                allowClear={false}
                open={yearOpen}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                inputReadOnly={true}
              />
            </FormItem>
          </Col>
          {/*<Col xs={6} sm={6} lg={6} xl={6}>*/}
          {/*  <FormItem*/}
          {/*    label="考核主方案"*/}
          {/*    labelCol={{ span: 6 }}*/}
          {/*    wrapperCol={{ span: 16 }}*/}
          {/*    className='esa-evaluate-form-item'*/}
          {/*  >*/}
          {/*    <Select*/}
          {/*      showSearch*/}
          {/*      value={pgmId}*/}
          {/*      style={{ width: '100%' }}*/}
          {/*      dropdownMatchSelectWidth={false}*/}
          {/*      dropdownClassName='esa-evaluate-treeSelect'*/}
          {/*      dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}*/}
          {/*      treeNodeFilterProp="title"*/}
          {/*      placeholder="请选择组织机构"*/}
          {/*      optionFilterProp="children"*/}
          {/*      onChange={this.handlePgmChange}*/}
          {/*      filterOption={(input, option) =>*/}
          {/*        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0*/}
          {/*      }*/}
          {/*      disabled={id !== ''}*/}
          {/*    >*/}
          {/*      {pgmList.map(item => <Option key={item.note} value={item.ibm} >{item.note}</Option>)}*/}
          {/*    </Select>*/}
          {/*  </FormItem>*/}
          {/*</Col>*/}
        </Row>
      </Form>
    );
  }
}

// export default BusEvaluate;
export default Form.create()(SearchItem);
