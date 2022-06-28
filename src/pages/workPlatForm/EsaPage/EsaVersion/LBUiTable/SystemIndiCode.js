import React, { Fragment } from 'react';
import IframeContent from '../../../../../components/WorkPlatForm/EsaPage/Common/iframeContent';
import { DecryptBase64 } from '../../../../../components/Common/Encrypt';

/**
 * 系统指标代码
 */

class SystemIndiCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const { match: { params: { versionData = '' } } } = this.props;
    const versionDataJson = JSON.parse(DecryptBase64(versionData)) || {};
    const table = versionDataJson.st === '2' ? 'VTINDI_DEF_HIS' : 'VTINDI_DEF'
    const livebos = localStorage.getItem('livebos');
    const url = `${livebos}/UIProcessor?Table=${table}&ParamAction=true&VERSION=${versionDataJson.VersionId || versionDataJson.parentVersionId}`;
    return (
      <Fragment>
        <IframeContent url={url} />
      </Fragment>
    );
  }
}
export default SystemIndiCode;
