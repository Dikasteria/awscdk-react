import React from 'react';
import './App.css';
import Amplify from 'aws-amplify';
import Notes from "./components/Notes";
import CreateNote from "./components/CreateNote"
import {myAppConfig} from "./aws-exports";

function App() {

  Amplify.configure(myAppConfig);

  return (
    <div style={{marginLeft: "2vw"}}>
      <h1>NOTES</h1>
      <Notes />
      <CreateNote />
    </div>
  );
}

export default App;
