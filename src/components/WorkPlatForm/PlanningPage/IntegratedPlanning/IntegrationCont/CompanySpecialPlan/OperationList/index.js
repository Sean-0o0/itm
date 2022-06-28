import React from 'react';
import { Button, Col, message } from 'antd';
import { LoadAssessPlanData } from '../../../../../../../services/planning/planning';
import LBFrameModal from '../../../../../../Common/BasicModal/LBFrameModal';
import { connect } from 'dva';

class OperationList extends React.Component {
    state = {
        visible: false,
        title: '',
        src: '',
        height: '',
    };

    import = (type) => {
        if (type === 1) {
            this.setState({
                title: '导入当年公司规划',
                src: `${localStorage.getItem('livebos') || ''}/OperateProcessor?operate=LoadExcel&Table=TCOMPANY_PLAN_YEAR_TEMP`,
                height: '15rem',
            }, () => {
                this.showModal();
            })
        } else if (type === 2) {
            this.setState({
                title: '导入模版下载',
                src: `${localStorage.getItem('livebos') || ''}/OperateProcessor?operate=TCOMPANY_PLAN_YEAR_TEMP_M&Table=TCOMPANY_PLAN_YEAR_TEMP`,
                height: '27rem',
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
            this.props.refresh && this.props.refresh()
        }
    }

    closeModal = () => {
        this.setState({
            visible: false,
        });
    }

    callBack = () =>{
        window.location.href = `/#/esa/planning/CompanySpecialList`;
    }


    // 导出全部数据
    export = () => {
        this.props.export && this.props.export();
    }

    render() {

        const { authorities: { companyPastPlan = [] }, data = [] } = this.props;
        // console.log("datadata", data)
        // const livebosPrefix = localStorage.getItem('livebos');
        return (
            <div style={{ display: 'flex', padding: '2rem 2rem 0 2rem' }}>
                <Col span={6} style={{ display: 'flex', }}>
                    <div style={{ fontSize: '1.4rem', color: 'rgba(153, 153, 153, 1)', lineHeight: '2rem' }}>年度:&nbsp;{data[0]?.YEAR ? data[0]?.YEAR : '--'}</div>
                    <div style={{ fontSize: '1.4rem', color: 'rgba(153, 153, 153, 1)', lineHeight: '2rem', paddingLeft: '2rem' }}>录入人:&nbsp;{data[0]?.OPREMP ? data[0].OPREMP : '--'}</div>
                </Col>
                <Col span={18} style={{ textAlign: 'end', }}>
                <div>
                    <Button onClick={() => this.callBack()} className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c" style={{ marginLeft: '10px' }} >返回</Button>&nbsp;&nbsp;
                </div>
                </Col>
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
