/**
 * @fileoverview Slideshow component that given an array of slide descriptions
 * of mixed types, renders the slides and automatically plays the slideshow for
 * the given durations
 */
import React, { Component } from 'react';

class WeatherContent extends Component {
  componentDidMount() {
    // Load the widget script initially
    this.loadWidgetScript();

    // Reload the widget script every 3 hours (in milliseconds)
    this.interval = setInterval(this.loadWidgetScript, 3 * 60 * 60 * 1000);
  }

  componentWillUnmount() {
    // Clear the interval when the component unmounts to prevent memory leaks
    clearInterval(this.interval);
  }

  loadWidgetScript = () => {
    const script = document.createElement("script");
    script.src = "https://weatherwidget.io/js/widget.min.js";
    script.async = true;

    // Remove any existing script tags with the same source to avoid duplicates
    const existingScript = document.querySelector(`script[src="${script.src}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    document.head.appendChild(script);
  };

  render() {
    return (
      <div className="weather">
        <a
          className="weatherwidget-io"
          href="https://forecast7.com/he/31d9734d79/rishon-letsiyon/"
          data-label_1="ראשון לציון"
          data-label_2="מזג אוויר"
          data-theme="original"
        >
          RISHON LETSIYON WEATHER
        </a>
      </div>
    );
  }
}

export default WeatherContent;
