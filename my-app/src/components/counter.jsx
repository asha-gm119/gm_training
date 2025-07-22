import { useContext } from "react";
import CounterContext from "../Context/CounterContext";

export default function Counter(){
    const {count,IncrementCount,DecrementCount,Reset}=useContext(CounterContext);
    return <div>
        <h2>Count:{count}</h2>
                    <button onClick={IncrementCount}>Increment</button>
                    <button onClick={DecrementCount}>Decrement</button>
                    <button onClick={Reset}>Reset</button>
    </div>;
}