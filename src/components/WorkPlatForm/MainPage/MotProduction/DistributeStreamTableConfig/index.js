/*
 * @Description: 实时数据配置页面
 * @Date: 2020-04-17 08:12:33
 */
import React from 'react';
import { Row, Col, Modal, message, Spin } from 'antd';
import { connect } from 'dva';
import LeftSearchAndListComponent from './LeftSearchAndListComponent';
import RightDetailAndEditContent from './RightDetailAndEditContent';
import AddStreamTableModal from './AddStreamTableModal';
import ErrorMessageModal from './ErrorMessageModal';
import { getDictKey } from '../../../../../utils/dictUtils';
import { FetchQueryStreamTableConfiguration, FetchQueryConnectionUrlExample, FetchStreamTableConfigurationMaintenance, FetchQueryStreamTableConfigurationList, FetchStreamTableStatusUpdate, FetchKafkaConnect, FetchQueryStreamTableDataType, FetchRefreshStatus } from '../../../../../services/motProduction';
import { fetchObject } from '../../../../../services/sysCommon';

class DistributeStreamTableConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: '',
      selectedItem: {},
      keyword: '',
      visible: false,
      addType: '',
      tableDetail: {},
      urlExample: [],
      isEdit: false,
      configurationList: [],
      tableDataType: [],
      spinning: false,
      height: 0,
      errorMessageModalVisible: false,
      errorMessage: '',
    };
  }

  componentWillMount() {
    this.updateDimensions();
  }
  componentDidMount() {
    this.handleListRefresh();
    this.fetchQueryConnectionUrlExample();
    document.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    document.removeEventListener('resize', this.updateDimensions);
  }
  handleKeywordChange=(keyword = '') => {
    this.setState({ keyword });
  }


  handleSelect=(item = {}, refresh=false) => {
    const { selectedId, isEdit } = this.state;
    const { tblId } = item;
    if (isEdit) {
      if (selectedId !== tblId) {
        this.openConfirmModal({ content: '是否取消当前页面修改？' }, () => {
          this.setState({ selectedId: tblId, addType: '', isEdit: false, selectedItem: item }, () => {
            this.fetchQueryStreamTableConfiguration(tblId);
          });
        });
      }
    } else if (selectedId !== tblId || refresh) {
      this.setState({ selectedId: tblId, selectedItem: item }, () => {
        this.fetchQueryStreamTableConfiguration(tblId);
      });
    }
  }
  // 1|新增;2|修改;3|删除;4|发布;5|撤销发布
  handleStart=(tblId = '') => {
    if (tblId) {
      this.openConfirmModal({ content: '是否在Kafka Connect中恢复该连接的状态？' }, async () => {
        const result = await FetchKafkaConnect({ method: 'PUT', url: `/connectors/${tblId}/resume` });
        if (result.statusCode === 200) {
          this.fetchStreamTableStatusUpdate({ tblId, strtUseSt: '1', errMsg: '配置信息错误，请修改！' });
        } else {
          message.error(result.note);
        }
      });
    }
  }
  handleRestart=() => {
    const { selectedId, selectedItem = {} } = this.state;
    this.openConfirmModal({ content: '是否在Kafka Connect中重启当前连接器？' }, async () => {
      this.setState({spinning: true});
      if (selectedItem.strtUseSt === '-1') {
        const result = await FetchKafkaConnect({ method: 'POST', url: `/connectors/${selectedId}/restart` });
        this.setState({spinning: false});
        if (result.statusCode === 200) {
          message.success("重启成功", () => {
            this.fetchStreamTableStatusUpdate({ tblId: selectedId, strtUseSt: '1', errMsg: '配置信息错误，请修改！' }, false);
          });
        } else {
          message.error(result.note);
        }
      } else if (selectedItem.strtUseSt === '-2') {
        const result = await FetchKafkaConnect({ method: 'POST', url: `/connectors/${selectedId}/tasks/0/restart` }, false);
        this.setState({spinning: false});
        if (result.statusCode === 200) {
          message.success("重启成功", ()=>{
            this.fetchStreamTableStatusUpdate({ tblId: selectedId, strtUseSt: '1', errMsg: '配置信息错误，请修改！' });
          });
        } else {
          message.error(result.note);
        }
      }
    });
  }
  handleStop=(tblId = '') => {
    if (tblId) {
      this.openConfirmModal({ content: '是否在Kafka Connect中暂停该连接？ 这将停止消息处理，直到恢复连接器为止' }, async () => {
        const result = await FetchKafkaConnect({ method: 'PUT', url: `/connectors/${tblId}/pause` });
        if (result.statusCode === 200) {
          this.fetchStreamTableStatusUpdate({ tblId, strtUseSt: '2', errMsg: '配置信息错误，请修改！' });
        } else {
          message.error(result.note);
        }
      });
    }
  }
  handleDelete=(tblId = '') => {
    if (tblId) {
      this.openConfirmModal({ content: '是否确认删除该流数据表配置？' }, async () => {
        this.fetchStreamTableConfigurationMaintenance({ tblId, oprTp: '3' });
      });
    }
  }

  handlePublish=() => {
    const { selectedId, selectedItem = {}, tableDetail = {}, tableDataType = [] } = this.state;
    this.openConfirmModal({ content: '是否发布此数据流表？' }, async () => {
      this.setState({ spinning: true });
      let params = {};
      if (selectedItem.ctcTp === '3') { // kafka
        this.fetchStreamTableConfigurationMaintenance({ tblId: selectedId, oprTp: '4' });
        return;
      } else if (selectedItem.ctcTp === '1') { // sink
        const tablePrimarykey = JSON.parse(tableDetail.colDtl).find(item => item.WTHR_PRIM_KEY === '1')?.TBL_COL || '';
        const tableStruct = {};
        JSON.parse(tableDetail.colDtl).forEach(item => Reflect.set(tableStruct, item.TBL_COL, item.DATA_TP));
        params = {
          // name: selectedItem.tblId,
          // config: {
          'connector.class': 'com.apex.connect.ApexJdbcSinkConnector',
          'tasks.max': 1,
          // eslint-disable-next-line quote-props
          'driver': tableDetail.dataSrcTp === '1' ? 'oracle' : 'mysql',
          'connection.url': tableDetail.ctcUrl,
          'table.name': tableDetail.tblNm,
          'table.primarykey': tablePrimarykey,
          'table.struct': JSON.stringify(tableStruct),
          // eslint-disable-next-line quote-props
          'topics': tableDetail.topicNm,
          'validate.non.null': false,
          // },
        };
      } else if (selectedItem.ctcTp === '2') { // source
        const incrementingColumn = JSON.parse(tableDetail.colDtl).find(item => item.WTHR_INCR_COL === '1');
        const incrementingColumnName = incrementingColumn?.TBL_COL || '';
        const incrementingType = tableDataType.find(item => item.dataTp === incrementingColumn.DATA_TP)?.incrTp || '';
        if (tableDetail.tblTp === '3') {
          params = {
            // name: selectedItem.tblId,
            // config: {
            'connector.class': 'com.apex.connect.jdbc.JdbcSourceConnector',
            'tasks.max': '1',
            'connection.url': tableDetail.ctcUrl,
            'topic.prefix': 'TOPIC_IN_' + tableDetail.tblNm,
            'validate.non.null': 'false',
            'numeric.mapping': 'best_fit',
            'poll.interval.ms': tableDetail.pollIntvl,
            'query': tableDetail.qrySql,
            // },
          };
        } else {
          params = {
            // name: selectedItem.tblId,
            // config: {
            'connector.class': 'com.apex.connect.jdbc.JdbcSourceConnector',
            'tasks.max': '1',
            'connection.url': tableDetail.ctcUrl,
            'topic.prefix': 'TOPIC_IN_',
            'table.whitelist': tableDetail.tblNm,
            'table.types': tableDetail.tblTp === '1' ? 'TABLE' : 'VIEW',
            'validate.non.null': 'false',
            'numeric.mapping': 'best_fit',
            'poll.interval.ms': tableDetail.pollIntvl,
            // },
          };
        }
        params.mode = incrementingType;
        params[`${incrementingType}.column.name`] = incrementingColumnName;
      }
      const payload = {
        method: 'PUT',
        url: `/connectors/${selectedItem.tblId}/config`,
        data: JSON.stringify(params),
      };
      try {
        const result = await FetchKafkaConnect({ ...payload });
        if (result.code > 0) {
          this.fetchStreamTableConfigurationMaintenance({ tblId: selectedId, oprTp: '4' });
        } else {
          this.setState({ spinning: false, errorMessageModalVisible: true, errorMessage: result.note });
          // message.error(result.note);
        }
      } catch (e) {
        this.setState({ spinning: false });
        this.setState({ spinning: false, errorMessageModalVisible: true, errorMessage: !e.success ? e.message : e.note });
        // message.error(!e.success ? e.message : e.note);
      }
    });
  }

  handlePublishCancel=() => {
    const { selectedId } = this.state;
    this.openConfirmModal({ content: '是否撤销发布此流数据表' }, () => {
      this.fetchStreamTableConfigurationMaintenance({ tblId: selectedId, oprTp: '5' }, '撤销发布成功！');
    });
  }

  handleUpdate=() => {
    const { selectedId, selectedItem = {}, tableDetail = {}, tableDataType = [] } = this.state;
    this.openConfirmModal({ content: '是否更新当前配置到Kafka Connector中？' }, async () => {
      this.setState({ spinning: true });
      let params = {};
      if (selectedItem.ctcTp === '1') { // sink
        const tablePrimarykey = JSON.parse(tableDetail.colDtl).find(item => item.WTHR_PRIM_KEY === '1')?.TBL_COL || '';
        const tableStruct = {};
        JSON.parse(tableDetail.colDtl).forEach(item => Reflect.set(tableStruct, item.TBL_COL, item.DATA_TP));
        params = {
          // name: selectedItem.tblId,
          // config: {
          'connector.class': 'com.apex.connect.ApexJdbcSinkConnector',
          'tasks.max': 1,
          // eslint-disable-next-line quote-props
          'driver': tableDetail.dataSrcTp === '1' ? 'oracle' : 'mysql',
          'connection.url': tableDetail.ctcUrl,
          'table.name': tableDetail.tblNm,
          'table.primarykey': tablePrimarykey,
          'table.struct': JSON.stringify(tableStruct),
          // eslint-disable-next-line quote-props
          'topics': tableDetail.topicNm,
          'validate.non.null': false,
          // },
        };
      } else if (selectedItem.ctcTp === '2') { // source
        const incrementingColumn = JSON.parse(tableDetail.colDtl).find(item => item.WTHR_INCR_COL === '1');
        const incrementingColumnName = incrementingColumn?.TBL_COL || '';
        const incrementingType = tableDataType.find(item => item.dataTp === incrementingColumn.DATA_TP)?.incrTp || '';
        if (tableDetail.tblTp === '3') {
          params = {
            // name: selectedItem.tblId,
            // config: {
            'connector.class': 'com.apex.connect.jdbc.JdbcSourceConnector',
            'tasks.max': '1',
            'connection.url': tableDetail.ctcUrl,
            'topic.prefix': 'TOPIC_IN_' + tableDetail.tblNm,
            'validate.non.null': 'false',
            'numeric.mapping': 'best_fit',
            'poll.interval.ms': tableDetail.pollIntvl,
            'query': tableDetail.qrySql,
            // },
          };
        } else {
          params = {
            // name: selectedItem.tblId,
            // config: {
            'connector.class': 'com.apex.connect.jdbc.JdbcSourceConnector',
            'tasks.max': '1',
            'connection.url': tableDetail.ctcUrl,
            'topic.prefix': 'TOPIC_IN_',
            'table.whitelist': tableDetail.tblNm,
            'table.types': tableDetail.tblTp === '1' ? 'TABLE' : 'VIEW',
            'validate.non.null': 'false',
            'numeric.mapping': 'best_fit',
            'poll.interval.ms': tableDetail.pollIntvl,
            // },
          };
        }
        params.mode = incrementingType;
        params[`${incrementingType}.column.name`] = incrementingColumnName;
      }
      const payload = {
        method: 'PUT',
        url: `/connectors/${selectedItem.tblId}/config`,
        data: JSON.stringify(params),
      };
      try {
        const result = await FetchKafkaConnect({ ...payload });
        if (result.code > 0) {
          this.handleListRefresh();
          // this.fetchStreamTableConfigurationMaintenance({ tblId: selectedId, oprTp: '4' }, '更新成功！');
        } else {
          this.setState({ spinning: false, errorMessageModalVisible: true, errorMessage: result.note });
          // message.error(result.note);
        }
      } catch (e) {
        this.setState({ spinning: false, errorMessageModalVisible: true, errorMessage: !e.success ? e.message : e.note });
        // message.error(!e.success ? e.message : e.note);
      }

      // try{
      //   const result = await FetchKafkaConnect({method:'PUT',url:`/connectors/${selectedId}/config`});
      //   if(result.statusCode === 200){
      //     this.fetchStreamTableConfigurationMaintenance({ tblId: selectedId, oprTp: '4' });
      //   }else{
      //     message.error(result.note);
      //   }
      // }catch(e){
      //   message.error(!e.success ? e.message : e.note);
      // }
    });
  }

  handleAdd =(type = '') => {
    const { isEdit, selectedId, addType } = this.state;
    if (isEdit) {
      this.openConfirmModal({ content: '是否取消当前页面修改？' }, () => {
        if (addType) {
          this.fetchQueryStreamTableConfiguration(selectedId);
        }
        this.setState({ addType: type, isEdit: false, visible: true });
      });
    } else {
      this.setState({ visible: true, addType: type });
      this.fetchQueryStreamTableDataType(type === '1' ? '3' : '1');
    }
  }
  handleEdit = () => {
    this.setState({ isEdit: true });
  }
  handleAddCancel=() => {
    this.setState({ visible: false, addType: '' });
  }

  handleEditCancel=() => {
    const { selectedId, addType } = this.state;
    this.openConfirmModal({ content: '是否取消当前页面修改？' }, () => {
      if (addType) {
        this.fetchQueryStreamTableConfiguration(selectedId);
      }
      this.setState({ addType: '', isEdit: false });
    });
  }

  handleAddOk=(tableDetail = {}) => {
    this.setState({ tableDetail, visible: false, isEdit: true });
  }

  handleSave=(payload) => {
    this.openConfirmModal({ content: '是否保存当前页面修改？' }, () => {
      this.fetchStreamTableConfigurationMaintenance(payload);
    });
  }

  handleListRefresh=async (call) => {
    try {
      const result = await FetchRefreshStatus();
      const { code } = result;
      if (code === 409) {
        setTimeout(async () => {
          await this.handleListRefresh();
        }, 2000);
      } else {
        this.fetchQueryStreamTableConfigurationList({ ctcStrtTp: '2' }, call);
      }
    } catch (e) {
      message.error(!e.success ? e.message : e.note);
      this.fetchQueryStreamTableConfigurationList({ ctcStrtTp: '2' });
    }
  }

  // 确认框
  openConfirmModal=(options = {}, onOk, onCancel) => {
    const { theme = 'default-dark-theme' } = this.props;
    Modal.confirm({
      title: '提示',
      content: '确认进行该操作？',
      okText: '确定',
      cancelText: '取消',
      autoFocusButton: null,
      className: theme,
      okButtonProps: { className: 'm-btn-radius m-btn-headColor', style: { marginLeft: 0 } },
      cancelButtonProps: { className: 'm-btn-radius m-btn-gray' },
      onCancel: () => { if (typeof onCancel === 'function') onCancel(); },
      onOk: () => { if (typeof onOk === 'function') onOk(); },
      ...options,
    });
  }

  updateDimensions = () => { // 窗口大小改变的时候调整固定
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    let height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
    height -= 115;
    this.setState({ height });
  }

  fetchSysObject=(objName, stateName, opt = {}) => {
    fetchObject(objName, { ...opt }).then((res) => {
      const { note, code, records } = res;
      if (code > 0) {
        this.setState({ [stateName]: records || [] });
      } else {
        message.error(note);
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }

  fetchQueryStreamTableConfigurationList= (payload, call) => {
    FetchQueryStreamTableConfigurationList({ ...payload }).then(async (res) => {
      const { code, note, records } = res;
      if (code > 0) {
        if (typeof call === 'function') {
          call(res);
        } else {
          this.setState({ configurationList: records || [], spinning: false });
        }
        // const result = await FetchKafkaConnect({method:'GET',url:'/connectors'});
        // if(result.statusCode === 200){
        //   console.log('result',JSON.parse(result.result));
        // }
      } else {
        this.setState({ spinning: false });
        message.error(note);
      }
    }).catch((e) => {
      this.setState({ spinning: false });
      message.error(!e.success ? e.message : e.note);
    });
  }

  fetchQueryStreamTableConfiguration=(tblId) => {
    if (tblId) {
      FetchQueryStreamTableConfiguration({ tblId }).then((res) => {
        const { code, note, records } = res;
        if (code > 0) {
          this.setState({ tableDetail: records.length > 0 ? records[0] : {}, spinning: false });
          this.fetchQueryStreamTableDataType(records.length > 0 ? records[0].dataSrcTp : '');
        } else {
          this.setState({ spinning: false });
          message.error(note);
        }
      }).catch((e) => {
        this.setState({ spinning: false });
        message.error(!e.success ? e.message : e.note);
      });
    }
  }
  fetchQueryStreamTableDataType=(dataSrcTp) => {
    if (dataSrcTp) {
      FetchQueryStreamTableDataType({ dataSrcTp }).then((res) => {
        const { code, note, records } = res;
        if (code > 0) {
          this.setState({ tableDataType: records, spinning: false });
        } else {
          message.error(note);
          this.setState({ spinning: false });
        }
      }).catch((e) => {
        this.setState({ spinning: false });
        message.error(!e.success ? e.message : e.note);
      });
    }
  }
  fetchQueryConnectionUrlExample=() => {
    FetchQueryConnectionUrlExample().then((res) => {
      const { code, note, records } = res;
      if (code > 0) {
        this.setState({ urlExample: records || [], spinning: false });
      } else {
        message.error(note);
        this.setState({ spinning: false });
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
      this.setState({ spinning: false });
    });
  }

  fetchStreamTableConfigurationMaintenance= (payload = {}, msg = '') => {
    const {selectedItem = {}} = this.state;
    FetchStreamTableConfigurationMaintenance({ ...payload }).then(async (res) => {
      const { code, note } = res;
      if (code > 0) {
        const { oprTp } = payload;
        if (oprTp === '3') {
          if (selectedItem.strtUseSt === '2') {
            try {
              const result = await FetchKafkaConnect({ method: 'DELETE', url: `/connectors/${payload.tblId}` });
              if (result.statusCode === 200) {
                message.success('删除成功！');
                this.setState({ selectedId: '' }, () => {
                  this.handleListRefresh();
                });
              }
            } catch (e) {
              message.error(!e.success ? e.message : e.note);
            }
          } else {
            message.success('删除成功！');
            this.setState({ selectedId: '' }, () => {
              this.handleListRefresh();
            });
          }
        } else if (oprTp === '1' || oprTp === '2') {
          message.success('保存成功！');
          this.setState({ isEdit: false, addType: '' });
          this.handleListRefresh(resp => {
            if (resp.code > 0) {
              this.setState({
                isEdit: false,
                addType: '',
                configurationList: resp.records || [],
              }, () => {
                const item = resp.records.find(elem => elem.tblId === note) || {};
                this.handleSelect(item, true);
              });
            } else {
              this.setState({ spinning: false });
            }
          });
        } else if (oprTp === '4' || oprTp === '5') {
          message.success(msg || '发布成功！');
          this.handleListRefresh(resp => {
            if (resp.code > 0) {
              const { selectedId } = this.state;
              this.setState({
                configurationList: resp.records || [],
                selectedItem: resp.records.find(item => item.tblId === selectedId) || {},
              }, () => {
                this.fetchQueryStreamTableConfiguration(selectedId);
              });
            } else {
              this.setState({ spinning: false });
            }
          });
        }
      } else {
        this.setState({ spinning: false });
        message.error(note);
      }
    }).catch((e) => {
      this.setState({ spinning: false });
      message.error(!e.success ? e.message : e.note);
    });
  }

  fetchStreamTableStatusUpdate=(payload, showSuccess=true) => {
    FetchStreamTableStatusUpdate({ ...payload }).then(async (res) => {
      const { code, note } = res;
      if (code > 0) {
        // this.setState({ urlExample: records || [] });
        if(showSuccess){
          message.success(note);
        }
        const { selectedId } = this.state;
        const resp = await FetchQueryStreamTableConfigurationList({ ctcStrtTp: '2' });
        this.setState({
          configurationList: resp.records || [],
          selectedItem: resp.records.find(item => item.tblId === selectedId) || {},
        }, () => {
          this.fetchQueryStreamTableConfiguration(selectedId);
        });
      } else {
        message.error(note);
        this.setState({ spinning: false });
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
      this.setState({ spinning: false });
    });
  }

  render() {
    const { selectedId, selectedItem, keyword, visible, addType, tableDetail, urlExample, isEdit, configurationList, tableDataType, spinning, height, errorMessageModalVisible, errorMessage } = this.state;
    const { dictionary: { [getDictKey('motDataSrc')]: motDataSrc = [], [getDictKey('motCtcTblTp')]: motCtcTblTp = [] } } = this.props;
    return (
      <React.Fragment>
        <Spin spinning={spinning} >
          <Row style={{ height, overflow: 'auto' }} className="mot-prod-scrollbar">
            <Col xs={24} sm={24} md={6} lg={6} xl={6} style={{ height: '100%', overflow: 'hidden', borderRight: '1px solid #e9e9e9' }}>
              <LeftSearchAndListComponent
                selectedId={selectedId}
                selectedItem={selectedItem}
                keyword={keyword}
                height={height}
                urlExample={urlExample}
                configurationList={configurationList}
                handleSelect={this.handleSelect}
                handleKeywordChange={this.handleKeywordChange}
                handleStart={this.handleStart}
                handleStop={this.handleStop}
                handleDelete={this.handleDelete}
                handleAdd={this.handleAdd}
                handleListRefresh={this.handleListRefresh}
                handleUpdate={this.handleUpdate}
              />
            </Col>
            <Col xs={24} sm={24} md={18} lg={18} xl={18} style={{ height, overflow: 'hidden' }}>
              <RightDetailAndEditContent
                selectedId={selectedId}
                selectedItem={selectedItem}
                urlExample={urlExample}
                tableDetail={tableDetail}
                motDataSrc={motDataSrc}
                motCtcTblTp={motCtcTblTp}
                addType={addType}
                isEdit={isEdit}
                tableDataType={tableDataType}
                height={height}
                handleEdit={this.handleEdit}
                handleEditCancel={this.handleEditCancel}
                handleSave={this.handleSave}
                handlePublish={this.handlePublish}
                handleUpdate={this.handleUpdate}
                handlePublishCancel={this.handlePublishCancel}
                handleRestart={this.handleRestart}
                fetchQueryStreamTableDataType={this.fetchQueryStreamTableDataType}
              />
            </Col>
          </Row>
          <AddStreamTableModal
            visible={visible}
            addType={addType}
            motDataSrc={motDataSrc}
            motCtcTblTp={motCtcTblTp}
            urlExample={urlExample}
            handleAddCancel={this.handleAddCancel}
            handleAddOk={this.handleAddOk}
            fetchQueryStreamTableDataType={this.fetchQueryStreamTableDataType}
          />
          <ErrorMessageModal
            visible={errorMessageModalVisible}
            handleCancel={() => this.setState({ errorMessageModalVisible: false })}
            handleOk={() => this.setState({ errorMessageModalVisible: false })}
            errMsg={errorMessage}
          />
        </Spin>
      </React.Fragment>
    );
  }
}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
  theme: global.theme,
}))(DistributeStreamTableConfig);

