import React from 'react';
import { Form, Table } from 'antd';
import BasicModal from '../../../../../Common/BasicModal';
class CooperateInstitutions extends React.Component {
    state = {
        data: [{ jydy: 'JY34231', jydymc: '创富1号', xgcps: 14, xggdhs: 23 }, { jydy: 'JY34231', jydymc: '创富1号', xgcps: 15, xggdhs: 23 }],
        columns: [
            {
                title: '机构名称',
                align: 'left',
                width: '30%',
                dataIndex: 'jydy',
                key: 'jydy'
            },
            {
                title: '产品代码',
                align: 'left',
                width: '20%',
                dataIndex: 'jydymc',
                key: 'jydymc'
            },
            {
                title: '产品名称',
                align: 'right',
                width: '20%',
                dataIndex: 'xgcps',
                key: 'xgcps',
            },
            {
                title: '交易单元代码',
                align: 'right',
                width: '30%',
                dataIndex: 'xggdhs',
                key: 'xggdhs',
            }],
        paginationProps: {
            current: 1, //当前页码
            pageSize: 1, // 每页数据条数
            showQuickJumper: true,
            showSizeChanger: true,
            size: 'small',
            pageSizeOptions: ['10', '20', '30'],
            showTotal: function (total) {
                return `总共有 ${total} 条数据`;
            },
            total: 2, // 总条数
            onChange: current => this.handlePageChange(current),
            onShowSizeChange: (current, pageSize) => this.handleSizeChange(current, pageSize)
        }
    };

    handlePageChange(current, pageSize) {
    }

    // 每页条数变化
    handleSizeChange(current, pageSize) {
    }

    handleCancel = () => {
        const { callBack } = this.props;
        callBack(false);
    }


    render() {
        const { data, columns, paginationProps } = this.state;
        const { visable } = this.props;
        const modalProps = {
            width: '115rem',
            title: '合作机构数',
            style: { top: '15rem' },
            visible: visable,
            onCancel: () => this.handleCancel(),
            footer: null,
        };
        return (
            <React.Fragment>
                <div className="">
                    <BasicModal {...modalProps}>
                        <div style={{ margin: '2rem' }}>
                            <Table dataSource={data} columns={columns} pagination={paginationProps} />
                        </div>
                    </BasicModal>
                </div>
            </React.Fragment>

        );
    }
}

export default Form.create()(CooperateInstitutions);
