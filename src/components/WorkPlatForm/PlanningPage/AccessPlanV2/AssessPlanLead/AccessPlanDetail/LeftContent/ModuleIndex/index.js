import React from 'react';
import nodata from '../../../../../../../../assets/no-data.png';
import RichTextEditor from './RichTextEditor'
class ModuleIndex extends React.Component {
    state = {
    };

    render() {
        const { data } = this.props;

        return (
            <React.Fragment>
                {data.NOTE ?
                    <RichTextEditor className="w-e-menu w-e-text-container w-e-toolbar"
                        data={[data]} sort={data.SNO}
                        name={data.MODULAR_NAME}
                        id={data.MODULAR_ID} /> :
                    <div style={{ position: 'relative', minHeight: '55rem' }}>
                        <div style={{ position: 'absolute', top: 'calc(50% - 120px)', left: 'calc(50% - 120px)' }}>
                            <img src={nodata} alt="" width="240" /><div style={{ textAlign: 'center', color: '#b0b0b0', fontSize: '1.5rem', marginTop: '1.5rem' }}> 暂无可展示内容!</div>
                        </div>
                    </div>
                }
                {/* {html ?
                    <div className="fma-CombinationStrategy-content" dangerouslySetInnerHTML={{ __html: DecryptBase64(html) || '' }}></div> :
                    <div style={{ position: 'relative', minHeight: '55rem' }}>
                        <div style={{ position: 'absolute', top: 'calc(50% - 120px)', left: 'calc(50% - 120px)' }}>
                            <img src={nodata} alt="" width="240" /><div style={{ textAlign: 'center', color: '#b0b0b0', fontSize: '1.5rem', marginTop: '1.5rem' }}> 暂无可展示内容!</div>
                        </div>
                    </div>

                } */}
            </React.Fragment >
        );
    }
}
export default ModuleIndex;
