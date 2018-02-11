// @ts-check

import React from 'react';
import { Link } from '@poa/router';

class RootPage extends React.Component {
  render() {
    return (
      <React.Fragment>
        Hello world! <Link to="new-route"> Another route</Link>
      </React.Fragment>
    );
  }
}

export default RootPage;
