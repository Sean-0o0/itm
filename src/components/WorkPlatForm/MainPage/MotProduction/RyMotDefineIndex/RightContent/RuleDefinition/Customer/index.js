/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
import React, { Fragment } from 'react';
import { Row, message, Table, Input, Button } from 'antd';
import BasicModal from '../../../../../../../Common/BasicModal';
import CommonModalContent from './CommonModalContent';
import { FetchqueryStaffMotEventInfo, FetchmotEventStaffVariableMaintenance, FetchmotEventStaffVariableDelete, FetchqueryCalculateRule } from '../../../../../../../../services/motProduction';

// 引入请求路径的示例


// 右边内容模块-规则定义-客户定义表格
const { Search } = Input;
class CustomerRelations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [], // 勾选的数据
      selectAll: false, // 是否全选
      keyword: '', // 关键字搜索
      visible: false,
      selectedRowKeys: [], // 表格选中记录
      staffData: [], // 员工参数定义数据
      addMode: true, // 是否是新增
      kh: '', // 客户
      czType: false,
    };
  }


  componentWillMount() {
    // this.fetchData(this.props.selectedMotId)

  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedMotId !== '') {
      this.setState({
        selectedRows: [], // 勾选的数据
        selectAll: false, // 是否全选
        keyword: '', // 关键字搜索

        selectedRowKeys: [], // 表格选中记录
        dataSource: [],
      }, () => {
        this.fetchData(nextProps.selectedMotId);
      });
    }
  }

    // 操作 查看详情 查询计算规则
    onOperate = (text, record) => {
      this.setState({
        kh: record.KHH,
      });
      const { selectedMotId = '', staffId = '' } = this.props;
      const payload = {
        evntId: Number(selectedMotId), // 事件ID
        objId: `${staffId}|${record.KHH}`, // 查询值  员工ID|关系类型ID
        objTp: 4, // 查询类型 查询类型：0|生效的规则;1|默认;2|营业部;3|关系类型;4|客户
      };
      FetchqueryCalculateRule(payload).then((res) => {
        const { code = 0, json = '' } = res;
        if (code > 0) {
          const staffData = [];

          if (json) {
            const jsonRule = JSON.parse(json);
            jsonRule.map((item) => {
              const fctrArr = item.FCTR;
              fctrArr.map((fctrItem) => {
                const fctrValArr = fctrItem.FCTR_VAR;

                const obj = {
                  wthrAlowDef: fctrValArr[0] ? fctrValArr[0].WTHR_ALOW_DEF : '', // 因子是否允许修改
                  FCTR_ID: fctrItem.FCTR_ID, // 因子ID
                  FCTR_NO: fctrItem.FCTR_NO, // 因子顺序
                  VAR_CODE: fctrValArr[0] ? fctrValArr[0].VAR_CODE : '', // 变量编码
                  VAR_DESC: fctrValArr[0] ? fctrValArr[0].VAR_DESC : '--', // 变量描述
                  DATA_TP: fctrValArr[0] ? fctrValArr[0].DATA_TP : '', // 数据类型
                  COND_NO: item.COND_NO,
                  VAR_VAL: fctrValArr[0] ? fctrValArr[0].VAR_VAL : '', // 变量值
                };
                staffData.push(obj);
              });
            });

            this.setState({
              staffData,
              visible: true,
              addMode: false,
            });
          }
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    fetchColumns = () => {
      const columns = [
        {
          title: '客户',
          dataIndex: 'kh',
          key: 'kh',
        },
        {
          title: '详情信息',
          dataIndex: 'xqxx',
          key: 'xqxx',
          render: (text, record, index) => {
            return <div style={{ cursor: 'pointer', color: '#2daae4' }} onClick={() => { this.onOperate(text, record, index); }}>操作</div>;
          },
        },

      ];

      return columns;
    }


    fetchData = (selectedMotId = '') => {
      const { staffId } = this.props;
      const { keyword = '' } = this.state;
      const data = [];
      const payload = {
        evntId: selectedMotId, // 事件ID() ,
        keyword,
        objTp: 2, // 查询类型() ,
        pagelength: 99999,
        pageno: 1,
        stfId: staffId, // 员工ID()
      };
      FetchqueryStaffMotEventInfo(payload).then((res) => {
        const { code = 0, records = '', note } = res;
        if (code > 0) {
          const jsonData = JSON.parse(records);
          if (jsonData.length > 0) {
            jsonData.map((item) => {
              const obj = {
                kh: item.KHXM ? item.KHXM : '--',
                KHH: item.KHH ? item.KHH : '--',
              };
              data.push(obj);
            });
            this.setState({
              dataSource: data,
              uuid: note,

            });
          } else {
            this.setState({
              dataSource: [],
              uuid: '',

            });
          }
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    // 表格勾选

    onSelectChange = (selectedRowKeys, selectedRows) => {
      this.setState({ selectedRowKeys, selectedRows });
    };


    // 表格搜索
    handleSearch = (value) => {
      this.setState({
        keyword: value,
      }, () => {
        this.fetchData(this.props.selectedMotId);
      });
    }

    // 新增点击
    addClick = () => {
      this.setState({
        visible: true,
        addMode: true,
      });
    }
    // 删除点击
    deleteClick = () => {
      const { selectedRows = [], selectAll, dataSource = [] } = this.state;
      if (selectedRows.length === 0) {
        message.warning('未选中任何记录');
      } else {
        const { staffId = '', selectedMotId, fetchMotDetail } = this.props;
        const { uuid = '' } = this.state;
        const chcidArr = [];
        // 点击了全选  筛选出未选中的ID
        if (selectAll) {
          dataSource.map((dataItem) => {
            let total = 0;
            selectedRows.map((selectItem) => {
              if (dataItem.KHH !== selectItem.KHH) {
                total += 1;
              }
              if (total === selectedRows.length) {
                chcidArr.push(dataItem.KHH);
              }
            });
          });
        } else {
          // 未点击全选
          selectedRows.map((item) => {
            chcidArr.push(item.KHH);
          });
        }


        const objIdSql = {
          CHC_ID: chcidArr.join(','), // 选中ID
          WTHR_ALL: selectAll ? 1 : 0, // 是否全选，0|否;1|是
          QRY_SQL_ID: uuid, // 查询条件对应UUID
        };
        const payload = {
          evntId: Number(selectedMotId), // 事件ID
          objIdSql: JSON.stringify(objIdSql), // 对象IDSQL
          objTp: 2, // 对象类型 1|按关系设置;2|按客户设置
          stfId: staffId, // 员工ID
        };
        FetchmotEventStaffVariableDelete(payload).then((res) => {
          const { code = 0 } = res;
          if (code > 0) {
            message.success('删除成功');
            fetchMotDetail && fetchMotDetail(selectedMotId);
          }
        }).catch((error) => {
          message.error(!error.success ? error.message : error.note);
        });
      }
    }

    // 保存
    onSaveClick = () => {
      const { staffId = '', selectedMotId = '', fetchMotDetail } = this.props;
      const { form: { getFieldValue } } = this.formRef.props;
      // 获取子组件的state 表格数据 用来入参
      const childDataSource = this.formRef.state.dataSource;

      if (childDataSource.length > 0) {
        childDataSource.map((item, index) => {
          const param = getFieldValue(`params_${index}`);
          item.VAR_VAL = param || '';
        });
      }
      const kh = getFieldValue('kh');

      // 构造入参需要的json结构
      const evntVarMnt = [];
      if (childDataSource.length > 0) {
        childDataSource.map((item) => {
          const obj = {
            COND_NO: item.COND_NO,
            FCTR_ID: item.FCTR_ID,
            FCTR_VAR: [
              {
                VAR_CODE: item.VAR_CODE,
                VAR_VAL: item.VAR_VAL,
              },
            ],
          };
          evntVarMnt.push(obj);
        });
      }


      const payload = {
        evntId: Number(selectedMotId), // 事件ID
        evntVarMnt: JSON.stringify(evntVarMnt), // 事件变量维护JSON
        objId: kh, // 对象ID
        objTp: 2, // 对象类型   1|按关系设置;2|按客户设置
        stfId: Number(staffId), // 员工ID
      };

      FetchmotEventStaffVariableMaintenance(payload).then((res) => {
        const { code = 0 } = res;
        if (code > 0) {
          this.setState({
            visible: false,
            czType: false,
          });
          message.success('保存成功');
          fetchMotDetail && fetchMotDetail(selectedMotId);
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    // 取消点击
    handleCancel = () => {
      this.setState({
        visible: false,
        czType: false,
      });
    }

    // 模态框底部
    renderFooter = () => {
      const { czType, addMode } = this.state;
      return (
        <div className="operation">
          {czType || addMode ? <Button className="m-btn-radius m-btn-headColor" htmlType="submit" type="primary" onClick={this.onSaveClick}>保存</Button>
                    : <Button className="m-btn-radius m-btn-headColor" onClick={() => { this.setState({ czType: true }); }}>编辑</Button>}
          <Button className="m-btn-radius m-btn-gray" onClick={this.handleCancel}>取消</Button>
        </div>
      );
    }

    // 全选
    selectAll = (selected) => {
      this.setState({
        selectAll: selected,
      });
    }


    render() {
      const { dictionary = {}, motDetail = {}, staffId } = this.props;
      const { dataSource = [], selectedRowKeys = [], visible, staffData = [], addMode, kh, czType } = this.state;
      const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
        onSelectAll: this.selectAll,
      };

      const modalProps = {
        width: '80rem',
        height: '70rem',
        title: addMode ? '新增' : '操作',
        style: { top: '2rem', overflowY: 'auto' },
        visible,
        onCancel: () => { this.setState({ visible: false }); },
        footer: this.renderFooter(),
      };
      return (
        <Fragment>
          <Row>
            <Row>
              <div className="mot-fbgz-color" style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px', lineHeight: '40px' }}>
                <span style={{ marginLeft: '40px', color: '#FFF' }}>客户定义</span>
              </div>
            </Row>

            <Row style={{ border: '1px solid #dcdcdc' }}>
              <span style={{ display: 'flex', padding: '1rem' }}>
                <Search onChange={(e) => { this.handleSearch(e.target.value); }} style={{ width: '40%', marginRight: '1rem' }} className="mot-prod-search-input" />
                {/* <div style={{ cursor: 'pointer', padding: '0 1rem', display: 'inline-block' }} onClick={this.addClick}> <i className='iconfont icon-tianjia' style={{ color: '#3dbcf5', fontSize: '14px' }}></i>  新增</div>
                            <div style={{ cursor: 'pointer', display: 'inline-block' }} onClick={this.deleteClick}> <i className='iconfont icon-shanchu1' style={{ color: '#ff7675', fontSize: '14px' }}></i> 删除 </div> */}
                <Button className="factor-bottom m-btn-table-headColor" onClick={this.addClick} >新增</Button>
                <Button className="factor-bottom m-btn-table-headColor" onClick={this.deleteClick} >删除</Button>
              </span>
            </Row>
            <Row>
              <Table
                            // bordered={false}
                className="mot-prod-td-no-border-table"
                rowSelection={rowSelection}
                dataSource={dataSource}
                columns={this.fetchColumns()}
              />
            </Row>

          </Row>
          <BasicModal {...modalProps}>
            <CommonModalContent addMode={addMode} czType={czType} kh={kh} staffData={staffData} staffId={staffId} motDetail={motDetail} dictionary={dictionary} wrappedComponentRef={form => this.formRef = form} />
          </BasicModal>
        </Fragment>
      );
    }
}

export default CustomerRelations;
