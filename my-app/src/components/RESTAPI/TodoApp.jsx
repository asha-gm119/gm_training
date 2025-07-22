import { useState,useEffect } from "react";
import { addTodo, deleteTodo, getTodos, UpdateTodo } from "./service";

const TodoApp=()=>{
    const [todos,settodos]=useState([]);
    const [task,settask]=useState("");
    const [edit,setedit]=useState(null);

    useEffect(()=>{
        getTodo();
    },[todos])
    //Load Todos
    const getTodo=async()=>{
        try {
            const response = await getTodos();
            settodos(response.data);
        }
        catch (e) {
            console.log(e);
        }
    }
    //edit todos
    const handleEdit=async(todo)=>{
        setedit(todo.id);
        settask(todo.title);
    }
    //delete Todos
    const handleDelete=async(x)=>{
        const response=await deleteTodo(x);
        if(response.status===200)
        {
            alert("Successfully Deleted");
            getTodo();
        }
    }
    const handleSubmit=async()=>{
        if(!task) return alert("PLease enter a task");
        if(edit)
        {
            const response=await UpdateTodo(edit,{title:task})
            if(response.data.status==="200"){
                alert("Successfully updated");
                setedit(null);
                setedit("");
                getTodo();//refrest the todo list
            }
        }
        else{
            const response=await addTodo({title: task});
            if(response.data.status==="200")
            {
                 alert("Successfully added");
                setedit(null);
                setedit("");
                getTodo();//refrest the todo list
            }
            }
        }
  
    return(
        <div>
            <input type="text" value={task} onChange={(e)=>settask(e.target.value)} />
            <button onClick={handleSubmit}>{edit? 'Update':'Add'}</button>
            <h2>todo:</h2>
            <ul>
                {
                    todos.map((todo)=>(
                    <li key={todo.id}>{todo.title}
                    <button onClick={()=>{handleEdit(todo)}}>edit</button>
                    <button onClick={()=>{handleDelete(todo.id)}}>Delete</button>
                    </li>))
                }
            </ul>

        </div>
    )
}
export default TodoApp;