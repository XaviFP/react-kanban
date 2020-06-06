import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { withRouter } from "react-router";
import { itemTypes } from "../../constants";
import Task from "../task/task";

function BoardColumn(props) {
  function handleSelectClick(event) {
    props.selectColumn(props.id);
    props.history.push(`${props.type}s/edit/${props.id}`, {
      id: props.id,
      type: itemTypes.COLUMN,
    });
  }

  function handleCreateTaskClick(event) {
    props.history.push("tasks/create", {
      type: itemTypes.TASK,
      columnId: props.id,
    });
  }

  return (
    <Draggable
      draggableId={props.id}
      index={Number(props.columns[props.id].index)}
    >
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="board-column"
        >
          <div className="header ui grid" {...provided.dragHandleProps}>
            <div className="two column row">
              <div className="left floated column">
                <label
                  className="ui large pink label"
                  onClick={handleSelectClick}
                >
                  {props.title}
                </label>
              </div>

              <div className="create-task-button">
                <button
                  className="ui button  labeled icon teal "
                  onClick={handleCreateTaskClick}
                >
                  <i className="icon plus"></i>
                  Task
                </button>
              </div>
            </div>
          </div>
          <Droppable droppableId={props.id} type="task">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="ui scrolling content"
              >
                {props.sortedTaskIds.map((taskId) => (
                  <Task
                    key={props.tasks[taskId].id}
                    id={props.tasks[taskId].id}
                    title={props.tasks[taskId].title}
                    columnId={props.tasks[taskId].columnId}
                    tags={props.tasks[taskId].tags}
                    selectTask={props.selectTask}
                    index={Number(props.tasks[taskId].index)}
                    type={itemTypes.TASK}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default withRouter(BoardColumn);
