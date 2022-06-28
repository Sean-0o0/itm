import React from 'react';
import { Drawer, message, Row, Col } from 'antd';
import TreeUtils from '../../../../../../../utils/treeUtils';
import LeftTree from './LeftTree';
import RightTable from './RightTable';
import { FetchqueryStaffSalaryForm } from '../../../../../../../services/EsaServices/navigation';

/**
 *  核对薪酬抽屉组件
 */

class DrawerContent extends React.Component {
  state = {
    originalData: [], // 原始数据
    treeData: [], // 树形数据
    selectedRecord: [], // 选中的节点数据
  }

  componentDidMount() {
    const { tableParams = {} } = this.props;
    if (tableParams.empNo) {
      this.queryStaffSalaryForm(tableParams);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { tableParams } = nextProps;
    if (JSON.stringify(tableParams) !== JSON.stringify(this.props.tableParams)) {
      if (tableParams.empNo) {
        this.queryStaffSalaryForm(tableParams);
      }
    }
  }
  onCloseDrawer = () => {
    this.setState({ treeData: [], selectItem: [], originalData: [] });
    const { onCloseDrawer } = this.props;
    if (onCloseDrawer) {
      onCloseDrawer();
    }
  }
  // 人员薪酬模板查询
  queryStaffSalaryForm = (params) => {
    FetchqueryStaffSalaryForm({ ...params }).then((res) => {
      const { records = [] } = res;
      const datas = TreeUtils.toTreeData(records, { keyName: 'id', pKeyName: 'fid', titleName: 'name', normalizeTitleName: 'name', normalizeKeyName: 'value' }, false);
      const treeData = datas[0] !== undefined ? [...datas[0].children] : [];
      this.setState({ treeData, originalData: records });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  handleNodeClick = (selectedKeys) => {
    const { originalData } = this.state;
    if (selectedKeys.length !== 0) {
      let selectedRecord = originalData.find(item => item.id === selectedKeys[0]);
      this.setState({
        selectedRecord,
      });
    }
  }
  render() {
    const { treeData = [], selectedRecord } = this.state;
    const { drawerVisible = false, chosenRowData, payload } = this.props;
    return (
      <div>
        <Drawer
          width="80%"
          closable={false}
          onClose={this.onCloseDrawer}
          visible={drawerVisible}
          style={{ overflow: 'auto' }}
          bodyStyle={{ padding: 0 }}
          destroyOnClose
          getContainer={document.getElementById('CheckSalaryDom')}
        >
          <Row>
            <Col span={24} style={{ fontSize: '16px', padding: '16px 24px', borderBottom: '1px solid #e8e8e8' }}>
              <span className="fwb">薪酬表单</span>
            </Col>
          </Row>
          <Row>
            <Col span={9} style={{ padding: '16px 24px', borderRight: '1px solid #e8e8e8', minHeight: '51rem' }}>
              <LeftTree treeData={treeData} handleNodeClick={this.handleNodeClick} />
            </Col>
            <Col span={15}>
              <RightTable selectedRecord={selectedRecord} chosenRowData={chosenRowData} payload={payload} />
            </Col>
          </Row>
        </Drawer>
      </div>
    );
  }
}

export default DrawerContent;
