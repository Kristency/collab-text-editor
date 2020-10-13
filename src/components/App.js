import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';
import Editor from './Editor';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/editor" exact>
          <Editor />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
