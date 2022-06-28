import React, { Fragment } from 'react';
import { Card, DatePicker, Input, Select } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getDictKey } from '../../../../../../../utils/dictUtils';
import SalesDepartmentModal from '../../../../Common/SalesDepartmentModal';


const { MonthPicker } = DatePicker;
const { Search } = Input;
/**
 * 客户经理薪酬考核导航  和 证券经纪人考核薪酬 的公共搜索组件
 */

class SalaryAppraisalSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      salesDepartmentModal: {// 营业部计算modal
        visible: false,
        handleOk: this.handleOk,
        onCancel: this.onCancel,
      },
    };
  }

  onCancel = () => {
    const { salesDepartmentModal } = this.state;
    this.setState({ salesDepartmentModal: { ...salesDepartmentModal, visible: false } });
  }
  handleOk = (selectItem) => {
    const { chooseOrg } = this.props;
    if (typeof chooseOrg === 'function') {
      chooseOrg(selectItem);
    }
    this.onCancel();
  }
  // 禁选后面日期
  disabledDate = (current) => {
    return current && current > moment().subtract(1, 'months').endOf('month');
  }
  //  打开营业部弹出框
  openSalesDepartmentModal = () => {
    const { salesDepartmentModal } = this.state;
    this.setState({ salesDepartmentModal: { ...salesDepartmentModal, visible: true } });
  }
  render() {
    const { leftTile, chooseMonth, chooseDepClass, orgName, type, dictionary: { [getDictKey('DEP_CLASS')]: depClassData = [] } } = this.props;
    const { salesDepartmentModal } = this.state;
    const monthFormat = 'YYYY-MM';
    return (
      <Fragment>
        <Card style={{ height: '100%' }} className="m-card">
          <div style={{ padding: '10px 15px', margin: '0' }} className="m-form ant-form">
            <div className="esa-salaryNavigation-title fl">
              {leftTile}
            </div>
            <div style={{ textAlign: 'right', lineHeight: '42px' }}>
              <div style={{ display: type === 'common' ? 'inline' : 'none' }}>
                <span style={{ margin: '0 10px', color: '#666' }}>部门类别</span>
                <Select
                  className="esa-select"
                  style={{ width: '15%' }}
                  placeholder="请选择"
                  allowClear
                  showSearch
                  onChange={chooseDepClass}
                >
                  {
                    depClassData.map(item => (
                      <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>
                    ))
                  }
                </Select>
              </div>
              <span style={{ margin: '0 10px', color: '#666' }}>薪酬月份</span>
              <MonthPicker
                style={{ width: '15%' }}
                defaultValue={moment().subtract(1, 'months')}
                format={monthFormat}
                onChange={chooseMonth}
                allowClear={false}
                disabledDate={this.disabledDate}
              />
              <span style={{ margin: '0 10px', color: '#666' }}>营业部</span>
              <Search
                readOnly
                style={{ width: '15%' }}
                value={orgName}
                onSearch={this.openSalesDepartmentModal}
              />
              <SalesDepartmentModal {...salesDepartmentModal} modalProps={{ bodyStyle: { height: '30rem', overflow: 'auto' } }} />
            </div>
          </div>
        </Card>
      </Fragment >
    );
  }
}
export default SalaryAppraisalSearch;
