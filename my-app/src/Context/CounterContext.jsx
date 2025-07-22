import React,{Children, createContext, useState} from "react";

const CounterContext=createContext();

export const CounterProvider=({children})=>{
    const [count, setCount]=useState(0);
    const IncrementCount=()=>{setCount(count+1)};
    const DecrementCount=()=>{setCount(count-1)};
    const Reset=()=>{setCount(0)};

    return(
        <div>
            <CounterContext.Provider value={{count, IncrementCount,DecrementCount,Reset}}>
                {children}
            </CounterContext.Provider>
        </div>
    )
}
export default CounterContext;