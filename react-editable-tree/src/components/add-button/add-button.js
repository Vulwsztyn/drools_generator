import React from "react";
import "./add-button.css";

const AddButton = ( {onClick} ) => {
    return (
      <div className="AddButton">
          <button 
            className="AddButton-Inner" 
            onClick={onClick}
            value>
            +
          </button>
      </div>
    );   
}

export default AddButton;