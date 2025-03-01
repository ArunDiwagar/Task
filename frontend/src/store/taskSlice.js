import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/task";

// ✅ Fetch Tasks
export const fetchTasks = createAsyncThunk("task/fetch", async () => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
});

// ✅ Add Task
export const addTask = createAsyncThunk("task/add", async (task) => {
  const response = await axios.post(API_URL, task, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
});

// ✅ Edit Task
export const editTask = createAsyncThunk("task/edit", async ({ id, title, status, priority }) => {
  const response = await axios.put(`${API_URL}/${id}`, { title, status, priority }, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
});


// ✅ Delete Task
export const deleteTask = createAsyncThunk("task/delete", async (id) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return id;
});

// ✅ Update Task Priority
export const updateTaskPriority = createAsyncThunk(
  "task/updatePriority",
  async ({ id, priority }) => {
    const response = await axios.patch(
      `${API_URL}/${id}/priority`,
      { priority },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  }
);




const taskSlice = createSlice({
  name: "task",
  initialState: { task: [], loading: false },
  reducers: {

  
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.task = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.task.push(action.payload);
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const index = state.task.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.task[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.task = state.task.filter((t) => t.id !== action.payload);
      })
      .addCase(updateTaskPriority.fulfilled, (state, action) => {
        const { id, priority } = action.payload;
        const task = state.task.find((t) => t.id === id);
        if (task) task.priority = priority;
      })

  },
});

export default taskSlice.reducer;
