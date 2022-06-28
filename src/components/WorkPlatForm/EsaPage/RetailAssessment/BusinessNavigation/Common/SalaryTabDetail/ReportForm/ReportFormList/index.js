import React, { Fragment } from 'react';
import { message } from 'antd';
import { FetchqueryWorkMenuConf } from '../../../../../../../../../services/EsaServices/navigation';

/**
 *  考核导航-考核报表和薪酬报表列表组件
 */
class ReportFormList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      WorkMenuConfData: [],
    };
  }
  componentDidMount() {
    const { depClass, stepId, orgNo, mon, menuClassId } = this.props;
    if (orgNo && mon) {
      const params = {
        mon,
        depClass,
        stepId,
        orgNo,
        menuClassId,
      };
      this.queryWorkMenuConf(params);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { menuClassId, mon, orgNo, depClass, stepId } = nextProps;
    if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
      const params = {
        mon,
        depClass,
        stepId,
        orgNo,
        menuClassId,
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
      message.error(!error.success ? error.message : error.note);
    });
  };
  render() {
    const { WorkMenuConfData } = this.state;
    const livebosPrefix = localStorage.getItem('livebos');
    return (
      <Fragment>
        <ul className="esa-salaryNavigation-mokuai-list">
          {WorkMenuConfData.map((item, index) => {
            return (
              <li key={index}>
                <a
                  href={`${livebosPrefix}/UIProcessor?Table=${item.tabsLink}`}
                  target={item.tabsLink ? '_blank' : ''}
                  className="esa-salaryNavigation-item-report"
                >
                  {index + 1}.{item.workName}
                </a>
              </li>
            );
          })}
        </ul>
      </Fragment >
    );
  }
}
export default ReportFormList;
