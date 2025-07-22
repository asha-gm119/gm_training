import { useState,useEffect, use } from "react";
const UseLocalStorage=(key,intialValue)=>{
    const [val,setv]=useState(()=>{
        const sval=localStorage.getItem(key);

        return sval? JSON.parse(sval):intialValue;
    });

    useEffect(()=>{
        localStorage.setItem('key',JSON.stringify(value));
    },[val,setv])

    return(
        <div>

        </div>
    )
};
export default UseLocalStorage;