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
  }

  render() {
    const { children, statusBar = [] } = this.props;
    return (
      <div className="display">
        {statusBar && statusBar.length > 0 && (
          <div className={'status'}>
            {statusBar.map((item) => {
              const type = item.split('_')[0];
              return (
                <div className={type}>
                  {type === 'date' ? (
                    <span>
                      {moment().format('dddd')} {moment().format('DD')}{' '}
                      {moment().format('MMMM')}{' '}
                      {moment().format('YYYY')} {/* Format date in Hebrew */}
                    </span>
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
          `}
        </style>
      </div>
    );
  }
}

export default Frame;
