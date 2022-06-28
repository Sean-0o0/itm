import React from 'react';
import { connect } from 'dva';
import { Checkbox, Table, TreeSelect, Button, message, Select } from 'antd';
import SecTable from './SecTable';
import BasicModal from '../../../../../../../../Common/BasicModal';
import AddFormulaModal from './AddFormulaModal';
import { FetchqueryListSalaryFormula } from '../../../../../../../../../services/EsaServices/salaryManagement';
import { fetchObject } from '../../../../../../../../../services/sysCommon';

class Define extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      yyb: this.props.initialOrgid,
      jgs: 0, // 是否显示旧公式  初始默认为0|否
      empClass: '',
      addFormulaModalVisible: false,
      staffTypes: [], // 人员类别
    };
  }
  componentWillMount() {

  }
  componentWillReceiveProps(nextProps) {
    const { rightData = {}, initialOrgid, userBasicInfo } = nextProps;
    const { ryid } = userBasicInfo;
    const { id = '' } = rightData;
    this.setState({
      yyb: initialOrgid,
      jgs: 0,
    });
    // if (nextProps.rightData !== this.props.rightData) {
    // 左侧有传薪酬代码的ID
    if (id !== '') {
      const payload = {
        current: 1,
        empNo: ryid, // 人员
        empClass: this.state.empClass,
        oldFormula: this.state.jgs, // 是否显示旧公式 0|否；1|是
        oprType: 1, // 1|公示定义；2|人员薪酬代码公式
        orgNo: initialOrgid, // 营业部 oprType为1时   必传
        pageSize: 10,
        paging: 0,
        salaryid: id, // 薪酬代码ID
        sort: '',
        total: -1,
      };
      this.fetchDefineData(payload);
    }
    this.queryStaffClassList();
    // }
  }

  //  人员类别查询 livebos对象
  queryStaffClassList = () => {
    fetchObject('RYJBDY').then((res) => {
      const { code = 0, records = [] } = res;
      if (code > 0) {
        const tmpl = [];
        records.forEach((item) => {
          tmpl.push({
            value: item.ID,
            label: item.CLASS_NAME,
            ...item,
          });
        });
        this.setState({
          staffTypes: tmpl,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 显示旧公式
  onChange = (e) => {
    let jgs = 0;
    if (e.target.checked) {
      jgs = 1;
    } else {
      jgs = 0;
    }
    this.setState({ jgs });
    const { rightData, initialOrgid } = this.props;
    const { id } = rightData;
    const payload = {
      current: 1,
      empNo: initialOrgid, // 人员
      empClass: this.state.empClass,
      oldFormula: jgs, // 是否显示旧公式 0|否；1|是
      oprType: 1, // 1|公示定义；2|人员薪酬代码公式
      orgNo: initialOrgid, // 营业部 oprType为1时   必传
      pageSize: 10,
      paging: 0,
      salaryid: id, // 薪酬代码ID
      sort: '',
      total: -1,
    };
    this.fetchDefineData(payload);
  }

  // 营业部改变
  handleYYBChange = (value) => {
    this.setState({ yyb: value });
    const { jgs } = this.state;
    const { rightData = {}, userBasicInfo } = this.props;
    const { ryid } = userBasicInfo;
    const { id = '' } = rightData;
    const payload = {
      current: 1,
      empNo: ryid, // 人员
      empClass: this.state.empClass,
      oldFormula: jgs, // 是否显示旧公式 0|否；1|是
      oprType: 1, // 1|公示定义；2|人员薪酬代码公式
      orgNo: value, // 营业部  oprType为1时   必传
      pageSize: 10,
      paging: 0,
      salaryid: id, // 薪酬代码ID
      sort: '',
      total: -1,
    };
    this.setState({
      yyb: value || this.props.initialOrgid,
    }, () => {
      this.fetchDefineData(payload);
    });
  }

  refreshTable = () => {
    const { jgs, yyb } = this.state;
    const { rightData = {}, userBasicInfo } = this.props;
    const { ryid } = userBasicInfo;
    const { id = '' } = rightData;
    const payload = {
      current: 1,
      empNo: ryid, // 人员
      empClass: this.state.empClass,
      oldFormula: jgs, // 是否显示旧公式 0|否；1|是
      oprType: 1, // 1|公示定义；2|人员薪酬代码公式
      orgNo: yyb, // 营业部  oprType为1时   必传
      pageSize: 10,
      paging: 0,
      salaryid: id, // 薪酬代码ID
      sort: '',
      total: -1,
    };
    this.fetchDefineData(payload);
  }


  // 查询公式列表
  fetchDefineData = (payload) => {
    // const { oprType = '' } = payload;
    FetchqueryListSalaryFormula(payload).then((res) => {
      const { records = [] } = res;
      // if (oprType === '1') {
      const newList = []; // 营业部id
      if (Array.isArray(records) && records.length > 0) {
        records.forEach((item) => {
          const { orgNo } = item;
          if (newList.indexOf(orgNo) === -1) {
            newList.push(orgNo);
          }
        });
      }
      const newDataSource = [];
      if (newList.length > 0) {
        newList.forEach((ele) => {
          const list = records.filter(elem => elem.orgNo === ele);
          if (Array.isArray(list)) {
            if (list.length > 0) {
              const { orgName, orgNo } = list[0];
              newDataSource.push({
                key: orgNo,
                orgNo,
                orgName,
                detail: list,
              });
            }
          }
        });
      }


      this.setState({
        dataSource: newDataSource,
      });
      // }
      // else if (oprType === '2') {
      //   this.setState({ dataSource: records });
      // }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }


  // 新增公式Modal
  showAddFormulaModal = () => { // eslint-disable-line
    const { st } = this.props;
    if (st === '1') {
      message.error('上架后禁止操作！')
    } else {
      this.setState({ addFormulaModalVisible: true });
    }
  }


  // 新增取消
  handleAddFormulaModalCancel = () => { // eslint-disable-line

    this.setState({ addFormulaModalVisible: false });
    // eslint-disable-next-line no-unused-expressions
  }

  // 表格列配置
  fetColumns = () => {
    const columns = [
      {
        title: '营业部',
        dataIndex: 'orgName',
        key: 'orgNo',
        render: text => (text ? <a>{text}</a> : '--'),
      },
    ];
    return columns;
  }

  // 人员类别改变重新查询列表
  onEmpClassChange = (value) => {
    const { jgs, yyb } = this.state;
    const { rightData = {}, userBasicInfo } = this.props;
    const { ryid } = userBasicInfo;
    const { id = '' } = rightData;
    const payload = {
      current: 1,
      empNo: ryid, // 人员
      empClass: value,
      oldFormula: jgs, // 是否显示旧公式 0|否；1|是
      oprType: 1, // 1|公示定义；2|人员薪酬代码公式
      orgNo: yyb, // 营业部  oprType为1时   必传
      pageSize: 10,
      paging: 0,
      salaryid: id, // 薪酬代码ID
      sort: '',
      total: -1,
    };
    this.fetchDefineData(payload);
  }

  render() {
    const { Seccolumns, gxyybDatas = [], rightData = {}, fetchLeftList, userBasicInfo, st, version } = this.props;
    const { jgs } = this.state;
    const { dataSource = [], addFormulaModalVisible, staffTypes = [] } = this.state;
    const addFormulaModalProps = {
      isAllWindow: 1,
      width: '80rem',
      title: '薪酬公式定义-新增',
      style: { top: '2rem', overflowY: 'auto' },
      visible: addFormulaModalVisible,
      onCancel: this.handleAddFormulaModalCancel,
      footer: null,
    };
    return (
      <React.Fragment>
        <div className="clearfix m-szys-btn-list">
          <div className="left m-kequn-form-item">
            <span className="m-kequn-form-left">营业部</span>
            <TreeSelect
              // value={this.state.yyb}
              className="esa-xcxmgl-select"
              showSearch
              style={{ width: '20rem' }}
              dropdownMatchSelectWidth
              treeData={gxyybDatas}
              placeholder="请选择营业部"
              searchPlaceholder="搜索..."
              multiple={false}
              filterTreeNode={(input, option) => option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              onChange={(value, label) => this.handleYYBChange(value, label)}
            />
          </div>
          {/* 标准版暂时先屏蔽人员类别筛选 */}
          <div className="left m-kequn-form-item" style = {{ display: 'none' }}>
            <span className="m-kequn-form-left">人员类别</span>
            <Select style={{ width: '100%' }}
            className="esa-xcxmgl-select"
            showSearch
            allowClear
            dropdownMatchSelectWidth
            style={{ width: '15rem' }}
            placeholder = '请选择人员类别'
            onChange ={this.onEmpClassChange}
            >
            {
              staffTypes.map((item) => {
                return <Select.Option key={item['value']} value={item['value']} >{item['label']}</Select.Option>;
              })
            }
          </Select>
          </div>

          {/*  */}
          <div className="left m-kequn-form-item">
            <span className="m-kequn-form-left">显示旧公式</span>
            <Checkbox onChange={this.onChange} checked={jgs === 1} />
          </div>
          {st !== '2' && <Button style={{ float: 'right' }} className="ant-btn fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={this.showAddFormulaModal}>
            <i className="iconfont icon-add " style={{ fontSize: '14px' }} />新增公式
          </Button>}
        </div>

        <Table
          fetch={{ service: '' }}
          // className="m-table-customer m-table-bortop"
          className=" m-table-bortop esa-xcxmgl-table "

          columns={this.fetColumns()}
          dataSource={dataSource}
          expandedRowRender={record => <SecTable version={version} gxyybDatas={gxyybDatas} record={record} Seccolumns={Seccolumns} rightData={rightData} fetchLeftList={this.props.fetchLeftList} handleAddFormulaModalCancel={this.handleAddFormulaModalCancel} refreshTable={this.refreshTable} />}
          pagination={dataSource.length > 5 ? {
            size: 'small',
            simple: true,
            pageSize: 5,
            position: 'bottom',
          } : false}
        />

        <BasicModal {...addFormulaModalProps}>
          <AddFormulaModal version={version} rightData={rightData} initialOrgid={this.props.initialOrgid} fetchLeftList={fetchLeftList} gxyybDatas={this.props.gxyybDatas} handleAddFormulaModalCancel={this.handleAddFormulaModalCancel} refreshTable={this.refreshTable} operate="add" />
        </BasicModal>
      </React.Fragment>
    );
  }
}

// export default Define;
export default (connect(({ global }) => ({
  userBasicInfo: global.userBasicInfo,
  // gxyybDatas: code.gxyybDatas,
}))(Define));
