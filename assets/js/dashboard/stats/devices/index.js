import React from 'react';
import { Link } from 'react-router-dom';

import Browsers from './browsers';
import OperatingSystems from './operating-systems';
import FadeIn from '../../fade-in';
import numberFormatter from '../../number-formatter';
import Bar from '../bar';
import * as api from '../../api';

const EXPLANATION = {
  Mobile: 'up to 576px',
  Tablet: '576px to 992px',
  Laptop: '992px to 1440px',
  Desktop: 'above 1440px',
};

function iconFor(screenSize) {
  if (screenSize === 'Mobile') {
    return (
      <svg
        width="16px"
        height="16px"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather -mt-px"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12" y2="18" />
      </svg>
    );
  }
  if (screenSize === 'Tablet') {
    return (
      <svg
        width="16px"
        height="16px"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather -mt-px"
      >
        <rect
          x="4"
          y="2"
          width="16"
          height="20"
          rx="2"
          ry="2"
          transform="rotate(180 12 12)"
        />
        <line x1="12" y1="18" x2="12" y2="18" />
      </svg>
    );
  }
  if (screenSize === 'Laptop') {
    return (
      <svg
        width="16px"
        height="16px"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather -mt-px"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    );
  }
  if (screenSize === 'Desktop') {
    return (
      <svg
        width="16px"
        height="16px"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather -mt-px"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    );
  }
}

class ScreenSizes extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    this.fetchScreenSizes();
    if (this.props.timer)
      this.props.timer.onTick(this.fetchScreenSizes.bind(this));
  }

  componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      this.setState({ loading: true, sizes: null });
      this.fetchScreenSizes();
    }
  }

  fetchScreenSizes() {
    api
      .get(
        `/api/stats/${encodeURIComponent(this.props.site.domain)}/screen-sizes`,
        this.props.query
      )
      .then((res) => this.setState({ loading: false, sizes: res }));
  }

  renderScreenSize(size) {
    const query = new URLSearchParams(window.location.search);
    query.set('screen', size.name);

    return (
      <div
        className="flex items-center justify-between my-1 text-sm"
        key={size.name}
      >
        <div className="w-full h-8" style={{ maxWidth: 'calc(100% - 6rem)' }}>
          <Bar
            count={size.count}
            all={this.state.sizes}
            bg="bg-green-50 dark:bg-gray-500 dark:bg-opacity-15"
          />
          <span
            tooltip={EXPLANATION[size.name]}
            className="flex px-2 dark:text-gray-300"
            style={{ marginTop: '-26px' }}
          >
            <Link
              className="block truncate hover:underline"
              to={{ search: query.toString() }}
            >
              {iconFor(size.name)} {size.name}
            </Link>
          </span>
        </div>
        <span className="font-medium dark:text-gray-200">
          {numberFormatter(size.count)}{' '}
          <span className="inline-block text-xs w-8 text-right">
            ({size.percentage}%)
          </span>
        </span>
      </div>
    );
  }

  label() {
    return this.props.query.period === 'realtime'
      ? 'Current visitors'
      : 'Visitors';
  }

  renderList() {
    if (this.state.sizes && this.state.sizes.length > 0) {
      return (
        <>
          <div className="flex items-center mt-3 mb-2 justify-between text-gray-500 text-xs font-bold tracking-wide">
            <span>Screen size</span>
            <span>{this.label()}</span>
          </div>
          {this.state.sizes &&
            this.state.sizes.map(this.renderScreenSize.bind(this))}
        </>
      );
    }
    return (
      <div className="text-center mt-44 font-medium text-gray-500 dark:text-gray-400">
        No data yet
      </div>
    );
  }

  render() {
    return (
      <>
        {this.state.loading && (
          <div className="loading mt-44 mx-auto">
            <div></div>
          </div>
        )}
        <FadeIn show={!this.state.loading}>{this.renderList()}</FadeIn>
      </>
    );
  }
}

export default class Devices extends React.Component {
  constructor(props) {
    super(props);
    this.tabKey = `deviceTab__${props.site.domain}`;
    const storedTab = window.localStorage[this.tabKey];
    this.state = {
      mode: storedTab || 'size',
    };
  }

  renderContent() {
    if (this.state.mode === 'size') {
      return (
        <ScreenSizes
          site={this.props.site}
          query={this.props.query}
          timer={this.props.timer}
        />
      );
    }
    if (this.state.mode === 'browser') {
      return (
        <Browsers
          site={this.props.site}
          query={this.props.query}
          timer={this.props.timer}
        />
      );
    }
    if (this.state.mode === 'os') {
      return (
        <OperatingSystems
          site={this.props.site}
          query={this.props.query}
          timer={this.props.timer}
        />
      );
    }
  }

  setMode(mode) {
    return () => {
      window.localStorage[this.tabKey] = mode;
      this.setState({ mode });
    };
  }

  renderPill(name, mode) {
    const isActive = this.state.mode === mode;

    if (isActive) {
      return (
        <li className="inline-block h-5 text-indigo-700 dark:text-indigo-500 font-bold border-b-2 border-indigo-700 dark:border-indigo-500">
          {name}
        </li>
      );
    }
    return (
      <li
        className="hover:text-indigo-600 cursor-pointer"
        onClick={this.setMode(mode)}
      >
        {name}
      </li>
    );
  }

  render() {
    return (
      <div className="stats-item">
        <div
          className="bg-white dark:bg-gray-825 shadow-xl rounded p-4 relative"
          style={{ height: '436px' }}
        >
          <div className="w-full flex justify-between">
            <h3 className="font-bold dark:text-gray-100">Devices</h3>

            <ul className="flex font-medium text-xs text-gray-500 dark:text-gray-400 space-x-2">
              {this.renderPill('Size', 'size')}
              {this.renderPill('Browser', 'browser')}
              {this.renderPill('OS', 'os')}
            </ul>
          </div>

          {this.renderContent()}
        </div>
      </div>
    );
  }
}
