import Comp3 from "./comp3";

const Comp2=({user})=>{
    return(
        <div>
            <h2>Prop Drilling.</h2>
            <Comp3 user={user}/>
        </div>
    )

}
export default Comp2;