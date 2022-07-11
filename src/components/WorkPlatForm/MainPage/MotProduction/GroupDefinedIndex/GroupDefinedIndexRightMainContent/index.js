/* eslint-disable no-return-assign */
/* eslint-disable prefer-destructuring */
import React, { Fragment } from 'react';
import { Row, Divider, Input, message, Form, Radio } from 'antd';
import { FetchScheduleGroupMaintenance, FetchscheduleDateTypeMaintenance } from '../../../../../../services/motProduction';
import ExecutionFrequency from './ExecutionFrequency';
import MotEvent from './MotEvent';

/**
 * 分组定义
 */

class GroupDefinedIndexRightMainContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameEdit: false, // mot名编辑
      timeTypeEdit: false, // 时间类型
    };
  }

  componentWillMount() {
  }

  // 点击修改图标
  onNameEdit = () => {
    this.setState({
      nameEdit: !this.state.nameEdit,
    }, () => {
      this.input.focus();
    });
  }
  // 输入框失去焦点
  onInputBlur = () => {
    const { tgtTp, selectedItem = {}, fetchCompanyName } = this.props;
    const name = this.input.state.value;
    const { grpId, cmptMode } = selectedItem;
    this.setState({
      nameEdit: false,
    }, () => {
      const payload = {
        cmptMode: Number(cmptMode), // 计算方式()
        grpId, // 分组ID
        grpNm: name, // 分组名称
        grpTp: 1, // 分组类型() ,
        oprTp: 2, // 操作类型
        tgtTp, // 目标类型()

      };
      FetchScheduleGroupMaintenance(payload).then(() => {
        fetchCompanyName && fetchCompanyName(tgtTp, '');
      }).catch((error) => {
        fetchCompanyName && fetchCompanyName(tgtTp, '');

        message.error(!error.success ? error.message : error.note);
      });
    });
  }


  // 时间类型编辑
  onTimeTypeEdit = () => {
    this.setState({
      timeTypeEdit: !this.state.timeTypeEdit,
    });
  }
  // 时间类型单选改变
  onRadioChange = (value) => {
    const { tgtTp, selectedItem = {}, fetchCompanyName } = this.props;
    const { grpId } = selectedItem;

    this.setState({
      timeTypeEdit: false,
    }, () => {
      const payload = {

        grpId: Number(grpId),
        schdDtTp: value,

      };
      FetchscheduleDateTypeMaintenance(payload).then((res) => {
        const { code = 0 } = res;
        if (code > 0) {
          fetchCompanyName && fetchCompanyName(tgtTp, '');
        }
      }).catch((error) => {
        fetchCompanyName && fetchCompanyName(tgtTp, '');
        message.error(!error.success ? error.message : error.note);
      });
    });
  }

  render() {
    const { selectedItem = {}, fetchCompanyName, tgtTp } = this.props;
    const { nameEdit, timeTypeEdit } = this.state;


    return (
      <Fragment>
        <Row>
          <Row style={{ padding: '2rem 2rem 0 2rem' }}>

            {
              nameEdit ?

                (<Input className="mot-input" defaultValue={selectedItem.grpNm} ref={input => this.input = input} style={{ width: '200px' }} onBlur={() => this.onInputBlur()} />)

                : (
                  <span style={{ fontWeight: '500', fontSize: '20px' }}>{selectedItem.grpNm}</span>
                )}


            <i onClick={this.onNameEdit} className="iconfont icon-bianji mot-icon" style={{ fontSize: '20px', margin: '0 0 0 5px' }} />


          </Row>
          <Divider />
          {/* 执行频率 */}
          <ExecutionFrequency selectedItem={selectedItem} fetchCompanyName={fetchCompanyName} tgtTp={tgtTp} />
          <Row style={{ padding: ' 2rem' }}>
            <div style={{ color: '#333333', fontSize: '16px', fontWeight: 'bold' }}>调度时间类型</div>
            {
              timeTypeEdit ? (
                <Radio.Group className="mot-radio" onChange={e => this.onRadioChange(e.target.value)} defaultValue={selectedItem.schdDtTp}>
                  <Radio value="1">上一交易日</Radio>
                  <Radio value="2">当天</Radio>
                  <Radio value="3">上月末</Radio>
                </Radio.Group>
              ) : (<span>{selectedItem.schdDtTp >= 1 && selectedItem.schdDtTp <= 3 ? ['', '上一交易日', '当天', '上月末'][selectedItem.schdDtTp] : ''}</span>)
            }

            <i onClick={this.onTimeTypeEdit} className="iconfont icon-bianji mot-icon" style={{ color: '#2daae4', fontSize: '20px', margin: '0 0 0 5px' }} />
          </Row>

          <Row>
            {/* MOT事件 */}
            <MotEvent selectedItem={selectedItem} fetchCompanyName={fetchCompanyName} tgtTp={tgtTp} />
          </Row>


        </Row>
      </Fragment>
    );
  }
}
// export default GroupDefinedIndexRightMainContent;
export default Form.create()(GroupDefinedIndexRightMainContent);

