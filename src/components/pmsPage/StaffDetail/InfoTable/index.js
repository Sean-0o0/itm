import React, { Component } from 'react'
import { Table, message, Popover } from 'antd'
import moment from 'moment';


class InfoTable extends Component {
    state = {
    }

    //获取标签数据
    getTagData = tag => {
        let arr = [];
        if (tag !== '' && tag !== null && tag !== undefined) {
            if (tag.includes(',')) {
                arr = tag.split(',');
            } else {
                arr.push(tag);
            }
        }
        return arr;
    };

    render() {
        const { tableLoading = false, tableData = [], } = this.props;

        const columns = [
            {
                title: '年份',
                dataIndex: 'xmnf',
                width: '9%',
                key: 'xmnf',
                ellipsis: true,
                sorter: (a, b) => Number(a.xmnf) - Number(b.xmnf),
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: '项目名称',
                dataIndex: 'xmmc',
                width: '20%',
                key: 'xmmc',
                ellipsis: true,
                render: (text, row, index) => {
                    return <div className='opr-btn'>{text}</div>
                }
            },
            {
                title: '项目标签',
                dataIndex: 'xmbq',
                width: '18%',
                key: 'xmbq',
                ellipsis: true,
                render: (text, row, index) => {
                    const data = this.getTagData(text)
                    return <div className="prj-tags">
                        {data.length !== 0 && (
                            <>
                                {data?.slice(0, 2)
                                    .map((x, i) => (
                                        <div key={i} className="tag-item">
                                            {x}
                                        </div>
                                    ))}
                                {data?.length > 2 && (
                                    <Popover
                                        overlayClassName="tag-more-popover"
                                        content={
                                            <div className="tag-more">
                                                {data?.slice(2)
                                                    .map((x, i) => (
                                                        <div key={i} className="tag-item">
                                                            {x}
                                                        </div>
                                                    ))}
                                            </div>
                                        }
                                        title={null}
                                    >
                                        <div className="tag-item">...</div>
                                    </Popover>
                                )}
                            </>
                        )}
                    </div>
                }
            },
            {
                title: '项目进度',
                dataIndex: 'xmjd',
                width: '10%',
                key: 'xmjd',
                ellipsis: true,
                sorter: (a, b) => Number(a.xmjd) - Number(b.xmjd),
                align: 'right',
                sortDirections: ['descend', 'ascend'],
                render: (text, row, index) => {
                    return <div style={{ paddingRight: '20px' }}>
                        {text}%
                    </div>
                }
            },
            {
                title: '项目阶段',
                dataIndex: 'dqlcb',
                width: '15%',
                key: 'xmpd',
                ellipsis: true,
            },
            {
                title: '承担岗位',
                dataIndex: 'cdgw',
                width: '15%%',
                key: 'cdgw',
                ellipsis: true
            },
            {
                title: '项目状态',
                dataIndex: 'xmzt',
                width: '12%',
                key: 'xmzt',
                ellipsis: true,
                sorter: (a, b) => Number(a.xmzt) - Number(b.xmzt),
                sortDirections: ['descend', 'ascend']
            }
        ];

        return (
            <div className="info-table">
                <div className="project-info-table-box">
                    <Table
                        loading={tableLoading}
                        columns={columns}
                        rowKey={'xmid'}
                        dataSource={tableData}
                        pagination={{
                            pageSizeOptions: ['10', '20', '30', '40'],
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: total => `共 ${tableData.length} 条数据`,
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default InfoTable;