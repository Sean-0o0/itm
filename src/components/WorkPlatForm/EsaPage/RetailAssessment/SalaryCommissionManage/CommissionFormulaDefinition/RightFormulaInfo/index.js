import React, { Fragment } from 'react';
import { Card, Button, message } from 'antd';
import FormContent from './formContent';
import TableContent from './tableContent';
import BasicModal from '../../../../../../Common/BasicModal';
import UpdateFormulaModel from '../UpdateFormulaModel';
import SetFormulaModel from '../SetFormulaModel';
// import LBFrame from 'livebos-frame';
import { FetchQueryInfoRoyaltyFormulaVariable } from '../../../../../../../services/EsaServices/commissionManagement';

/**
 * 右侧 详情
 */

class RightFormulaInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      paramList: [],
      modalVisible: false,
      // type: '',

    };
  }
  componentDidMount = () => {
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data.id !== this.props.data.id) {
      this.setState({ data: nextProps.data }, this.FetchQueryInfoRoyaltyFormulaVariable);
    }
  }

  // 点击修改
  onHandleClick = () => {
    const { data: { id }, st } = this.props;
    if (st === '1') {
      message.error('上架后禁止操作！')
    } else {
      this.setState({
        visible: true,
      });
      const { updateIsModify } = this.props;
      if (updateIsModify && typeof updateIsModify === 'function') {
        updateIsModify(true, id);
      }
    }
  }

  onMessage = (messageObj) => { // iframe的回调事件
    if (!messageObj) { // 取消事件，对应 LiveBOS `operateCancel`
      this.cancel();
    } else { // 操作完成事件，对应 LiveBOS `operateCallback`
      const { refreshLeftList, data: { id }, updateIsModify } = this.props;
      if (updateIsModify && typeof updateIsModify === 'function') {
        updateIsModify(true, id);
      }
      if (refreshLeftList && typeof refreshLeftList === 'function') {
        refreshLeftList();
      }
      this.cancel();
    }
  }

  // 设置拆分指标
  onClickSetZb = () => {
    const { st } = this.props;
    if (st === '1') {
      message.error('上架后禁止操作！')
    } else {
      this.setState({
        type: 'ZB',
        modalVisible: true,
      });
    }
  }
  cancel = () => {
    this.setState({
      modalVisible: false,
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
    this.FetchQueryInfoRoyaltyFormulaVariable();
  }

  FetchQueryInfoRoyaltyFormulaVariable = async () => { // 变量查询
    const { data: { id = '' } } = this.state;
    if (id) {
      const result = await FetchQueryInfoRoyaltyFormulaVariable({ fmlaId: id });
      const { code = 0 } = result;
      if (code === 1) {
        const { records = [] } = result;
        if (records.length) {
          this.setState({ paramList: records[0].paramValue });
        }
      }
    } else {
      this.setState({ paramList: [] });
    }
  }

  render() {
    const { visible, modalVisible, data, type } = this.state;
    const { st, versionId } = this.props;
    let modalTitle = '';
    if (type === 'ZB') {
      modalTitle = '设置拆分指标';
    }
    const modalProps = {
      isAllWindow: 1,
      width: '105rem',
      title: '提成公式修改',
      style: { top: '2rem', overflowY: 'auto' },
      visible,
      onCancel: this.handleCancel,
      footer: null,
    };
    const modalProps1 = {
      width: '60rem',
      height: '50rem',
      title: modalTitle,
      visible: modalVisible,
      onCancel: this.cancel,
      footer: null,
    };

    return (
      <Fragment>
        <Card
          className="m-card m-card-pay ant-card-wider-padding ant-card-padding-transition formulaCard h100"
          bodyStyle={{ height: 'calc(100% - 65px)' }}
          title={data.tmplName}
          extra={st !== '2' &&
            <React.Fragment>
              <Button
                className="fcbtn m-btn-border m-btn-border-headColor btn-1c"
                style={{ marginRight: '1rem', float: 'right' }}
                onClick={this.onClickSetZb}
              >
                <i className="iconfont icon-setLine m-btn-border-headColor" style={{ fontSize: '1.2rem', lineHeight: '2rem', marginRight: 5 }} />
                设置拆分指标
              </Button>
              <Button
                className="fcbtn m-btn-border m-btn-border-headColor btn-1c"
                style={{ marginRight: '1rem', float: 'right' }}
                onClick={this.onHandleClick}
              >
                <i className="iconfont icon-bianji2 m-btn-border-headColor" style={{ fontSize: '1.2rem', lineHeight: '2rem', marginRight: 5 }} />
                修改
              </Button>
            </React.Fragment>
          }
        >
          <div className="m-pay-right-box h100" style={{ overflow: 'hidden auto' }}>
            <FormContent data={this.props.data} />
            <TableContent data={this.state.paramList} />
          </div>
        </Card>
        <BasicModal {...modalProps}>
          <div style={{ height: '50rem', overflow: 'auto' }}>
            <UpdateFormulaModel versionId={versionId} handleCancel={this.handleCancel} data={this.props.data} refreshLeftList={this.props.refreshLeftList} />
          </div>
        </BasicModal>
        <BasicModal {...modalProps1}>
          <div style={{ height: '20rem', overflow: 'auto' }}>
            <SetFormulaModel handleCancel={this.cancel} data={this.props.data} />
          </div>
        </BasicModal>
      </Fragment>
    );
  }
}
export default RightFormulaInfo;
