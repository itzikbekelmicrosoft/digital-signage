/**
 * @fileoverview DisplayFrame component which renders the date, time and layout
 * for the added widgets
 */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import 'moment/locale/he'; // Import Hebrew locale for moment.js

class Frame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: moment().format('LT'), // Initial time
      date: moment().format('dddd DD MMMM YYYY') // Initial date
    };
  }

  componentDidMount() {
    // Update time every second
    this.timeTimerID = setInterval(() => this.tickTime(), 1000);

    // Update date every day at midnight
    this.dateTimerID = setInterval(() => this.tickDate(), 86400000); // 86400000 milliseconds = 1 day

    // Clear timers every 6 hours
    this.clearTimersID = setInterval(() => this.clearTimers(), 21600000); // 21600000 milliseconds = 6 hours
  }

  componentWillUnmount() {
    clearInterval(this.timeTimerID); // Clear time timer to prevent memory leaks
    clearInterval(this.dateTimerID); // Clear date timer to prevent memory leaks
    clearInterval(this.clearTimersID); // Clear the timer for clearing timers
  }

  tickTime() {
    this.setState({
      time: moment().format('LT')
    });
  }

  tickDate() {
    this.setState({
      date: moment().format('dddd DD MMMM YYYY')
    });
  }

  clearTimers() {
    clearInterval(this.timeTimerID);
    clearInterval(this.dateTimerID);
    clearInterval(this.clearTimersID);
  }

  render() {
    const { children, statusBar = [] } = this.props;
    const { time, date } = this.state;
    return (
      <div className="display">
        {statusBar && statusBar.length > 0 && (
          <div className={'status'}>
            {statusBar.map((item) => {
              const type = item.split('_')[0];
              return (
                <div className={type}>
                  {type === 'date' ? (
                    <span>{date}</span>
                  ) : type === 'connection' ? (
                    <FontAwesomeIcon className={'wifi'} icon={faWifi} />
                  ) : type === 'time' ? (
                    <span>{moment().format('LT')}</span> // Format time in Hebrew
                  ) : (
                    ' '
                  )}
                </div>
              );
            })}
          </div>
        )}
        {children}
        <style jsx>
          {`
            .display {
              display: flex;
              flex-direction: column;
              width: 100%;
              height: 100%;
              background: black;
              font-family: Open Sans, sans-serif;
              color: white;
            }
            .status {
              padding: 30px;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: center;
            }
            .status .spacer {
              display: flex;
              flex: 1;
            }
            .status *:not(:first-child):not(:last-child) {
              margin-right: 8px;
              margin-left: 8px;
            }
            .status .connection {
              color: #baff23;
            }
            .digital-time {
              font-size: 24px;
              font-weight: bold;
              font-family: 'Digital', sans-serif;
            }
          `}
        </style>
      </div>
    );
  }
}

export default Frame;
