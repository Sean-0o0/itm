import React from 'react';
import { Select, message, Row, Col, Button, Tooltip } from 'antd';
import { FetchQueryUserList, GrantOption } from '../../../../../../../../services/planning/planning.js';

class AddFeedback extends React.Component {
    state = {
        userList: [],
        selectedKey: '',
    }

    componentDidMount() {
        this.fetchQueryUserList();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.fetchQueryUserList();
        }
    }

    fetchQueryUserList = () => {
        const { orgId = '' } = this.props;
        if (orgId) {
            FetchQueryUserList({
                type: 0,
                orgId
            }).then(res => {
                const { code = 0, records = [] } = res;
                if (code > 0) {
                    this.setState({
                        userList: records,
                        // selectedKey: records[0] && records[0].userId ? records[0].userId : ''
                    });
                }
            }).catch(e => {
                message.error(!e.success ? e.message : e.note);
            })
        }
    }

    handleMoudleChange = (value) => {
        this.setState({
            selectedKey: value
        })
    }

    onClickOk = () => {
        const { selectedKey } = this.state;
        const { planId = '' } = this.props;
        if (selectedKey === '') {
            message.warning("请选择授权人!");
        } else {
            GrantOption({
                gtEmp: selectedKey,
                planId
            }).then(res => {
                const { code = 0, note = '' } = res;
                if (code > 0) {
                    message.success(note);
                    this.props.closeModal();
                }
            }).catch(e => {
                message.error(!e.success ? e.message : e.note);
            })
        }
    }



    render() {
        const { userList } = this.state;
        const { closeModal } = this.props;

        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <div className='af-modal-body' style={{ fontSize: '1.133rem' }}>
                            <div className='clearfix af-modal-firstcont'>
                                <div className='fl'>授权人：&nbsp;&nbsp;</div>
                                <div className='fl' style={{ width: '15rem' }}>
                                    <Select style={{ width: '100%' }}
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.props.children.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        disabled={userList.length === 0 ? true : false} onChange={this.handleMoudleChange}>
                                        {userList.map((item, index) => {
                                            return <Select.Option key={index} value={item.userId}>
                                                <Tooltip overlayClassName="selected-toolTip" placement="right"
                                                    title={item.orgName}>{item.userName}</Tooltip>
                                            </Select.Option>

                                        })}
                                    </Select>
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
