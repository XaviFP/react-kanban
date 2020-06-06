import { board } from "./reducers";
import actions from "./actions";
import { data } from "./fixtures";

function refreshData() {
  return { ...data };
}

let testData = {};
let testBoard = {};
describe("board reducer", () => {
  beforeEach(() => {
    testData = refreshData();
    testBoard = testData[0];
  });

  describe("moveTask action", () => {
    it("should update given task to given column and index", () => {
      const newState = board(
        testData,
        actions.moveTask({
          taskId: "382",
          toColumn: "3",
          toIndex: "0",
          boardId: "0",
        })
      );
      expect(newState[0].tasks["382"].columnId).toEqual("3");
      expect(newState[0].tasks["382"].index).toEqual("0");
    });
  });

  describe("moveColumn action", () => {
    it("should update given column to given index", () => {
      const newState = board(
        testData,
        actions.moveColumn({ columnId: "2", toIndex: "0", boardId: "0" })
      );
      expect(newState[0].columns["2"].index).toEqual("0");
    });
  });
});
