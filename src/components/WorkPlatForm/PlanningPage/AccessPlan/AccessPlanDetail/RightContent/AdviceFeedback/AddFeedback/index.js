import React from 'react';
import { Select, Input, message, Row, Col, Button } from 'antd';
import { FetchQueryLegalNote, AddOption, UpdateOption } from '../../../../../../../../services/planning/planning.js';


class AddFeedback extends React.Component {
    state = {
        modularList: [],
        selectedKey: '0',
        optContent: '',
        replyNote: '',//意见回复内容
    }

    componentDidMount() {
        const { optData: {
            modularId = '',
            optionContent = '',
            replyNote
        } } = this.props;
        this.setState({
            //selectedKey: modularId,
            electedKey: '0',
            optContent: optionContent,
            replyNote
        })
        this.fetchQueryLegalNote();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.fetchQueryLegalNote();
        }
    }

    fetchQueryLegalNote = () => {
        const { orgId = '', userId = '', yr = '', oprType = '', planType = '' } = this.props;
        let modularList = [{ modularId: '0', modularName: '方案总体' },
        { modularId: '1', modularName: '基础指标' }
        ]
        if (orgId && yr) {
            FetchQueryLegalNote({
                orgId,
                planType,
                yr,
                oprType,
                head: planType === '1' ? userId : 0
            }).then(res => {
                const { code = 0, records = [] } = res;
                if (code > 0) {
                    modularList = [...modularList, ...records]
                }
                this.setState({
                    modularList: modularList
                });
            }).catch(e => {
                message.error(!e.success ? e.message : e.note);
            })
        }
    }


    handleAdviceChange = ({ target: { value } }) => {
        this.setState({
            optContent: value
        })
    }

    handleMoudleChange = (value) => {
        this.setState({
            selectedKey: value
        })
    }

    onClickOk = () => {
        const { modularList = '', selectedKey, optContent, replyNote = '' } = this.state;
        const { oprSort = 1, optData: { optionId = '' }, reloadAuth, closeModal, replyId = '', modalType } = this.props;
        let modularName = "";
        modularList.forEach(item => {
            if (selectedKey === item.modularId) {
                modularName = item.modularName
            }
        })
        const { planId = 0 } = this.props;
        if (selectedKey === '') {
            message.warning("请选择对应模块!");
        } else if (optContent === '') {
            message.warning("请输入意见内容!");
        } else {
            if (oprSort === 1) {
                let params = {}
                if (modalType) {
                    params = {
                        planId,
                        modularId: selectedKey,
                        modularName,
                        optContent,
                        replyId,
                        replyNote
                    }
                } else {
                    params = {
                        planId,
                        modularId: selectedKey,
                        modularName,
                        optContent,
                    }
                }
                AddOption(params).then(res => {
                    const { code = 0, note = '' } = res;
                    if (code > 0) {
                        message.success(note);
                        reloadAuth();
                        closeModal();
                    }
                }).catch(e => {
                    message.error(!e.success ? e.message : e.note);
                })
            } else {
                UpdateOption({
                    modularId: selectedKey,
                    modularName,
                    optContent,
                    optId: optionId,
                    planId,
                    replyNote
                }).then(res => {
                    const { code = 0, note = '' } = res;
                    if (code > 0) {
                        message.success(note);
                        reloadAuth();
                        closeModal();
                    }
                }).catch(e => {
                    message.error(!e.success ? e.message : e.note);
                })
            }

        }
    }
    handleAnswerContent = ({ target: { value } }) => {
        this.setState({
            replyNote: value
        })
    }

    render() {
        const { modularList, selectedKey = '0', optContent = '', } = this.state;
        const { closeModal, modalType = false, optionContent, editType, optData } = this.props;
        const node = <>
            <div className='clearfix' style={{ marginBottom: '1rem' }}>
                <div className='fl' style={{display:'flex'}}><div style={{color:'white'}}>*</div>&nbsp;引用意见：&nbsp;&nbsp;</div>
                <div className='fl' style={{ width: '30rem' }}>
                    {editType ? optData?.replyOption : optionContent}
                </div>
            </div>
            <div className='clearfix' style={{ marginBottom: '1rem' }}>
                <div className='fl' style={{display:'flex'}}><div style={{color:'white'}}>*</div>&nbsp;回复内容：&nbsp;&nbsp;</div>
                <div className='fl' style={{ width: '30rem' }}>
                    <Input.TextArea
                        onChange={this.handleAnswerContent}
                        maxLength={1000}
                        rows={4}
                        defaultValue={editType ? optData?.replyNote : ''}
                    />
                </div>
            </div>
        </>



        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <div className='af-modal-body' style={{ fontSize: '1.133rem' }}>
                            {/* 先判断是否是编辑 是的话进一步判断是否存在引用内容   */}
                            {
                                editType ? (optData?.replyOption.length === 0 ? '' : node) : (modalType ? node : '')
                            }
                            {modalType}
                            {/*<div className='clearfix af-modal-firstcont'>
                                <div className='fl'>对应模块：&nbsp;&nbsp;</div>
                                <div className='fl' style={{ width: '20rem' }}>
                                    <Select style={{ width: '100%' }} value={selectedKey}
                                        disabled={modularList.length === 0 ? true : false} onChange={this.handleMoudleChange}>
                                        {modularList.map((item, index) => {
                                            return <Select.Option key={index} value={item.modularId}>{item.modularName}</Select.Option>
                                        })}
                                    </Select>
                                </div>
                            </div>*/}
                            <div className='clearfix'>
                                <div className='fl' style={{display:'flex'}}><div style={{color:'red'}}>*</div>&nbsp;意见内容：&nbsp;&nbsp;</div>
                                <div className='fl' style={{ width: '30rem' }}>
                                    <Input.TextArea
                                        onChange={this.handleAdviceChange}
                                        maxLength={1000}
                                        rows={4}
                                        defaultValue={editType ? optContent : ''}
                                    />
                                </div>
                            </div>

                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{ marginTop: 10, marginBottom: 10, textAlign: 'center' }}>
                        <Button style={{ marginRight: 8 }} className="m-btn-radius m-btn-headColor" onClick={this.onClickOk} > 确定 </Button>
                        <Button style={{ marginLeft: 8 }} className="m-btn-radius" onClick={closeModal}> 关闭 </Button>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default AddFeedback;
