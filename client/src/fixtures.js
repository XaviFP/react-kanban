export const data = {
  boards: {
    "0": {
      id: "0",
      index: "0",
      title: "Project X",
    },
  },
  "0": {
    columns: {
      "0": {
        id: "0",
        index: "4",
        title: "Backlog",
        boardId: "0",
      },
      "1": {
        id: "1",
        index: "1",
        title: "TODO",
        boardId: "0",
      },
      "2": {
        id: "2",
        index: "2",
        title: "In Progress",
        boardId: "0",
      },
      "3": {
        id: "3",
        index: "3",
        title: "In Review",
        boardId: "0",
      },
      "4": {
        id: "4",
        index: "0",
        title: "Done",
        boardId: "0",
      },
    },
    tasks: {
      "382": {
        id: "382",
        columnId: "0",
        index: "0",
        title:
          "Refactor code to encapsulate logic units in functions that define their behaviour.",
        description: "",
        tags: [
          { id: 0, name: "C++" },
          { id: 1, name: "GNU" },
        ],
      },
      "312": {
        id: "312",
        columnId: "0",
        index: "1",
        title: "Refactor code to use the least amount of deep copies.",
        description: "",
        tags: [{ id: 2, name: "Securiy" }],
      },
      "408": {
        id: "408",
        columnId: "0",
        index: "2",
        title:
          "Prevent state tasks to be modified until dragged task is dropped.",
        description: "",
        tags: [
          { id: 0, name: "C++" },
          { id: 3, name: "Graphics" },
        ],
      },
      "256": {
        id: "256",
        columnId: "0",
        index: "3",
        title:
          "Write test for all logic units involved in application state modification.",
        description: "",
        tags: [
          { id: 4, name: "Legal" },
          { id: 5, name: "Tax" },
        ],
      },
      "198": {
        id: "198",
        columnId: "0",
        index: "4",
        title: "Add ability to move columns",
        description: "",
        tags: [
          { id: 6, name: "Android" },
          { id: 7, name: "F-droid" },
        ],
      },
      "545": {
        id: "545",
        columnId: "0",
        index: "5",
        title: "Add backend with persistence and containerize the application.",
        description: "",
        tags: [
          { id: 0, name: "A" },
          { id: 1, name: "B" },
          { id: 2, name: "C" },
          { id: 3, name: "D" },
        ],
      },
      "302": {
        id: "302",
        columnId: "1",
        index: "0",
        title: "Send Tax paperwork",
        description: "",
        tags: [
          { id: 4, name: "Legal" },
          { id: 5, name: "Tax" },
        ],
      },
      "535": {
        id: "535",
        columnId: "1",
        index: "2",
        title: "Do the shopping",
        description: "",
        tags: [
          { id: 4, name: "Legal" },
          { id: 5, name: "Tax" },
        ],
      },
      "500": {
        id: "500",
        columnId: "1",
        index: "1",
        title: "Other legal stuff",
        description: "",
        tags: [
          { id: 4, name: "Legal" },
          { id: 5, name: "Tax" },
        ],
      },
      "199": {
        id: "199",
        columnId: "2",
        index: "0",
        title:
          "Fix free document reader issue after fresh install on Android 10",
        description: "",
        tags: [
          { id: 6, name: "Android" },
          { id: 7, name: "F-droid" },
        ],
      },
      "200": {
        id: "200",
        columnId: "3",
        index: "0",
        title: "Learn React",
        description: "",
        tags: [],
      },
      "156": {
        id: "156",
        columnId: "4",
        index: "0",
        title: "Update kernel version",
        description: "",
        tags: [{ id: 2, name: "Securiy" }],
      },
    },
  },
};

export const expected = {
  sortedColumnIdsByIndex: ["4", "1", "2", "3", "0"],
  sortedColumnIdsById: ["0", "1", "2", "3", "4"],
  column1TaskIds: ["302", "500", "535"],
  taskIdsById: [
    "156",
    "198",
    "199",
    "200",
    "256",
    "302",
    "312",
    "382",
    "408",
    "500",
    "535",
    "545",
  ],
  nextId: "546",
  column1Tasks: [
    {
      id: "302",
      columnId: "1",
      index: "0",
      title: "Send Tax paperwork",
      description: "",
      tags: [
        { id: 4, name: "Legal" },
        { id: 5, name: "Tax" },
      ],
    },
    {
      id: "500",
      columnId: "1",
      index: "1",
      title: "Other legal stuff",
      description: "",
      tags: [
        { id: 4, name: "Legal" },
        { id: 5, name: "Tax" },
      ],
    },
    {
      id: "535",
      columnId: "1",
      index: "2",
      title: "Do the shopping",
      description: "",
      tags: [
        { id: 4, name: "Legal" },
        { id: 5, name: "Tax" },
      ],
    },
  ],
  reorderedColumn1TaskIds: ["535", "500", "302"],
};

export default { data };
