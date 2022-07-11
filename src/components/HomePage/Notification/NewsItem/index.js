import React from 'react';
class NewsItem extends React.Component {

    render() {
        const { userNotice = {} } = this.props;
        const livebosPrefix = localStorage.getItem('livebos')
        let url = livebosPrefix + '/UIProcessor?ViewMode=UIMODE.NEWSBOARD.RECORD&&Table=vtBlog&ID='
        if (userNotice.notcid) {
            url = url + userNotice.notcid;
        }

        return (
            <div className="flex1 flex-r report-top m-container-left">
                <div className="flex1" style={{ marginRight: '2rem' }}>
                    <div className='m-container-dot' style={{ left: '2.1rem' }}></div>
                    <a href={url} target="_blank">
                        <div target='_blank' rel='noreferrer' style={{
                            fontSize: '1.867rem',
                            color: '#333333',
                            wordBreak: 'break-all',
                            lineHeight: '1.2'
                        }}>
                            {userNotice.title ? userNotice.title : ''}
                        </div>
                    </a>
                </div>
                <div style={{
                    fontSize: '1.633rem',
                    color: '#999999',
                    lineHeight: '2.5rem', wordBreak: 'break-all', paddingRight: '3rem'
                }}>
                    {userNotice.pubtime ? userNotice.pubtime : ''}
                </div>
            </div>
        );
    }
}
export default NewsItem;
