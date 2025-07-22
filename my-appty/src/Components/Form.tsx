import React, { useState } from "react";

const Form=()=>{
    const [s,sets]=useState<String>("");
    const handlechange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        sets(e.target.value)
    }
    const handlesubmitdata=(e:React.MouseEvent<HTMLButtonElement>)=>{
        console.log("Dispaly data",s)
    }
    return(
        <div>
            <input type="text" onChange={handlechange} />
            <button onClick={handlesubmitdata}>Submit</button>
        </div>
    )
}
export default Form;