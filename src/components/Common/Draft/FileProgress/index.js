import React from 'react';
import { Progress } from 'antd';

const FileProgress = (props) => {
  const { file, fileList = [], deleFile } = props;
  const { uid = -1, status = '', percent = 0 } = file || {};
  return (
    <div className="ant-upload-list ant-upload-list-text">
      {
        fileList.map((tempFile) => {
            const { status: tempStatus = '', uid: tempUid = '', name, response: tempResponse = {} } = tempFile;
            const { data = {} } = tempResponse;
            const { md5 = '' } = data || {};
            if (tempUid !== uid || parseInt(percent, 10) === 100 || status !== 'uploading') {
                if (tempStatus === 'error' || md5 === '') {
                    return (
                      <div key={tempUid} className="ant-upload-list-item ant-upload-list-item-error">
                        <div className="ant-upload-list-item-info">
                          <span>
                            <i className="anticon anticon-paper-clip" />
                            <span className="ant-upload-list-item-name" title={name}>{name}</span>
                          </span>
                        </div><i title="删除文件" onClick={() => deleFile(tempUid, '')} className="anticon anticon-cross" />
                      </div>
                    );
                } else if (tempStatus === 'done') {
                    return (
                      <div key={tempUid} className="ant-upload-list-item ant-upload-list-item-done">
                        <div className="ant-upload-list-item-info">
                          <span>
                            <i className="anticon anticon-paper-clip" />
                            <span className="ant-upload-list-item-name" title={name}>{name}</span>
                          </span>
                        </div><i title="删除文件" onClick={() => deleFile(tempUid, md5)} className="anticon anticon-cross" />
                      </div>
                      );
                }
            } else if (status === 'uploading') {
                return (
                  <div key={tempUid} className="ant-upload-list-item ant-upload-list-item-uploading" style={{ height: 'auto' }}>
                    <div className="ant-upload-list-item-info">
                      <span><i className="anticon anticon-spin anticon-loading" /><span className="ant-upload-list-item-name" title={name}>{name}</span></span>
                    </div><i title="删除文件" onClick={() => deleFile(tempUid, md5)} className="anticon anticon-cross" />
                    {/* <div className="ant-upload-list-item-progress"> */}
                    {/* <div className="ant-progress ant-progress-line ant-progress-status-normal ant-progress-default">
                        <div>
                          <div className="ant-progress-outer">
                            <div className="ant-progress-inner">
                              <div className="ant-progress-bg" style={{ width: `${percent}%`, height: '2px', borderRadius: '100px', backgroundColor: '#1890ff' }} />
                            </div>
                          </div>
                        </div>
                      </div> */}
                    {/* </div> */}
                    <Progress percent={percent} size="small" strokeWidth={5} showInfo={false} />
                  </div>
                  );
            }
            return ' ';
        })
    }
    </div>
  );
};

export default FileProgress;
