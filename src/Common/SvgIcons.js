import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

const FilterIcon = () => {
  return (
    <SvgIcon>
      <path d="M14 12v7.88c.04.3-.06.62-.29.83a.996.996 0 01-1.41 0l-2.01-2.01a.989.989 0 01-.29-.83V12h-.03L4.21 4.62a1 1 0 01.17-1.4c.19-.14.4-.22.62-.22h14c.22 0 .43.08.62.22a1 1 0 01.17 1.4L14.03 12H14z"></path>
    </SvgIcon>
  );
};

const AllLayersIcon = () => {
  return (
    <SvgIcon>
      <path d="M4,5H20V7H4V5M4,9H20V11H4V9M4,13H20V15H4V13M4,17H14V19H4V17Z"></path>
    </SvgIcon>
  );
};

const FavouriteLayesIcon = () => {
  return (
    <SvgIcon>
      <path d="M17,19.09L19.45,20.58L18.8,17.77L21,15.89L18.11,15.64L17,13L15.87,15.64L13,15.89L15.18,17.77L14.5,20.58L17,19.09M4,14H12V16H4V14M4,6H16V8H4V6M4,10H16V12H4V10Z"></path>
    </SvgIcon>
  );
};

const EditLayesIcon = () => {
  return (
    <SvgIcon>
      <path d="M2,6V8H14V6H2M2,10V12H14V10H2M20.04,10.13C19.9,10.13 19.76,10.19 19.65,10.3L18.65,11.3L20.7,13.35L21.7,12.35C21.92,12.14 21.92,11.79 21.7,11.58L20.42,10.3C20.31,10.19 20.18,10.13 20.04,10.13M18.07,11.88L12,17.94V20H14.06L20.12,13.93L18.07,11.88M2,14V16H10V14H2Z"></path>
    </SvgIcon>
  );
};

const ChevronDobleRightWhite = () => {
  return (
    <SvgIcon htmlColor="#fff">
      <path d="M5.59,7.41L7,6L13,12L7,18L5.59,16.59L10.17,12L5.59,7.41M11.59,7.41L13,6L19,12L13,18L11.59,16.59L16.17,12L11.59,7.41Z"></path>
    </SvgIcon>
  );
};

export {
  FilterIcon,
  AllLayersIcon,
  FavouriteLayesIcon,
  EditLayesIcon,
  ChevronDobleRightWhite
};
