import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { withRouter } from "react-router";
import { itemTypes } from "../../constants";

function Task(props) {
  function handleClick(evt) {
    props.selectTask(props.id);
    props.history.push(`${props.type}s/edit/${props.id}`, {
      id: props.id,
      type: itemTypes.TASK,
    });
  }

  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          className="task"
          onClick={handleClick}
        >
          <div className="content">
            <h4>{props.title}</h4>
          </div>
          <div className="ui divider"></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="ui circular labels tags left floated">
              {props.tags.map((tag) => (
                <span
                  className="ui yellow horizontal circular label"
                  key={tag.id.toString()}
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <div>
              <span className="ui purple horizontal label">
                T{props.id.substring(0, 4)}
              </span>
              <span>
                <div className="ui image label">
                  {/* <img className="ui avatar image" alt="" src="" /> */}
                  Me
                </div>
              </span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default withRouter(Task);
