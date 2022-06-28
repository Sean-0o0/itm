import React, { Fragment } from 'react';
import IframeContent from '../../../../../components/WorkPlatForm/EsaPage/Common/iframeContent';
import { DecryptBase64 } from '../../../../../components/Common/Encrypt';

/**
 * 级别考核方案定义
 */

class LevelAssessmentDef extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const { match: { params: { versionData = '' } } } = this.props;
    const versionDataJson = JSON.parse(DecryptBase64(versionData)) || {};
    const table = versionDataJson.st === '2' ? 'V_TEXAM_CLASS_PROGRAM_HIS' : 'vTEXAM_CLASS_PROGRAM'
    const livebos = localStorage.getItem('livebos');
    const url = `${livebos}/UIProcessor?Table=${table}&ParamAction=true&VERSION=${versionDataJson.VersionId || versionDataJson.parentVersionId}`;
    return (
      <Fragment>
        <IframeContent url={url} />
      </Fragment>
    );
  }
}
export default LevelAssessmentDef;
