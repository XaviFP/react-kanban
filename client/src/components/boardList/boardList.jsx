import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { withRouter } from "react-router";
import { itemTypes } from "../../constants";
import BoardItem from "../boardItem/boardItem";

function BoardList(props) {
  function handleCreateBoardClick(evt) {
    props.history.push("boards/create", { type: itemTypes.BOARD });
  }
  function onDragEnd(result) {
    const { source, destination, draggableId, type } = result;
    if (!destination) {
      return;
    }
    if (source.index === destination.index) {
      return;
    }
    if (type === itemTypes.BOARD) {
      props.moveBoard(draggableId, destination.index);
    }
  }

  return (
    <div style={{ marginTop: "7px" }}>
      <button
        className="ui button olive labeled icon"
        onClick={handleCreateBoardClick}
        style={{ bottom: "10px" }}
      >
        <i className="icon plus"></i>
        Add Board
      </button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={"board-list"} type="board">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="ui scrolling content"
            >
              {props.sortedBoardIds.map((boardId) => (
                <BoardItem
                  key={boardId}
                  id={boardId}
                  title={props.boards[boardId].title}
                  setActiveBoard={props.setActiveBoard}
                  index={Number(props.boards[boardId].index)}
                  type={itemTypes.BOARD}
                  selected={props.activeBoardId === boardId}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default withRouter(BoardList);
