import React, { Component, Fragment } from 'react';
import { Row, Col } from 'antd';
/**
 * 指标详情
 */
class AppraisalIndexDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const { planDetail = {} } = this.props;
    if(typeof(planDetail.auditOpion)!=="undefined")
    {planDetail.auditOpion =planDetail.auditOpion.replace(/;/g," ")}
    return (
      <Fragment>
        <div className="esa-appraisal-detail">
          <Row>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="esa-appraisal-detail-item">
                <span className="esa-appraisal-detail-label">方案名称：</span>
                <span className="esa-appraisal-detail-content">{planDetail.tmplName || '--'}</span>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="esa-appraisal-detail-item">
                <span className="esa-appraisal-detail-label">营业部：</span>
                <span className="esa-appraisal-detail-content">{planDetail.orgName || '--'}</span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="esa-appraisal-detail-item">
                <span className="esa-appraisal-detail-label">公司考核指标权重(0%-100%):</span>
                <span className="esa-appraisal-detail-content"> {planDetail.coExamWeight || '--'}</span>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="esa-appraisal-detail-item">
                <span className="esa-appraisal-detail-label">营业部考核指标权重(0%-100%):</span>
                <span className="esa-appraisal-detail-content"> {planDetail.orgExamWeight || '--'}</span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="esa-appraisal-detail-item">
                <span className="esa-appraisal-detail-label">公司必选指标权重(0%-100%):</span>
                <span className="esa-appraisal-detail-content"> {planDetail.coRequiredWeight || '--'}</span>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="esa-appraisal-detail-item">
                <span className="esa-appraisal-detail-label">公司可选指标权重(0%-100%):</span>
                <span className="esa-appraisal-detail-content"> {planDetail.coOptionalWeight || '--'}</span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="esa-appraisal-detail-item">
                <span className="esa-appraisal-detail-label">审批记录：</span>
                <div className="esa-appraisal-detail-content mt10" style={{ wordBreak: 'break-all' }}>
                  <div dangerouslySetInnerHTML={{ __html: planDetail.auditOpion || '' }} />
                  
                </div>
              </div>

            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="esa-appraisal-detail-item">
                <span className="esa-appraisal-detail-label">审批状态：</span>
                <span className="esa-appraisal-detail-content">{planDetail.statusName || '--'}</span>
              </div>
            </Col>
          </Row>
        </div>
      </Fragment>
    );
  }
}

export default AppraisalIndexDetail;
