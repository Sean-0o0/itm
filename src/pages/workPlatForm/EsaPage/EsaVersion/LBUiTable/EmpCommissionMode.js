import React, { Fragment } from 'react';
import IframeContent from '../../../../../components/WorkPlatForm/EsaPage/Common/iframeContent';
import { DecryptBase64 } from '../../../../../components/Common/Encrypt';

/**
 * 人员提成方式
 */

class EmpCommissionMode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const { match: { params: { versionData = '' } } } = this.props;
    const versionDataJson = versionData ? JSON.parse(DecryptBase64(versionData)) : {};
    const { version: versionId, orgid: orgId } = versionDataJson;
     const livebos = localStorage.getItem('livebos');
    const url = `${livebos}/UIProcessor?Table=V_TTAKE_EMP_MODE&ParamAction=true&ORG_ID=${orgId}&VERSION=${versionId}`;
    return (
      <Fragment>
        <IframeContent url={url} />
      </Fragment>
    );
  }
}
export default EmpCommissionMode;
