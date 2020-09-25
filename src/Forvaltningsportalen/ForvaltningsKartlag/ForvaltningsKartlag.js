import React, { useState } from "react";
import ForvaltningsGruppering from "./ForvaltningsGruppering";
import { Chip, Typography, List, Button } from "@material-ui/core";
import Sortering from "./Sortering";
import Filtrering from "./Filtrering";
import TegnforklaringLink from "../../Tegnforklaring/TegnforklaringLink";

const ForvaltningsKartlag = ({
  kartlag,
  toggleSublayer,
  toggleAllSublayers,
  zoom,
  showSublayerDetails,
  setLegendVisible
}) => {
  // Denne funksjonen tar inn alle lagene som sendes inn, og henter ut per eier
  const [sortKey, setSortKey] = useState("alfabetisk");
  const [tagFilter, setTagFilter] = useState({});
  const [hideHidden] = useState(false); // Not used??? Never changes...
  const [searchTerm] = useState(null); // Not used??? Never changes...
  const [matchAllFilters, setMatchAllFilters] = useState(true);

  const handleFilterTag = (tag, value) => {
    let tagFilterTemp = tagFilter;
    tagFilterTemp[tag] = value;
    setTagFilter(tagFilterTemp);
  };

  const handleChangeSort = sortKey => {
    setSortKey(sortKey);
  };

  const sortKeyToDescription = {
    alfabetisk: "Alfabetisk",
    tema: "Gruppert på tema",
    dataeier: "Gruppert på dataeier"
  };

  let lag = kartlag;
  let sorted = {};

  // Henter ut unike tags for checklistegenerering
  let taglist = {};
  for (let i in lag) {
    for (let tag of lag[i]["tags"] || []) taglist[tag] = true;
  }

  taglist = Object.keys(taglist).sort();

  // Sorterer listen på valgt kriterie
  console.log("Render");
  for (let item in lag) {
    console.log("Sort results");
    let criteria = lag[item][sortKey];
    let new_list = [];
    if (!criteria) {
      criteria = "";
    }
    if (sorted[criteria]) {
      new_list = sorted[criteria];
    }
    lag[item].id = item;
    new_list.push(lag[item]);
    sorted[criteria] = new_list;
  }

  const tags = taglist
    .filter(tag => tagFilter[tag])
    .map(tag => (
      <Chip
        id="layers-filter-chips"
        style={{ margin: "2px 5px 2px 0" }}
        key={tag}
        label={tag}
        clickable
        color="primary"
        onClick={() => handleFilterTag(tag, !tagFilter[tag])}
        onDelete={() => handleFilterTag(tag, false)}
      />
    ));

  return (
    <>
      <div className="header-layers-menu">
        <div className="sort-filter-layers-wrapper">
          <div>
            <Typography variant="h6">Kartlag</Typography>
            <Typography variant="body2">
              {sortKeyToDescription[sortKey]}
            </Typography>
          </div>
          <div className="sort-filter-icons-wrapper">
            <Sortering sort={sortKey} onChangeSort={handleChangeSort} />
            <Filtrering
              taglist={taglist}
              tagFilter={tagFilter}
              onFilterTag={handleFilterTag}
            />
          </div>
        </div>
      </div>
      {tags && tags.length > 0 && (
        <div className="selected-tags-wrapper">
          <div className="selected-tags-tittle">
            <Typography id="filters-header" variant="body2">
              Filtrer
            </Typography>
            {tags.length > 1 && (
              <div className="filter-options-wrapper">
                <Button
                  id="filter-all-button"
                  size="small"
                  color={matchAllFilters ? "primary" : "secondary"}
                  onClick={() => {
                    setMatchAllFilters(true);
                  }}
                >
                  Matcher alle
                </Button>
                /
                <Button
                  id="filter-all-button"
                  size="small"
                  color={matchAllFilters ? "secondary" : "primary"}
                  onClick={() => {
                    setMatchAllFilters(false);
                  }}
                >
                  Matcher minst ett
                </Button>
              </div>
            )}
          </div>
          {tags.reduce((accu, elem, index) => {
            return accu === null ? [elem] : [...accu, elem];
          }, null)}
        </div>
      )}

      <div className="legend-link-background">
        <div className="legend-link-wrapper">
          <TegnforklaringLink
            layers={kartlag}
            setLegendVisible={setLegendVisible}
          />
        </div>
      </div>

      <List id="layers-list-wrapper">
        {Object.keys(sorted)
          .reverse()
          .map(element => {
            return (
              <ForvaltningsGruppering
                searchTerm={searchTerm}
                hideHidden={hideHidden}
                tagFilter={tagFilter}
                matchAllFilters={matchAllFilters}
                kartlag={sorted[element]}
                element={element}
                key={element}
                toggleSublayer={toggleSublayer}
                toggleAllSublayers={toggleAllSublayers}
                zoom={zoom}
                showSublayerDetails={showSublayerDetails}
              />
            );
          })}
      </List>
    </>
  );
};

// class ForvaltningsKartlag extends React.Component {
//   // Denne funksjonen tar inn alle lagene som sendes inn, og henter ut per eier
//   state = {
//     sortKey: "alfabetisk",
//     tagFilter: {},
//     hideHidden: false,
//     searchTerm: null,
//     showFilter: false,
//     matchAllFilters: true
//   };

//   handleFilterTag = (tag, value) => {
//     let tagFilter = this.state.tagFilter;
//     tagFilter[tag] = value;
//     this.setState({ tagFilter });
//   };

//   handleChangeSort = sortKey => {
//     this.setState({ sortKey });
//   };

//   sortKeyToDescription = {
//     alfabetisk: "Alfabetisk",
//     tema: "Gruppert på tema",
//     dataeier: "Gruppert på dataeier"
//   };

//   render() {
//     const { toggleSublayer, toggleAllSublayers } = this.props;
//     let lag = this.props.kartlag;
//     let sortKey = this.state.sortKey;
//     let sorted = {};

//     // Henter ut unike tags for checklistegenerering
//     let taglist = {};
//     for (let i in lag)
//       for (let tag of lag[i]["tags"] || []) taglist[tag] = true;

//     taglist = Object.keys(taglist).sort();

//     // Sorterer listen på valgt kriterie
//     console.log("Render")
//     for (let item in lag) {
//       console.log("Sort results")
//       let criteria = lag[item][sortKey];
//       let new_list = [];
//       if (!criteria) {
//         criteria = "";
//       }
//       if (sorted[criteria]) {
//         new_list = sorted[criteria];
//       }
//       lag[item].id = item;
//       new_list.push(lag[item]);
//       sorted[criteria] = new_list;
//     }

//     const tags = taglist
//       .filter(tag => this.state.tagFilter[tag])
//       .map(tag => (
//         <Chip
//           id="layers-filter-chips"
//           style={{ margin: "2px 5px 2px 0" }}
//           key={tag}
//           label={tag}
//           clickable
//           color="primary"
//           onClick={() => this.handleFilterTag(tag, !this.state.tagFilter[tag])}
//           onDelete={() => this.handleFilterTag(tag, false)}
//         />
//       ));

//     return (
//       <>
//         <div className="header-layers-menu">
//           <div className="sort-filter-layers-wrapper">
//             <div>
//               <Typography variant="h6">Kartlag</Typography>
//               <Typography variant="body2">
//                 {this.sortKeyToDescription[sortKey]}
//               </Typography>
//             </div>
//             <div className="sort-filter-icons-wrapper">
//               <Sortering sort={sortKey} onChangeSort={this.handleChangeSort} />
//               <Filtrering
//                 taglist={taglist}
//                 tagFilter={this.state.tagFilter}
//                 onFilterTag={this.handleFilterTag}
//               />
//             </div>
//           </div>
//         </div>
//         {tags && tags.length > 0 && (
//           <div className="selected-tags-wrapper">
//             <div className="selected-tags-tittle">
//               <Typography id="filters-header" variant="body2">
//                 Filtrer
//               </Typography>
//               {tags.length > 1 && (
//                 <div className="filter-options-wrapper">
//                   <Button
//                     id="filter-all-button"
//                     size="small"
//                     color={this.state.matchAllFilters ? "primary" : "secondary"}
//                     onClick={() => {
//                       this.setState({ matchAllFilters: true });
//                     }}
//                   >
//                     Matcher alle
//                   </Button>
//                   /
//                   <Button
//                     id="filter-all-button"
//                     size="small"
//                     color={this.state.matchAllFilters ? "secondary" : "primary"}
//                     onClick={() => {
//                       this.setState({ matchAllFilters: false });
//                     }}
//                   >
//                     Matcher minst ett
//                   </Button>
//                 </div>
//               )}
//             </div>
//             {tags.reduce((accu, elem, index) => {
//               return accu === null ? [elem] : [...accu, elem];
//             }, null)}
//           </div>
//         )}

//         <div className="legend-link-background">
//           <div className="legend-link-wrapper">
//             <TegnforklaringLink
//               layers={this.props.kartlag}
//               setLegendVisible={this.props.setLegendVisible}
//             />
//           </div>
//         </div>

//         <List id="layers-list-wrapper">
//           {Object.keys(sorted)
//             .reverse()
//             .map(element => {
//               return (
//                 <ForvaltningsGruppering
//                   searchTerm={this.state.searchTerm}
//                   hideHidden={this.state.hideHidden}
//                   tagFilter={this.state.tagFilter}
//                   matchAllFilters={this.state.matchAllFilters}
//                   kartlag={sorted[element]}
//                   element={element}
//                   key={element}
//                   toggleSublayer={toggleSublayer}
//                   toggleAllSublayers={toggleAllSublayers}
//                   zoom={this.props.zoom}
//                   showSublayerDetails={this.props.showSublayerDetails}
//                 />
//               );
//             })}
//         </List>
//       </>
//     );
//   }
// }

export default ForvaltningsKartlag;
