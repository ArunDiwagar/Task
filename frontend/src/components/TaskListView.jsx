import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import Swal from "sweetalert2";
import { deleteTask } from "../store/taskSlice";
import { MoreHorizontal } from "lucide-react";

// Three-dot icon

const TaskListView = () => {
  const { task } = useSelector((state) => state.task);
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Filter tasks based on search, status, and priority
  const filteredTasks = task.filter((t) =>
    t.title.toLowerCase().includes(filterText.toLowerCase()) &&
    (statusFilter ? t.status === statusFilter : true) &&
    (priorityFilter ? t.priority === priorityFilter : true)
  );

  // Handle Single Delete with Confirmation
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This task will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteTask(id));
        Swal.fire("Deleted!", "Task has been deleted.", "success");
        setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
      }
    });
  };

  // Handle Bulk Delete
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;

    Swal.fire({
      title: `Delete ${selectedRows.length} tasks?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete all!"
    }).then((result) => {
      if (result.isConfirmed) {
        selectedRows.forEach((id) => dispatch(deleteTask(id)));
        Swal.fire("Deleted!", `${selectedRows.length} tasks have been deleted.`, "success");
        setSelectedRows([]);
      }
    });
  };

  // Handle Row Selection
  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  //  Handle "Select All"
  const handleSelectAll = () => {
    if (selectedRows.length === filteredTasks.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredTasks.map((task) => task.id));
    }
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "bg-green-200 text-green-700";
      case "Medium":
        return "bg-yellow-200 text-yellow-700";
      case "High":
        return "bg-orange-200 text-orange-700";
      case "Urgent":
        return "bg-red-200 text-red-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const columns = [
    {
      name: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={selectedRows.length === filteredTasks.length}
        />
      ),
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.id)}
          onChange={() => handleRowSelect(row.id)}
        />
      ),
      width: "80px",
    },
    { name: "Title", selector: (row) => row.title, sortable: true },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.status === "Completed"
              ? "bg-green-200 text-green-700"
              : row.status === "In Progress"
              ? "bg-blue-200 text-blue-700"
              : "bg-yellow-200 text-yellow-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(row.priority)}`}
        >
          {row.priority}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
          <div className="relative">
             <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-200 rounded-md"
      >
        <MoreHorizontal className="w-5 h-5 text-gray-600" />
      </button>

      {/* Dropdown menu positioned to the right side */}
      {isOpen && (
        <div className="absolute left-full top-0 ml-2 w-28 bg-white border rounded-md shadow-lg z-10">
          <button
            onClick={() => navigate(`/edit/${row.id}`, { state: row })}
            className="flex w-full text-left px-4 py-2 text-sm text-blue-500 hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="flex w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
          >
            Delete
          </button>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search tasks..."
            className="border px-3 py-2 rounded-md text-sm w-64"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <select
            className="border px-3 py-2 rounded-md text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Not Started">Not Started</option>
          </select>
          <select
            className="border px-3 py-2 rounded-md text-sm"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <CSVLink
            data={filteredTasks}
            filename={"tasks.csv"}
            className="border px-4 py-2 rounded-md bg-gray-100"
          >
            Export CSV
          </CSVLink>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={handleBulkDelete}
          disabled={selectedRows.length === 0}
          className={`px-4 py-2 text-white rounded-md ${
            selectedRows.length > 0 ? "bg-red-500 hover:bg-red-600" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Delete Selected ({selectedRows.length})
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filteredTasks}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default TaskListView;
