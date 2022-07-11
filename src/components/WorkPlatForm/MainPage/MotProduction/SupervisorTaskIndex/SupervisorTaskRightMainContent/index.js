import React, { Fragment } from 'react';
import { Row, Col, Divider, Button, Form, message, TreeSelect, Select, Checkbox } from 'antd';
import { DoubleRightOutlined, UserOutlined, ProfileOutlined } from '@ant-design/icons';
import BasicModal from '../../../../../Common/BasicModal';
import BasicDataTable from '../../../../../Common/BasicDataTable';

import { debounce, isEqual } from 'lodash';
import TreeUtils from '../../../../../../utils/treeUtils';
import { fetchUserAuthorityDepartment } from '../../../../../../services/commonbase/userAuthorityDepartment';
import { FetchSysCommonTable } from '../../../../../../services/sysCommon';
import {
  FetchQuerySuperviseTaskStaffDetail,
  FetchSuperviseTaskMaintenance,
} from '../../../../../../services/motProduction';


class SupervisorTaskRightMainContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: this.props.task,
      yybTreeData: [],
      stfClDict: [],
      treeDefaultExpandedKeys: [],
      qryTp: 1, // 1|事件维度，2|人员维度,
      searchOption: {
        mainOrgId: '',
        orgId: '',
        stfCl: '',
        current: 1,
        paging: 1,
        pageSize: 10,
      },
      eventDimensionTableData: {
        records: [],
        total: 0,
      }, // 事件维度名单
      staffDimensionTableData: {
        records: [],
        total: 0,
        dynamicFields: [],
      }, // 人员维度名单
      modalVisible: false,
      modalTableData: { // 明细查询中的表格数据
        records: [],
        total: 0,
        current: 1,
        dynamicFields: [],
        evntId: undefined,
      },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { task } = nextProps;
    if (isEqual(task, prevState.task)) {
      return null;
    } else {
      return {
        task,
        searchOption: {
          mainOrgId: '',
          orgId: '',
          stfCl: '',
          current: 1,
          paging: 1,
        },
      };
    }
  }

  componentDidMount() {
    this.fetchYybTreeData();
    this.fetchStfClDict();
    this.fetchQuerySuperviseTaskStaffDetail({ qryTp: this.state.qryTp, ...this.state.searchOption });
    window.addEventListener('resize', debounce(() => {
      const { qryTp, searchOption } = this.state;
      if (qryTp === 2) {
        this.fetchQuerySuperviseTaskStaffDetail({ ...searchOption, qryTp });
      }
    }, 1000));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!isEqual(prevState.task, this.state.task)) {
      this.props.form.resetFields();
      this.fetchQuerySuperviseTaskStaffDetail({
        qryTp: this.state.qryTp,
        ...this.state.searchOption,
      }, this.state.task.taskId);
    }
  }

  fetchQuerySuperviseTaskStaffDetail = (payload, taskId = this.state.task.taskId) => {
    if (payload.qryTp === 1) {
      payload.stfCl = '';
    }
    FetchQuerySuperviseTaskStaffDetail({ ...payload, taskId }).then(res => {
      const { code, records, total, note } = res;
      if (code > 0) {
        const { qryTp } = payload;
        for (let i = 0; i < records.length; i++) {
          records[i].key = i;
        }
        if (qryTp === 1) {
          this.setState({ eventDimensionTableData: { records, total } });
        } else if (qryTp === 2) {
          let dynamicFields = [];
          if (note.trim() !== '') {
            dynamicFields = note.trim().split(';').map(item => {
              return { code: item.split('|')[0], name: item.split('|')[1] };
            });
          }
          const { evntId, orgId } = payload; // 如果payload中有传evntId和orgId则为明细查询
          if (evntId) {
            this.setState({
              modalTableData: {
                records, total, current: payload.current, dynamicFields, evntId, orgId,
              },
            });
          } else {
            this.setState({
              staffDimensionTableData: { records, total, dynamicFields },
              searchOption: { ...this.state.searchOption, current: payload.current },
            });
          }
        }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  fetchYybTreeData = () => {
    fetchUserAuthorityDepartment({ paging: 0 }).then(res => {
      const { code, records } = res;
      if (code > 0) {
        const data = TreeUtils.toTreeData(records, {
          keyName: 'yybid',
          pKeyName: 'fid',
          titleName: 'yybmc',
          normalizeTitleName: 'title',
          normalizeKeyName: 'value',
        }, true);
        const yybTreeData = [];
        const treeDefaultExpandedKeys = [];
        data.forEach((item) => {
          const { children } = item;
          yybTreeData.push(...children);

        });
        yybTreeData.forEach(item => {
          treeDefaultExpandedKeys.push(item.value);
        });
        this.setState({
          yybTreeData,
          treeDefaultExpandedKeys,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  fetchStfClDict = () => {
    FetchSysCommonTable({
      'objectName': 'TRYFLBM',
    }).then((res = {}) => {
      const { code = 0, records = [] } = res;
      if (code > 0) {
        this.setState({
          stfClDict: records,
        });
      }
    });
  };

  fetchSuperviseTaskMaintenance = (oprTp) => {
    FetchSuperviseTaskMaintenance({ oprTp, taskId: this.state.task.taskId }).then(res => {
      const { code = 0, note } = res;
      if (code > 0) {
        let note = '操作成功';
        switch (oprTp) {
          case 2:
            note = '确认成功';
            break;
          case 3:
            note = '终止成功';
            break;
        }
        message.success(note);
      } else {
        message.error(note);
      }
      this.props.onRefreshLeft && this.props.onRefreshLeft();
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  handleQryTpChange = () => {
    const oldQryTp = this.state.qryTp;
    let { searchOption } = this.state;
    searchOption = { ...searchOption, current: 1 };
    const qryTp = oldQryTp === 1 ? 2 : 1;
    this.fetchQuerySuperviseTaskStaffDetail({ ...searchOption, qryTp });
    this.setState({ qryTp, searchOption });
  };


  handleBtnConfirm = () => {
    this.fetchSuperviseTaskMaintenance(2);
  };

  handleBtnTerminate = () => {
    this.fetchSuperviseTaskMaintenance(3);
  };

  handleMainOrgChange = value => {
    const searchOption = { ...this.state.searchOption, mainOrgId: value, current: 1 };
    this.fetchQuerySuperviseTaskStaffDetail({ qryTp: this.state.qryTp, ...searchOption });
    this.setState({ searchOption });
  };

  handleOrgChange = value => {
    const searchOption = { ...this.state.searchOption, orgId: value, current: 1 };
    this.fetchQuerySuperviseTaskStaffDetail({ qryTp: this.state.qryTp, ...searchOption });
    this.setState({ searchOption });
  };

  handleStfClChange = value => {
    const searchOption = { ...this.state.searchOption, stfCl: value, current: 1 };
    this.fetchQuerySuperviseTaskStaffDetail({ qryTp: this.state.qryTp, ...searchOption });
    this.setState({ searchOption });
  };

  handleTableChange = (pageNo, pageSize) => {
    let { qryTp, searchOption } = this.state;
    searchOption = { ...searchOption, current: pageNo, pageSize };
    this.fetchQuerySuperviseTaskStaffDetail({ qryTp, ...searchOption });
    this.setState({ searchOption });
  };

  handleModalTableChange = (pageNo, pageSize, record = undefined) => {
    let { evntId, orgId } = this.state.modalTableData;
    if (record !== undefined) {
      evntId = record['EVNT_ID'];
      orgId = record['ORG_ID'];
    }
    this.fetchQuerySuperviseTaskStaffDetail({ qryTp: 2, current: pageNo, pageSize, evntId, orgId });
  };

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const {
      task, yybTreeData, stfClDict, qryTp, searchOption, eventDimensionTableData, staffDimensionTableData,
      treeDefaultExpandedKeys, modalVisible, modalTableData,
    } = this.state;
    this.getFieldsValue = this.props.form.getFieldsValue;

    let eventColumns, staffColumns, modalColumns;
    eventColumns = [{
      title: '主体营业部',
      dataIndex: 'MAIN_ORG_NM',
      key: 'MAIN_ORG_NM',
    }, {
      title: '营业部',
      dataIndex: 'ORG_NM',
      key: 'ORG_NM',
    }, {
      title: '督导事件',
      dataIndex: 'EVNT_NM',
      key: 'EVNT_NM',
    }, {
      title: '重要程度',
      dataIndex: 'IMPT_NM',
      key: 'IMPT_NM',
    }, {
      title: '涉及人数',
      dataIndex: 'INVL_STF_NUM',
      key: 'INVL_STF_NUM',
      align: 'right',
    }, {
      title: '已办结人数',
      dataIndex: 'CPLT_STF_NUM',
      key: 'CPLT_STF_NUM',
      align: 'right',
    }, {
      title: (<span style={{ paddingLeft: '15px' }}>明细</span>),
      key: 'btnDetail',
      render: (text, record, index) => {
        return (
          <Button type="link" style={{ height: '20px' }} onClick={() => {
            this.handleModalTableChange(1, 10, record);
            this.setState({ modalVisible: true });
          }}><span style={{ fontSize: '12px' }}>明细查询</span></Button>
        );
      },
    }];
    staffColumns = [{
      title: '主体营业部',
      width: '150px',
      dataIndex: 'MAIN_ORG_NM',
      key: 'MAIN_ORG_NM',
      fixed: 'left',
    }, {
      title: '营业部',
      width: '150px',
      dataIndex: 'ORG_NM',
      key: 'ORG_NM',
      fixed: 'left',
    }, {
      title: '员工',
      width: '150px',
      dataIndex: 'STF_NM',
      key: 'STF_NM',
      fixed: 'left',
    }, {
      title: '督导人员',
      width: '150px',
      dataIndex: 'SPVS_STF_NM',
      key: 'SPVS_STF_NM',
      fixed: 'left',
    }, {
      title: '人员类别',
      width: '150px',
      dataIndex: 'STF_CL_NM',
      key: 'STF_CL_NM',
      fixed: 'left',
    }];
    modalColumns = JSON.parse(JSON.stringify(staffColumns));
    staffDimensionTableData.dynamicFields.forEach(item => {
      const { name, code } = item;
      staffColumns.push({
        title: name,
        width: '150px',
        dataIndex: code,
        key: code,
        render: (text, record, index) => {
          return (
            <Checkbox checked={text !== '0'} disabled={text === '0'}>
              <span style={{ fontSize: '12px' }}>{text === '0' ? '' : text}</span>
            </Checkbox>
          );
        },
      });
    });
    modalTableData.dynamicFields.forEach(item => {
      const { name, code } = item;
      modalColumns.push({
        title: name,
        width: '150px',
        dataIndex: code,
        key: code,
        render: (text, record, index) => {
          return (
            <Checkbox checked={text !== '0'} disabled={text === '0'}>
              <span style={{ fontSize: '12px' }}>{text === '0' ? '' : text}</span>
            </Checkbox>
          );
        },
      });
    });

    if (this.tableContainer && this.tableContainer.clientWidth > staffColumns.length * 150) {
      staffColumns = staffColumns.map(item => {
        if (item.fixed && item.fixed === 'left') {
          item.fixed = false;
        }
        return item;
      });
    }
    if (this.modalTableContainer && this.modalTableContainer.clientWidth > modalColumns.length * 150) {
      modalColumns = modalColumns.map(item => {
        if (item.fixed && item.fixed === 'left') {
          item.fixed = false;
        }
        return item;
      });
    }
    return (
      <Fragment>
        <Row style={{ padding: '0 2rem', marginTop: '12px', lineHeight: '32px', height: '32px' }}>
          <span style={{ fontSize: '16px' }}>{task.taskNm}</span>
          {/* {task.taskSt === '1' ? (
            <div style={{ float: 'right' }}>
              <Button type="primary" style={{ marginRight: '1rem' }} onClick={this.handleBtnConfirm}>确认</Button>
              <Button onClick={this.handleBtnTerminate}>终止</Button>
            </div>
          ) : ''} */}
        </Row>
        <Divider style={{ margin: '12px 0' }} />
        <Row style={{ padding: '0 2rem' }}>
          <span style={{ fontWeight: 'bold' }}>督导名单</span>
          <Button type="link" style={{ float: 'right' }} onClick={this.handleQryTpChange}>
            {qryTp === 1 ? (
              <Fragment>
                <UserOutlined />
                <span style={{ marginLeft: '2px' }}>人员维度</span>
                <DoubleRightOutlined />
              </Fragment>
            ) : (
                <Fragment>
                  <ProfileOutlined />
                  <span style={{ marginLeft: '2px' }}>事件维度</span>
                  <DoubleRightOutlined />
                </Fragment>
              )}
          </Button>
        </Row>
        <Row style={{ padding: '0 2rem', marginBottom: '12px' }}>
          <Form layout="inline">
            <Col span={8}>
              <Form.Item label="主体营业部：">
                {treeDefaultExpandedKeys.length > 0 ? getFieldDecorator('mainOrgId')(
                  <TreeSelect style={{ width: '200px' }} placeholder="请选择" searchPlaceholder="请输入关键字"
                    allowClear={true}
                    showSearch
                    // filterTreeNode={(input, option) => option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    filterTreeNode={(input, option) => { return option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.value.indexOf(input) >= 0 }}

                    dropdownStyle={{ maxHeight: '50vh', overflow: 'auto' }}
                    treeData={yybTreeData}
                    treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                    onChange={this.handleMainOrgChange}
                  />,
                ) : 0}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="营业部：">
                {treeDefaultExpandedKeys.length > 0 ? getFieldDecorator('OrgId')(
                  <TreeSelect style={{ width: '200px' }} placeholder="请选择" searchPlaceholder="请输入关键字"
                    allowClear={true}
                    showSearch
                    // filterTreeNode={(input, option) => option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    filterTreeNode={(input, option) => { return option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.value.indexOf(input) >= 0 }}

                    dropdownStyle={{ maxHeight: '50vh', overflow: 'auto' }}
                    treeData={yybTreeData}
                    treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                    onChange={this.handleOrgChange}
                  />,
                ) : ''}
              </Form.Item>
            </Col>
            {qryTp === 2 ? (
              <Col span={8}>
                <Form.Item label="人员类别：">
                  {treeDefaultExpandedKeys.length > 0 ? getFieldDecorator('stfCl', { initialValue: searchOption.stfCl || undefined })(
                    <Select style={{ width: '200px' }} placeholder="请选择" allowClear={true}
                      onChange={this.handleStfClChange}
                      showSearch
                      optionFilterProp="children">
                      {
                        stfClDict.map(item => (
                          <Select.Option key={item.ID} value={item.ID}>{item.FLMC}</Select.Option>
                        ))
                      }
                    </Select>,
                  ) : ''}
                </Form.Item>
              </Col>
            ) : ''}
          </Form>
        </Row>
        <Row style={{ padding: '0 2rem', marginBottom: '24px' }}>
          <div style={{ overflowX: 'hidden' }} ref={(ref) => {
            this.tableContainer = ref;
          }}>
            <BasicDataTable className="factor-table m-table-customer"
              rowKey="key"
              scroll={{ x: qryTp === 1 ? false : staffColumns[0].fixed ? 'max-content' : false }}
              dataSource={qryTp === 1 ? eventDimensionTableData.records : staffDimensionTableData.records}
              columns={qryTp === 1 ? eventColumns : staffColumns}
              pagination={{
                current: searchOption.current,
                total: qryTp === 1 ? eventDimensionTableData.total : staffDimensionTableData.total,
                showTotal: total => `共 ${total} 条`, showQuickJumper: true, showSizeChanger: true,
                onChange: this.handleTableChange, onShowSizeChange: this.handleTableChange,
              }} />
          </div>
        </Row>
        <Row style={{ padding: '0 2rem' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '18px' }}>创建信息</div>
          <Row>
            <Col span={12}>创建人: {task.crtrNm}</Col>
            <Col span={12}>创建日期: {task.crtDt}</Col>
          </Row>
          <Row>
            <Col span={12}>督导角色: {task.spvsRoleNm}</Col>
          </Row>
        </Row>
        <BasicModal
          title="督导事件明细"
          visible={modalVisible}
          width="1000px"
          cancelText="关闭"
          onCancel={() => {
            this.setState({ modalVisible: false });
          }}
        >
          <div style={{ overflowX: 'hidden' }} ref={(ref) => {
            this.modalTableContainer = ref;
          }}>
            <BasicDataTable className="factor-table m-table-customer" dataSource={modalTableData.records}
              rowKey="key"
              scroll={{ x: modalColumns[0].fixed ? 'max-content' : false }}
              columns={modalColumns}
              pagination={{
                current: modalTableData.current,
                total: modalTableData.total,
                showTotal: total => `共 ${total} 条`, showQuickJumper: true, showSizeChanger: true,
                onChange: this.handleModalTableChange, onShowSizeChange: this.handleModalTableChange,
              }} />
          </div>
        </BasicModal>
      </Fragment>
    );
  }
}

export default Form.create()(SupervisorTaskRightMainContent);
