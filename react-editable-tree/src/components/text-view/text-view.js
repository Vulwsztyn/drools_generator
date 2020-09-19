import React from "react";
import "./text-view.css";

const TextView = ( { onChange, value } ) => {
    return (
        <div className="TextView">
            <textarea 
              className="TextView-Area"
              value={value}
              onChange={onChange}
            />
        </div>
    );
}

export default TextView;