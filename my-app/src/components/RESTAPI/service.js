import api from "./api";

export const getTodos=()=>api.get(`/todos`);
export const addTodo=(todo)=>api.post(`/todos`,todo)
export const UpdateTodo=(id,todo)=>api.put(`/todos/${id}`,todo)
export const deleteTodo=(id)=>api.delete(`/todos/${id}`)