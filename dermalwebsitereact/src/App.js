import React, {useState,useEffect} from 'react';
import axios from 'axios';
import './App.css';
import DERMALForm from './components/DERMALForm';

//create the homepage
function App() {

  return (
    <div className="App">
      <h1>DERMAL</h1>
        
      <DERMALForm />
           
    </div>
  );
}

export default App;
