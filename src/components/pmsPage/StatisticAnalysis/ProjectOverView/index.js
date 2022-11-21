import React from 'react'
import ProjectProfileTab from './ProjectProfileTab';

export default function ProjectOverView() {
  const getContrastItem = (iconName) => {
    return (
      <div className='contrast-item'>
        <div className='contrast-item-left'>
          <i className={'iconfont icon-'+ iconName} style={{ fontSize: '24px' }}></i>
        </div>
        <div className='contrast-item-right'>
          <div className='contrast-item-txt'>资本性预算</div>
          <div className='contrast-item-data'>
            <div className='data-txt'>
              <span className='data-txt-num'>80000</span>
              万
            </div>
            <div className='data-contrast'>较去年:
              {/*绿色 #46CB9F */}
              <span className='data-contrast-num' style={{ color: '#F06270' }}>+200
                <i className='iconfont icon-rise' style={{ fontSize: '2px' }}></i>
              </span>
            </div>
          </div>
        </div>

      </div>
    );
  };
  return (
    <div className='project-overview-box'>
      <div className='overview-top-box'>
        <ProjectProfileTab/>
        <div className='top-right-box'></div>
      </div>
      <div className='overview-bottom-box'>
        <div className='overview-bottom-title'>预算总体情况</div>
        <div className='overview-bottom-contrast-box'>
          {getContrastItem('finance')}
          {getContrastItem('cash')}         
          {getContrastItem('assets')}
        </div>
      </div>
    </div>
  )
}
