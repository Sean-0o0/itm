import React, { Fragment } from 'react';
import { Card } from 'antd';
import OperationBtnList from './OperationBtnList';
import AppraisalIndexDetail from './AppraisalIndexDetail';
import MandatorySelectedIndexTable from './MandatorySelectedIndexTable';
import AlternativeIndexTable from './AlternativeIndexTable';

/**
 * 右侧考核操作 指标详情
 */

class AppraisalPlanDetail extends React.Component {
  constructor(props) {
    super(props);

  }
  render() {
    const {
      handlePlanEdit,
      handleSubmitExamine,
      handleDepartmentExamine,
      handleCompanyExamine,
      handlePlanReturn,
      planDetail = {},
      indexDetail,
      pageType='',
    } = this.props;
    const selectBtn = (
      <div>
        <div style={{ marginTop: '2rem' }}>
          <MandatorySelectedIndexTable indexDetail={indexDetail} />
        </div>
        <div style={{ marginTop: '2rem' }}>
          <AlternativeIndexTable indexDetail={indexDetail} />
        </div>
      </div>
    );
    return (

      <Fragment>
        <Card
          className="m-card h100"
          bodyStyle={{ height: 'calc(100% - 65px)' }}
          title={
            <div className="dis-fx" style={{"padding-right":"2px", "white-space":"pre-wrap"}}>
              <div className="dis-fx alc fwb">{planDetail.tmplName || '--'}</div>
            </div>
          }
          extra={
            <div style={{ height: '32px' }}>
              <OperationBtnList
                handlePlanEdit={handlePlanEdit}
                handleSubmitExamine={handleSubmitExamine}
                handleDepartmentExamine={handleDepartmentExamine}
                handleCompanyExamine={handleCompanyExamine}
                handlePlanReturn={handlePlanReturn}
                pageType={pageType}

              />
            </div>
          }
        >
          <div className="h100" style={{ overflow: 'hidden auto' }}>
            <div style={{ padding: '2rem 4rem 0' }}>
              <AppraisalIndexDetail planDetail={planDetail} />
            </div>
            <div>{this.props.total === 0 ? '' : selectBtn}</div>
          </div>
        </Card>
      </Fragment>
    );
  }
}
export default AppraisalPlanDetail;
