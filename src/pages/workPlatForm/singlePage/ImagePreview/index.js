import React from 'react';

const guidePicture = '/fonturl/picture/index-zcyd.png';

export default function ImagePreview() {
  return (
    <div
      className="img-box"
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: 'black',
        textAlign: 'center',
        overflow: 'hidden',
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <img src={guidePicture} alt="招采引导图片" style={{ height: '660%', width: '66%' }} />
    </div>
  );
}
