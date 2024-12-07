import React from "react";
import ChildCard from "./childCard";

const ChildList = ({ list }) => {
    return (
        <div>
            {list.map((child) => (
                <ChildCard key={child.childId} childData={child} />
            ))}
        </div>
    );
};

export default ChildList;