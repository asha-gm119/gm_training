import React, { use } from "react";
import { useState } from "react";
const Test=props=>{
    const [c,setc]=useState(0);
    const [n,setn]=useState('');
    const [active,setactive]=useState(true);
    function submitData(e){
        console.log(e.target.value);
        console.log("The name is:",n);
    }
    return(
        <>
        <h2>Count:{c}</h2>
        <button onClick={()=>setc(c=>{
            if(c==10)
            {
                return c=0;
            }
            return c+1;
        })}>Increment</button>
        <button onClick={()=>setc(c=>{
            if(c==0)
                return c;
            return c-1;
        })}>Decrement</button>
        <button onClick={()=>setc(c=0)}>Reset</button>
        <h3>Name: <span>{n}</span></h3>
        <input type="text" value={n} onChange={(e)=>setn(e.target.value)} />
        <button onClick={submitData}>submit</button><br /><br />
        <button onClick={()=>setactive(!active)}>{active? "Active":"Not Active"}</button>
        </>
    )
}
export default Test