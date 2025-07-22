import React, { useState } from "react";


const Counter=()=>{
    const [c,setc]=useState<number>(0);
    const [u,setu]=useState<{name:string;age:number}| null>(null);
    return(
        <div>
            <h2>count is:{c}</h2>
            <button onClick={()=>setc(c+1)}>Increment</button>
            <button onClick={()=>setc(c-1)}>Decrement</button>
            <button onClick={()=>setc(0)}>Reset</button>
        </div>
    )
}
export default Counter;