import React, { Component, Fragment } from 'react';

class DetailContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { data = {} } = this.props;
    return (
      <div>
        <div className="esa-content-info-item">
          <div className="esa-content-info-label">列名</div>
          <div className="esa-content-info-description">
            {data.sbjDataDtlName}
          </div>
        </div>
        {
          data.colType === '1' ? (
            <div className="esa-content-info-item">
              <div className="esa-content-info-label">基础数据表</div>
              <div className="esa-content-info-description">{data.bscTblName}</div>
            </div>
        )
          : (
            <Fragment>
              <div className="esa-content-info-item">
                <div className="esa-content-info-label">对应指标</div>
                <div className="esa-content-info-description">{data.corrIndiName}</div>
              </div>
              <div className="esa-content-info-item">
                <div className="esa-content-info-label">计算规则</div>
                <div className="esa-content-info-description">{data.sbjColFmlaDisp}</div>
              </div>
            </Fragment>
          )}

      </div>
    );
  }
}
export default DetailContent;
