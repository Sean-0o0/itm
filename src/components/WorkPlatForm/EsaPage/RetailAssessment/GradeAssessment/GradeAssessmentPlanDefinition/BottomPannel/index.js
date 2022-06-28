import React, { Fragment } from 'react';
import { Button, Card } from 'antd';
import BasicModal from '../../../../../../Common/BasicModal';
import GradeAssessmentPlanDefinition from '../../../../../../../pages/workPlatForm/EsaPage/SinglePage/GradeAssessmentPlanDefinition';
import PlanTable from './PlanTable';

/**
 * 左侧 类别、项目
 */

class BottomPannel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      type: '',
    };
  }

  // 新增 修改
  handleOnClick = (type) => {
    this.setState({
      visible: true,
      type,
    });
  }
  // 新增  修改
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { visible, type } = this.state;
    const modalProps = {
      isAllWindow: 1,
      width: '105rem',
      title: type === 'add' ? '类别考核方案定义-新增' : '类别考核方案定义-修改',
      style: { top: '2rem' },
      visible,
      onCancel: this.handleCancel,
      footer: null,
    };
    return (
      <Fragment>
        <Card className="m-card" >
          <div style={{ margin: '10px 0 0 20px' }} >
            <div style={{ margin: '0 0 0 10px' }} >
              <Button type="button" className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c" style={{ marginRight: '1rem' }} onClick={() => this.handleOnClick('add')}>
                <i className="iconfont icon-add fs-inherit" />&nbsp;新增
              </Button>
              <Button type="button" className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c" style={{ marginRight: '1rem' }} onClick={() => this.handleOnClick('edit')}>
                <i className="iconfont icon-edit1 fs-inherit" />修改
              </Button>
              <Button type="button" className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c" style={{ marginRight: '1rem' }}>
                <i className="iconfont icon-delete1 fs-inherit" />删除
              </Button>
            </div>
            <div>
              <PlanTable className="m-table" />
            </div>
          </div>
          <BasicModal {...modalProps}>
            <GradeAssessmentPlanDefinition handleCancel={this.handleCancel} />
          </BasicModal>
        </Card>
      </Fragment>
    );
  }
}
export default BottomPannel;
