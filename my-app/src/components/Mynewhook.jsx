import { useEffect, useState } from "react";

const Mynewhook=()=>{
    const [form,setform]=useState({name:'',age:''})
    const [item,setitem]=useState([])
    useEffect(()=>{
        console.log("mounted");
    },[])
    return(
        <div>
            <h2>Effect</h2>
            <form >
                <input type="text" value={form.name} onChange={(e)=>setform({...form, name:e.target.value})} />
                <input type="number" value={form.age} onChange={(e)=>setform({...form, age:e.target.value})} />
                <button onClick={()=>setitem([...item,setitem(`item ${item.length+1}`)])}> Add items</button>
            </form>
            <ul>
                {
                    item.map((item,index)=>(
                        <li key={index}>{item}</li>
                    ))
                }
            </ul>
        </div>
    )
}
export default Mynewhook;