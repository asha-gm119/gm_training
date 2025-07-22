import {useState} from "react";

const Form=()=>{
    const [un, setun]=useState('');
    const [ma, setma]=useState('');

    const submitdata=(e)=>{
        e.preventDefault();
        if(un==="" || ma==="")
        {
            alert("please fill the data")
        }else
        {
            alert("Submitted successfully")
            setun("")
            setma("")
        }
    }
    return(<div>
            <form action="">
                <input type="text" value={un} onChange={(e)=>setun(e.target.value)} />
                <input type="email" value={ma} onChange={(e)=>setma(e.target.value)}/>
                <button onClick={submitdata}>submit</button>
            </form>
        </div>);
}
export default Form;