import Comp2 from "./comp2";
const Comp1=()=>{
    const user={name:"John",age:30}
    return(
        <div>
            <h2>Prop drilling</h2>
            <Comp2 user={user}/>
        </div>
    )
}
export default Comp1;