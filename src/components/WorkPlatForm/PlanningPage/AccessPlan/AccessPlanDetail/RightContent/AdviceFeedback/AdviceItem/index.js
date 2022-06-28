import React from 'react';
import { Timeline, Popconfirm, Input, Button, message } from 'antd';
import { OprOption, DeleteOption, UpdateOprOption } from '../../../../../../../../services/planning/planning.js';
import AddFeedback from './../AddFeedback'
import BasicModal from '../../../../../../../Common/BasicModal';
class AdviceItem extends React.Component {
    state = {
        agreeStatus: 0,
        isHidden: true,
        oprNote: '',
        resultStatus: 0, //0|查看，1|展示
        detailChange: 0,
        visible: false,
    };

    isAgree = (isAgree) => {
        this.setState({
            agreeStatus: isAgree,
            isHidden: false
        })
    }

    handleDetailChange = ({ target: { value } }) => {
        this.setState({
            oprNote: value,
            detailChange: this.state.resultStatus ? 1 : 0
        })
    }

    cancel = () => {
        const { resultStatus } = this.state;
        if (resultStatus) {
            this.setState({ resultStatus: 0, detailChange: 0 })
        } else {
            this.setState({ isHidden: true })
        }
    }

    confirm = (optId, status) => {
        const { oprNote, resultStatus } = this.state;
        const { refresh } = this.props;
        if (resultStatus) {
            UpdateOprOption({
                oprnote: oprNote,
                oprtype: status,
                optid: optId
            }).then(res => {
                const { code = 0, note = '' } = res;
                if (code > 0) {
                    message.success(note);
                    this.setState({
                        resultStatus: 0,
                        isHidden: true,
                        agreeStatus: 0
                    }, () => {
                        refresh();
                    })
                }
            }).catch(e => {
                message.error(!e.success ? e.message : e.note);
            })
        } else {
            OprOption({
                oprNote,
                oprType: status,
                optId
            }).then(res => {
                const { code = 0, note = '' } = res;
                if (code > 0) {
                    message.success(note);
                    refresh();
                }
            }).catch(e => {
                message.error(!e.success ? e.message : e.note);
            })
        }
    }

    updateOpt = () => {
        const { data } = this.props;
        if (this.props.newOrUpdate) {
            this.props.newOrUpdate(2, data)
            //this.props.changeOprSort(2)
        }
    }

    updateResult = () => {
        const { data: { status = 0 } } = this.props;
        this.setState({
            resultStatus: 1,
            isHidden: false,
            agreeStatus: Number(status) - 1
        })
    }

    deleteOpt = () => {
        const { refresh, data: { optionId = '' } } = this.props;
        DeleteOption({
            optId: optionId
        }).then(res => {
            const { code = 0, note = '' } = res;
            if (code > 0) {
                message.success(note);
                refresh();
            }
        }).catch(e => {
            message.error(!e.success ? e.message : e.note);
        })
    }

    showModal = () => {
        const { showModal, data } = this.props
        showModal(true, false, data?.optionContent, +data?.optionId,)
    }
    render() {
        const { oprNote, agreeStatus = 0, isHidden, resultStatus, detailChange, } = this.state;
        const { data = {}, authList = [] } = this.props;

        const { status = '0' } = data;
        const { oprAuth } = data;
        const adviceAuth = oprAuth.split(";") || [];
        let statusClass = "flex1";
        let dotClass = "";
        switch (status) {
            case '0':
                dotClass = 'blue';
                statusClass = statusClass + ' blue';
                break;
            case '1':
                dotClass = 'black';
                statusClass = statusClass + ' black';
                break;
            case '2':
                dotClass = 'blue';
                statusClass = statusClass + ' blue';
                break;
            case '3':
                dotClass = 'orange';
                statusClass = statusClass + ' orange';
                break;
            case '4':
                dotClass = 'red';
                statusClass = statusClass + ' red';
                break;
            default:
                break;
        }
        return (
            <Timeline.Item color={dotClass}>
                <div className='flex-r advice-top'>
                    <div className='flex1 flex-r fwb advice-info'>
                        <div className={statusClass} style={{ display: "flex" }}>{data.statusName || '--'}
                            {(authList.indexOf("9") !== -1 && adviceAuth.indexOf("9") !== -1) &&
                                <Button type="link" style={{ paddingRight: '0.5rem', display: 'flex', justifyContent: 'start', fontSize: '1.167rem', }} onClick={this.showModal} >
                                    <i className='iconfont icon-tianjia' style={{ fontSize: '1.167rem', marginRight: '.2rem', }} />
                                    引用
                                </Button>
                            }
                        </div>
                        <div className='fs14 advice-info-name' style={{ display: 'flex', justifyContent: 'start' }}>
                            {data.feedbackEmpName || '--'}
                        </div>
                    </div>
                    <div className='fs14 advice-time'>{data.feedbackTime || '---------- --:--:--'}</div>
                    {(data.status === '0' || data.status === '1') && authList.indexOf("5") !== -1 && adviceAuth.indexOf("5") !== -1 ?
                        <i className='iconfont icon-spdp' title='修改' style={{ cursor: 'pointer', color: '#40a9ff', fontSize: '1.33rem', marginLeft: '0.5rem' }} onClick={this.updateOpt} /> : null
                    }
                    {(data.status === '0' || data.status === '1') && authList.indexOf("6") !== -1 && adviceAuth.indexOf("6") !== -1 ?
                        <Popconfirm title={`确定删除当前意见反馈吗?`} onConfirm={this.deleteOpt}>
                            <a><i className='iconfont icon-shanchu' title='删除' style={{ cursor: 'pointer', color: '#40a9ff', fontSize: '1.33rem', margin: 'auto 0 auto 1rem' }} /></a>
                        </Popconfirm>
                        : null
                    }
                </div>
                <div className='fs14 advice-cont'>
                    {data.replyOption && <div className='advice-cont-desc'>
                        <b>引用意见：</b>{data.replyOption || '--'}
                    </div>}
                    {data.replyNote && <div className='advice-cont-desc'>
                        <b>回复内容：</b>{data.replyNote || '--'}
                    </div>}
                    <div className='advice-cont-desc'>
                        <b>意见内容：</b> {data.optionContent || '--'}
                    </div>
                    <div
                        className='fs14 advice-cont-foot'
                        style={{
                            color: (data.status !== '0' && data.status !== '1') && resultStatus === 0 ? '#666' : '#C0C0C0',
                            backgroundColor: (data.status !== '0' && data.status !== '1') && resultStatus === 0 ? 'rgb(236 236 236)' : '#fff',
                            padding: (data.status !== '0' && data.status !== '1') && resultStatus === 0 ? '.5rem .7rem' : '0',
                            borderRadius: '.2rem'
                        }}>
                        {data.status !== '1' && resultStatus === 0 ?
                            <React.Fragment>
                                {(data.status !== '0' || data.status !== '1') && authList.indexOf("8") !== -1 && adviceAuth.indexOf("8") !== -1 ?
                                    <div className="flex-r">
                                        <div className='flex1'></div>
                                        <i className='iconfont icon-spdp' title='修改' style={{ cursor: 'pointer', color: '#40a9ff', fontSize: '1.33rem', marginLeft: '0.5rem' }} onClick={this.updateResult} />
                                    </div>
                                    : null
                                }
                                {data.status !== '0' && <div><div className="advice-cont-foot-detail" style={{ paddingTop: '0', textIndent: '2em' }}>
                                    <span>{data.oprNote || '--'}</span>
                                </div>
                                    <div className="flex-r" style={{ paddingTop: '.5rem' }}>
                                        <div className='flex1'></div>
                                        <div style={{ marginRight: '1rem' }}>{data.oprEmpName || '--'}</div>
                                        <div>{data.oprTime || '---------- --:--:--'}</div>
                                    </div>
                                </div>}
                                {authList.indexOf("4") !== -1 && adviceAuth.indexOf("4") !== -1 &&
                                    <div>
                                        <div className='pr advice-foot-submit'>
                                            <div className='advice-submit-box'>
                                                <Button type="primary" className='advice-foot-confirm' onClick={() => this.confirm(data.optionId, 4)}>确定</Button>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </React.Fragment> :
                            ((authList.indexOf("7") !== -1 && adviceAuth.indexOf("7") !== -1) || resultStatus === 1) &&
                            < React.Fragment >
                                <div className='advice-status-select clearfix'>
                                    <div className='fl advice-status advice-status-ture' onClick={() => this.isAgree(1)} style={{ backgroundColor: agreeStatus === 1 ? '#c4e6f7' : '#fff' }}>采纳</div>
                                    <div className='fl advice-status advice-status-part' onClick={() => this.isAgree(2)} style={{ backgroundColor: agreeStatus === 2 ? '#f8d7a5fa' : '#fff' }}>部分采纳</div>
                                    <div className='fl advice-status advice-status-false' onClick={() => this.isAgree(3)} style={{ backgroundColor: agreeStatus === 3 ? '#f5b2b5' : '#fff' }}>不采纳</div>
                                </div>
                                <div style={isHidden ? { 'display': 'none' } : {}}>
                                    <div className='advice-foot-edit'>
                                        <Input.TextArea
                                            onChange={this.handleDetailChange}
                                            maxLength={1000}
                                            value={resultStatus === 1 && detailChange === 0 ? data.oprNote : oprNote}
                                            autoSize={{ minRows: 2, maxRows: 6 }}
                                            placeholder='请输入'
                                        />
                                    </div>
                                    <div className='pr advice-foot-submit'>
                                        <div className='advice-submit-box'>
                                            <Button type="primary" className='advice-foot-confirm' onClick={() => this.confirm(data.optionId, agreeStatus)}>确定</Button>
                                            <Button className='advice-foot-cancel' onClick={this.cancel}>取消</Button>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>

                        }
                    </div>
                </div>
            </Timeline.Item >
        );
    }
}
export default AdviceItem;
