import React from 'react';
import { Divider, Tooltip, Icon } from 'antd';


class IndustryDynamicNews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      extend: true,
    };
  }

  componentDidMount() {
  }

  getComments = (notcId) => {
    // console.log("点击的哪条？",notcId)
    const {handleComments} = this.props;
    handleComments(notcId);
  }

  render() {
    const { data,id=''} = this.props;
    const { extend = true,} = this.state;
    const livebosPrefix=localStorage.getItem('livebos')
    let url = livebosPrefix+'/UIProcessor?ViewMode=UIMODE.NEWSBOARD.RECORD&&Table=TASSESS_Industry_news&ID='
    return (
      id === data.notcId ?(<div style={{ padding: '1rem 2rem 0 2rem', width: '100%',backgroundColor:'rgba(84, 169, 223, 0.1)'}} onClick={e=>this.getComments(data.notcId)}>
      <div style={{ display: 'flex', width: '100%', padding: '0 2rem 0 0', }}>
        <div style={{ width: '65%' }}><Tooltip title={data.title}><a href={url+data.notcId}  target='_blank' rel = 'noreferrer' style={{ fontSize: '1.43rem', fontWeight: 500, color: '#54A9DF', lineHeight: '2.05rem', width: '65%' }}>{data.title.length > 15 ? data.title.slice(0, 15) + '...' : data.title}</a></Tooltip></div>
        <div style={{ fontSize: '1.43rem', fontWeight: 400, color: '#999999', lineHeight: '2.05rem', width: '13%' }}>{data.publisher}</div>
        <div style={{ fontSize: '1.43rem', fontWeight: 400, color: '#999999', lineHeight: '2.05rem', width: '22%', textAlign: 'end' }}>{data.pubTime}</div>
      </div>
      <div style={{ fontSize: '1.43rem', fontWeight: 400, color: '#333333', lineHeight: '2.05rem', padding: '1rem 0 0 0', }}>{data.content.length > 100 && extend ? data.content.slice(0, 100) + '...' : data.content}</div>
      <div style={{ fontSize: '1.43rem', fontWeight: 400, color: '#54A9DF', lineHeight: '2.05rem', padding: '0.5rem 0 0 0', textAlign: 'end', marginRight: '0.5rem', }} onClick={() => {
        this.setState({
          extend: !extend,
        })
      }}>{data.content.length > 50 ? (extend ? '展开' : '收起') : ''}{data.content.length > 100 ? <Icon style={{ margin: '0 0.5rem' }} type={extend ? 'down' : 'up'} /> : ''}</div>
      <div style={{ fontSize: '1.43rem', fontWeight: 400, color: '#54A9DF', lineHeight: '2.05rem', padding: '0.5rem 0 1rem 0', }}>{data.attachment !== "" ? <Icon style={{ margin: '0 0.5rem' }} type="link" /> : ''}<a style={{ color: '#54A9DF' }} href={`${localStorage.getItem('livebos') || ''}/OperateProcessor?Column=Attachment&PopupWin=false&Table=TASSESS_Industry_news&operate=Download&Type=View&ID=${data.notcId}`}>{data.attachment}</a></div>
      <Divider style={{ margin: '0' }} />
    </div>):(
      <div style={{ padding: '1rem 2rem 0 2rem', width: '100%',backgroundColor:''}} onClick={e=>this.getComments(data.notcId)}>
        <div style={{ display: 'flex', width: '100%', padding: '0 2rem 0 0', }}>
          <div style={{ fontSize: '1.43rem', fontWeight: 500, color: '#54A9DF', lineHeight: '2.05rem', width: '65%' }}><Tooltip title={data.title}>{data.title.length > 15 ? data.title.slice(0, 15) + '...' : data.title}</Tooltip></div>
          <div style={{ fontSize: '1.43rem', fontWeight: 400, color: '#999999', lineHeight: '2.05rem', width: '13%' }}>{data.publisher}</div>
          <div style={{ fontSize: '1.43rem', fontWeight: 400, color: '#999999', lineHeight: '2.05rem', width: '22%', textAlign: 'end' }}>{data.pubTime}</div>
        </div>
        <div style={{ fontSize: '1.43rem', fontWeight: 400, color: '#333333', lineHeight: '2.05rem', padding: '1rem 0 0 0', }}>{data.content.length > 100 && extend ? data.content.slice(0, 100) + '...' : data.content}</div>
        <div style={{ fontSize: '1.43rem', fontWeight: 400, color: '#54A9DF', lineHeight: '2.05rem', padding: '0.5rem 0 0 0', textAlign: 'end', marginRight: '0.5rem', }} onClick={() => {
          this.setState({
            extend: !extend,
          })
        }}>{data.content.length > 50 ? (extend ? '展开' : '收起') : ''}{data.content.length > 100 ? <Icon style={{ margin: '0 0.5rem' }} type={extend ? 'down' : 'up'} /> : ''}</div>
        <div style={{ fontSize: '1.43rem', fontWeight: 400, color: '#54A9DF', lineHeight: '2.05rem', padding: '0.5rem 0 1rem 0', }}>{data.attachment !== "" ? <Icon style={{ margin: '0 0.5rem' }} type="link" /> : ''}<a style={{ color: '#54A9DF' }} href={`${localStorage.getItem('livebos') || ''}/OperateProcessor?Column=Attachment&PopupWin=false&Table=TASSESS_Industry_news&operate=Download&Type=View&ID=${data.notcId}`}>{data.attachment}</a></div>
        <Divider style={{ margin: '0' }} />
      </div>)
    );
  }
}

export default IndustryDynamicNews;
