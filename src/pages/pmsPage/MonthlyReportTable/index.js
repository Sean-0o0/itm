import React, {Fragment} from 'react';
import { connect } from 'dva';
import MonthlyReportTableTab from '../../../components/pmsPage/MonthlyReportTable/index';
const MonthlyReportTable = () => {
    return (
        <Fragment>
            <MonthlyReportTableTab></MonthlyReportTableTab>
        </Fragment>
    );
};
export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(MonthlyReportTable);
