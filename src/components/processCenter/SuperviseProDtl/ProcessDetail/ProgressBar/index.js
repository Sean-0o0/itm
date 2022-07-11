import React from 'react';
import { Form,message } from 'antd';

class ProcessBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  componentDidMount() {
    
    
  }


  render() {
    const {proProgress = [] } = this.props;
    return (
      
          <div >
          {
              proProgress.map(data => {
                  return (
                    <div className='flex-c' style={{'justifyContent':'center'}}>
                      <div className={data.state === '0'?'incomplete':data.state === '1'?'running':'complete'}>
                          {data.state === '2' ? '' : data.id}
                        </div>
                      <div style={{'paddingTop':'1rem'}}>{data.name}</div>
                      <div  className={data.id === '1' ?'firstLine':data.id === '7' ? '' :'line' }></div>
                    </div>
                  )
              })
          }
          </div>
      
    );
  }
}

export default Form.create()(ProcessBar);
