import React, { Fragment } from 'react';
import { message } from 'antd';
import ReportFormList from './ReportFormList';
import { FetchqueryWorkMenuClass } from '../../../../../../../../services/EsaServices/navigation';

/**
 *  考核导航-考核报表和薪酬报表组件
 */
class ReportForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuClassData: [],
    };
  }
  componentDidMount() {
    const { depClass, stepId, bizType } = this.props;
    const params = {
      depClass,
      stepId,
      bizType,
    };
    this.queryWorkMenuClass(params);
  }
  componentWillReceiveProps(nextProps) {
    const { depClass, stepId, bizType } = nextProps;
    if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
      const params = {
        depClass,
        stepId,
        bizType,
      };
      this.queryWorkMenuClass(params);
    }
  }
  // 业务工作导航菜单分类-查询
  queryWorkMenuClass = (params) => {
    FetchqueryWorkMenuClass({ ...params }).then((res) => {
      const { records = [] } = res;
      this.setState({
        menuClassData: records,
      });
    }).catch((error) => {
      this.setState({
        menuClassData: [],
      });
      message.error(!error.success ? error.message : error.note);
    });
  };
  render() {
    const { menuClassData } = this.state;
    return (
      <Fragment>
        <div style={{ margin: '10px' }}>
          <div className="esa-salaryNavigation-wrap-report">
            <div className="fl esa-salaryNavigation-report">
              {menuClassData.map((item, index) => (
                <div key={index}>
                  <div className="esa-salaryNavigation-title">{item.menuClassName}</div>
                  <ReportFormList menuClassId={item.id} {...this.props} />
                </div>
              ))}

            </div>

          </div>
        </div >
      </Fragment >
    );
  }
}
export default ReportForm;
