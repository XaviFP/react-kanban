import { combineReducers } from "redux";
import {
  CREATE_BOARD,
  CREATE_COLUMN,
  CREATE_TASK,
  DELETE_BOARD,
  DELETE_COLUMN,
  DELETE_TASK,
  INIT_STATE,
  MOVE_BOARD,
  MOVE_COLUMN,
  MOVE_TASK,
  SELECT_COLUMN,
  SELECT_TASK,
  SET_ACTIVE_BOARD,
  UPDATE_COLUMN,
  UPDATE_TASK,
} from "./actions";
import { itemTypes } from "./constants";
import {
  getCollectionIds,
  getColumnIds,
  getColumnTaskIds,
  updateCollectionIdexesFromList,
} from "./utils.js";

export function board(state = {}, action) {
  switch (action.type) {
    case INIT_STATE:
      return { ...state, ...action.state };

    case MOVE_TASK:
      return moveTask(state, action);

    case SELECT_TASK:
      return selectTask(state, action.taskId);

    case UPDATE_TASK:
      return updateTask(state, action.task);

    case CREATE_TASK:
      return createTask(state, action);

    case DELETE_TASK:
      return deleteTask(state, action.taskId);

    case MOVE_COLUMN:
      return moveColumn(state, action);

    case CREATE_COLUMN:
      return createColumn(state, action);

    case DELETE_COLUMN:
      return deleteColumn(state, action.columnId);

    case SELECT_COLUMN:
      return selectColumn(state, action.columnId);

    case UPDATE_COLUMN:
      return updateColumn(state, action.column);

    case CREATE_BOARD:
      return createBoard(state, action);

    case SET_ACTIVE_BOARD:
      return setActiveBoard(state, action.boardId);

    case DELETE_BOARD:
      return deleteBoard(state, action.boardId);

    case MOVE_BOARD:
      return moveBoard(state, action);

    default:
      return state;
  }
}

const kanbanReducers = combineReducers({
  board,
});

export default kanbanReducers;

function moveTask(state, { taskId, toColumn, toIndex, boardId }) {
  const targetBoard = boardId ? boardId : state.activeBoardId;
  const board = { ...state[targetBoard] };
  const tasks = board.tasks;

  const fromColumn = tasks[taskId].columnId;
  const fromIndex = tasks[taskId].index;

  let columnTaskIds = {
    [fromColumn]: getColumnTaskIds(fromColumn, tasks),
  };

  columnTaskIds[toColumn] =
    fromColumn === toColumn
      ? columnTaskIds[fromColumn]
      : getColumnTaskIds(toColumn, tasks);
  // Delete task from origin column
  columnTaskIds[fromColumn].splice(fromIndex, 1);

  //Insert the task at target index.
  columnTaskIds[toColumn].splice(toIndex, 0, taskId);
  // Update task's column with destination column.
  tasks[taskId].columnId = toColumn;
  // Update all tasks in involved columns.
  for (const [, sortedTaskIds] of Object.entries(columnTaskIds)) {
    updateCollectionIdexesFromList(sortedTaskIds, tasks);
  }

  return {
    ...state,
    [targetBoard]: board,
  };
}

/**
 * Put a copy of the selected task in the state as selectedItem.
 */
function selectTask(state, taskId) {
  const task = {
    ...Object.values(state[state.activeBoardId].tasks).find(
      (task) => task.id.toString() === taskId.toString()
    ),
  };
  task.type = itemTypes.TASK;
  return { ...state, selectedItem: task };
}

/**
 * Updates selected task with a new version of it.
 */
function updateTask(state, task) {
  const targetBoard = task.boardId ? task.boardId : state.activeBoardId;
  const board = { ...state[targetBoard] };
  const updatedTasks = board.tasks;
  updatedTasks[task.id] = { ...task };
  return { ...state, tasks: { ...updatedTasks }, selectedItem: {} };
}

/**
 * Move column being dragged to the new position.
 */
function moveColumn(state, { columnId, toIndex, boardId }) {
  const targetBoard = boardId ? boardId : state.activeBoardId;
  const board = { ...state[targetBoard] };
  const columns = board.columns;

  const fromIndex = columns[columnId].index;

  let columnIds = getColumnIds(columns);
  columnIds.splice(fromIndex, 1);
  columnIds.splice(toIndex, 0, columnId);

  // Update all columns' indexes
  updateCollectionIdexesFromList(columnIds, columns);
  return {
    ...state,
    [targetBoard]: { ...state[targetBoard], columns: { ...columns } },
  };
}

/**
 *
 * @param {*} state
 * @param {*} column
 */
function createColumn(state, { column }) {
  const targetBoard = column.boardId ? column.boardId : state.activeBoardId;
  const board = { ...state[targetBoard] };
  const columns = board.columns;
  columns[column.id] = column;
  return {
    ...state,
    [targetBoard]: { ...state[targetBoard], columns: { ...columns } },
    selectedItem: {},
  };
}

/**
 *
 * @param {*} state
 * @param {*} columnId
 * @param {*} boardId
 */
function deleteColumn(state, columnId, boardId) {
  const targetBoard = boardId ? boardId : state.activeBoardId;
  const board = { ...state[targetBoard] };
  const columns = board.columns;
  delete columns[columnId];
  return {
    ...state,
    [targetBoard]: { ...state[targetBoard], columns: { ...columns } },
    selectedItem: {},
  };
}

/**
 * Put a copy of the selected column in the state as selectedItem.
 */
function selectColumn(state, columnId) {
  const column = {
    ...Object.values(state[state.activeBoardId].columns).find(
      (column) => column.id.toString() === columnId.toString()
    ),
  };
  column.type = itemTypes.COLUMN;
  return { ...state, selectedItem: column };
}

/**
 *
 * @param {*} state
 * @param {*} column
 */
function updateColumn(state, column) {
  const targetBoard = column.boardId ? column.boardId : state.activeBoardId;
  const board = { ...state[targetBoard] };
  const columns = board.columns;
  columns[column.id] = { ...column };
  return {
    ...state,
    [targetBoard]: { ...state[targetBoard], columns: { ...columns } },
    selectedItem: {},
  };
}

/**
 *
 * @param {*} state
 * @param {*} task
 */
function createTask(state, { task }) {
  const targetBoard = task.boardId ? task.boardId : state.activeBoardId;
  const board = { ...state[targetBoard] };
  const tasks = board.tasks;
  tasks[task.id] = task;
  return {
    ...state,
    [targetBoard]: { ...state[targetBoard], tasks: { ...tasks } },
    selectedItem: {},
  };
}

/**
 *
 * @param {*} state
 * @param {*} taskId
 * @param {*} boardId
 */
function deleteTask(state, taskId, boardId) {
  const targetBoard = boardId ? boardId : state.activeBoardId;
  const board = { ...state[targetBoard] };
  const tasks = board.tasks;
  delete tasks[taskId];
  return { ...state, tasks: { ...tasks }, selectedItem: {} };
}

function createBoard(state, { args }) {
  const { newBoard, newBoardsObject } = args;
  const boards = { ...state.boards };
  boards[newBoard.id] = newBoard;
  return {
    ...state,
    [newBoard.id]: newBoardsObject[newBoard.id],
    boards: boards,
  };
}

/**
 *
 * @param {*} state
 * @param {*} boardId
 */
function setActiveBoard(state, boardId) {
  return { ...state, activeBoardId: boardId };
}

/**
 *
 * @param {*} state
 * @param {*} boardId
 */
function deleteBoard(state, boardId) {
  const boards = { ...state.boards };
  delete boards[boardId];
  return { ...state, boards: { ...boards } };
}

function moveBoard(state, { boardId, toIndex }) {
  const boards = { ...state.boards };
  console.log("boards before", boards);
  const fromIndex = boards[boardId].index;

  const boardIds = getCollectionIds(state, "boards", "index");
  console.log("boardIds before", boardIds);
  boardIds.splice(fromIndex, 1);
  boardIds.splice(toIndex, 0, boardId);
  console.log("boardIds after", boardIds);
  // Update all columns' indexes
  updateCollectionIdexesFromList(boardIds, boards);
  console.log("boards after", boards);
  return {
    ...state,
    boards: boards,
  };
}
// function copyBoardFrom(state, boardId, copyColumns, copyTasks){

// }

// function copyColumnsFromBoard(state, boardId){

// }

// function copyTasksFromBoard(state, boardId){

// }
