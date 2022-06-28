import React from 'react';
import { Row, Col, Table, Select } from 'antd';

class CustomerRanking extends React.Component {
  businessColumns = () => {
    const columns = [
      {
        dataIndex: 'pm',
        title: '排名',
        render: text => <span className="blueDark">{text === '' ? '--' : text}</span>,
      },
      {
        dataIndex: 'fgs',
        title: '分公司',
        render: text => (text === '' ? '--' : text),
      },
      {
        dataIndex: 'zsr',
        title: '总收入(万元)',
        render: text => (text === '' ? '--' : text),
      },
      {
        dataIndex: 'pmbhcd',
        title: '排名变化程度',
        render: text => (text.includes('+') ? <span style={{ color: 'red' }}>{text}</span> : text.includes('-') ? <span style={{ color: 'green' }}>{text}</span> : text),
      },
    ];
    return columns;
  }
  getData = () => {
    const dataSource = [
      {
        pm: '1',
        fgs: '上海分公司',
        zsr: '142338.04',
        pmbhcd: '+2',
      },
      {
        pm: '2',
        fgs: '北京分公司',
        zsr: '107402.22',
        pmbhcd: '-1',
      },
      {
        pm: '3',
        fgs: '浙江分公司',
        zsr: '93976.22',
        pmbhcd: '+4',
      },
      {
        pm: '4',
        fgs: '深圳分公司',
        zsr: '64629.59',
        pmbhcd: '+5',
      },
      {
        pm: '5',
        fgs: '广东分公司',
        zsr: '59704.77',
        pmbhcd: '0',
      },
    ];
    return dataSource;
  }

  getRightData = () => {
    const dataSource = [
      {
        pm: '29',
        fgs: '上海自贸分公司',
        zsr: '2338.04',
        pmbhcd: '-2',
      },
      {
        pm: '28',
        fgs: '吉林分公司',
        zsr: '2402.22',
        pmbhcd: '-2',
      },
      {
        pm: '27',
        fgs: '甘肃分公司',
        zsr: '3076.22',
        pmbhcd: '+2',
      },
      {
        pm: '26',
        fgs: '广西分公司',
        zsr: '4629.59',
        pmbhcd: '+2',
      },
      {
        pm: '25',
        fgs: '陕西分公司',
        zsr: '5704.77',
        pmbhcd: '0',
      },
    ];
    return dataSource;
  }
  render() {
    // const { businessColumns } = this.props;
    return (
      <React.Fragment>
        <Row>
          <Col span={12} style={{ padding: '1rem' }}>
            <Row>
              <Col style={{ position: 'relative', height: '40px', lineHeight: '40px', fontWeight: '900' }}><span style={{ width: '3px', height: '10px', position: 'absolute', top: '15px', left: '-10px', backgroundColor: 'rgb(44, 170, 228)' }} />
                分公司当年收入排名(全公司前五)
                <Select defaultValue="总收入" style={{ width: 120, float: 'right' }}>
                  <Select.Option value="总收入">总收入</Select.Option>
                </Select>
              </Col>
            </Row>
            <Table
              className="m-table-customer m-table-bortop ant-table-wrapper"
              columns={this.businessColumns()}
              pagination={{
                pageSize: 15,
              }}
              dataSource={this.getData()}
            />
          </Col>
          <Col span={12} style={{ padding: '1rem' }}>
            <Row>
              <Col style={{ position: 'relative', height: '40px', lineHeight: '40px', fontWeight: '900' }}><span style={{ width: '3px', height: '10px', position: 'absolute', top: '15px', left: '-10px', backgroundColor: 'rgb(44, 170, 228)' }} />
                分公司当年收入排名(全公司后五)
                <Select defaultValue="总收入" style={{ width: 120, float: 'right' }}>
                  <Select.Option value="总收入">总收入</Select.Option>
                </Select>
              </Col>
            </Row>
            <Table
              className="m-table-customer m-table-bortop ant-table-wrapper"
              columns={this.businessColumns()}
              pagination={{
                pageSize: 15,
              }}
              dataSource={this.getRightData()}
            />
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}
export default CustomerRanking;