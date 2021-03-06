import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { todo } from "../api/todoAPI";
import { filters as Filters } from "../reducers/filtersReducer";
import { generateRandomColor } from "../utils/helpers";

// createEntityAdapter: gives us an "adapter" object that contains several premade reducer functions
// getInitialState: returns an object that looks like { ids: [], entities: {} },
// for storing a normalized state of items along with an array of all item IDs
// getSelectors: generates a standard set of selector functions
export const todosAdapter = createEntityAdapter();
const initialState = todosAdapter.getInitialState({ status: "idle" });

// async thunk action creators
export const fetchTodos = createAsyncThunk("todos/fetchTodos", () =>
  todo.getAll().then((response) => response)
);

export const saveNewTodo = createAsyncThunk(
  "todos/createTodo",
  async (newTodo) => {
    return await todo.post({ ...newTodo }).then((response) => response);
  }
);

// createSlice uses a library called Immer inside.
// Immer uses a special JS tool called a Proxy to wrap the data you provide,
// and lets you write code that "mutates" that wrapped data.
// Immer tracks all the changes you've tried to make, and then uses that list of changes to return a safely immutably updated value
// You can only write "mutating" logic in Redux Toolkit's createSlice and createReducer because they use Immer inside
const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    // toggle todo completion status (completed: true || false)
    todoToggled(state, action) {
      const todo = state.entities[action.payload];
      todo.completed = !todo.completed;
    },
    // select color (a filter option) for each todo
    todoColorSelected: {
      reducer(state, action) {
        const { todoId, color } = action.payload;
        state.entities[todoId].color = color;
      },
      prepare(todoId, color) {
        return { payload: { todoId, color } };
      },
    },
    todoDeleted: todosAdapter.removeOne,
    // mark all todos as completed: true
    allTodosCompleted(state, action) {
      Object.values(state.entities).forEach((todo) => {
        todo.completed = true;
      });
    },
    // delete all completed todos
    completedTodosCleared(state, action) {
      const completedIds = Object.values(state.entities)
        .filter((todo) => todo.completed)
        .map((todo) => todo.id);
      todosAdapter.removeMany(state, completedIds);
    },
  },
  extraReducers: {
    [fetchTodos.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchTodos.fulfilled]: (state, action) => {
      const newEntities = {};
      action.payload.slice(0, 6).forEach((todo) => {
        newEntities[todo.id] = todo;
        newEntities[todo.id]["color"] = generateRandomColor();
      });
      todosAdapter.setAll(state, newEntities);
      state.status = "idle";
    },
    [saveNewTodo.fulfilled]: todosAdapter.addOne,
  },
});

export const {
  todoToggled,
  todoColorSelected,
  todoDeleted,
  allTodosCompleted,
  completedTodosCleared,
} = todosSlice.actions;

export default todosSlice.reducer;

// selectors
export const {
  selectAll: selectTodos,
  selectById: selectTodoById,
} = todosAdapter.getSelectors((state) => state.todos);

export const selectTodoIds = createSelector(
  selectTodos, // First, pass one or more "input selector" functions
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (todos) => todos.map((todo) => todo.id)
);

export const selectFilteredTodos = createSelector(
  selectTodos, // First input selector: all todos
  (state) => state.filters, // Second input selector: all filter values
  (todos, filters) => {
    // Output selector: receives both values
    const { status, colors } = filters;
    const showAllTodos = status === Filters.statuses.All;
    if (showAllTodos && colors.length === 0) return todos;

    const completedStatus = status === Filters.statuses.Completed;
    return todos.filter((todo) => {
      const statusMatches = showAllTodos || todo.completed === completedStatus;
      const colorMatches = colors.length === 0 || colors.includes(todo.color);
      return statusMatches && colorMatches;
    });
  }
);

export const selectFilteredTodoIds = createSelector(
  selectFilteredTodos, // Frist input: custom memoized selector
  (filteredTodos) => filteredTodos.map((todo) => todo.id)
);
