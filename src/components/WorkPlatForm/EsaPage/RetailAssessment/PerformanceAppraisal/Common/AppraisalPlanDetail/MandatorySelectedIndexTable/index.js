import React, { Component, Fragment } from 'react';
import { Card, Table } from 'antd';

/**
 * 必选指标
 */
class MandatorySelectedIndexTable extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  fetchColumns=() => {
    const columns = [
      {
        title: '考核指标',
        dataIndex: 'indiName',
      },
      {
        title: '业务数量',
        dataIndex: 'ywsl',
        align: 'center',
        render: (value, record) => {
          const html = [];
          for (let i = 1; i <= 10; i++) {
            if (record[`examStd${i}`]) {
              html.push(<div key={i} className="tc" style={{ padding: '2px 0' }}>{record[`examStd${i}`]}</div>);
            } else {
              return html;
            }
          }
        },
      },
      {
        title: '折算得分',
        dataIndex: 'zldf',
        align: 'center',
        render: (value, record) => {
          const html = [];
          for (let i = 1; i <= 10; i++) {
            if (record[`std${i}Score`]) {
              html.push(<div key={i} className="tc" style={{ padding: '2px 0' }}>{record[`std${i}Score`]}</div>);
            } else {
              return html;
            }
          }
        },
      },
      {
        title: '零分阈值（%）',
        dataIndex: 'zeroThld',
        align: 'center',
      },
      {
        title: '百分阈值(%)',
        dataIndex: 'pctThld',
        align: 'center',
      },
      {
        title: '权重',
        dataIndex: 'examWeight',
        align: 'center',
        render: value => Number(value).toFixed(2),
      },
    ];
    return columns;
  }
  render() {
    const { indexDetail = [] } = this.props;
    const dataSource = [...indexDetail].filter(item => item.isMust === '1');
    return (
      <Fragment>
        <Card
          className="m-card"
          headStyle={{ borderBottom: 'none' }}
          title={
            <div className="dis-fx">
              <div className="dis-fx alc fwb">必选指标</div>
            </div>
          }
        >
          <div style={{ padding: '0rem 4rem' }}>
            <Table
              rowKey={record => `${record.id}-${record.empLevelId}`}
              size="middle"
              columns={this.fetchColumns()}
              dataSource={dataSource}
              pagination={{
                className: 'm-paging',
                size: 'small',
                showLessItems: true,
                hideOnSinglePage: true,
              }}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default MandatorySelectedIndexTable;
