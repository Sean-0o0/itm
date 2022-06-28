/* eslint-disable no-nested-ternary */
/* eslint-disable react/sort-comp */
import React, { Fragment } from 'react';
import { Row, Button, message } from 'antd';
import BasicModal from '../../../../../../Common/BasicModal';
import FetchDataTable from '../../../../../../Common/FetchDataTable';
import CalculationRuleDefinition from './CalculationRuleDefinition';
import AddNew from './AddNew';
import Warning from './Warning';
import Export from './Export';

class MainContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defineVisible: false,
      addVisible: false,
      warningVisible: false,
      exportVisible: false,
      selectRowData: '', // 选中的行数据
      type: '', // 新增  删除  修改

    };
  }
  componentDidMount() {

  }

  componentWillReceiveProps() {

  }

  // 行点击
  onRowClick = (record, type) => {
    this.setState({
      selectRowData: record,
    }, () => {
      if (type) {
        // 新增时 点击规则定义
        this.handleOnDefineClick();
      }
    });
  }


  // 设置行样式
  setRowClass=(record) => {
    return record.id === this.state.selectRowData.id ? 'clickRowStyle' : '';
  }

  // 计算规则定义
  handleOnDefineClick = () => {
    const { selectRowData } = this.state;
    if (selectRowData) {
      this.setState({
        defineVisible: true,
      });
    } else {
      message.warning('请先选择记录');
    }
  }


  // 计算规则定义
  handleDefineCancel = () => {
    this.setState({
      defineVisible: false,
    });
  }


  // 新增 修改 删除
  handleOnAddClick = (type) => {
    if (type === 'edit' || type === 'delete') {
      const { selectRowData } = this.state;
      if (selectRowData) {
        this.setState({
          addVisible: true,
          type,
        });
      } else {
        message.warning('请先选择记录');
      }
    } else {
      this.setState({
        addVisible: true,
        type,
      });
    }
  }
  // 新增  修改  删除
  handleAddCancel = () => {
    this.setState({
      addVisible: false,
    });
  }

  // 设置预警上限
  handleOnWarningClick=() => {
    const { selectRowData } = this.state;
    if (selectRowData) {
      this.setState({
        warningVisible: true,
      });
    } else {
      message.warning('请先选择记录');
    }
  }

   // 设置预警上限
   handleWarningCancel = () => {
     this.setState({
       warningVisible: false,
     });
   }

   // 导出
   handleOnExportClick=() => {
     const { selectRowData } = this.state;
     if (selectRowData) {
       this.setState({
         exportVisible: true,
       });
     } else {
       message.warning('请先选择记录');
     }
   }

   // 导出
   handleExportCancel = () => {
     this.setState({
       exportVisible: false,
     });
   }

  fetchColumns = () => {
    const columns = [
      {
        title: '执行顺序',
        dataIndex: 'zxsx',
        key: 'zxsx',
        width: '50px',
      },
      {
        title: '指标代码',
        dataIndex: 'zbdm',
        key: 'zbdm',
      },
      {
        title: '指标名称',
        dataIndex: 'zbmc',
        key: 'zbmc',
      },
      {
        title: '指标级别',
        dataIndex: 'zbjb',
        key: 'zbjb',
      },
      {
        title: '适用对象',
        dataIndex: 'sydx',
        key: 'sydx',
      },
      {
        title: '指标分组',
        dataIndex: 'zbfz',
        key: 'zbfz',
      },
      {
        title: '计算方式',
        dataIndex: 'jsfs',
        key: 'jsfs',
      },
      {
        title: '计算表达式',
        dataIndex: 'jsbds',
        key: 'jsbds',
      },
      {
        title: '表达式解析',
        dataIndex: 'bdsjx',
        key: 'bdsjx',
      },
      {
        title: '限制条件',
        dataIndex: 'xztj',
        key: 'xztj',
      },
      {
        title: '源指标',
        dataIndex: 'yzb',
        key: 'yzb',
      },
      {
        title: '引用参数',
        dataIndex: 'yycs',
        key: 'yycs',
      },
      {
        title: '指标属性',
        dataIndex: 'zbsx',
        key: 'zbsx',
      },
      {
        title: '统计周期',
        dataIndex: 'tjzq',
        key: 'tjzq',
      },
      {
        title: '作废标志',
        dataIndex: 'zfbz',
        key: 'zfbz',
      },
      {
        title: '部门类别',
        dataIndex: 'bmlb',
        key: 'bmlb',
      },
      {
        title: '关系类型',
        dataIndex: 'gxlx',
        key: 'gxlx',
      },
      {
        title: '引用层级',
        dataIndex: 'yycj',
        key: 'yycj',
      },
      {
        title: '执行类型',
        dataIndex: 'zxlx',
        key: 'zxlx',
      },
      {
        title: '结算对象',
        dataIndex: 'jsdx',
        key: 'jsdx',
      },
      {
        title: '指标是否展示',
        dataIndex: 'zbsfzs',
        key: 'zbsfzs',
      },
      {
        title: '展示顺序',
        dataIndex: 'zssx',
        key: 'zssx',
      },

      {
        title: '说明',
        dataIndex: 'sm',
        key: 'sm',
      },


    ];

    return columns;
  }

  // 获取表格数据
  fetchDataSource = () => {
    // 搜索内容

    // const searchData = this.props.searchData;

    const data = [
      {
        key: 0,
        zxsx: '1',
        zbdm: 'ZHSZ_T2_KH',
        zbmc: '客户_T+2日市值',
        zbjb: '自定义',
        sydx: '客户',
        zbfz: '',
        jsfs: '引用数据源',
        jsbds: 'PRO_ZBTJ1_KH_ZHSZ_T2',
        bdsjx: '',
        xztj: '',
        yzb: '',
        yycs: '',
        zbsx: '',
        tjzq: '',
        zfbz: '',
        bmlb: '',
        gxlx: '',
        yycj: '',
        zxlx: '',
        jsdx: '',
        zbsfzs: '',
        zssx: '',
        sm: '',
      },
      {
        key: 1,
        zxsx: '2',
        zbdm: 'ZHSZ_T2_KH2',
        zbmc: '客户_T+2日市值2',
        zbjb: '自定义2',
        sydx: '客户2',
        zbfz: '',
        jsfs: '引用过程',
        jsbds: 'PRO_ZBTJ1_KH_ZHSZ_T22',
        bdsjx: '',
        xztj: '',
        yzb: '',
        yycs: '',
        zbsx: '',
        tjzq: '',
        zfbz: '',
        bmlb: '',
        gxlx: '',
        yycj: '',
        zxlx: '',
        jsdx: '',
        zbsfzs: '',
        zssx: '',
        sm: '',
      },
      {
        key: 2,
        zxsx: '3',
        zbdm: 'ZHSZ_T2_KH2',
        zbmc: '客户_T+2日市值2',
        zbjb: '自定义2',
        sydx: '客户2',
        zbfz: '',
        jsfs: '引用指标',
        jsbds: 'PRO_ZBTJ1_KH_ZHSZ_T22',
        bdsjx: '',
        xztj: '',
        yzb: '',
        yycs: '',
        zbsx: '',
        tjzq: '',
        zfbz: '',
        bmlb: '',
        gxlx: '',
        yycj: '',
        zxlx: '',
        jsdx: '',
        zbsfzs: '',
        zssx: '',
        sm: '',
      },
      {
        key: 3,
        zxsx: '4',
        zbdm: 'ZHSZ_T2_KH2',
        zbmc: '客户_T+2日市值2',
        zbjb: '自定义2',
        sydx: '客户2',
        zbfz: '',
        jsfs: '自定义脚本',
        jsbds: 'PRO_ZBTJ1_KH_ZHSZ_T22',
        bdsjx: '',
        xztj: '',
        yzb: '',
        yycs: '',
        zbsx: '',
        tjzq: '',
        zfbz: '',
        bmlb: '',
        gxlx: '',
        yycj: '',
        zxlx: '',
        jsdx: '',
        zbsfzs: '',
        zssx: '',
        sm: '',
      },


    ];

    return data;
  }


  render() {
    const { defineVisible, addVisible, warningVisible, exportVisible, selectRowData, type } = this.state;
    const defineModalProps = {
      width: '80rem',
      height: '70rem',
      title: '计算规则定义',
      visible: defineVisible,
      onCancel: this.handleDefineCancel,
      // onOk: this.handleDefineOk,
      footer: null,
    };

    const addModalProps = {
      width: '70rem',
      height: '70rem',
      title: type === 'add' ? '系统指标代码-新增' : type === 'edit' ? '系统指标代码-修改' : '系统指标代码-删除',
      visible: addVisible,
      onCancel: this.handleAddCancel,
      // onOk: this.handleDefineOk,
      footer: null,
    };

    const warningModalProps = {
      width: '40rem',
      height: '30rem',
      title: '设置预警上限',
      visible: warningVisible,
      onCancel: this.handleWarningCancel,
      // onOk: this.handleDefineOk,
      footer: null,
    };

    const exportModalProps = {
      width: '70rem',
      height: '50rem',
      title: '导出',
      visible: exportVisible,
      onCancel: this.handleExportCancel,
      // onOk: this.handleDefineOk,
      footer: null,
    };

    const tableProps = {
      columns: this.fetchColumns(),
      dataSource: this.fetchDataSource(),
      fetch: {
        service: null,
        params: {
        },
      },
      pagination: {
        pageSize: 5,
        paging: 1,
        total: 10,
      },
      rowClassName: this.setRowClass,
      onRow: (record) => {
        return {
          onClick: () => this.onRowClick(record),
        };
      },
    };
    return (

      <Fragment >
        <Row style={{ display: 'flex' }}>
          <span style={{ margin: '0 1rem 0 2rem' }}>

            <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={() => this.handleOnAddClick('add')}> <i className="iconfont icon-add" style={{ fontSize: '14px' }} />  新增</Button>
          </span>
          <span style={{ margin: '0 1rem' }}>
            <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={() => this.handleOnAddClick('edit')}><i className="iconfont icon-modify" style={{ fontSize: '14px' }} />修改</Button>
          </span>
          <span style={{ margin: '0 1rem' }}>
            <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={() => this.handleOnDefineClick()}><i className="iconfont icon-deal" style={{ fontSize: '14px' }} />计算规则定义</Button>
          </span>
          <span style={{ margin: '0 1rem' }}>
            <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={() => this.handleOnWarningClick()}><i className="iconfont icon-warning-circle-fill" style={{ fontSize: '14px' }} />设置预警上限</Button>
          </span>
          <span style={{ margin: '0 1rem' }}>
            <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={() => this.handleOnAddClick('delete')}><i className="iconfont icon-shanchu" style={{ fontSize: '14px' }} />删除</Button>
          </span>
          <span style={{ margin: '0 1rem' }}>
            <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={() => this.handleOnExportClick()}><i className="iconfont icon-xiazai" style={{ fontSize: '14px' }} />导出</Button>
          </span>
        </Row>
        <Row style={{ padding: ' 1rem 2.33rem ', height: '300px', overflow: 'auto' }}>
          <FetchDataTable
            {...tableProps}
          />
        </Row>

        <BasicModal {...defineModalProps}>
          <CalculationRuleDefinition handleDefineCancel={this.handleDefineCancel} selectRowData={selectRowData} />
        </BasicModal>

        <BasicModal {...addModalProps}>
          <AddNew handleAddCancel={this.handleAddCancel} selectRowData={selectRowData} type={type} handleOnDefineClick={this.handleOnDefineClick} onRowClick={this.onRowClick} />
        </BasicModal>

        <BasicModal {...warningModalProps}>
          <Warning handleWarningCancel={this.handleWarningCancel} selectRowData={selectRowData} />
        </BasicModal>

        <BasicModal {...exportModalProps}>
          <Export handleExportCancel={this.handleExportCancel} />
        </BasicModal>

      </Fragment>
    );
  }
}

export default MainContent;
