import React from 'react';
import './App.css';
import Amplify from 'aws-amplify';
import Notes from "./components/Notes";
import CreateNote from "./components/CreateNote"

function App() {

  const myAppConfig = {
    'aws_appsync_graphqlEndpoint': 'https://peas4hmpfvh6re4u3tyc27uv44.appsync-api.eu-west-2.amazonaws.com/graphql',
    'aws_appsync_region': 'eu-west-2',
    'aws_appsync_authenticationType': 'API_KEY',
    'aws_appsync_apiKey': "da2-p6ls2ru7erekxd2f2hxr74mmfq",
  };

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
