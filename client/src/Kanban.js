import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import actions from "./actions";
import Board from "./components/board/board";
import BoardList from "./components/boardList/boardList";
import ItemEdit from "./components/editForm/ItemEdit";
import { itemTypes } from "./constants";
import { getCollectionIds, getColumnTaskIds } from "./utils.js";
const WEB_SOCKET_SERVER_ENDPOINT = "ws://localhost:5000";

class Kanban extends React.Component {
  componentDidMount() {
    this.getServerState()
      .then((res) => {
        this.props.dispatch(actions.initState(res));
      })
      .catch((err) => console.log(err));

    const operations = {
      board: {
        move: actions.moveBoard,
        create: actions.createBoard,
        delete: actions.deleteBoard,
        update: actions.updateBoard,
      },
      column: {
        move: actions.moveColumn,
        create: actions.createColumn,
        delete: actions.deleteColumn,
        update: actions.updateColumn,
      },
      task: {
        move: actions.moveTask,
        create: actions.createTask,
        delete: actions.deleteTask,
        update: actions.updateTask,
      },
    };
    // Websockets
    async function session() {
      await fetch("/session");
    }
    session();
    const socket = new WebSocket(WEB_SOCKET_SERVER_ENDPOINT);
    socket.onopen = function (event) {
      console.log("Websocket connection established");
    };
    socket.onmessage = (event) => {
      console.log("Websocket message received", event.data);

      try {
        const payload = JSON.parse(event.data);
        console.log("Payload", payload);
        if (payload.dispatch) {
          delete payload.dispatch;
          if (
            payload.type &&
            Object.values(itemTypes).some(
              (itemType) => itemType === payload.type
            )
            // TODO Check action as well
          ) {
            try {
              this.props.dispatch(
                operations[payload.type][payload.action](payload)
              );
              new Notification(payload.action + " " + payload.type);
            } catch (error) {
              console.log(
                "Something went wrong dispatching the action pushed by the server"
              );
              console.log(payload);
              console.log(error);
            }
          }
        }
      } catch (error) {
        console.log(error);
        console.log("Received invalid payload", event.data);
      }
    };
  }

  getServerState = async () => {
    const response = await fetch("/boards");
    const body = await response.json();
    // TODO Handle server unavailability
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  // Action dispatchers
  selectTask = (taskId) => {
    this.props.dispatch(actions.selectTask({ taskId }));
  };

  selectColumn = (columnId) => {
    this.props.dispatch(actions.selectColumn({ columnId }));
  };

  createTask = (task) => {
    this.props.dispatch(actions.doCreateTask({ task }));
  };

  deleteTask = (taskId) => {
    this.props.dispatch(actions.doDeleteTask(taskId));
  };

  moveTask = (taskId, toColumn, toIndex) => {
    this.props.dispatch(actions.doMoveTask({ taskId, toColumn, toIndex }));
  };

  createColumn = (column) => {
    this.props.dispatch(actions.doCreateColumn({ column }));
  };

  createBoard = (board) => {
    this.props.dispatch(actions.doCreateBoard({ board }));
  };

  deleteColumn = (columnId) => {
    this.props.dispatch(actions.doDeleteColumn(columnId));
  };

  moveColumn = (columnId, toIndex) => {
    this.props.dispatch(actions.doMoveColumn({ columnId, toIndex }));
  };

  deleteBoard = (boardId) => {
    this.props.dispatch(actions.doDeleteBoard({ boardId }));
  };

  moveBoard = (boardId, toIndex) => {
    this.props.dispatch(actions.doMoveBoard({ boardId, toIndex }));
  };

  upsertSelectedTask = (task) => {
    if (task.id) {
      this.props.dispatch(actions.doUpdateTask({ task }));
    } else {
      this.createTask(task);
    }
  };

  upsertSelectedColumn = (column) => {
    if (column.id) {
      this.props.dispatch(actions.doUpdateColumn({ column }));
    } else {
      this.createColumn(column);
    }
  };

  setActiveBoard = (boardId) => {
    this.props.dispatch(actions.setActiveBoard({ boardId }));
  };

  upsertSelectedBoard = (board) => {
    if (board.id) {
      this.props.dispatch(actions.doUpdateBoard({ board }));
    } else {
      this.createBoard(board);
    }
  };

  upsertSelectedItem = (item) => {
    switch (item.type) {
      case itemTypes.TASK:
        delete item.type;
        this.upsertSelectedTask(item);
        break;
      case itemTypes.COLUMN:
        delete item.type;
        this.upsertSelectedColumn(item);
        break;
      case itemTypes.BOARD:
        delete item.type;
        this.upsertSelectedBoard(item);
        break;
      default:
        return;
    }
  };

  deleteItem = (item) => {
    switch (item.type) {
      case itemTypes.TASK:
        this.deleteTask({ taskId: item.id });
        break;
      case itemTypes.COLUMN:
        this.deleteColumn({ columnId: item.id });
        break;
      case itemTypes.BOARD:
        this.deleteBoard({ boardId: item.id });
        break;
      default:
        return;
    }
  };

  render() {
    if (Object.keys(this.props.board).length > 0) {
      const { activeBoardId } = this.props.board;
      const activeBoard = activeBoardId ? activeBoardId : null;

      const sortedColumnIdsByIndex = activeBoard
        ? getCollectionIds(this.props.board[activeBoard], "columns", "index")
        : [];

      return (
        <Router>
          <Route exact path={`*/create`}>
            <ItemEdit
              item={
                activeBoard ? this.props.board[activeBoard].selectedItem : null
              }
              activeBoard={activeBoard}
              upsertSelectedItem={this.upsertSelectedItem}
            />
          </Route>
          <Route exact path={`*/edit/:itemId`}>
            {activeBoard ? (
              <ItemEdit
                item={this.props.board[activeBoard].slectedItem}
                board={this.props.board[activeBoard]}
                activeBoard={activeBoard}
                upsertSelectedItem={this.upsertSelectedItem}
                deleteItem={this.deleteItem}
              />
            ) : (
              ""
            )}
          </Route>
          <Route path="/">
            <div className="ui grid">
              <div
                className={
                  "two wide column boards-menu-panel" +
                  " board-mat-" +
                  (activeBoard
                    ? this.props.board.boards[activeBoard].index % 19
                    : 0)
                }
              >
                <BoardList
                  sortedBoardIds={getCollectionIds(
                    this.props.board,
                    "boards",
                    "index"
                  )}
                  boards={this.props.board.boards}
                  setActiveBoard={this.setActiveBoard}
                  moveBoard={this.moveBoard}
                  activeBoardId={activeBoard ? activeBoard : ""}
                ></BoardList>
              </div>
              <div className="ten wide column">
                <Board
                  sortedColumnIds={sortedColumnIdsByIndex}
                  sortedTaskIds={sortedColumnIdsByIndex.map((columnId) =>
                    getColumnTaskIds(
                      columnId,
                      this.props.board[activeBoard].tasks
                    )
                  )}
                  columns={
                    activeBoard ? this.props.board[activeBoard].columns : []
                  }
                  moveColumn={this.moveColumn}
                  moveTask={this.moveTask}
                  tasks={activeBoard ? this.props.board[activeBoard].tasks : []}
                  selectTask={this.selectTask}
                  selectColumn={this.selectColumn}
                  findTask={this.findTask}
                  index={
                    activeBoard ? this.props.board.boards[activeBoard].index : 0
                  }
                  board={
                    activeBoard ? this.props.board.boards[activeBoard] : {}
                  }
                />
              </div>
            </div>
          </Route>
        </Router>
      );
    } else return "";
  }
}

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps)(Kanban);
