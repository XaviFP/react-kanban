"use-strict";
import mongoose from "mongoose";
import "./models/Board.js";
const Board = mongoose.model("boards");
import "./models/Column.js";
const Column = mongoose.model("columns");
import "./models/Task.js";
const Task = mongoose.model("tasks");
import { indexSorting, updateCollectionIdexesFromList } from "./utils.js";

/*
 * COLUMN OPERATIONS
 */

export async function createBoard(payload) {
  try {
    const { board } = payload;
    delete board.id;
    board.index = await Board.countDocuments({});
    const newBoard = await new Board(board)
      .save()
      .then((board) => board.toJSON());
    const newBoardsObject = {};
    newBoardsObject[newBoard.id] = { columns: {} };

    for (const [index, title] of [
      "To do",
      "In progress",
      "In review",
      "Done",
    ].entries()) {
      const column = await new Column({
        title: title,
        index: index,
        boardId: newBoard.id,
      })
        .save()
        .then((column) => column.toJSON());

      newBoardsObject[newBoard.id].columns[column.id] = {
        id: column.id,
        index: index,
        title: title,
        boardId: newBoard.id,
      };
    }
    newBoardsObject[newBoard.id].tasks = {};

    return {
      ...payload,
      newBoard: newBoard,
      newBoardsObject: newBoardsObject,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function moveBoard(payload) {
  try {
    const { boardId, toIndex } = payload;
    const board = await Board.findById({ _id: boardId });
    const fromIndex = board.index;
    const boards = await Board.find({}).then((boards) =>
      boards.map((board) => board.toJSON())
    );
    const idKeyBoards = {};
    for (const board of boards.entries()) {
      idKeyBoards[board[1].id] = { ...board[1] };
    }

    const sortedBoardIds = boards.sort(indexSorting).map((board) => board.id);
    sortedBoardIds.splice(fromIndex, 1);
    sortedBoardIds.splice(toIndex, 0, boardId);

    // Update all boards' indexes
    updateCollectionIdexesFromList(sortedBoardIds, idKeyBoards);

    const updatedBoards = await Promise.all(
      Object.values(idKeyBoards).map(
        async (board) =>
          await Board.updateOne({ _id: board.id }, { index: board.index })
      )
    );
    console.log(`BOARD ${boardId} MOVED TO INDEX ${toIndex}`);
    return { ...payload };
  } catch (error) {
    console.log(error);
  }
}

export function getBoard(boardId) {}
export function updateBoard(boardId, req) {}
export function deleteBoard(boardId, req) {}

/*
 * COLUMN OPERATIONS
 */

export async function createColumn(payload) {
  try {
    const { column } = payload;
    delete column.id;
    column.index = await Column.countDocuments({ boardId: column.boardId });
    const newColumn = await new Column(column)
      .save()
      .then((newColumn) => newColumn.toJSON());
    console.log("NEW COLUMN CREATED:", newColumn);
    return {
      ...payload,
      column: newColumn,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function updateColumn(payload) {
  try {
    const { column } = payload;
    const updatedColumn = await Column.updateOne(
      { _id: column.id },
      { title: column.title, description: column.description }
    );
    console.log(`UPDATED COLUMN ${column.id}. NEW VALUES:`, updatedColumn);
    return { ...payload };
  } catch (error) {
    console.log(error);
  }
}

export async function moveColumn(payload) {
  try {
    const { columnId, toIndex } = payload;
    const column = await Column.findById({ _id: columnId });
    const fromIndex = column.index;
    const boardColumns = await Column.find({
      boardId: column.boardId,
    }).then((boardColumns) => boardColumns.map((column) => column.toJSON()));
    const idKeyColumns = {};
    for (const column of boardColumns.entries()) {
      idKeyColumns[column[1].id] = { ...column[1] };
    }

    const sortedColumnIds = boardColumns
      .sort(indexSorting)
      .map((column) => column.id);
    sortedColumnIds.splice(fromIndex, 1);
    sortedColumnIds.splice(toIndex, 0, columnId);

    // Update all columns' indexes
    updateCollectionIdexesFromList(sortedColumnIds, idKeyColumns);

    const updatedColumns = await Promise.all(
      Object.values(idKeyColumns).map(
        async (column) =>
          await Column.updateOne({ _id: column.id }, { index: column.index })
      )
    );
    console.log(`COLUMN ${columnId} MOVED TO INDEX ${toIndex}`);
    return { ...payload, boardId: column.boardId };
  } catch (error) {
    console.log(error);
  }
}

export async function deleteColumn(payload) {
  try {
    const { columnId } = payload;
    const updatedColumn = await Column.deleteOne({ _id: columnId });
    console.log(`DELETED COLUMN ${columnId}`);
    return { ...payload };
  } catch (error) {
    console.log(error);
  }
}

/*
 * TASK OPERATIONS
 */

export async function createTask(payload) {
  try {
    const { task } = payload;
    delete task.id;
    const column = await Column.findById({ _id: task.columnId });
    task.index = await Task.countDocuments({ columnId: task.columnId });
    task.boardId = column.boardId;
    const newTask = await new Task(task).save();
    console.log("NEW TASK CREATED:", newTask);

    return {
      ...payload,
      task: {
        id: newTask._id,
        title: newTask.title,
        columnId: newTask.columnId,
        index: newTask.index,
        tags: [],
        boardId: newTask.boardId,
      },
    };
  } catch (error) {
    console.log(error);
  }
}

export async function updateTask(payload) {
  try {
    const { task } = payload;
    const updatedTask = await Task.updateOne(
      { _id: task.id },
      { title: task.title, description: task.description }
    );
    console.log(`UPDATED TASK ${task.id}. NEW VALUES:`, updatedTask);
    return { ...payload };
  } catch (error) {
    console.log(error);
  }
}

export async function moveTask(payload) {
  try {
    const { taskId, toColumn, toIndex } = payload;
    const movedTask = await Task.findOne({ _id: taskId });
    const fromColumn = movedTask.columnId;
    const fromIndex = movedTask.index;
    let ids = [fromColumn, toColumn];
    const idKeyTasks = {};
    const affectedColumnTasks = await Task.find({
      columnId: { $in: ids },
    }).then((tasks) => tasks.map((task) => task.toJSON()));
    for (const task of affectedColumnTasks.entries()) {
      idKeyTasks[task[1].id] = { ...task[1] };
    }
    let columnTaskIds = {
      [fromColumn]: affectedColumnTasks
        .filter((task) => task.columnId.toString() === fromColumn.toString())
        .sort(indexSorting)
        .map((task) => task.id),
    };
    columnTaskIds[toColumn] =
      fromColumn === toColumn
        ? columnTaskIds[fromColumn]
        : affectedColumnTasks
            .filter((task) => task.columnId.toString() === toColumn.toString())
            .sort(indexSorting)
            .map((task) => task.id);
    // Delete task from origin column
    columnTaskIds[fromColumn].splice(fromIndex, 1);
    columnTaskIds[toColumn].splice(toIndex, 0, taskId);
    idKeyTasks[taskId].columnId = toColumn;
    for (const [, sortedTaskIds] of Object.entries(columnTaskIds)) {
      updateCollectionIdexesFromList(sortedTaskIds, idKeyTasks);
    }
    const updatedTasks = await Promise.all(
      Object.values(idKeyTasks).map(
        async (task) =>
          await Task.updateOne(
            { _id: task.id },
            { index: task.index, columnId: task.columnId }
          )
      )
    );
    console.log(
      `TASK ${taskId} MOVED TO COLUMN ${toColumn} AND INDEX ${toIndex}`
    );
    const column = await Column.findById({ _id: fromColumn });
    return { ...payload, boardId: column.boardId };
  } catch (error) {
    console.log(error);
  }
}

export async function deleteTask(payload) {
  try {
    const { taskId } = payload;
    const result = await Task.deleteOne({ _id: taskId });
    console.log(`DELETED TASK ${taskId}`);
    return { ...payload };
  } catch (error) {
    console.log(error);
  }
}

/*
 * SERVICE OPERATIONS MULTIPLEXER
 */

const actions = {
  board: {
    move: moveBoard,
    create: createBoard,
    delete: deleteBoard,
    update: updateBoard,
  },
  column: {
    move: moveColumn,
    create: createColumn,
    delete: deleteColumn,
    update: updateColumn,
  },
  task: {
    move: moveTask,
    create: createTask,
    delete: deleteTask,
    update: updateTask,
  },
};

export async function process(payload) {
  try {
    console.log("PAYLOAD RECEIVED", payload);
    const result = await actions[payload.type][payload.action](payload);
    return result;
  } catch (error) {
    return error;
  }
}

/*
 * FETCH INITIAL APPLICATION STATE
 */

export async function getAll() {
  try {
    const { dbBoards, dbColumns, dbTasks } = await fetchDatabase();
    const state = {};
    state.boards = {};
    let boardId = {};
    for (const board of dbBoards.entries()) {
      boardId = board[1].id;
      state.boards[boardId] = board[1];
      state[boardId] = {};
      state[boardId].columns = {};
      state[boardId].tasks = {};

      let filteredDbColumns = dbColumns.filter((column) => {
        return column.boardId.toString() === boardId.toString();
      });
      for (const column of filteredDbColumns.entries()) {
        state[boardId].columns[column[1].id.toString()] = column[1];

        let filterdDbTasks = dbTasks.filter(
          (task) => task.columnId.toString() === column[1].id.toString()
        );

        for (const task of filterdDbTasks.entries()) {
          state[boardId].tasks[task[1].id.toString()] = task[1];
        }
      }
    }
    state.activeBoardId = Object.values(state.boards)[0].id;
    return state;
  } catch (error) {
    console.log(error);
  }
}

async function fetchDatabase() {
  try {
    const dbBoards = await Board.find({}).then((boards) =>
      boards.map((board) => board.toJSON())
    );
    const dbColumns = await Column.find({}).then((columns) =>
      columns.map((column) => column.toJSON())
    );
    const dbTasks = await Task.find({}).then((tasks) =>
      tasks.map((task) => task.toJSON())
    );
    return { dbBoards, dbColumns, dbTasks };
  } catch (error) {
    console.log(error);
  }
}
