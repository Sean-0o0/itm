/* eslint-disable react/sort-comp */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react';
import { Row, Button, Table, Tooltip, message, AutoComplete } from 'antd';
import BasicModal from '../../../../../../Common/BasicModal';
import Calculation from './Calculation';
import { fetchObject } from '../../../../../../../services/sysCommon';
import { FetchqueryListExamineItemFormula, FetchoperateExamineItemFormula } from '../../../../../../../services/EsaServices/commissionManagement';
/**
 * 右侧考核项主要内容
 */

class RightMainContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogCalculationVisible: false, // 显示弹框
      dialogCalculationTitle: '', // 弹框标题
      selectFormulaId: '', // 选中的公式Id
      selectFormulaItem: {}, // 选中的公式项
      opTp: '', // 操作类型 1|新增;2|修改;3|删除;
      orignFucList: [], // 原公式列表
      fucList: [], // 公式列表表格数据
      assessmentGroup: [], //考核分组
    };
  }
  componentDidMount() {
    const { examId = '' } = this.props;
    this.fetchData(examId);
    this.fetchAsseessmentGroup();
  }

  componentWillReceiveProps(nextProps) {
    const { examId } = this.props;
    const { examId: newSelectItem } = nextProps;
    if (newSelectItem !== examId) {
      this.fetchData(newSelectItem);
    }
  }

  //查询考核分组（考核对象）
  fetchAsseessmentGroup = () =>{
    fetchObject('KHFZ').then((res) => {
      const { note, code, records } = res;

      if (code > 0) {
        this.setState({ assessmentGroup: records});
      } else {
        message.error(note);
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }

  // 获取考核项公式列表
  fetchData = (examId) => {
    // { itmNo: examId} 获取函数列表表格
    const payload = {
      "current": 0,
      "itemFmlaId": "",
      "itemNo": examId,
      "pageSize": "",
      "paging": 0,
      "sort": "",
      "total": -1
    }
    FetchqueryListExamineItemFormula({ ...payload }).then((response) => {
      const { records } = response;
      const fucList = [];
      records.forEach((item) => { if (item.itemNo === examId) { fucList.push(item); } });
      const newfucList = fucList.map((item) => {
        const descItem = [];
        const { itemFmlaDesc } = item;
        const splitDescList = itemFmlaDesc.split(';');
        splitDescList.forEach((item1) => {
          const mapList = item1.split('=');
          const [calExps, label] = mapList;
          const obj = { calExps, label };
          descItem.push(obj);
        });
        const newitemFmlaDesc = this.handleJsgsgsChange(item.itemFmla, descItem);
        // 回填适用对象
        let adpatMidVal = '';
        // let adpatMidValId = '';
        item.adpatObj.split(';').forEach((obj, index) => {
          let grps=this.state.assessmentGroup.find(item => item.GRPS_ID === obj);
          adpatMidVal += grps? grps.GRPS_NAME+' ' : '';
          // adpatMidValId += `${obj.adpatObj};`;
        });
        const adpatObjName = adpatMidVal;
        return {
          ...item,
          itemFmlaDesc: newitemFmlaDesc,
          adpatObjName,
          adpatScpName: '考核分组',
        };
      });
      this.setState({
        fucList: newfucList,
        selectFormulaId: '',
      });
    });
    // const allfucList = [
    //   { adpatObjList: [{ adpatObj: '9', adpatObjName: '传统营业部' }],
    //     adpatScp: '2',
    //     adpatScpName: '考核分组',
    //     itmFmla: 'GREATEST($X{DMMSR_JQZCZ}×(1+$X{DMMSR_YXDMBZZL} × 0.6),$X{DMMSR_QYNSXZ})',
    //     itemFmlaDesc: '$X{DMMSR_QYNSXZ}=$X{代买卖收入市占率_前1年实现值};$X{DMMSR_YXDMBZZL}=$X{代买卖收入市占率_预下达目标增长率};$X{DMMSR_JQZCZ}=$X{代买卖收入市占率_基期值初值};',
    //     itmFmlaId: '426',
    //     itmNo: 'DMMSR_MBZZZ',
    //     refItm: 'DMMSR_JQZCZ;DMMSR_QYNSXZ;DMMSR_YXDMBZZL' },
    // ];

  }

  // 计算公式正则验证
  stringReplaceAll=(formula, AFindText, ARepText) => {
    const raRegExp = new RegExp(AFindText.replace(/([\\(\\)\\[\]\\{\\}\\^\\$\\+\\-\\*\\?\\.\\"\\'\\|\\])/g, '\\$1'), 'ig');
    return formula.replace(raRegExp, ARepText);
  }

  // 计算公式翻译
  handleJsgsgsChange = (calFmla, data) => {
    const flag = data && data.length;
    let formula = calFmla || '';
    // 替换运算符和指标
    if (flag) {
      data.forEach((item) => {
        const { calExps = '', label = '' } = item;
        formula = this.stringReplaceAll(formula, calExps, label);
      });
      return formula;
    }
  }
  /* ------------------------ 表格 ------------------------ */
  // 组装表格项
  assembleColumns = () => {
    const columns = [
      {
        title: '适用范围',
        dataIndex: 'adpatScpName',
        key: 'adpatScpName',
      },
      {
        title: '适用对象',
        dataIndex: 'adpatObjName',
        key: 'adpatObjName',
      },
      {
        title: '计算公式',
        dataIndex: 'itemFmlaDesc',
        key: 'itemFmlaDesc',
        onCell: () => {
          return {
            style: {
              maxWidth: 150,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
            },
          };
        },
        render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>,
      },
    ];
    return columns;
  }

  // 选择表格项
  onTableSelect = (selectedRowKeys) => {
    const { orignFucList } = this.state;
    const selectFormulaItem = orignFucList.find(item => item.itemFmlaId === selectedRowKeys);
    this.setState({
      selectFormulaItem,
    });
  }

  /* ------------------------ 配置弹框 ------------------------ */
  renderBtnGroup = () => {
    const btnGroup = [{ title: '新增', key: '1' }, { title: '修改', key: '2' }, { title: '删除', key: '3' }];
    return btnGroup.map((item) => {
      return (
        <Button className="m-btn-radius esa-btn-opacity-bg" onClick={() => this.operateBtnClick(item.key)} key={item.key}>{item.title} </Button>
      );
    });
  }
  // 点击操作按钮
  operateBtnClick = (opTp) => {
    if (opTp === '1') {
      this.setState({
        dialogCalculationTitle: '考核项公式 - 新增',
        dialogCalculationVisible: true,
        opTp: '1',
      });
    } else if (opTp === '2') {
      const { selectFormulaId } = this.state;
      if (!selectFormulaId) {
        message.warning('请选择一条公式记录');
      } else {
        this.setState({
          dialogCalculationTitle: '考核项公式 - 修改',
          dialogCalculationVisible: true,
          opTp: '2',
        });
      }
    } else if (opTp === '3') {
      const { selectFormulaId } = this.state;
      if (!selectFormulaId) {
        message.warning('请选择一条公式记录');
      } else {
        this.setState({
          dialogCalculationTitle: '考核项公式 - 删除',
          dialogCalculationVisible: true,
          opTp: '3',
        });
      }
    }
  }

  /* ------------------------ 配置弹框 ------------------------ */
  // 弹框参数
  assembleModalProps = () => {
    const { dialogCalculationTitle, dialogCalculationVisible, opTp } = this.state;
    const modalProps = {
      width: '80%',
      title: dialogCalculationTitle,
      style: { top: '2rem' },
      bodyStyle: { height: opTp !== '3' && '45rem', overflow: 'auto' },
      className: 'esa-scrollbar',
      visible: dialogCalculationVisible,
      onCancel: this.handleCancel,
      onOk: this.handleOk,
      footer: (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" onClick={this.handleOk} className="m-btn-radius m-btn-headColor ant-btn"><span>确定</span></button>
          <button type="button" onClick={this.handleCancel} className="m-btn-radius m-btn-headColor ant-btn"><span>取消</span></button>
        </div>
      ),
    };
    return modalProps;
  }

  // 弹窗确定
  handleOk = () => {
    const { validateFieldsAndScroll, getFieldValue } = this.calculation.props.form;
    const { opTp,selectFormulaItem } = this.state;
    const adpatObj=getFieldValue('adpatObj')?getFieldValue('adpatObj').join(';'):'';
    let payload = {};
    validateFieldsAndScroll(null, { scroll: { offsetTop: 80 } }, (err, values) => {
      if (!err) {
        //console.log('project:', values);
        this.setState({
          dialogCalculationVisible: false,
        });
        // 调用新增接口 重新获取数据
        payload = {
          "adpatObj": adpatObj,
          "adpatScp": 2,
          "itemFmla": getFieldValue('calFmla'),
          "itemFmlaId": opTp === "1" ? '':selectFormulaItem[0].itemFmlaId ,
          "itemNo": this.props.examId,
          "oprType": opTp
        };
         this.submit(payload);
      }
    });
  }

  submit = async(payload) =>{
    await FetchoperateExamineItemFormula({
      ...payload
    }).then((response) => {
      const { code, note } = response;
      if (code > 0) {
        message.success(note);
      }
      this.fetchData(this.props.examId);
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 弹窗取消
  handleCancel = () => {
    this.setState({
      dialogCalculationVisible: false,
    });
  }


  render() {
    const { opTp, fucList, selectFormulaItem, selectFormulaId, assessmentGroup = [] } = this.state;
    const { examId = '' } = this.props;
    return (
      <Fragment>
        {/* 主要内容 */}
        <Row style={{ padding: '0 1.25rem', height: '3.5rem', lineHeight: '3.5rem', borderBottom: '1px solid #FAFAFA' }}>
          <div style={{ float: 'left', fontWeight: 'bold', fontSize: '1.333rem' }}>考核项公式定义</div>
          <div style={{ float: 'right' }}>
            {this.renderBtnGroup()}
          </div>
        </Row>
        <Row style={{ padding: '3rem 1.25rem' }}>
          <Table
            className="esa-radio-group-inner"
            dataSource={fucList}
            columns={this.assembleColumns()}
            pagination={false}
            rowKey={record => record.itemFmlaId}
            onRow={
              record => {
                return {
                  onClick: event => {
                    this.setState({
                      selectFormulaId: selectFormulaId?.[0] === record.itemFmlaId ? '' : [record.itemFmlaId],
                      selectFormulaItem: selectFormulaId?.[0] === record.itemFmlaId ? {} : [record],
                    });
                  }, // 点击行
                };
              }
            }
            rowClassName={record => record.itemFmlaId === selectFormulaId?.[0] ? 'ant-table-row-selected' : ''}
            // rowSelection={{
            //   selectedRowKeys: selectFormulaId,
            //   type: 'radio',
            //   onChange: (selectedRowKeys, selectedRows) => {
            //     //console.log('selectedRowKeys', selectedRowKeys);
            //     //console.log('selectedRows', selectedRows);
            //     this.setState({
            //       selectFormulaId: selectedRowKeys,
            //       selectFormulaItem: selectedRows,
            //     });
            //   },
            // }}
          />
        </Row>
        <BasicModal {...this.assembleModalProps()}>
          {/* eslint-disable-next-line no-return-assign */}
          <Calculation handleCancel={this.handleCancel} wrappedComponentRef={ref => this.calculation = ref} opTp={opTp} selectFormulaItem={selectFormulaItem} examId={examId} assessmentGroup={assessmentGroup} />
        </BasicModal>
      </Fragment>
    );
  }
}

export default RightMainContent;
