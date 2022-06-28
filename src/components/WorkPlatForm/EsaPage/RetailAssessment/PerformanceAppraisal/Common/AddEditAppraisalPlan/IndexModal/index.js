import React, { Component, Fragment } from 'react';
import { Form, Row, Col, message, Input, Table } from 'antd';
import lodash from 'lodash';
import BasicModal from '../../../../../../../Common/BasicModal';
import { fetchObject } from '../../../../../../../../services/sysCommon';
/**
 * 新增修改方案
 */
class AddEditPlanModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      total: 0,
      selectRecord: {},
    };
  }
  componentWillReceiveProps(nextProps) {
    const { visible: preV } = this.props;
    const { visible: aftV } = nextProps;
    if (aftV && preV !== aftV) {
      this.setState({
        dataSource: [],
      }, this.fetchData());
    }
  }
  handleOk = () => {
    const { handleIndexSelect } = this.props;
    if (typeof handleIndexSelect === 'function') {
      handleIndexSelect(this.state.selectRecord);
    }
  }
  handleCancel = () => {
    const { onCancel } = this.props;
    if (typeof onCancel === 'function') {
      onCancel();
    }
  }

  handleRowSelect=(record) => {
    this.setState({ selectRecord: record });
  }
  fetchData=(value) => {
    const { alternativeIndexRef = {}, versionId } = this.props;
    const cdata = lodash.get(alternativeIndexRef, 'indexTableRef.state.dataSource', []);
    const cids = cdata.map(m => m.id);
    let condition = {
      is_must: '0',
      indi: value,
    }
    if (versionId) {
      condition.version = versionId;
    }
    fetchObject('JXZB', { condition }).then((res) => {
      const { note, code, records, total } = res;
      if (code > 0) {
        this.setState({ dataSource: records?.filter(m => !cids.includes(m.ID) && m.VERSION === '') || [], total });
      } else {
        message.error(note);
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  fetchColumns=() => {
    // const { depClass = [], examTypeList = [] } = this.props;
    // //console.log('depClass', depClass);
    // //console.log('examTypeList', examTypeList);
    const columns = [
      // {
      //   title: '指标代码',
      //   dataIndex: 'INDI_CODE',
      //   width: 250,
      //   align: 'center',
      // },
      // {
      //   title: '部门类别',
      //   dataIndex: 'DEP_CLASS',
      //   align: 'center',
      // },
      // {
      //   title: '部门类别名称',
      //   dataIndex: 'DEP_CLASS',
      //   align: 'center',
      //   render: (text) => {
      //     const depName = depClass.filter(item => text === item.ibm);
      //     return depName.length > 0 ? depName[0].note : '';
      //   },
      // },
      // {
      //   title: '指标类型',
      //   dataIndex: 'INDI_TYPE',
      //   align: 'center',
      // },
      // {
      //   title: '指标类型名称',
      //   dataIndex: 'INDI_TYPE',
      //   align: 'center',
      //   render: (text) => {
      //     const examType = examTypeList.filter(item => text === item.ibm);
      //     return examType.length > 0 ? examType[0].note : '';
      //   },
      // },
      // {
      //   title: '考核指标',
      //   dataIndex: 'EXAM_INDI',
      //   align: 'center',
      // },
      // {
      //   title: '考核指标名称',
      //   dataIndex: 'EXAM_INDI_NAME',
      //   align: 'center',
      // },
      {
        title: '指标名称',
        dataIndex: 'INDI_NAME',
        align: 'center',
        width: "15%",
      },
      {
        title: '说明',
        dataIndex: 'REMK',
        align: 'center',
      },
      // {
      //   title: '是否必须',
      //   dataIndex: 'IS_MUST',
      //   align: 'center',
      // },
      // {
      //   title: '是否必须名称',
      //   dataIndex: 'IS_MUST_NAME',
      //   align: 'center',
      // },
      // {
      //   title: '计分方式',
      //   dataIndex: 'SCORE_MODE',
      //   align: 'center',
      // },
      {
        title: '计分方式名称',
        dataIndex: 'SCORE_MODE_NAME',
        align: 'center',
        width: "15%",
      },
      // {
      //   title: '营业部',
      //   dataIndex: 'ORG_ID',
      //   align: 'center',
      // },
      // {
      //   title: '修改日期',
      //   dataIndex: 'MODI_DATE',
      //   align: 'center',
      // },
      // {
      //   title: '设置人',
      //   dataIndex: 'SETUP_PER',
      //   align: 'center',
      // },
      // {
      //   title: '设置人名称',
      //   dataIndex: 'SETUP_PER_NAME',
      //   align: 'center',
      // },
      // {
      //   title: '考核标准',
      //   dataIndex: 'EXAM_STD',
      //   align: 'center',
      // },
      // {
      //   title: '折算得分',
      //   dataIndex: 'CVRT_SCORE',
      //   align: 'center',
      // },
      // {
      //   title: '标准底限',
      //   dataIndex: 'STD_BTM',
      //   align: 'center',
      // },
      // {
      //   title: '标准上限',
      //   dataIndex: 'STD_TOP',
      //   align: 'center',
      // },
      // {
      //   title: '权重底限',
      //   dataIndex: 'WEIGHT_BTM',
      //   align: 'center',
      // },
      // {
      //   title: '权重上限',
      //   dataIndex: 'WEIGHT_TOP',
      //   align: 'center',
      // },
      // {
      //   title: '计分底限',
      //   dataIndex: 'SCORE_BTM',
      //   align: 'center',
      // },
      // {
      //   title: '计分上限',
      //   dataIndex: 'SCORE_TOP',
      //   align: 'center',
      // },
      // {
      //   title: '考评权重',
      //   dataIndex: 'PRFM_WEIGHT',
      //   align: 'center',
      // },
      // {
      //   title: '跨营业部折算系数',
      //   dataIndex: 'OTHER_ORG_COEF',
      //   align: 'center',
      // },
      // {
      //   title: '零分阈值',
      //   dataIndex: 'ZERO_THLD',
      //   align: 'center',
      // },
      // {
      //   title: '百分阈值',
      //   dataIndex: 'PCT_THLD',
      //   align: 'center',
      // },
      // {
      //   title: '业务数量单位',
      //   dataIndex: 'BIZ_QTY_UNIT',
      //   align: 'center',
      // },
      // {
      //   title: '百分制阈值单位',
      //   dataIndex: 'PCT_THLD_UNIT',
      //   align: 'center',
      // },
      {
        title: '是否允许编辑',
        dataIndex: 'IS_RVS',
        align: 'center',
        width: "15%",
        render: (text) => {
          // 0否1是
          const rvsDic = {
            0: '否',
            1: '是',
          };
          return rvsDic[text] || '--';
        },
      },
    ];
    return columns;
  }
  render() {
    const { dataSource = [], total = 0, selectRecord } = this.state;
    const { visible = false } = this.props;
    const modalProps = {
      title: '选择记录',
      width: '100rem',
      visible,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
    };
    return (
      <Fragment>
        <BasicModal
          {...modalProps}
        >
          <Row className="m-row-form mt10">
            <Col sm={24} md={8} lg={8} xl={8} xxl={8} className="m-form ant-form" style={{ margin: '0', padding: '1rem' }}>
              <Input.Search
                placeholder="请输入别名进行搜索"
                onSearch={value => this.fetchData(value)}
              />
            </Col>
            <Col sm={24} md={24} lg={24} xl={24} xxl={24} >
              <Table
                className="esa-scrollbar"
                // scroll={{ x: 4000 }}
                columns={this.fetchColumns()}
                dataSource={dataSource}
                size="small"
                pagination={{
                  total: dataSource.length,
                  className: 'm-paging',
                  size: 'small',
                  showLessItems: true,
                  hideOnSinglePage: true,
                }}
                rowClassName={record => (selectRecord.ID === record.ID ? 'ant-table-row-selected' : '')}
                onRow={(record) => {
                  return {
                    onClick: () => this.handleRowSelect(record),
                  };
                }}
              />
            </Col>
          </Row>
        </BasicModal>
      </Fragment>
    );
  }
}

export default Form.create()(AddEditPlanModal);
