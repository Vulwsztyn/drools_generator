import React, { Component } from "react";
import "./App.css";
import Tree from "./components/tree";
import { DEFAULT_NODES } from "./constants";

class App extends Component {

    render() {      
    return (
      <Tree data={DEFAULT_NODES}/>
    );
  }
}

export default App;
