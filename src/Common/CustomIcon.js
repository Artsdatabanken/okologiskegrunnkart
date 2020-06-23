import React from "react";
import iconsJson from "./Icons.json";
import CustomTooltip from "./CustomTooltip";

const CustomIcon = ({ icon, size, styling, color, id, tooltipText }) => {
  const pathString = iconsJson[icon];
  return (
    <>
      {tooltipText ? (
        <CustomTooltip
          id="layer-icon-tooltip"
          placement="left"
          title={tooltipText}
        >
          <div id={id || "id"} className="layer-icon-wrapper">
            <svg
              id="id"
              className="custom-icon"
              width={size}
              height={size}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill={color || "#000000"}
            >
              <path id="id" style={styling} d={pathString || ""} />
            </svg>
          </div>
        </CustomTooltip>
      ) : (
        <div id={id || "id"} className="layer-icon-wrapper">
          <svg
            id="id"
            className="custom-icon"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill={color || "#000000"}
          >
            <path id="id" style={styling} d={pathString || ""} />
          </svg>
        </div>
      )}
    </>
  );
};

export default CustomIcon;
