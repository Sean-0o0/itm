import React from 'react';
import { Select, Button, message, Input, } from 'antd'
import { connect } from 'dva';
import { FetchLivebosLink } from '../../../../../../../services/amslb/user';
import LBFrameModal from '../../../../../../Common/BasicModal/LBFrameModal';
class ListHead extends React.Component {
    state = {
        year: '2022',
        title: '',
        addModalVisible: false,
        addUrl: '',
    };


    componentDidMount() {
    }

    handleYearChange = (year) => {
        this.setState({
            year: year,
        })
    }

    handleTitleChange = (e) => {
        this.setState({
            title: e.target.value,
        })
    }

    handleSearch = (e) => {
        const { handleChange } = this.props;
        const { year = '2022', title = '' } = this.state;
        handleChange(year, title)
    }

    fetchLBAddUrl = (e) => {
        FetchLivebosLink({
            method: 'TDEPARTMENT_PLAN_ADD',
            object: 'TDEPARTMENT_PLAN',
        }).then((ret = {}) => {
            const { data = '' } = ret;
            if (data) {
                this.setState({
                    addUrl: data,
                    addModalVisible: true
                });
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
        });
    }

    //关闭弹窗
    closeAddModal = () => {
        const { handleChange } = this.props;
        const { year = '2022', title = '' } = this.state;
        this.setState({ addModalVisible: false, }, () => {
            handleChange(year, title)
        });
    };


    //新增
    submitAdd = (messageObj) => {
        const { handleChange } = this.props;
        const { year = '2022', title = '' } = this.state;
        if (!messageObj) { // 取消事件，对应 LiveBOS `operateCancel`
            this.closeAddModal();
        } else { // 操作完成事件，对应 LiveBOS `operateCallback`
            message.success('新增成功');
            this.closeAddModal();
            handleChange(year, title)
        }
    };

    render() {
        const { year, addModalVisible, addUrl, } = this.state
        const { params, authorities: { TDEPARTMENT_PLAN = [] } } = this.props
        const curYear = new Date().getFullYear()
        let yearArray = []
        for (var i = -5; i < 5; i++) {
            yearArray.push(curYear + i)
        }
        return (
            <div className='clearfix' style={{ display: 'flex' }}>
                <div style={{ flexShrink: 0, fontSize: '1.1rem', fontWeight: '500' }} >年度：
                    <Select style={{ width: '8rem' }} onChange={e => this.handleYearChange(e)}
                        defaultValue={year ? (year ? year : new Date().getFullYear()) : (params.year ? params.year : new Date().getFullYear())} id='year'>
                        {
                            yearArray.map((item, index) => {
                                return <Select.Option key={item} value={item} >{item}</Select.Option>;
                            })
                        }
                    </Select>
                </div>
                <div style={{ flexShrink: 0, fontSize: '1.1rem', fontWeight: '500' }} className='fl header-dept'>
                    主题：
                    <Input style={{ width: '14rem' }} placeholder='请输入主题' onChange={e => this.handleTitleChange(e)}
                        id='title'>
                    </Input>
                </div>
                <div>
                    <Button onClick={e => this.handleSearch(e)} className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c" style={{ marginLeft: '10px' }} >查询</Button>&nbsp;&nbsp;
                    {
                        TDEPARTMENT_PLAN.includes("TDEPARTMENT_PLAN_ADD") && <Button className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c" onClick={
                            (e) => { this.fetchLBAddUrl() }}>新增</Button>
                    }
                </div>
                <LBFrameModal
                    modalProps={{
                        style: { top: '10rem' },
                        destroyOnClose: true,
                        title: '新增',
                        width: '60rem',
                        height: '50rem',
                        visible: addModalVisible,
                        onCancel: this.closeAddModal,
                    }}
                    frameProps={{
                        height: '40rem',
                        src: `${localStorage.getItem('livebos') || ''}${addUrl}`,
                        onMessage: this.submitAdd,
                    }}
                />
            </div>
        );
    }
}
export default connect(({ global = {} }) => ({
    dictionary: global.dictionary,
    authorities: global.authorities,
}))(ListHead);
