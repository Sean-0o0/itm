import React, { Fragment } from 'react';
import IframeContent from '../../../../../components/WorkPlatForm/EsaPage/Common/iframeContent';
import { DecryptBase64 } from '../../../../../components/Common/Encrypt';

/**
 * 系统指标参数
 */

class SystemIndiParams extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const { match: { params: { versionData = '' } } } = this.props;
    const versionDataJson = JSON.parse(DecryptBase64(versionData)) || {};
    const table = versionDataJson.st === '2' ? 'V_TINDI_PARAM_HIS' : 'V_TINDI_PARAM'
    const livebos = localStorage.getItem('livebos');
    const url = `${livebos}/UIProcessor?Table=${table}&ParamAction=true&VERSION=${versionDataJson.VersionId || versionDataJson.parentVersionId}`;
    return (
      <Fragment>
        <IframeContent url={url} />
      </Fragment>
    );
  }
}
export default SystemIndiParams;
