/* eslint-disable react/sort-comp */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Checkbox, Select, Button, Form, message, Input } from 'antd';
import BasicModal from '../../../../../../../../Common/BasicModal';
import FetchDataTable from '../../../../../../../../Common/FetchDataTable';
import AddFormulaModal from './AddFormulaModal';
// import { FetchSalaryFormula } from '../../../../../../../../../services/salaryAssessment';
import OperateColumns from './OperateColumns';
import Buttons from './Buttons';
import { FetchqueryListSalaryFormula } from '../../../../../../../../../services/EsaServices/salaryManagement';
import ExaminersModal from '../../../../../PerformanceAppraisal/Common/AddEditAppraisalPlan/ExaminersModal'

// 人员薪酬代码公式
class Template extends React.Component {
  constructor(props) {
    super(props);
    const { userBasicInfo } = this.props;
    const { ryid } = userBasicInfo;
    this.state = {
      dataSource: [],
      payload: {}, // 查询参数
      // ry: ryid, // 人员
      ry: '', // 人员
      jgs: 0,
      addFormulaModalVisible: false,
      flag: true,
      examinerModal: {
        visible: false,
        selectedKeys: {},
        handleOk: this.handleExaminersSelected,
        onCancel: this.onExaminerCancel,
      },
    };
  }

  onRef = (ref) =>{
    this.child=ref;
  }

  refreshTable = () =>{

    this.child.refreshTable();

  }
  getCount = () => {
    return this.child;
  }

  componentWillMount() {
    const { ry = '' } = this.state;
    const { rightData = {}, initialOrgid, ryDatas = [] } = this.props;


    const { id = '' } = rightData;
    // const tempRy = ryDatas.filter((item) => {
    //   return item.EMP_NO === ry;
    // });
    if (id !== '') {
      const payload = {
        current: 1,
        // empNo: tempRy[0].EMP_NO, // 人员
        empNo: ry, // 人员
        oldFormula: this.state.jgs, // 是否显示旧公式 0|否；1|是
        oprType: 2, // 1|公示定义；2|人员薪酬代码公式
        orgNo: initialOrgid, // 营业部 oprType为1时   必传
        pageSize: 30,
        paging: 0,
        salaryid: id, // 薪酬代码ID
        sort: '',
        total: -1,
      };
      // this.fetchPersonnelData(payload);
      this.setState({
        payload,
      }, () => {
        // this.fetchPersonnelData(payload);
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(nextProps) !== JSON.stringify(this.props)){
    const { rightData = {}, initialOrgid, ryDatas } = nextProps;
    const { id = '' } = rightData;
    const { ry = 1 } = this.state;
    // 在用户基本信息中获取的是人员ID， 而人员数据匹配的是人员编号，需要过滤匹配
    let tempRy = [];
    tempRy = ryDatas.filter((item) => {
      return item.value === ry;
    });

    const { userBasicInfo } = this.props;
    const { ryid } = userBasicInfo;
    // const initRy = ryDatas.filter((item) => {
    //   return item.value === ryid;
    // });

    if (id !== '') {
      const payload = {
        current: 1,
        empNo: tempRy.length > 0 ? tempRy[0].ID : '', // 人员  需要做判断 否则当清除人员，在查询时报错

        oldFormula: this.state.jgs, // 是否显示旧公式 0|否；1|是
        oprType: 2, // 1|公示定义；2|人员薪酬代码公式
        orgNo: initialOrgid, // 营业部 oprType为1时   必传
        pageSize: 10,
        paging: 0,
        salaryid: id || 0, // 薪酬代码ID
        sort: '',
        total: -1,
      };
      this.setState({
        payload,
      }, () => {
        // this.fetchPersonnelData(payload);
      });
    }

    this.refreshTable();
    // this.fetchPersonnelData(payload);
    // }
    // }
  }
}

  // 改变旧公式
  onChange = (e) => {
    let jgs = 0;
    if (e.target.checked) {
      jgs = 1;
    } else {
      jgs = 0;
    }
    this.setState({ jgs:jgs });
    this.state.jgs = jgs;
    const { rightData, initialOrgid, ryDatas } = this.props;
    const { ry = 0 } = this.state;
    const { id } = rightData;
    let tempRy = [];
    tempRy = ryDatas.filter((item) => {
      return item.value === ry;
    });
    const payload = {
      current: 1,
      empNo: tempRy.length > 0 ? tempRy[0].ID : ry, // 人员
      // empNo: '1001016604', // 人员

      oldFormula: this.state.jgs, // 是否显示旧公式 0|否；1|是
      oprType: 2, // 1|公示定义；2|人员薪酬代码公式
      orgNo: initialOrgid, // 营业部 oprType为1时   必传
      pageSize: 10,
      paging: 0,
      salaryid: id, // 薪酬代码ID
      sort: '',
      total: -1,
    };
    this.setState({
      payload,
    }, () => {
      // this.fetchPersonnelData(payload);
    });
  }


  // 查询人员薪酬公式列表
  //  fetchPersonnelData = (payload) => {
  //    FetchqueryListSalaryFormula(payload).then((res) => {
  //      const { records = [], code = 0 } = res;
  //      if (code > 0) {
  //        this.setState({ dataSource: records }, () => {

  //        });
  //      }
  //    }).catch((error) => {
  //      message.error(!error.success ? error.message : error.note);
  //    });
  //  }
   // // 选择人员
   handleExaminerSelect = () => {

    const { examinerModal } = this.state;
    this.setState({ examinerModal: { ...examinerModal, visible: true } });
  }
  // // 考核人员取消
  onExaminerCancel = () => {
    const { examinerModal } = this.state;
    const { form: { resetFields } } = this.props;
    examinerModal.selectedKeys = {};
    resetFields('empName');
    this.setState({ examinerModal: { ...examinerModal, visible: false }, ry: '' },() =>{this.handleRYChange();});
  }
  // 选中考核人员
  handleExaminersSelected = (record = {}) => {
    this.setState({ examinerModal: { visible: false, selectedKeys: record }, ry: record.ID },() =>{this.handleRYChange();});
    this.props.form.setFieldsValue({ empName: record.EMP_NAME || '' });

//     setTimeout(function(){
//     const destin = document.getElementsByClassName("ant-input-clear-icon");
//     //console.log(destin)
//     //console.log(document.getElementsByClassName("ant-input-clear-icon"))
//     //console.log(destin[0])
//     destin[0].onclick=(e)=>{

//       alert("牛逼")
//       e.preventDefault();
//     }
//     //console.log(destin[0])
// }
//      , 1000);
  }

  restorecancle=()=>{

  }
  // 人员改变
  handleRYChange = () => {
    const { jgs, ry='' } = this.state;
    const { rightData = {}, initialOrgid, } = this.props;
    const { id = '' } = rightData;
    const payload = {
      current: 1,
      empNo: ry, // 人员
      // empNo: '1001016604', // 人员
      oldFormula: jgs, // 是否显示旧公式 0|否；1|是
      oprType: 2, // 1|公示定义；2|人员薪酬代码公式
      orgNo: initialOrgid, // 营业部 oprType为1时   必传
      pageSize: 20,
      paging: 0,
      salaryid: id, // 薪酬代码ID
      sort: '',
      total: -1,
    };
    // //console.log(payload);
    this.setState({
      payload,
    }, () => {
      // // this.fetchPersonnelData(payload);
      // //console.log(1);
    //  this.refreshTable();
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
  }


  // 表格列
  fetchColumns = () => {
    const { Seccolumns, rightData = {}, refreshList, version,st } = this.props;
    const newColumns = [...Seccolumns, {
      title: '操作',
      dataIndex: 'operate',
      render: (_, record) => (<OperateColumns version={version} st={st} record={record} ryDatas={this.props.ryDatas} fetchLeftList={this.props.fetchLeftList} Seccolumns={Seccolumns} rightData={rightData} gxyybDatas={this.props.gxyybDatas} refreshList={refreshList} refreshTable={this.refreshTable}/>),
    }];

    return newColumns;
  }

  render() {
    const { ryDatas = [], type, rightData = {}, refreshList, gxyybDatas = [], st, version } = this.props;
    const { payload = {}, examinerModal } = this.state;
    const { jgs } = this.state;
    const { dataSource = [], addFormulaModalVisible } = this.state;
    const addFormulaModalProps = {
      isAllWindow: 1,
      width: '80rem',
      title: '薪酬公式定义-新增',
      style: { top: '2rem', overflowY: 'auto' },
      visible: addFormulaModalVisible,
      onCancel: this.handleAddFormulaModalCancel,
      footer: null,
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        <div className="clearfix m-szys-btn-list">
          <div className="left m-kequn-form-item" style={{'margin-top': '-5px' }}>
          <Form sm={8} md={8} xxl={8} >
                <Form.Item className="m-kequn-form-left" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="人员" colon={false}>
                  {getFieldDecorator('empName', {
                  })(<Input.Search
                    onSearch={() => this.handleExaminerSelect()}
                    readOnly
                    allowClear
                    placeholder="请选择"
                  />)
                  }
                </Form.Item>
              </Form>
          </div>

          <div className="left m-kequn-form-item">
            <span className="m-kequn-form-left">显示旧公式</span>
            <Checkbox onChange={this.onChange} checked={jgs === 1} />
          </div>
          {st !== '2' && (<Fragment><div className="left m-kequn-form-item">
            <Buttons queryParams={payload} count={this.getCount} />
          </div>
            <Button style={{ float: 'right' }} className="ant-btn ant-btn fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={this.showAddFormulaModal} >
              <i className="iconfont icon-add" style={{ fontSize: '14px' }} />新增公式
          </Button></Fragment>)}
        </div>

        {/* <Table */}
        <FetchDataTable
          fetch={{ service: FetchqueryListSalaryFormula, params: payload }}
          // className="m-table-customer m-table-bortop"
          className=" m-table-bortop esa-xcxmgl-table  "
          onRef={this.onRef}
          columns={this.fetchColumns()}
          dataSource={dataSource}
          pagination={dataSource.length > 5 ? {
            size: 'small',
            simple: true,
            pageSize: 5,
            position: 'bottom',
          } : false}
        />
        <BasicModal {...addFormulaModalProps}>
          <AddFormulaModal version={version} gxyybDatas={gxyybDatas} ryDatas={ryDatas} fetchLeftList={this.props.fetchLeftList} rightData={rightData} type={type} handleAddFormulaModalCancel={this.handleAddFormulaModalCancel} operate="add" refreshList={refreshList} refreshTable={this.refreshTable}/>
        </BasicModal>
        <ExaminersModal
              {...examinerModal}
              handleOk={this.handleExaminersSelected}
              onCancel={this.onExaminerCancel}
              modalProps={{ bodyStyle: { maxHeight: '55rem', overflow: 'auto' } }}
            />
      </React.Fragment>
    );
  }
}

// export default Template;
export default Form.create()(connect(({ global }) => ({
  userBasicInfo: global.userBasicInfo,
  // gxyybDatas: code.gxyybDatas,
}))(Template));
