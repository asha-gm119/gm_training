import { useState, useRef } from "react";
const Controlled=()=>{
    const [ipv, setipv]=useState('');
    const ipref=useRef(null);
    const hunc=()=>{
        alert(`${ipref.current.value}`);
    };
    return (
        <div>
            <h2>Value:{ipv}</h2>
            <input type="text" value={ipv} onChange={(e)=>setipv(e.target.value)} />
            <h2>uncontorlled value</h2>
            <input ref={ipref} placeholder="uncontrolled" />
            <button onClick={hunc}>uncontrolled button</button>
        </div>
    );
}
export default Controlled;