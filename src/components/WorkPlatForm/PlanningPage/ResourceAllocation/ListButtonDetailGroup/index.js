import React from 'react';
import { Button, Form, message } from 'antd';
import { connect } from 'dva';
import LBFrameModal from '../../../../Common/BasicModal/LBFrameModal';
import BasicModal from '../../../../Common/BasicModal';
import config from '../../../../../utils/config';
import { ModResourceAllocationDeal } from '../../../../../services/planning/planning';

const { api } = config;
const { planning: { exportResourceAllocation } } = api;
const columns = [
  {
    columnName: "年份",
    dataIndex: 'yr',
    width: '8%',
  },
  {
    columnName: "资源类别",
    dataIndex: 'resClassName',
    width: '15%',
  },
  {
    columnName: "组织机构",
    dataIndex: 'orgName',
    width: '15%',
  },
  {
    columnName: "当前实际情况",
    dataIndex: 'nowNum',
    width: '15%',
  },
  {
    columnName: "计划情况",
    dataIndex: 'planNum',
    width: '15%',
  },
  {
    columnName: "拟增配情况",
    dataIndex: 'addNum',
    width: '15%',
  },
  {
    columnName: "备注",
    dataIndex: 'remark',
    width: '20%',
  },
];
class ListButtonDetailGroup extends React.Component {
  state = {
    //导入
    importVisible: false,
    //导出
    exportVisible: false,
    //修改提交
    modifyVisible: false,
    //导入
    importUrl: '/OperateProcessor?operate=LoadExcel&Table=TRESOURCE_ALLOCATION_TEMP',
    //导出
    exportUrl: '/OperateProcessor?operate=ToExcel&Table=TRESOURCE_ALLOCATION_TEMP',
  };


  componentDidMount() {

  }

  closeImportModal = () => {
    this.setState({
      importVisible: false,
    });
  };

  closeExportModal = () => {
    this.setState({
      exportVisible: false,
    });
  };

  closeModifyModal = () => {
    this.setState({
      modifyVisible: false,
    });
  };

  onImportMessage = (messageObj) => { // iframe的回调事件
    if (!messageObj) { // 取消事件，对应 LiveBOS `operateCancel`
      this.closeImportModal();
    } else { // 操作完成事件，对应 LiveBOS `operateCallback`
      this.closeImportModal();
      message.success('导入成功');
      this.props.refresh && this.props.refresh()
    }
  }

  onExportMessage = (messageObj) => { // iframe的回调事件
    if (!messageObj) { // 取消事件，对应 LiveBOS `operateCancel`
      this.closeExportModal();
    } else { // 操作完成事件，对应 LiveBOS `operateCallback`
      this.closeExportModal();
      message.success('导出成功');
      this.props.refresh && this.props.refresh()
    }
  }

  submitExport = () => { // iframe的回调事件
    const { newData = [], year = "2022" } = this.props;
    const iframe = this.ifile; // iframe的dom
    if (newData.length === 0) {
      this.setState({
        exportVisible: false,
      });
      return;
    }
    const tableHeaderNames = columns.map(item => item.columnName);
    tableHeaderNames.unshift();
    const tableHeaderCodes = columns.map(item => item.dataIndex);
    tableHeaderCodes.unshift();
    const exportPayload = JSON.stringify({
      isAllSel: 1,
      unSelectRowKey: '',
      queryCompanyPlanYearModel: {},
      tableHeaderNames: tableHeaderNames.join(','),
      tableHeaderCodes: tableHeaderCodes.join(','),
      tableName: '总体资源配置详情',
      oprYr: year,
      viewType: "3",
      orgId: "1",
      resType: newData[0].resClass,
    });
    //console.log("导出当年规划的参数",exportPayload)
    const actionUrl = exportResourceAllocation;
    // 创建一个表单
    const downloadForm = document.createElement('form');
    downloadForm.id = 'downloadForm';
    downloadForm.name = 'downloadForm';
    // 创建一个输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'exportPayload';
    input.value = exportPayload;
    // 将该输入框插入到 form 中
    downloadForm.appendChild(input);
    // form 的提交方式
    downloadForm.method = 'POST';
    // form 提交路径
    downloadForm.action = actionUrl;
    // 添加到 body 中
    iframe.appendChild(downloadForm);
    // 对该 form 执行提交
    downloadForm.submit();
    // 删除该 form
    iframe.removeChild(downloadForm);
    this.setState({
      exportVisible: false,
    });
  };

  //提交修改
  submitModify = () => {
    //查询资源明细情况 部门资源得时候传orgid=1
    const { newData } = this.props;
    newData.forEach((item, index) => {
      ModResourceAllocationDeal({
        //VIEWTYPE入参为3时，查询资源明细情况。
        'id': Number(item.fid),
        'now': item.nowNum,
        //查询资源明细 Restype= 点击的父列表里返回的 resClass
        'plan': item.planNum,
        //查询资源明细 yr= 点击的父列表里返回的 yr
        'add': item.addNum,
        'remark': item.remark,
      }).then((res) => {
        const { code = 0, note = '' } = res;
        if (code > 0 && index === newData.length - 1) {
          message.success(note);
          return;
        } else if (index === newData.length - 1) {
          message.error(note);
        }
      });
    });
    this.setState({
      modifyVisible: false,
    });
  };

  render() {
    const { importUrl, importVisible, exportVisible, modifyVisible } = this.state;
    const { newData = [], authorities: { ResourceAllocation = [] } } = this.props;
    //修改提交弹窗参数
    const modalProps = {
      style: { overflowY: 'auto', top: '20rem' },
      destroyOnClose: true,
      title: '提示',
      width: '60rem',
      height: '50rem',
      visible: modifyVisible,
      onCancel: this.closeModifyModal,
      onOk: this.submitModify,
    };
    return <div style={{ marginTop: '1rem', marginBottom: '1rem', display: 'flex' }}>
      {ResourceAllocation.includes('ResourceAllocationImport')
        && <Button
          className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'
          onClick={() => {
            this.setState({
              importVisible: true,
            });
          }} style={{ marginRight: '10px', flexShrink: 0 }}>导入
        </Button>
      }
      {ResourceAllocation.includes('ResourceAllocationExport')
        && <Button className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'
          onClick={() => {
            this.setState({
              exportVisible: true,
            });
          }} style={{ marginRight: '10px', flexShrink: 0 }}>
          导出</Button>
      }
      {ResourceAllocation.includes('ResourceAllocationUpdate')
        && <Button className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'
          onClick={() => {
            this.setState({
              modifyVisible: true,
            });
          }} style={{ marginRight: '10px', flexShrink: 0 }}>
          修改提交</Button>
      }
      <LBFrameModal
        modalProps={{
          style: { overflowY: 'auto', top: '10rem' },
          destroyOnClose: true,
          title: '导入',
          width: '60rem',
          height: '50rem',
          visible: importVisible,
          onCancel: this.closeImportModal,
        }}
        frameProps={{
          height: '40rem',
          src: `${localStorage.getItem('livebos') || ''}${importUrl}`,
          onMessage: this.onImportMessage,
        }}
      />
      <BasicModal {...modalProps}>
        <Form.Item style={{ margin: '1rem', padding: '1rem' }} label='提示' labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}>
          <div>{newData.length === 0 ? '暂无可提交的数据' : '是否确认提交？'}</div>
        </Form.Item>
      </BasicModal>
      <iframe title='下载' id='m_iframe' ref={(c) => {
        this.ifile = c;
      }} style={{ display: 'none' }} />
      <BasicModal title={'导出'}
        width='50rem'
        style={{ overflowY: 'auto', height: '70rem', margin: '0 auto', top: '10rem' }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        visible={exportVisible}
        onOk={this.submitExport}
        onCancel={this.closeExportModal}>
        <Form.Item style={{ margin: '1rem', padding: '1rem' }} label='提示' labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}>
          <div><span>{newData.length === 0 ? '暂无可导出的数据' : '是否导出数据？'}</span></div>
        </Form.Item>
      </BasicModal>
    </div>;
  }
}

export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(ListButtonDetailGroup);
