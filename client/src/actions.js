const SERVER_URL = "/boards";
/*
 * action types
 */

export const INIT_STATE = "INIT_STATE";
export const CREATE_TASK = "CREATE_TASK";
export const SELECT_TASK = "SELECT_TASK";
export const MOVE_TASK = "MOVE_TASK";
export const UPDATE_TASK = "UPDATE_TASK";
export const DELETE_TASK = "DELETE_TASK";
export const MOVE_COLUMN = "MOVE_COLUMN";
export const CREATE_COLUMN = "CREATE_COLUMN";
export const DELETE_COLUMN = "DELETE_COLUMN";
export const SELECT_COLUMN = "SELECT_COLUMN";
export const UPDATE_COLUMN = "UPDATE_COLUMN";
export const CREATE_BOARD = "CREATE_BOARD";
export const SET_ACTIVE_BOARD = "SET_ACTIVE_BOARD";
export const DELETE_BOARD = "DELETE_BOARD";
export const UPDATE_BOARD = "UPDATE_BOARD";
export const MOVE_BOARD = "MOVE_BOARD";

/*
 * Synchronous action creators
 */

export function initState(state) {
  return { type: INIT_STATE, state };
}

export function moveTask(args) {
  const { taskId, toColumn, toIndex, boardId } = args;
  return { type: MOVE_TASK, taskId, toColumn, toIndex, boardId };
}

export function selectTask(args) {
  const { taskId } = args;
  return { type: SELECT_TASK, taskId };
}

export function updateTask(args) {
  const { task } = args;
  return { type: UPDATE_TASK, task };
}

export function createTask(args) {
  const { task } = args;
  return { type: CREATE_TASK, task };
}

export function deleteTask(args) {
  const { taskId } = args;
  return { type: DELETE_TASK, taskId };
}

export function moveColumn(args) {
  const { columnId, toIndex, boardId } = args;
  return { type: MOVE_COLUMN, columnId, toIndex, boardId };
}

export function createColumn(args) {
  const { column } = args;
  return { type: CREATE_COLUMN, column };
}

export function deleteColumn(args) {
  const { columnId } = args;
  return { type: DELETE_COLUMN, columnId };
}

export function selectColumn(args) {
  const { columnId } = args;
  return { type: SELECT_COLUMN, columnId };
}

export function updateColumn(args) {
  const { column } = args;
  return { type: UPDATE_COLUMN, column };
}

export function createBoard(args) {
  return { type: CREATE_BOARD, args: args };
}

export function setActiveBoard(args) {
  const { boardId } = args;
  return { type: SET_ACTIVE_BOARD, boardId };
}

export function deleteBoard(args) {
  const { boardId } = args;
  return { type: DELETE_BOARD, boardId };
}

export function moveBoard(args) {
  const { boardId, toIndex } = args;
  return { type: MOVE_BOARD, boardId, toIndex };
}

export function updateBoard(args) {
  const { board } = args;
  return { type: UPDATE_BOARD, board };
}

/*
 * Asynchronous action creators
 */

async function postRequest(body) {
  return fetch(SERVER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=utf-8" },
    body: JSON.stringify(body),
  });
}
export function doCreateBoard(kwargs) {
  return async (dispatch) => {
    const response = await postRequest({
      action: "create",
      type: "board",
      board: kwargs.board,
    });
    const parsedResponse = await response.json();
    return dispatch(createBoard(parsedResponse));
  };
}

export function doDeleteBoard(kwargs) {
  return (dispatch) => {
    dispatch(deleteBoard(kwargs));
    return postRequest({
      action: "delete",
      type: "board",
      boardId: kwargs.boardId,
    });
  };
}

export function doUpdateBoard(kwargs) {
  return (dispatch) => {
    dispatch(updateBoard(kwargs));
    return postRequest({
      action: "update",
      type: "board",
      board: kwargs.board,
    });
  };
}

export function doMoveBoard(kwargs) {
  return (dispatch) => {
    dispatch(moveBoard(kwargs));
    return postRequest({
      action: "move",
      type: "board",
      boardId: kwargs.boardId,
      toIndex: kwargs.toIndex,
    });
  };
}

export function doMoveColumn(kwargs) {
  return (dispatch) => {
    dispatch(moveColumn(kwargs));
    return postRequest({
      action: "move",
      type: "column",
      columnId: kwargs.columnId,
      toIndex: kwargs.toIndex,
    });
  };
}

export function doCreateColumn(kwargs) {
  return async (dispatch) => {
    const response = await postRequest({
      action: "create",
      type: "column",
      column: kwargs.column,
    });
    const parsedResponse = await response.json();
    return dispatch(
      createColumn({
        action: "create",
        type: "column",
        column: parsedResponse.column,
      })
    );
  };
}

export function doDeleteColumn(kwargs) {
  return (dispatch) => {
    dispatch(deleteColumn(kwargs));
    return postRequest({
      action: "delete",
      type: "column",
      columnId: kwargs.columnId,
    });
  };
}

export function doUpdateColumn(kwargs) {
  return (dispatch) => {
    dispatch(updateColumn(kwargs));
    return postRequest({
      action: "update",
      type: "column",
      column: kwargs.column,
    });
  };
}

export function doCreateTask(kwargs) {
  return async (dispatch) => {
    const response = await postRequest({
      action: "create",
      type: "task",
      task: kwargs.task,
    });
    const parsedResponse = await response.json();
    return dispatch(
      createTask({ action: "create", type: "task", task: parsedResponse.task })
    );
  };
}

export function doDeleteTask(kwargs) {
  return (dispatch) => {
    dispatch(deleteTask(kwargs));
    return postRequest({
      action: "delete",
      type: "task",
      taskId: kwargs.taskId,
    });
  };
}

export function doUpdateTask(kwargs) {
  return (dispatch) => {
    dispatch(updateTask(kwargs));
    return postRequest({ action: "update", type: "task", task: kwargs.task });
  };
}

export function doMoveTask(kwargs) {
  return (dispatch) => {
    dispatch(moveTask(kwargs));
    return postRequest({
      action: "move",
      type: "task",
      taskId: kwargs.taskId,
      toColumn: kwargs.toColumn,
      toIndex: kwargs.toIndex,
    });
  };
}

export default {
  createBoard,
  createColumn,
  createTask,
  deleteBoard,
  deleteColumn,
  deleteTask,
  doCreateBoard,
  doCreateColumn,
  doCreateTask,
  doDeleteBoard,
  doDeleteColumn,
  doDeleteTask,
  doMoveBoard,
  doMoveColumn,
  doMoveTask,
  doUpdateBoard,
  doUpdateColumn,
  doUpdateTask,
  initState,
  moveBoard,
  moveColumn,
  moveTask,
  selectColumn,
  selectTask,
  setActiveBoard,
  updateBoard,
  updateColumn,
  updateTask,
};
