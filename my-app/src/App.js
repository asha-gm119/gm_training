// import logo from './logo.svg';
// import './App.css';
// import Welcome from './components/Welcome';
// import AuthPage from './components/AuthPage';
// // import Test from './components/Test';
// // import Controlled from './components/Controlled';
// // import Form from './components/Form';
// import { Routes, Route} from 'react-router-dom';
// import Mynewhook from './components/Mynewhook';
// import Random from './components/Random';
// //import Home from './components/Home';
// import Curd from './components/Curd';
// import TodoApp from './components/RESTAPI/TodoApp';
// import Comp3 from './components/comp3';
// import Comp1 from './components/comp1';
// import { ThemeProvider,useTheme } from './Context/ThemeContext';

// const themedApp=()=>{
//   const ToggleTheme=()=>{
//     const {theme, toggleTheme}=useTheme()
//   };
//  return (
//     <div>
//       <h2>the current theme is: {theme}</h2>
//       <button onClick={toggleTheme}>Toggle Theme</button>
//     </div>
//  )}
// function App() {

//   <ThemeProvider>
//       <themedApp />
//     </ThemeProvider>
  
//   return (
    
//     <div>
     
//     {/* <Welcome /> */}
//     {/* <AuthPage /> */}
//     {/* <Test />
//     <Controlled />
//     <Form /> */}
//     {/* <Routes>
//       <Route path="/" element={<Welcome/>}/>
//       <Route path='/welcome' element={<AuthPage/>}/>
//     </Routes> */}
//     {/* <Mynewhook /> */}
//     {/* <Random /> */}
//     {/* <Home /> */}
//     {/* <Curd /> */}
//     {/* <TodoApp /> */}
//       {/* <Comp1/> */}

//     </div>
//   );
// }

// export default App;


// import './App.css';
// import { ThemeProvider, useTheme } from './Context/ThemeContext';
// import CounterContext from './Context/CounterContext';

// function ThemedApp() {
//   const { theme, toggleTheme } = useTheme();

//   return (
//     <div>
//       <h2>The current theme is: {theme}</h2>
//       <button onClick={toggleTheme}>Toggle Theme</button>
//     </div>
//   );
// }

// function App() {
//   return (
//     <ThemeProvider>
//       <div>
//         <ThemedApp />
//         {/* Uncomment or add other components/routes as needed */}
//       </div>
//     </ThemeProvider>
//   );
// }

// export default App;

// import { createContext, useState } from "react";
// import Counter from "./components/counter";
// import CounterContext, { CounterProvider } from "./Context/CounterContext";

// const ThemeContext=createContext(null);
// const CounterApp=()=>{
//     const [theme,setTheme]=useState('light');
//     return(
//       <div className={theme}>
//       <CounterProvider>
//         <Counter />
//         </CounterProvider>
//       </div>
//     )
// }
// export default CounterApp;

// App.js
import React from 'react';

import AddItem from './Context/AddItems';
import Cart from './Context/Cart';
import { CartProvider } from './Context/CartContext';

function App() {
  return (
    <CartProvider>
      <div style={{ padding: 20 }}>
        <AddItem />
        <hr />
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;

