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

    import = () => {
      this.setState({
        title:'导入利润预算表',
        src:`${localStorage.getItem('livebos') || ''}/OperateProcessor?operate=LoadExcel&Table=TCOMPANY_PROFIT_BUDGET_TEMP`,
        height:'15rem',
      })
      this.showModal();
    }

    importMould = () => {
      this.setState({
        title:'导入模版下载',
        src:`${localStorage.getItem('livebos') || ''}/OperateProcessor?operate=TCOMPANY_PROFIT_BUDGET_TEMP_M&Table=TCOMPANY_PROFIT_BUDGET_TEMP`,
        height:'27rem',
      })
      this.showModal();
    }

    export = () => {
        this.props.export&&this.props.export()
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    closeModal = () => {
        this.setState({
            visible: false,
        });
    }

    onEditMessage = (messageObj) => { // iframe的回调事件
        if (!messageObj) { // 取消事件，对应 LiveBOS `operateCancel`
            this.closeModal();
        } else { // 操作完成事件，对应 LiveBOS `operateCallback`
            this.closeModal();
            message.success('导入成功');
            this.props.refresh&&this.props.refresh()
            // LoadAssessPlanData({
            //     type: 2,
            //     yr: new Date().getFullYear()
            // }).then((ret) => {
            //     const { code = 0 } = ret;
            //     if (code > 0) {
            //         this.closeModal();
            //         message.success('修改成功');
            //         this.props.refresh&&this.props.refresh()
            //     }

            // })
        }
        // this.closeModal();
    }

    render() {

        const { authorities: { companyProfitBudget = [] } } = this.props;

        return (
            <div className='ip-tab1-operation'>
              {companyProfitBudget.includes('companyProfitBudgetImport')
              && <Button style={{ flexShrink: 0, marginLeft: '2rem' }}
                          className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'  onClick={this.import}>导入</Button>
              }
              {companyProfitBudget.includes('companyProfitBudgetExport')
              && <Button style={{ flexShrink: 0, marginLeft: '1rem' }}
                          className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'  onClick={this.export}>导出</Button>
              }
              {/*companyProfitBudgetTmpl*/}
              {companyProfitBudget.includes('companyProfitBudgetTmpl')
              && <Button style={{ flexShrink: 0, marginLeft: '1rem' }}
                         className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'  onClick={this.importMould}>导入模版下载</Button>
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
                        onMessage: this.onEditMessage
                    }}
                />
            </div>
        );
    }
}
export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(OperationList);
