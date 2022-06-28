import React from 'react';
import { Button, message } from 'antd';
import { LoadAssessPlanData } from '../../../../../../../services/planning/planning';
import LBFrameModal from '../../../../../../Common/BasicModal/LBFrameModal';
import { connect } from 'dva';

class OperationList extends React.Component {
    state = {
        visible: false,
        title:'',
        src:'',
        height:'',
    };

    import = (type) => {
        if(type === 1){
          this.setState({
            title:'导入当年公司规划',
            src:`${localStorage.getItem('livebos') || ''}/OperateProcessor?operate=LoadExcel&Table=TCOMPANY_PLAN_YEAR_TEMP`,
            height:'15rem',
          }, () => {
            this.showModal();
          })
        }else if(type === 2){
          this.setState({
            title:'导入模版下载',
            src:`${localStorage.getItem('livebos') || ''}/OperateProcessor?operate=TCOMPANY_PLAN_YEAR_TEMP_M&Table=TCOMPANY_PLAN_YEAR_TEMP`,
            height:'27rem',
          }, () => {
            this.showModal();
          })
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    onEditMessage = (messageObj) => { // iframe的回调事件
        if (!messageObj) { // 取消事件，对应 LiveBOS `operateCancel`
            this.closeModal();
        } else { // 操作完成事件，对应 LiveBOS `operateCallback`
            this.closeModal();
            message.success('导入成功');
            this.props.refresh&&this.props.refresh()
        }
    }

    closeModal = () => {
        this.setState({
            visible: false,
        });
    }


    // 导出全部数据
    export = () => {
        this.props.export && this.props.export();
    }

    render() {

        const { authorities: { companyPastPlan = []} } = this.props;

        return (
            <div className='ip-tab1-operation'>
              {companyPastPlan.includes('companyPastPlanImport')
              && <Button style={{ flexShrink: 0, marginLeft: '2rem' }}
                         className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c' onClick={() =>this.import(1)}>导入</Button>
              }
              {companyPastPlan.includes('companyPastPlanExport')
              && <Button style={{ flexShrink: 0, marginLeft: '1rem' }}
                         className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c' onClick={this.export}>导出</Button>
              }
              {companyPastPlan.includes('companyPastPlanTmpl')
              &&
              <Button style={{ flexShrink: 0, marginLeft: '1rem' }}
                         className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c' onClick={() =>this.import(2)}>导入模版下载</Button>
              }
                <LBFrameModal
                    modalProps={{
                        style: { overflowY: 'auto', top: '10rem' },
                        destroyOnClose: true,
                        title: this.state.title,
                        width: '60rem',
                        height: '50rem',
                        visible: this.state.visible,
                        onCancel: this.closeModal,
                    }}
                    frameProps={{
                        height: this.state.height,
                        src: this.state.src,
                        onMessage: this.onEditMessage,
                    }}
                />
            </div>
        );
    }
}
export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(OperationList);
