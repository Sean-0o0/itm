import React from 'react';

class DateBox extends React.Component {
    state = {
        nowDate: new Date(),
        week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    };

    componentDidMount() {

        this.interval = setInterval(() => {
            this.setState(
                {
                    nowDate: new Date(),
                },
                () => {
                    this.setDate();
                },
            );
        }, 1000);
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }

    }

    setDate = () => {
        const { nowDate, week } = this.state;
        let min = nowDate.getMinutes();
        if (min.toString().length === 1) {
            min = '0' + min.toString();
        }
        let dataList = [nowDate.getFullYear(), nowDate.getMonth() + 1, nowDate.getDate()];
        let time = nowDate.getHours() + ':' + min;
        this.setState({
            date: dataList.join('-'),
            chaWeek: week[nowDate.getDay()],
            time,
        });
    };

    render() {
        const { date = '', chaWeek = '', time = '' } = this.state;

        return (
            <div className="head-right">
                <p>{date}&nbsp;{chaWeek}</p>
                <p>{time}</p>
            </div>
        );
    }
}

export default DateBox;
