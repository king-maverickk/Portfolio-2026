import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import SiteHeader from './components/SiteHeader';
import AOS from 'aos';
import { isMobile } from 'react-device-detect';

import 'aos/dist/aos.css';
import './fonts.css';

// The Lab (and GSAP, which only it uses) loads when someone opens /lab, so the
// home page doesn't download it.
const Lab = lazy(() => import('./components/Lab'));
const Projects = lazy(() => import('./components/Projects'));

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
      {/* On every page: the mark, the two corner buttons and the menu. */}
      <SiteHeader />
      <Suspense fallback={null}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/lab" component={Lab} />
          <Route exact path="/projects/:id?" component={Projects} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
