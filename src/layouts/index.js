import LoginPageLayout from './login';
import MainPageLayout from './workPlatForm/PageLayout/index';
import SinglePageLayout from './single/PageLayout/index';
import IconFontLayouts from './iconFont/index';
import TestPageLayout from './test/PageLayout/index';
import TestPaper from '../components/WorkPlatForm/TestPaper/index';

function BasicLayout(props) {
  const { location: { pathname = '' } } = props;
  if (pathname.startsWith('/login')) {
    return (
      <div style={{ height: '100%' }}>
        <LoginPageLayout {...props} />
      </div>
    );
  } else if (pathname.startsWith('/single')) {
    return (
      <div style={{ height: '100%' }}>
        <SinglePageLayout {...props} />
      </div>
    );
  } else if (pathname.startsWith('/iconFont')) {
    return (
      <div style={{ height: '100%' }}>
        <IconFontLayouts {...props} />
      </div>
    );
  } else if (pathname.startsWith('/testPage')) {
    return (
      <div style={{ height: '100%' }}>
        <TestPageLayout {...props} />
      </div>
    );
  } else if (pathname.startsWith('/testPaper')) {
    return (
      <div style={{ height: '100%' }}>
        <TestPaper {...props} />
      </div>
    );
  }else {
    return (
      <div style={{ height: 'auto' }}>
        <MainPageLayout {...props} />
      </div>
    );
  }
}

export default BasicLayout;
