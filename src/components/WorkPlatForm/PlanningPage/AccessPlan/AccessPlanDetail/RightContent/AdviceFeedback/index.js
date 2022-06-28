import React from 'react';
import { Select, Timeline, Pagination, Button, message } from 'antd';
import BasicModal from '../../../../../../Common/BasicModal';
import AddFeedback from './AddFeedback';
import GrantAdvice from './GrantAdvice';
import GrantRECAdvice from './GrantRECAdvice';
import AdviceItem from './AdviceItem';
import nodata from '../../../../../../../assets/no-data.png';
import { FetchQueryOptList, FetchQueryOptOprAuth } from '../../../../../../../services/planning/planning.js';

class RightContent extends React.Component {
    state = {
        mode: '',
        orgId: '',
        userId: 0,
        yr: '',
        agreeStatus: 0,
        visible: false,
        //授权弹窗
        grantVisible: false,
        //授权回收弹窗
        grantRECVisible: false,
        isHidden: true,
        adviceList: [],
        total: 1,
        optData: {},
        authList: [],
        pageParam: {
            paging: 1,
            current: 1,
            pageSize: 6,
            total: -1,
            sort: '',
        },
        modalType: false, //弹窗类型 为true的时候为引用
        optionContent: '', //弹窗的引用意见
        editType: false,     //true的时候是修改
    };

    componentDidMount() {
        this.fetchQueryOptList();
        this.fetchQueryOptOprAuth();
    }

    handleHeader = (headerInfo) => {
        let { orgId, userId, yr } = this.state;
        const infoList = headerInfo.split(",");
        infoList.forEach((item, index) => {
            const tmpl = item.split(":");
            if (tmpl.length > 1) {
                if (tmpl[0] === "orgId") {
                    orgId = tmpl[1];
                } else if (tmpl[0] === "head") {
                    userId = tmpl[1];
                } else if (tmpl[0] === "yr") {
                    yr = tmpl[1];
                }
            }
        })
        this.setState({
            orgId,
            userId,
            yr
        })
    }

    fetchQueryOptList = () => {
        const { planId = '' } = this.props;
        const { pageParam, mode } = this.state;
        let params = {
            ...pageParam,
            planId,
        };
        if (mode) {
            const status = Number.parseInt(mode);
            params = {
                ...params,
                status
            }
        }
        FetchQueryOptList(params).then(res => {
            const { code = 0, records = [], totalrows = 1, note = '' } = res;
            this.handleHeader(note);
            if (code > 0) {
                this.setState({
                    adviceList: records,
                    total: totalrows || 1,
                });
            }
        }).catch(e => {
            message.error(!e.success ? e.message : e.note);
        })
    }

    fetchQueryOptOprAuth = () => {
        const { planId: planid = '' } = this.props;
        FetchQueryOptOprAuth({ planid }).then(res => {
            const { code = 0, records = [] } = res;
            if (code > 0) {
                const authList = records[0] ? records[0].oprauth.split(";") : [];
                this.setState({ authList });
            }
        }).catch(e => {
            message.error(!e.success ? e.message : e.note);
        })
    }

    handleModeChange = e => {
        const mode = e;
        this.setState({ mode }, () => {
            this.fetchQueryOptList()
        });
    };

    changePage = (current) => {
        const { pageParam } = this.state;
        this.setState({
            pageParam: {
                ...pageParam,
                current
            }
        }, () => {
            this.fetchQueryOptList()
        });
    }

    showModal = (modalType, editType = false, optionContent = '', replyId = 0,) => {
        //this.onColse();
        this.setState({
            visible: true,
            modalType,
            optionContent,//传递进弹窗的引用意见
            replyId,
            editType
        });
    }

    closeModal = () => {
        this.setState({
            visible: false,

        });
        this.fetchQueryOptList();
    }

    showGrantModal = () => {
        //this.onColse();
        this.setState({
            grantVisible: true,
        });
    }

    closeGrantModal = () => {
        this.setState({
            grantVisible: false,
        });
        this.refresh();
    }

    showGrantRECModal = () => {
      //this.onColse();
      this.setState({
        grantRECVisible: true,
      });
    }

    closeGrantRECModal = () => {
      this.setState({
        grantRECVisible: false,
      });
      this.refresh();
    }

    refresh = () => {
        this.fetchQueryOptOprAuth()
        this.fetchQueryOptList();
    }

    newOrUpdate = (oprSort, optData) => {
        //this.onColse();
        let modalType = false, editType = false
        if (oprSort === 2) {
            modalType = true
            editType = true
        }
        this.setState({
            oprSort: oprSort, //1|新增 2|修改
            optData: optData,
            editType
        }, () => {
            this.showModal(modalType, editType);
        });
    }

    changeOprSort = (oprSort) => {
        this.setState({
            oprSort
        })
    }

  onColse = () =>{
    const { handleClickCallback } = this.props;
    if (handleClickCallback) {
      handleClickCallback()
    }
  }

    render() {
        const { mode, adviceList, orgId, yr, userId, oprSort, optData, authList, modalType, optionContent, replyId, editType } = this.state;
        const { dictionary: { PLANOPTION_STATUS: planOptionStatus = [] }, planId = '', planType = '' } = this.props;

        return (
            <div className='af-box flex-c' style={{ minHeight: '50rem' }}>
                <div className='flex-r' style={{ marginLeft: '2rem'}}><span style={{ color: '#333', fontWeight: 'bold' }}>意见状态：</span>
                    <Select style={{ width: '10rem' }} value={mode} onChange={(e) => { this.handleModeChange(e) }} >
                        <Select.Option key='-1' value=''>全部</Select.Option>
                        {planOptionStatus.map((item) => { return <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>; })}
                    </Select>
                    <div className='button-box' style={{float:'right',display:'flex',width:`${authList.indexOf("2") !== -1?(authList.indexOf("3") !== -1?'21rem':'0'):'21rem'}`,marginLeft: `${authList.indexOf("2") !== -1?(authList.indexOf("3") !== -1?'0':'14rem'):'0'}`}}>
                        {authList.indexOf("3") !== -1 &&
                            <Button type="link" onClick={this.showGrantModal} ><i className='iconfont icon-yewuyunying' style={{fontSize: '1.167rem'}} />授权</Button>
                        }
                        {authList.indexOf("3") !== -1 &&
                            <Button type="link" onClick={this.showGrantRECModal} ><i className='iconfont icon-yewuyunying' style={{fontSize: '1.167rem'}} />授权回收</Button>
                        }
                        {authList.indexOf("2") !== -1 &&
                            <Button type="link" onClick={() => this.newOrUpdate(1, {})} ><i className='iconfont icon-tianjia' style={{fontSize: '1.167rem'}} />新增</Button>
                        }
                    </div>
                </div>
                {/* <div className='af-radio'>
                    <Radio.Group onChange={this.handleModeChange} value={mode} style={{ marginBottom: 8 }}>
                        <Radio.Button value=''>全部</Radio.Button>
                        {planOptionStatus.map((item, index) => (
                            <Radio.Button value={item.ibm}>{item.note}</Radio.Button>
                        ))
                        }
                    </Radio.Group>
                </div> */}
                {adviceList.length === 0 ?
                    <div style={{ position: 'absolute', top: 'calc(50% - 120px)', left: 'calc(50% - 120px)' }}>
                        <img src={nodata} alt="" width="240" /><div style={{ textAlign: 'center', color: '#b0b0b0', fontSize: '1.5rem', marginTop: '1.5rem' }}> 暂无可展示内容!</div>
                    </div> :
                    <React.Fragment>
                        <div className='af-detail flex1'>
                            <Timeline style={{padding:'0px 0px 3px 0px'}}>
                                {adviceList.map(item => {
                                    return <AdviceItem authList={authList} data={item} refresh={this.refresh}
                                        newOrUpdate={this.newOrUpdate} changeOprSort={this.changeOprSort}
                                        showModal={this.showModal}
                                    />
                                })
                                }
                            </Timeline>
                        </div>
                        <div style={{ position: 'relative', height: '4rem', width: '100%' }}>
                            <div style={{ position: 'absolute', top: '.5rem', right: '0' }}>
                                <Pagination simple pageSize={this.state.pageParam.pageSize} current={this.state.pageParam.current} total={this.state.total} onChange={this.changePage} />
                            </div>
                        </div>
                    </React.Fragment>
                }
                <BasicModal
                    visible={this.state.visible}
                    onCancel={this.closeModal}
                    style={{ /* height: '20rem' */ }}
                    footer={null}
                    width="45rem"
                    // zIndex={1049}
                    title={editType ? "修改反馈" : "新增反馈"}
                >
                    <AddFeedback
                        reloadAuth={this.fetchQueryOptOprAuth}
                        oprSort={oprSort}
                        closeModal={this.closeModal}
                        planId={planId}
                        orgId={orgId}
                        userId={userId}
                        yr={yr}
                        planType={planType}
                        oprType={1}
                        replyId={replyId}
                        modalType={modalType}
                        optionContent={optionContent}
                        optData={optData}
                        editType={editType}//告诉子组件当前编辑状态  用以区分修改和引用
                    />
                </BasicModal>
                <BasicModal
                    visible={this.state.grantVisible}
                    onCancel={this.closeGrantModal}
                    style={{ /* height: '20rem' */ }}
                    footer={null}
                    // zIndex={1049}
                    width="40rem"
                    title="授权反馈意见"
                >
                  <GrantAdvice closeModal={this.closeGrantModal} planId={planId} orgId={orgId} />
                </BasicModal>
                <BasicModal
                  visible={this.state.grantRECVisible}
                  onCancel={this.closeGrantRECModal}
                  style={{ /* height: '20rem' */ }}
                  footer={null}
                  // zIndex={1049}
                  width="40rem"
                  title="授权回收"
                >
                  <GrantRECAdvice closeModal={this.closeGrantRECModal} planId={planId} orgId={orgId} />
                </BasicModal>
            </div>
        );
    }
}
export default RightContent;
