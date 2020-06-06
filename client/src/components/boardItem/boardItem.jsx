import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { withRouter } from "react-router";
import { itemTypes } from "../../constants";

function BoardItem(props) {
  function handleClick(evt) {
    props.setActiveBoard(props.id);
    props.history.push("/", {
      id: props.id,
      type: itemTypes.BOARD,
    });
  }
  const backgroundColors = [
    "#48809b",
    "#009688",
    "#ff9800",
    "#3f51b5",
    "#e91e63",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#9575cd",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#f44336",
    "#ffc107",
    "#ab47bc",
    "#ff7043",
    "#8d6e63",
    "#bdbdbd",
    "#607d8b",
  ];

  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          onClick={handleClick}
          className={"board-list-item"}
          style={
            props.selected
              ? {
                  marginLeft: "30px",
                  zIndex: "1",
                  width: "210px",
                  ...provided.draggableProps.style,
                }
              : { ...provided.draggableProps.style }
          }
        >
          <div
            style={
              props.selected
                ? {
                    display: "flex",
                    width: "100%",
                    paddingBottom: "0px",
                  }
                : {}
            }
          >
            <div
              className="board-list-item-content"
              style={
                props.selected
                  ? {
                      color: backgroundColors[props.index],
                    }
                  : {}
              }
            >
              {props.title}
            </div>
            {props.selected && (
              <div
                className="arrow-right"
                style={{
                  borderLeft: "15px solid " + backgroundColors[props.index],
                }}
              ></div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default withRouter(BoardItem);
