/* eslint-disable no-mixed-operators */
/* eslint-disable react/sort-comp */
import React from 'react';
import lodash from 'lodash';
import { Row, Col, Form, Input, InputNumber, message } from 'antd';
import BasicModal from '../../../../../../../../../../../Common/BasicModal';
import FetchDataTable from '../../../../../../../../../../../Common/FetchDataTable';
// import { FetchQuerySalaryTemplate, FetchQuerySalaryTemplateConf } from '../../../../../../../../../../../../services/salaryAssessment';
import { FetchqueryInfoSalaryTemplateConf } from '../../../../../../../../../../../../services/EsaServices/salaryManagement';
import EditableTable from './EditableTable';

class ApplyTemp extends React.Component {
  state = {
    chooseTempModalVisible: false,
    // selectedTempId: '', // 选中的模板id
    selectedTempData: '', // 选中的模板数据
    tempArr: [], // 模板对象数组
  }

  componentDidMount() {
    this.fetchTempFields(this.props.existingData.payTmplId, true);
  }

  componentWillReceiveProps(nextProps) {
    const { operate = '' } = this.props;
    const { payload: { singleParamValues: aftSingleParamValues = [] }, form: { getFieldsValue }, updatePayload } = nextProps;
    const { selectedTempData: { fdfs = '' } } = this.state;
    // 查询现有模板字段（修改模式有效）

    // if (operate === 'edit' && payTmplId !== nextProps.existingData.payTmplId && nextProps.existingData.payTmplId) {
    if (operate === 'edit' && this.props.existingData.payTmplId !== nextProps.existingData.payTmplId) {
      this.fetchTempFields(nextProps.existingData.payTmplId, true);
    }
    if (fdfs === '3') {
      // 更新payload里面的单项模板数据
      const values = getFieldsValue();
      const keys = Object.keys(values).filter(m => m.indexOf('dyzd_') === 0);
      const tmplObj = {};
      keys.forEach((m) => {
        tmplObj[`F${m.split('_')[1]}`] = values[m] || '';
      });
      if (updatePayload && JSON.stringify(aftSingleParamValues) !== JSON.stringify([tmplObj])) {
        updatePayload({ singleParamValues: [tmplObj] });
      }
    }
  }
  // 更改套用模板对象变量 初始化数据
  getTemplateArr = () => {
    const { templateInitArr = [] } = this.props;


    const { paramValues = [] } = this.state.selectedTempData;
    const tempArr = [];
    const obj = {};
    // 参数对象数组中的参数变量个数
    const count = paramValues.length;
    // const index = Math.round(count / 2);
    for (let i = 0; i < count; i++) {
      obj[`FLD${i}`] = `${paramValues[i].auditVal}` || '';
    }
    tempArr.push(obj);


    this.setState({
      // tempArr: templateInitArr,
      tempArr,

    }, () => {
      this.props.onTemplateArrChange(tempArr);
    });
  }

  // 修改模式  获取使用模板的初始变量
  getEditInitData=() => {
    const { templateInitArr = [] } = this.props;
    this.setState({
      tempArr: templateInitArr,
    });

    this.props.onTemplateArrChange(templateInitArr);
  }

  // 模板对象  单项分段方式数据改变
  changeTempParams=(value, index) => {
    // // 参数对象数组中的参数变量个数
    // const count = paramValues.length;
    const { tempArr = [] } = this.state;
    const arrIndex = Math.floor(index / 2);
    // const arrLeft = index % 2;
    tempArr[arrIndex][`FLD${index}`] = `${value}`;

    this.setState({
      tempArr,
    }, () => {
      this.props.onTemplateArrChange(tempArr);
    });
  }

  assembleTempListTableCoumns = () => {
    return [{
      dataIndex: 'name',
      title: '模板名称',
      render: text => text || '--',
    }, {
      dataIndex: 'remk',
      title: '说明',
      render: text => text || '--',
    }, {
      dataIndex: 'segValMode',
      title: '分段取值方式',
      // 1|分段选一； 2|分段累加 ；3|单项
      // render: text => text || '--',
      render: (text) => {
        if (text === '1') {
          return '分段选一';
        } else if (text === '2') {
          return '分段累加';
        } else if (text === '3') {
          return '单项';
        }
        return '--';
      },
    }];
  }


  showChooseTempModal = () => {
    this.setState({ chooseTempModalVisible: true });
  }

  handleChooseTempModalOk = () => {
    const { selectedTempId } = this.state;
    this.fetchTempFields(selectedTempId);
  }

  // 查询模板字段
  fetchTempFields = (selectedTempId, isFirst) => {
    // const { form: { setFieldsValue }, updatePayload } = this.props;
    const { version, form: { setFieldsValue }, updatePayload } = this.props;

    if (selectedTempId) {
      // 查询模板详情
      FetchqueryInfoSalaryTemplateConf({
        id: selectedTempId,
        version,
        // id: 121,
        // id: 11,
        // id: '',
      }).then((ret = {}) => {
        const { code = 0, records = [] } = ret;
        if (code > 0) {
          if (records.length > 0) {
            const { name = '' } = records[0];
            setFieldsValue({ mbmc: name });
            this.setState({ selectedTempData: records[0] || {} }, () => {
              // 修改模式
              if (isFirst) {
              // 首次加载页面。直接去获取之前构造好的模板变量数组
                const { selectedTempData: { fdfs = '' } } = this.state;
                if (fdfs === '3') {
                // 手动选择模板
                  this.getTemplateArr();
                }
                this.getEditInitData();
              } else {
              // 手动选择模板
                this.getTemplateArr();
              }
            });
          }
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
    // 查询模板详情数据
    this.setState({ chooseTempModalVisible: false });
  }

  // 点击选中模板对象
  onSelectTemplate=(record, id) => {
    const { form: { setFieldsValue } } = this.props;
    const { name = '' } = record;
    setFieldsValue({ mbmc: name });
    this.setState({ selectedTempData: record || {} }, () => {
      this.getTemplateArr();
      this.props.onSelectTemplate(id);
    });
  }

  render() {
    const { version, form: { getFieldDecorator }, updatePayload, payload = {}, existingData = {}, operate = '' } = this.props;
    const { chooseTempModalVisible = false, selectedTempData = {}, selectedTempData: { remk: tempDesc = '', paramValues: tempParams = [], segValMode = '' } } = this.state;
    // 模板单项方式默认值（仅修改模式）
    if (operate === 'edit' && segValMode === '3') {
      const { paramValues = [] } = existingData;
      // 修改模式 判断是否切换模板 构造不同初始值
      if (selectedTempData.id === existingData.payTmplId) {
        if (paramValues.length > 0) {
          const arr = JSON.parse(paramValues);
          tempParams.forEach((item, index) => {
            tempParams[index].initialValue = lodash.get(arr, `[0][FLD${index}]`, '');
          });
        }
      } else {
        tempParams.forEach((item, index) => {
          tempParams[index].initialValue = tempParams[index].auditVal;
        });
      }
    }

    // 新增模式  切换模板设置初始值
    if (operate === 'add' && segValMode === '3') {
      tempParams.forEach((item, index) => {
        tempParams[index].initialValue = tempParams[index].auditVal;
      });
    }
    // 选择模板弹框属性
    const chooseTempModalProps = {
      isAllWindow: 1,
      width: '70rem',
      title: '选择模板',
      style: { top: '5rem', overflowY: 'auto' },
      visible: chooseTempModalVisible,
      onCancel: () => { this.setState({ chooseTempModalVisible: false }); },
      onOk: this.handleChooseTempModalOk,
    };
      // 选择模板数据列表属性
    const tempListTableProps = {
      rowKey: 'id',
      columns: this.assembleTempListTableCoumns(),
      fetch: { service: FetchqueryInfoSalaryTemplateConf, params: { id: '', paging: 0, version } },
      // fetch: { service: '', params: { mbmc: '' } },

      pagination: { pageSize: 10 },
      onRow: () => {
        return {
          onClick: (_, record) => {
            // eslint-disable-next-line react/no-unused-state
            // this.setState({ selectedTempId: record.id });
            this.onSelectTemplate(record, record.id);
          },
        };
      },
    };
    return (
      <React.Fragment>
        <Row>
          <Col sm={24} md={24} xxl={24} >
            <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item esa-xcxmgl-select" label="套用模板" >
              {
                  getFieldDecorator('mbmc', {
                    rules: [{ required: true, message: '请选择模板' }],
                  })(<Input placeholder="点击选择模板" readOnly onClick={this.showChooseTempModal} style={{ cursor: 'pointer' }} />)
                }
            </Form.Item>
          </Col>
        </Row>
        {/* 选择模板弹框 */}
        <BasicModal {...chooseTempModalProps}>
          <div style={{ maxHeight: '36rem', overflow: 'auto' }}>
            <FetchDataTable className="m-table-customer" {...tempListTableProps} />
          </div>
        </BasicModal>

        {
            tempDesc.length > 0 && (
              <Row>
                <Col sm={24} md={24} xxl={24} >
                  <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="&nbsp;" >
                    <span style={{ fontSize: '1.086rem' }}>{tempDesc}</span>
                  </Form.Item>
                </Col>
              </Row>
            )
          }

        {
            segValMode === '3' && tempParams.map(item => (
              <Row>
                <Col sm={24} md={24} xxl={24} >
                  <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label={item.descr}>
                    {
                      getFieldDecorator(`dyzd_${item.corrCol}`, {
                        initialValue: item.initialValue || '',
                        rules: [{ required: true, message: '请输入值' }],
                      })(<InputNumber onChange={(value) => { this.changeTempParams(value, item.corrCol); }} />)
                    }
                  </Form.Item>
                </Col>
              </Row>
            ))
          }

        {
            segValMode && segValMode !== '3' && tempParams.length > 0 && (<div style={{ paddingLeft: '4rem' }}><EditableTable templateInitArr={this.props.templateInitArr} onTemplateArrChange={this.props.onTemplateArrChange} tempParams={tempParams} templateArr={this.props.templateArr} updatePayload={updatePayload} payload={payload} /></div>)
          }
      </React.Fragment>
    );
  }
}

export default Form.create()(ApplyTemp);
