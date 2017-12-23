import React, { Component } from 'react'


import Header from './components/header.js'
import Container from './components/container.js'

import './App.css';
import './style/header.css'
import './style/container.css'
import './style/comments.css'
import './style/player.css'
import './style/logindialog.css'
import './style/logoutdialog.css'

class App extends Component {
  render() {
    return (
      	<div className="App">
        	<Header />
        	<Container />
      	</div>
    );
  }
}

export default App;
