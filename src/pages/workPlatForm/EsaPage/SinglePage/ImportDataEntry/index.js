/**
 * 新增供livebos直接打开分管领导考评
 */
import React, { Fragment } from 'react';
import { Spin, Form, Button, message } from 'antd';
import PdfFiles from '../../../../../components/WorkPlatForm/EsaPage/SinglePage/ImportDataEntry/pdfFiles';
import { FetchoperateDataImport, FetchqueryTmplDetail } from '../../../../../services/EsaServices/assessmentEvaluation';
class ImportDataEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            tmpDetail: '',
        };
    }

    componentWillMount() {
        const { match: { params: { tmplNo = '' } } } = this.props;
        FetchqueryTmplDetail({tmplNo}).then((response) => {
            const { code = 0, records = '' } = response;
            if (code > 0) { 
                this.setState({ tmpDetail: records[0] });
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
        });
    }

    handleSubmit = () => {
        const { match: { params: { tmplNo = '' } } } = this.props;
        const fjInfo = this.pdfFiles.funToReturnList()[0];
        const excelData = this.pdfFiles.funToReturnList()[1];
        if (fjInfo !== '') {
            this.setState({ loading: true }, () => {
                const params = {
                    oprType: '1',
                    tmplNo,
                    data: excelData,
                    dataExcel: fjInfo.md5
                }
                FetchoperateDataImport(params).then((response) => {
                    const { code = 0, note = '' } = response;
                    if (code > 0) { 
                        message.success(note);
                        this.setState({ loading: false });
                        const { onSubmitOperate } = this.props;
                        if (onSubmitOperate) {
                            onSubmitOperate();
                        }
                    }
                }).catch((error) => {
                    message.error(!error.success ? error.message : error.note);
                    this.setState({ loading: false });
                });
            });
        } else {
            message.warn("请上传文件！");
            return;
        }

    }

    cancle = () => {
        const { onCancelOperate } = this.props;
        if (onCancelOperate) {
            onCancelOperate();
        }
    }

    render() {
        const { loading, tmpDetail: { prdVal = '', tmplName= '' } } = this.state;
        return (
            <Fragment>
                <Spin tip="Loading..." spinning={loading} style={{ width: '100%', marginTop: '100px' }}>
                    <Form className="sjdr-form" style={{ overflowX: 'hidden', width: '100%', margin: '0', padding: '20px', backgroundColor: '#fff' }}>
                        <Form.Item label={(<span>数据时间</span>)}>
                            {prdVal}
                        </Form.Item>
                        <Form.Item label={(<span>模板名称</span>)}>
                            {tmplName}
                        </Form.Item>
                        <Form.Item label={(<span>导入文件</span>)}>
                            <PdfFiles ref={(c) => { this.pdfFiles = c; }} />
                        </Form.Item>
                        <Form.Item>
                            <div className='tc'>
                                <Button className='m-btn-radius m-btn-headColor' onClick={() => this.handleSubmit()} >确定</Button>
                                <Button style={{ marginLeft: '0.6rem' }} className='m-btn-radius m-btn-pink' onClick={() => this.cancle()} >取消</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Spin>
            </Fragment>
        );
    }
}

export default ImportDataEntry;
