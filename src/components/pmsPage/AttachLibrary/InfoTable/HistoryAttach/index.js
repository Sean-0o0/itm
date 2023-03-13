import React, { Component } from 'react'
import { Modal, Select, DatePicker, Button } from 'antd'
import AttachTable from './AttachTable'

const { RangePicker } = DatePicker;

class HistoryAttach extends Component {
    state = {}
    render() {
        const { modalVisible = false } = this.props;
        return (<Modal wrapClassName='history-attach-modal' width='60vw'
            maskClosable={false}
            zIndex={100}
            maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
            cancelText='取消'
            okText='保存'
            style={{ top: '5vh' }}
            bodyStyle={{ padding: '0', overflow: 'hidden' }}
            title={null}
            footer={null}
            visible={modalVisible}
            onCancel={() => this.props.closeModalVisible()}>
            <div className='body-title-box'>
                <strong>文档历史版本</strong>
            </div>
            <div className='body-cont history-attach-body'>
                <div className="item-box">
                    <div className="console-item" style={{ width: '25%' }}>
                        <div className="item-label">上传人</div>
                        <Select
                            className="item-selector"
                            dropdownClassName={'item-selector-dropdown'}
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            showSearch
                            allowClear
                            placeholder="请选择"
                        >
                            {/* {prjMngerData.map((x, i) => (
                <Select.Option key={i} value={x.ID}>
                  {x.USERNAME}
                </Select.Option>
              ))} */}
                        </Select>
                    </div>
                    <div className="console-item" style={{ width: '50%' }}>
                        <div className="item-label" >上传时间</div>
                        <RangePicker className="item-selector" separator='至' onChange={this.handlePicker} />
                    </div>
                    <div style={{flex: '1', display: 'flex', flexDirection:'row-reverse'}}>
                        <Button className="btn-reset" onClick={this.handleReset}>
                            重置
                        </Button>
                        <Button
                            className="btn-search"
                            type="primary"
                        // onClick={() =>
                        //   handleSearch({
                        //     budget,
                        //     budgetType
                        //   })
                        // }
                        >
                            查询
                        </Button>
                    </div>
                </div>
                <AttachTable/>
            </div>
        </Modal>);
    }
}

export default HistoryAttach;