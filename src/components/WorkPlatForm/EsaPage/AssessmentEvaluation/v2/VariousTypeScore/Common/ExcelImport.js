import React, { Fragment } from 'react';
import { Button, Upload, message } from 'antd';
import config from '../../../../../../../utils/config';

/**
 * excel表格导入按钮
 */

const { api } = config;
const { esa: { examScoreDataImport } } = api;

class ExcelImport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {

  }
  handleExcelImport = (info) => {
    const { onChange, dataRecords } = this.props;
    if (info.file.status === 'done') {
      const { response: { code = 0, fj = '[]', note } } = info.file;
      if (code > 0) {
        const fjarr = JSON.parse(fj);
        if (fjarr.length > 0) {
          for (let i = 0; i < fjarr.length; i++) {
            if (isNaN(dataRecords[fjarr[i].number - 1].itmWt)) {
              if (Number(fjarr[i].examScore) < 0 || Number(fjarr[i].examScore) > 10) {
                message.error("加分项的评分在0到10之间，请重新上传!");
                return;
              }
            } else { 
              if (Number(fjarr[i].examScore) < 70 || Number(fjarr[i].examScore) > 120) {
                message.error("评分在70到120之间，请重新上传!");
                return;
              }
            }
          }
        }
        message.success(note);
        onChange(fj);
      } else {
        message.error(note);
      }
    }
  }

  render() {
    const { className, btnClassName, headName, headField, datalength, disabled, style = {} } = this.props;
    const uploadProps = {
      name: 'file',
      accept: '.xls,.xlsx',
      className,
      action: examScoreDataImport,
      showUploadList: false,
      data: {
        headName,
        headField,
        datalength,
      },
      onChange: this.handleExcelImport,
    };
    return (
      <Fragment>
        <Upload {...uploadProps}>
          <div style={{ display: 'inline' }}>
            <Button disabled={disabled} className={`fcbtn m-btn-border m-btn-border-headColor btn-1c ${btnClassName}`} style={style}>导入</Button>
          </div>
        </Upload>
      </Fragment>
    );
  }
}
export default ExcelImport;
