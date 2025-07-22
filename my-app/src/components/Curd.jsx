import { useState,useEffect } from "react";
const Curd=()=>{
    const [d,setd]=useState([]);
    const [msg,setmsg]=useState([]);
    useEffect(()=>{
    fetch('https://jsonplaceholder.typicode.com/posts')
.then(response=>response.json())
.then(data=>setd(data))},[])
const senddata=(e)=>{
    fetch('https://jsonplaceholder.typicode.com/posts',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({msg:msg})
    }).then(response=>response.json())
    .then(data=>console.log(data))
}
    return(
        <div>
            <input type="text" value={msg} onChange={(e)=>{setmsg(e.target.value)}} placeholder="Enter msg"/>
            <button onClick={senddata}>Send</button>
            <h2>CRUD</h2>
            
        </div>
    )
}
export default Curd;