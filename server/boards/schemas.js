import Joi from "joi";
import { itemTypes, itemActions } from "../constants.js";

export const validationOptions = {
  abortEarly: false, // abort after the last validation error
  allowUnknown: true, // allow unknown keys that will be ignored
  stripUnknown: false, // remove unknown keys from the validated data
};

export const payloadDataSchema = Joi.object({
  type: Joi.string().valid(Object.values(itemTypes)).required(),
  action: Joi.string().valid(Object.values(itemActions)).required(),
});

const moveTaskSchema = Joi.object({
  taskId: Joi.string().required(),
  toColumn: Joi.string().required(),
  toIndex: Joi.number().integer().min(0).required(),
});

const createTaskSchema = Joi.object({
  task: Joi.object({
    columnId: Joi.string().required(),
    boardId: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string(),
  }),
});

const updateTaskSchema = Joi.object({
  task: Joi.object({
    task: Joi.object({
      id: Joi.string().required(),
      columnId: Joi.string().required(),
      boardId: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string(),
    }),
  }),
});

const deleteTaskSchema = Joi.object({
  taskId: Joi.string().required(),
});

const moveColumnSchema = Joi.object({
  columnId: Joi.string().required(),
  toIndex: Joi.number().integer().min(0).required(),
});

const createColumnSchema = Joi.object({
  column: Joi.object({
    boardId: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string(),
  }),
});

const updateColumnSchema = Joi.object({
  column: Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string(),
  }),
});

const deleteColumnSchema = Joi.object({
  columnId: Joi.string().required(),
});

const createBoardSchema = Joi.object({
  board: Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
  }),
});

const moveBoardSchema = Joi.object({
  boardId: Joi.string().required(),
  toIndex: Joi.number().integer().min(0).required(),
});

// export the schemas
const schemas = {
  board: {
    move: moveBoardSchema,
    create: createBoardSchema,
    // delete: deleteBoard,
    // update: updateBoard,
  },
  column: {
    move: moveColumnSchema,
    create: createColumnSchema,
    delete: deleteColumnSchema,
    update: updateColumnSchema,
  },
  task: {
    move: moveTaskSchema,
    create: createTaskSchema,
    delete: deleteTaskSchema,
    update: updateTaskSchema,
  },
};

export default schemas;
