import React, { useState } from "react";

function Random() {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled((prevState) => !prevState);
  };

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: isToggled ? "lightblue" : "lightpink", // color based on selection
    color: "black",
    border: "none",
  };

  return (
    <button onClick={handleToggle} style={buttonStyle}>
      {isToggled ? "Male" : "Female"}
    </button>
  );
}

export default Random;
