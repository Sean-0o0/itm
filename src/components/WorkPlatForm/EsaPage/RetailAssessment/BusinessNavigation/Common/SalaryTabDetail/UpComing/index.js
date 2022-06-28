import React, { Fragment } from 'react';
import { Checkbox, Button, Modal, message } from 'antd';
import { FetchqueryWorkMenuConf, FetchoperateWorkMenuAgent } from '../../../../../../../../services/EsaServices/navigation';

const { confirm } = Modal;
/**
 *  考核导航-考核前待办和薪酬前待办组件
 */

class UpComing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      WorkMenuConfData: [],
    };
  }
  componentDidMount() {
    const { depClass, stepId, mon, orgNo } = this.props;
    if (orgNo && mon) {
      const params = {
        mon,
        depClass,
        stepId,
        orgNo,
      };
      this.queryWorkMenuConf(params);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { mon, orgNo, depClass, stepId } = nextProps;
    const { mon: preMon, orgNo: preOrgNo, depClass: preDep } = this.props;
    if (orgNo !== preOrgNo || mon !== preMon || depClass !== preDep) {
      const params = {
        mon,
        depClass,
        stepId,
        orgNo,
      };
      this.queryWorkMenuConf(params);
    }
  }
  // 工作导航菜单查询
  queryWorkMenuConf = (params) => {
    FetchqueryWorkMenuConf({ ...params }).then((res) => {
      const { records = [] } = res;
      this.setState({
        WorkMenuConfData: records,
      });
    }).catch((error) => {
      this.setState({
        WorkMenuConfData: [],
      });
      message.error(!error.success ? error.message : error.note);
    });
  };
  // 业务工作导航菜单待办-单记录完成
  operateWorkMenuAgentOne = (item) => {
    const { depClass, orgNo, mon, stepId } = this.props;
    const params = {
      depClass,
      ip: '',
      menuConfId: `${item.ID}`,
      mon,
      oprType: 1,
      orgNo,
    };
    FetchoperateWorkMenuAgent({ ...params }).then((res) => {
      const { code } = res;
      if (code > 0) {
        const param = {
          mon,
          depClass,
          stepId,
          orgNo,
        };
        this.queryWorkMenuConf(param);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };
  // 业务工作导航菜单待办-全部完成
  operateWorkMenuAgentAll = (data) => {
    const { depClass, orgNo, mon, stepId } = this.props;
    const params = {
      depClass,
      ip: '',
      menuConfId: '',
      mon,
      oprType: 1,
      orgNo,
    };
    let boolean = true;
    data.forEach(async (item, index) => {
      params.menuConfId = `${item.ID}`;
      await FetchoperateWorkMenuAgent({ ...params }).then((res) => {
        const { code } = res;
        if (code < 0) {
          boolean = false;
        }
      }).catch((error) => {
        boolean = false;
        message.error(!error.success ? error.message : error.note);
      });
      if (index === data.length - 1) {
        const param = {
          mon,
          depClass,
          stepId,
          orgNo,
        };
        this.queryWorkMenuConf(param);
        if (boolean) {
          message.success('操作成功!');
        }
      }
    });
  };
  // 完成确认框
  handleChange = (type, item) => {
    const { theme = 'default-dark-theme' } = this.props;
    confirm({
      title: type === 1 ? '确认已经全部完成?' : '确认已经完成?',
      cancelText: '取消',
      okText: '确定',
      className: theme,
      okButtonProps: { className: 'm-btn-radius m-btn-headColor', style: { marginLeft: 0 } },
      cancelButtonProps: { className: 'm-btn-radius m-btn-gray' },
      onOk: () => {
        if (type === 1) {
          const WorkMenuConfDataNoExec = this.selectNoExecData();
          this.operateWorkMenuAgentAll(WorkMenuConfDataNoExec);
        } else {
          this.operateWorkMenuAgentOne(item);
        }
      },
      onCancel() {
      },
    });
  }
  // 筛选未完成的待办数据
  selectNoExecData = () => {
    const { WorkMenuConfData } = this.state;
    const WorkMenuConfDataNoExec = WorkMenuConfData.filter((item) => {
      return item.execSts !== '1';
    });
    return WorkMenuConfDataNoExec;
  }

  render() {
    const { WorkMenuConfData } = this.state;
    // 筛选未完成的待办数据
    const WorkMenuConfDataNoExec = this.selectNoExecData();
    const livebosPrefix = localStorage.getItem('livebos');
    return (
      <Fragment>
        <div style={{ margin: '10px', paddingLeft: '50px' }}>
          <Button
            disabled={WorkMenuConfDataNoExec.length <= 0}
            className="fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c"
            onClick={() => this.handleChange(1)}
          >
            全部完成
          </Button>
          <ul className="esa-salaryNavigation-mokuai-list">
            {WorkMenuConfData.map((item, index) => {
              return (
                <li key={index}>
                  <Checkbox checked={item.execSts === '1'} disabled={item.execSts === '1'} onChange={e => (e.target.checked ? this.handleChange(0, item) : '')} />
                  <a
                    href={`${livebosPrefix}/UIProcessor?Table=${item.tabsLink}`}
                    target={item.tabsLink ? '_blank' : ''}
                    className="esa-salaryNavigation-item"
                  >
                    {index + 1}.{item.workName}
                  </a>
                  <div style={{ marginLeft: '15px', fontsize: '14px' }}>--<span dangerouslySetInnerHTML={{ __html: item.execRemk || '' }} /></div>
                </li>
              );
            })}
          </ul>
        </div >
      </Fragment >
    );
  }
}
export default UpComing;
