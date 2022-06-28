/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment } from 'react';
import { Card, Button, Modal, message, Popover } from 'antd';
import FetchDataTable from '../../../../../components/Common/FetchDataTable';
import OperOrgVsCfgModal from './OperOrgVsCfgModal';
import { EncryptBase64 } from '../../../../../components/Common/Encrypt';
import { FetchoperateOrgSalaryVersion, FetchqueryOrgSalaryVersion } from '../../../../../services/EsaServices/esaVersion';

/**
 * 营业部薪酬版本配置表
 */

class OrgVersionConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshNum: 0,
      operOrgVsCfgModal: {
        visible: false,
        selectData: {},
        onCancel: this.onCancel,
        doRefreshTable: this.doRefreshTable,
      },
    };
  }

  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {

  }
  doRefreshTable = () => {
    const { refreshNum } = this.state;
    this.setState({ refreshNum: refreshNum + 1 });
  }
  openoperOrgVsCfgModal = (operateType, record = {}) => {
    const { operOrgVsCfgModal } = this.state;
    this.setState({ operOrgVsCfgModal: { ...operOrgVsCfgModal, selectData: record, visible: true, operateType } });
  }
  onCancel = () => {
    const { operOrgVsCfgModal } = this.state;
    this.setState({ operOrgVsCfgModal: { ...operOrgVsCfgModal, selectData: {}, visible: false } });
  }
  openLink = (record) => {
    const url = `/#/esa/orgVersionCfgDetail/appraisalPlan/${EncryptBase64(JSON.stringify(record))}`
    window.open(url, '_blank');
  }
  // 删除确认框
  handleDelete = (orgVersionId) => {
    const { theme = 'default-dark-theme' } = this.props;
    Modal.confirm({
      title: '是否确认作废?',
      cancelText: '取消',
      okText: '确定',
      className: theme,
      okButtonProps: { className: 'm-btn-radius m-btn-headColor', style: { marginLeft: 0 } },
      cancelButtonProps: { className: 'm-btn-radius m-btn-gray' },
      onOk: () => {
        FetchoperateOrgSalaryVersion({ oprType: 3, orgVersionId }).then((res) => {
          const { note, code } = res;
          if (code > 0) {
            message.success(note);
            this.doRefreshTable();
          } else {
            message.error(note);
          }
        }).catch((e) => {
          message.error(!e.success ? e.message : e.note);
        });
      },
    });
  }
  fetchColumns = () => {
    const columns = [
      {
        title: '营业部',
        dataIndex: 'orgName',
        key: 'orgName',
        align: 'left',
        render: (value) => {
          return <span className="m-color">{value}</span>;
        },
      },
      {
        title: '人员类别',
        dataIndex: 'examClassName',
        key: 'examClassName',
        align: 'left',
        render: (value) => (
          <Popover placement='bottom' content={value} overlayStyle={{ maxWidth: '250px' }}>
            <span style={{
              maxWidth: '150px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',
              display: 'inline-block'
            }}>
              {value}
            </span>
          </Popover>
        )
      },
      {
        title: '薪酬版本',
        dataIndex: 'versionName',
        key: 'versionName',
        align: 'left',
      },
      {
        title: '状态',
        dataIndex: 'st',
        key: 'st',
        align: 'left',
        render: value => <span>{value === '1' ? '正常' : value === '2' ? '作废' : '--'}</span>
      },
      {
        title: '开始月份',
        dataIndex: 'begMon',
        key: 'begMon',
        align: 'left',
      },
      {
        title: '结束月份',
        dataIndex: 'endMon',
        key: 'endMon',
        align: 'left',
      },
      {
        title: '设置人',
        dataIndex: 'crtrName',
        key: 'crtrName',
        align: 'left',
        render: (value) => {
          return <span className="m-color">{value}</span>;
        },
      },
      {
        title: '设置日期',
        dataIndex: 'crtrDt',
        key: 'crtrDt',
        align: 'left',
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        width: 160,
        render: (value, record) => {
          return <div><a className="m-color mr10" onClick={() => this.openLink(record)}>详情</a>
            <a className="m-color mr10" onClick={() => this.openoperOrgVsCfgModal(2, record)}>修改</a>
            <a className="m-color" onClick={() => this.handleDelete(value)}>作废</a></div>
        },
      }
    ];
    return columns;
  }
  render() {
    const { operOrgVsCfgModal, refreshNum } = this.state;
    const tableProps = {
      style: { marginTop: '17px' },
      rowKey: 'id',
      columns: this.fetchColumns(),
      locale: { emptyText: '暂无数据' },
      fetch: {
        service: FetchqueryOrgSalaryVersion,
        params: {
          refreshNum,
        },
      },
      isPagination: true,
      pagination: {
        pageSize: 10, // 每页记录条数
      },
    };
    return (
      <Fragment>
        <Card style={{ height: '100%', overflow: 'hidden auto', margin: '0.833rem' }} className="m-card" bodyStyle={{ margin: '2rem 2rem 0 2rem' }}>
          <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={() => this.openoperOrgVsCfgModal(1)}>新增</Button>
          <FetchDataTable {...tableProps} />
          <OperOrgVsCfgModal {...operOrgVsCfgModal} />
        </Card>
      </Fragment>
    );
  }
}
export default OrgVersionConfig;
