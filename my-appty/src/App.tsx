import React from 'react';
import logo from './logo.svg';
import './App.css';
import Greeting from './Components/Greeting';
import Counter from './Components/Counter';
import Form from './Components/Form';
function App() {
  return (
   <div className="App">
    <Greeting name="Jhon" age={30} />
    <Counter/>
    <Form/>
   </div>
  );
}

export default App;
