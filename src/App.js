import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import AOS from 'aos';
import { isMobile } from 'react-device-detect';

import 'aos/dist/aos.css';
import './fonts.css';

function App() {
  useEffect(() => {
    setTimeout(() => {
      AOS.init({
        offset: isMobile ? 10 : 100,
      });
      AOS.refresh();
    }, 1500);
  }, []);

  return (
    <Router basename={process.env.BASE_PATH}>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
