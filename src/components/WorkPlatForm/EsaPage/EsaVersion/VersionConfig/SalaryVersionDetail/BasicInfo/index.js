import React, { Fragment } from 'react';
import { Row, Col, Card, Input, message, Upload, Icon, Button } from 'antd';
import { connect } from 'dva';
import versionPng from '../../../../../../../assets/esa/version.png';
import { DecryptBase64 } from '../../../../../../../components/Common/Encrypt';
import { FetchoperateSalaryVersion, FetchquerySalaryVersionDetail } from '../../../../../../../services/EsaServices/esaVersion';
import config from '../../../../../../../utils/config';

/**
 * 基本信息
 */
const { api } = config;
const { esa: {
  // downloadRedisFile,
  docsUpload } } = api;
class BasicInfo extends React.Component {
  constructor(props) {
    // const { userBasicInfo: { orgid = '', orgname = '' } } = props;
    const { salaryVersionDetail: { versionData = '' } } = props;
    const versionDataJson = JSON.parse(DecryptBase64(versionData));
    const { parentVersionId = '', VersionId = '' } = versionDataJson;
    super(props);
    this.state = {
      fileList: [],
      editBtnShow: '',
      versionData: '',
      parentVersionId,
      VersionId,
      remk: '',
    };
  }


  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const { parentVersionId = '', VersionId = '' } = this.state;
    FetchquerySalaryVersionDetail({ parentVersionId, versionId: VersionId }).then((res) => {
      const { records = [] } = res;
      const { ruleDoc = '' } = records[0];
      let docArr = [];
      let fileList = [];
      if (ruleDoc) {
        docArr = ruleDoc.split('|');
        if (docArr.length === 2) {
          const livebos = localStorage.getItem('livebos');
          fileList.push({
            uid: '-1',
            name: docArr[1],
            status: 'done',
            url: `${livebos}${docArr[0]}`,
            linkProps: `{"download": "${livebos}${docArr[0]}","target" : "_self"}`, // 下载链接额外的 HTML 属性

          })
        }
      }
      this.setState({
        remk: records[0].remk,
        versionData: records[0],
        fileList,
      })
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });

  }
  editRemkFocus = () => {
    this.setState({ editBtnShow: 'none' }, () => { document.getElementById("remkInput").focus(); });
  }
  editRemkBlur = (e) => {
    const { remk, parentVersionId = '', VersionId = '' } = this.state;
    if (e.target.value.trim()) {
      this.setState({ editBtnShow: '' });
    } else {
      this.setState({ editBtnShow: '', remk: '' });
    }
    this.operateSalaryVersion({ oprType: 2, remk, parentVersionId, versionId: VersionId })
  }
  editRemkChange = (e) => {
    this.setState({ remk: e.target.value.trim() });
  }
  operateSalaryVersion = (params) => {
    FetchoperateSalaryVersion(params).then((res) => {
      const { note, code } = res;
      if (code > 0) {
        this.initData();
      } else {
        message.error(note);
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  // 图片上传到临时文件夹后回调
  handleImageUpload = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    fileList = fileList.map(file => {
      if (file.response) {
        const { data, note, code } = file.response;
        if (code > 0) {
          const { parentVersionId = '', VersionId = '' } = this.state;
          // file.url = `${downloadRedisFile}/${data.md5}`;
          // file.uid = data.md5;     // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
          // file.name = data.name;  // 文件名
          // file.status = 'done';// 状态有：uploading done error removed
          // file.linkProps = `{"download": "${downloadRedisFile}/${data.md5}","target":"_self"}`; // 下载链接额外的 HTML 属性
          this.operateSalaryVersion({ oprType: 2, ruleDoc: data.md5, parentVersionId, versionId: VersionId })
        } else {
          message.error(note);
        }
      }
      return file;
    });
    this.setState({ fileList });
  }
  render() {
    const { remk, editBtnShow, versionData = {}, fileList } = this.state;
    const props = {
      action: docsUpload,
      onChange: this.handleImageUpload,
      name: "file",
      fileList,
    };
    return (
      <Fragment>
        <div style={{ height: '100%', overflow: 'hidden' }}>
          <Row className="m-row" style={{ height: '100%' }}>
            <Col xs={24} sm={24} lg={24} xl={24} style={{ height: '100%' }}>
              <Card style={{ height: '100%', overflow: 'hidden auto' }} className="m-card" title="薪酬版本详情" headStyle={{ fontWeight: 'bold' }}>
                <Row className="m-row" style={{ height: '100%' }}>
                  <Col span={2} style={{ height: '100%' }} className="mt10 tc ml10">
                    <img alt="" src={versionPng} />
                  </Col>
                  <Col span={20} style={{ height: '100%' }} className="mt10">
                    <div className="esa-version-sbj-title">{versionData.versionName || '--'}版本</div>
                    <div className="esa-version-subcont-detail">制度文档：
                    <Upload {...props} className="wid25">
                        <Button>
                          <Icon type="upload" /> 点击上传附件
                      </Button>
                      </Upload>
                    </div>
                    <div className="esa-version-subcont-detail">&nbsp;&nbsp;&nbsp;创建人：<span className="m-color">{versionData.crtrName || '--'}</span></div>
                    <div className="esa-version-subcont-detail">创建日期：<span>{versionData.crtrDt || '--'}</span></div>
                    {/* <div className="esa-version-subcont-detail">发布日期：<span>{versionData.crtrDt || '--'}</span></div> */}
                    <div className="esa-version-subcont-detail">上架日期：<span>{versionData.upDt || '--'}</span></div>
                    <div className="esa-version-subcont-detail">下架日期：<span>{versionData.DownDt || '--'}</span></div>
                    <div className="esa-version-subcont-detail">特别说明：
                    <div className="m-overall-info" style={{ padding: '0' }}>
                        <input type="text" value={remk} placeholder="" disabled style={{ display: editBtnShow, fontSize: '14px' }} className="esa-version-overflow" title={remk} /><i className="iconfont icon-modifyList m-color" onClick={this.editRemkFocus} style={{ display: editBtnShow }} />
                        <Input id="remkInput" value={remk} style={{ display: editBtnShow === '' ? 'none' : '', width: '15rem' }} onChange={this.editRemkChange} onBlur={this.editRemkBlur} placeholder="请输入特别说明" autoFocus />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </Fragment >
    );
  }
}
export default connect(({ salaryVersionDetail }) => ({
  salaryVersionDetail,
}))(BasicInfo);
