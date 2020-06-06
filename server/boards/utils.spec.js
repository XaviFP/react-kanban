import {
  indexSorting,
  idSorting,
  getColumnTasks,
  getColumnTaskIds,
  getColumnIds,
  getTaskIds,
  updateCollectionIdexesFromList,
} from "./utils";

import { data, expected } from "./fixtures";
let testData = {};
let testBoard = {};
function refreshData() {
  return { ...data };
}

describe("helper functions", () => {
  beforeEach(() => {
    testData = refreshData();
    testBoard = testData[0];
  });
  describe("indexSorting", () => {
    it("should sort by increasing index", () => {
      const columnIdsSortedByIndex = Object.values(testBoard.columns)
        .sort(indexSorting)
        .map((column) => column.id);
      expect(columnIdsSortedByIndex).toEqual(expected.sortedColumnIdsByIndex);
    });
  });
  describe("idSorting", () => {
    it("should sort by increasing id", () => {
      const columnIdsSortedById = Object.values(testBoard.columns)
        .sort(idSorting)
        .map((column) => column.id);
      expect(columnIdsSortedById).toEqual(expected.sortedColumnIdsById);
    });
  });
  describe("getColumnTasks", () => {
    it("should return column's tasks", () => {
      const column1Tasks = getColumnTasks(1, testBoard.tasks).sort(idSorting);
      expect(column1Tasks).toEqual(expected.column1Tasks);
    });
  });
  describe("getColumnTaskIds", () => {
    it("should return column's taskIds sorted by index", () => {
      const column1TaskIds = getColumnTaskIds(1, testBoard.tasks);
      expect(column1TaskIds).toEqual(expected.column1TaskIds);
    });
  });
  describe("getTaskIds", () => {
    it("should return all taskIds sorted by id", () => {
      const taskIdsById = getTaskIds(testBoard.tasks);
      expect(taskIdsById).toEqual(expected.taskIdsById);
    });
  });
  describe("getColumnIds", () => {
    it("should return all column ids sorted by index", () => {
      const sortedColumnIdsByIndex = getColumnIds(testBoard.columns);
      expect(sortedColumnIdsByIndex).toEqual(expected.sortedColumnIdsByIndex);
    });
  });
  describe("updateCollectionIdexesFromList", () => {
    it("should update all the indexes of the items in the sorted by index list", () => {
      updateCollectionIdexesFromList(
        expected.reorderedColumn1TaskIds,
        testBoard.tasks
      );
      for (const [index, id] of expected.reorderedColumn1TaskIds.entries()) {
        expect(testBoard.tasks[id].index).toEqual(index.toString());
      }
    });
  });
});
