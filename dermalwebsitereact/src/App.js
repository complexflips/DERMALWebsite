import React, {useState,useEffect} from 'react';
import axios from 'axios';
import './App.css';
import DERMALForm from './components/DERMALForm';
import DisplayTasks from './DisplayTasks';

function App() {
    const [tasks,setTasks]=useState([]);


  return (
    <div className="App">
      <h1>DERMAL</h1>
        
      <DERMALForm />
           
    </div>
  );
}

export default App;
