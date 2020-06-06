"use-strict";
import mongoose from "mongoose";
import dbHandler from "../tests/dbHandler";
import "./models/Board.js";
import "./models/Column.js";
import "./models/Task.js";
import {
  createBoard,
  createColumn,
  createTask,
  deleteColumn,
  deleteTask,
  moveBoard,
  moveColumn,
  moveTask,
  updateColumn,
  updateTask,
} from "./service.js";
import { indexSorting } from "./utils.js";
const Board = mongoose.model("boards");
const Column = mongoose.model("columns");
const Task = mongoose.model("tasks");

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Board test suite.
 */
describe("Boards ", () => {
  describe("board ", () => {
    /**
     * Tests that a valid board can be created through the boardService.
     */
    it("can be created correctly", async () => {
      const result = await createBoard({ board: { title: "Board" } });
      expect(result).toBeDefined();
      expect(result).toHaveProperty("newBoard");
      let newBoard = result.newBoard;
      expect(result.newBoard).toHaveProperty("id");
      expect(result).toHaveProperty("newBoardsObject");
      const newBoardsObject = result.newBoardsObject;
      expect(newBoardsObject[newBoard.id]).toHaveProperty("columns");
      expect(Object.keys(newBoardsObject[newBoard.id].columns)).toHaveLength(4);
      expect(newBoardsObject[newBoard.id]).toHaveProperty("tasks");
      expect(newBoardsObject[newBoard.id].tasks).toStrictEqual({});

      newBoard = await Board.findOne({})
        .exec()
        .then((board) => board.toJSON());
      //   const newBoard = object.toJSON();
      expect(newBoard).toBeDefined();
      expect(newBoard).toHaveProperty("id");
      expect(newBoard.id).toEqual(result.newBoard.id);
      expect(newBoard.index).toEqual("0");
    });

    /**
     * Tests that a board index can be changed thus reordering the rest of boards' indexes.
     */
    it("can be moved", async () => {
      const { newBoard: board0 } = await createBoard({
        board: { title: "Board0" },
      });
      const { newBoard: board1 } = await createBoard({
        board: { title: "Board1" },
      });
      const { newBoard: board2 } = await createBoard({
        board: { title: "Board2" },
      });
      expect(board0.index).toEqual("0");
      expect(board1.index).toEqual("1");
      expect(board2.index).toEqual("2");
      await moveBoard({ boardId: board2.id, toIndex: "0" });

      const newBoard0 = await Board.findOne({
        _id: board0.id,
      }).then((board) => board.toJSON());
      const newBoard1 = await Board.findOne({ _id: board1.id }).then((board) =>
        board.toJSON()
      );
      const newBoard2 = await Board.findOne({ _id: board2.id }).then((board) =>
        board.toJSON()
      );

      expect(newBoard0.index).toEqual("1");
      expect(newBoard1.index).toEqual("2");
      expect(newBoard2.index).toEqual("0");
    });
  });
  describe("column ", () => {
    /**
     * Tests that a valid column can be created through the boardService.
     */
    it("can be created correctly", async () => {
      const { newBoard, newBoardsObject } = await createBoard({
        board: { title: "Board" },
      });
      expect(Object.keys(newBoardsObject[newBoard.id].columns)).toHaveLength(4);
      const { column: newColumn } = await createColumn({
        column: { title: "Column", boardId: newBoard.id },
      });
      expect(newColumn).toHaveProperty("id");
      expect(newColumn.index).toEqual("4");
      expect(newColumn.boardId.toString()).toEqual(newBoard.id.toString());
      const boardColumns = await Column.find({})
        .exec()
        .then((boards) => boards.map((board) => board.toJSON()));
      expect(boardColumns.length).toEqual(5);
    });
    /**
     * Tests that a column index can be changed thus reordering the rest of board columns' indexes.
     */
    it("can be moved", async () => {
      const { newBoard, newBoardsObject } = await createBoard({
        board: { title: "Board" },
      });
      const sortedColumns = Object.values(
        newBoardsObject[newBoard.id].columns
      ).sort(indexSorting);
      expect(sortedColumns[0].index).toEqual(0);
      expect(sortedColumns[1].index).toEqual(1);
      expect(sortedColumns[2].index).toEqual(2);
      expect(sortedColumns[3].index).toEqual(3);
      const { boardId } = await moveColumn({
        columnId: sortedColumns[2].id,
        toIndex: "0",
      });
      expect(boardId.toString()).toEqual(newBoard.id.toString());
      const boardColumns = await Column.find({})
        .exec()
        .then((boards) => boards.map((board) => board.toJSON()));
      const idKeyColumns = {};
      for (const column of boardColumns.entries()) {
        idKeyColumns[column[1].id] = { ...column[1] };
      }
      expect(idKeyColumns[sortedColumns[0].id].index).toEqual("1");
      expect(idKeyColumns[sortedColumns[1].id].index).toEqual("2");
      expect(idKeyColumns[sortedColumns[2].id].index).toEqual("0");
      expect(idKeyColumns[sortedColumns[3].id].index).toEqual("3");
    });
    /**
     * Tests that a column can be updated through the boardService.
     */
    it("can be updated correctly", async () => {
      const { newBoard, newBoardsObject } = await createBoard({
        board: { title: "Board" },
      });
      expect(Object.keys(newBoardsObject[newBoard.id].columns)).toHaveLength(4);
      const { column: newColumn } = await createColumn({
        column: { title: "Column", boardId: newBoard.id },
      });
      expect(newColumn).toHaveProperty("id");
      expect(newColumn.index).toEqual("4");
      expect(newColumn.title).toEqual("Column");
      await updateColumn({
        column: { title: "UpdatedColumn", id: newColumn.id },
      });
      const updatedColumn = await Column.findOne({
        _id: newColumn.id,
      }).then((board) => board.toJSON());
      expect(updatedColumn.title).toEqual("UpdatedColumn");
    });
    /**
     * Tests that a column can be deleted through the boardService.
     */
    it("can be deleted correctly", async () => {
      const { newBoard, newBoardsObject } = await createBoard({
        board: { title: "Board" },
      });
      expect(Object.keys(newBoardsObject[newBoard.id].columns)).toHaveLength(4);
      const { column: newColumn } = await createColumn({
        column: { title: "Column", boardId: newBoard.id },
      });
      expect(newColumn).toHaveProperty("id");
      expect(newColumn.index).toEqual("4");
      expect(newColumn.title).toEqual("Column");
      await deleteColumn({
        columnId: newColumn.id,
      });
      const updatedColumn = await Column.findOne({
        _id: newColumn.id,
      });
      expect(updatedColumn).toEqual(null);
    });
  });
  describe("task ", () => {
    /**
     * Tests that a valid task can be created through the boardService.
     */
    it("can be created correctly", async () => {
      const { newBoard } = await createBoard({
        board: { title: "Board" },
      });
      const { column: newColumn } = await createColumn({
        column: { title: "Column", boardId: newBoard.id },
      });
      let numberOfTasks = await Task.countDocuments({}).exec();
      expect(numberOfTasks).toEqual(0);
      const { task: newTask } = await createTask({
        task: { title: "Task title", columnId: newColumn.id },
      });
      numberOfTasks = await Task.countDocuments({}).exec();
      expect(numberOfTasks).toEqual(1);
      numberOfTasks = await Task.countDocuments({
        columnId: newColumn.id,
      }).exec();
      expect(numberOfTasks).toEqual(1);
      const createdTask = await Task.findById({
        _id: newTask.id,
      }).then((task) => task.toJSON());
      expect(createdTask).toHaveProperty("index");
      expect(createdTask).toHaveProperty("title");
      expect(createdTask.index).toEqual("0");
      expect(createdTask.title).toEqual("Task title");
    });
    /**
     * Tests that a task can be updated through the boardService.
     */
    it("can be updated correctly", async () => {
      const { newBoard } = await createBoard({
        board: { title: "Board" },
      });
      const { column: newColumn } = await createColumn({
        column: { title: "Column", boardId: newBoard.id },
      });
      let numberOfTasks = await Task.countDocuments({}).exec();
      expect(numberOfTasks).toEqual(0);
      const { task: newTask } = await createTask({
        task: { title: "Task title", columnId: newColumn.id },
      });
      numberOfTasks = await Task.countDocuments({}).exec();
      expect(numberOfTasks).toEqual(1);
      numberOfTasks = await Task.countDocuments({
        columnId: newColumn.id,
      }).exec();
      expect(numberOfTasks).toEqual(1);
      await updateTask({ task: { id: newTask.id, title: "Updated Title" } });
      const updatedTask = await Task.findById({
        _id: newTask.id,
      }).then((task) => task.toJSON());
      expect(updatedTask).toHaveProperty("title");
      expect(updatedTask.title).toEqual("Updated Title");
    });
    /**
     * Tests that a task can be deleted through the boardService.
     */
    it("can be deleted correctly", async () => {
      const { newBoard } = await createBoard({
        board: { title: "Board" },
      });
      const { column: newColumn } = await createColumn({
        column: { title: "Column", boardId: newBoard.id },
      });
      let numberOfTasks = await Task.countDocuments({}).exec();
      expect(numberOfTasks).toEqual(0);
      const { task: newTask } = await createTask({
        task: { title: "Task title", columnId: newColumn.id },
      });
      numberOfTasks = await Task.countDocuments({}).exec();
      expect(numberOfTasks).toEqual(1);
      numberOfTasks = await Task.countDocuments({
        columnId: newColumn.id,
      }).exec();
      expect(numberOfTasks).toEqual(1);
      await deleteTask({ taskId: newTask.id });
      numberOfTasks = await Task.countDocuments({}).exec();
      expect(numberOfTasks).toEqual(0);
    });
    /**
     * Tests that a task index and columnId can be changed
     * thus reordering the rest of tasks in previous and new columns' indexes.
     */
    it("can be moved", async () => {
      const { newBoard, newBoardsObject } = await createBoard({
        board: { title: "Board" },
      });
      const sortedColumns = Object.values(
        newBoardsObject[newBoard.id].columns
      ).sort(indexSorting);
      expect(sortedColumns[0].index).toEqual(0);
      expect(sortedColumns[1].index).toEqual(1);
      expect(sortedColumns[2].index).toEqual(2);
      expect(sortedColumns[3].index).toEqual(3);

      let numberOfTasks = await Task.countDocuments({}).exec();
      expect(numberOfTasks).toEqual(0);

      let { task: newTask0 } = await createTask({
        task: { title: "Task0 title", columnId: sortedColumns[0].id },
      });
      let { task: newTask1 } = await createTask({
        task: { title: "Task1 title", columnId: sortedColumns[0].id },
      });
      let { task: newTask2 } = await createTask({
        task: { title: "Task2 title", columnId: sortedColumns[1].id },
      });
      let { task: newTask3 } = await createTask({
        task: { title: "Task3 title", columnId: sortedColumns[1].id },
      });
      numberOfTasks = await Task.countDocuments({}).exec();
      expect(numberOfTasks).toEqual(4);
      numberOfTasks = await Task.countDocuments({
        columnId: sortedColumns[0].id,
      }).exec();
      expect(numberOfTasks).toEqual(2);
      numberOfTasks = await Task.countDocuments({
        columnId: sortedColumns[1].id,
      }).exec();
      expect(numberOfTasks).toEqual(2);
      await moveTask({
        taskId: newTask0.id,
        toColumn: sortedColumns[1].id,
        toIndex: "1",
      });
      numberOfTasks = await Task.countDocuments({}).exec();
      expect(numberOfTasks).toEqual(4);

      numberOfTasks = await Task.countDocuments({
        columnId: sortedColumns[0].id,
      }).exec();
      expect(numberOfTasks).toEqual(1);

      numberOfTasks = await Task.countDocuments({
        columnId: sortedColumns[1].id,
      }).exec();
      expect(numberOfTasks).toEqual(3);

      newTask0 = await Task.findById({
        _id: newTask0.id,
      }).then((task) => task.toJSON());

      newTask1 = await Task.findById({
        _id: newTask1.id,
      }).then((task) => task.toJSON());

      newTask2 = await Task.findById({
        _id: newTask2.id,
      }).then((task) => task.toJSON());

      newTask3 = await Task.findById({
        _id: newTask3.id,
      }).then((task) => task.toJSON());

      expect(newTask0.columnId.toString()).toEqual(
        sortedColumns[1].id.toString()
      );
      expect(newTask0.index).toEqual("1");

      expect(newTask1.columnId.toString()).toEqual(
        sortedColumns[0].id.toString()
      );
      expect(newTask1.index).toEqual("0");

      expect(newTask2.columnId.toString()).toEqual(
        sortedColumns[1].id.toString()
      );
      expect(newTask2.index).toEqual("0");

      expect(newTask3.columnId.toString()).toEqual(
        sortedColumns[1].id.toString()
      );
      expect(newTask3.index).toEqual("2");
    });
  });
});
