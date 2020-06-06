import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { withRouter } from "react-router";
import { itemTypes } from "../../constants";
import BoardColumn from "../boardColumn/boardColumn";

function Board(props) {
  function onDragEnd(result) {
    const { source, destination, draggableId, type } = result;
    if (!destination) {
      return;
    }
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    if (type === "column") {
      props.moveColumn(draggableId, destination.index);
    }
    if (type === "task") {
      props.moveTask(draggableId, destination.droppableId, destination.index);
    }
  }

  function handleCreateColumnClick(event) {
    props.history.push("columns/create", {
      type: itemTypes.COLUMN,
    });
  }

  return (
    <div>
      <div id="toolbar" style={{ paddingTop: "20px", display: "flex" }}>
        <button
          className="ui button olive labeled icon"
          onClick={handleCreateColumnClick}
          style={{ top: "10px", marginLeft: "10px" }}
        >
          <i className="icon plus"></i>
          Add Column
        </button>
        <div
          style={{
            fontSize: "x-large",
            alignSelf: "center",
            marginLeft: "320px",
            position: "relative",
            color: "white",
            top: "2px",
          }}
        >
          {props.board.title}
        </div>
      </div>
      <div className="ui grid">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId={"Board"}
            direction={"horizontal"}
            type="column"
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  minWidth: "1920px",
                  minHeight: "1100px",
                }}
                className={"board-mat board-mat-" + (props.index % 19)}
              >
                {props.sortedColumnIds.map((columnId, index) => (
                  <BoardColumn
                    key={columnId.toString()}
                    id={columnId}
                    title={props.columns[columnId].title}
                    selectTask={props.selectTask}
                    sortedTaskIds={props.sortedTaskIds[index]}
                    indexSorting={props.indexSorting}
                    tasks={props.tasks}
                    columns={props.columns}
                    selectColumn={props.selectColumn}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default withRouter(Board);
