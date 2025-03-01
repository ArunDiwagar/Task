import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { updateTaskPriority } from "../store/taskSlice";

const priorityLevels = ["Low", "Medium", "High", "Urgent"];

const KanbanView = () => {
  const { task } = useSelector((state) => state.task);
  const dispatch = useDispatch();

  // Group tasks by priority
  const columns = {
    Low: task.filter((task) => task.priority === "Low"),
    Medium: task.filter((task) => task.priority === "Medium"),
    High: task.filter((task) => task.priority === "High"),
    Urgent: task.filter((task) => task.priority === "Urgent"),
  };

  // Handle drag and drop
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      dispatch(updateTaskPriority({ id: draggableId, priority: destination.droppableId }));
    }
  };

  // Priority Colors
  const getPriorityStyles = (priority) => {
    const styles = {
      Low: "bg-green-100 text-green-700 border-green-300",
      Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
      High: "bg-orange-100 text-orange-700 border-orange-300",
      Urgent: "bg-red-100 text-red-700 border-red-300",
    };
    return styles[priority] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-gray-50 min-h-screen">
        {priorityLevels.map((priority) => (
          <Droppable key={priority} droppableId={priority}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="w-full min-h-[450px] bg-white border border-gray-300 shadow-md rounded-lg p-4 flex flex-col"
              >
                {/* Priority Header */}
                <h2
                  className={`text-lg font-semibold mb-4 p-3 rounded-md text-center shadow-sm ${getPriorityStyles(priority)}`}
                >
                  {priority} <span className="text-sm opacity-75">({columns[priority].length})</span>
                </h2>

                {/* Task List */}
                <div className="flex-grow overflow-y-auto space-y-3">
                  {columns[priority].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-4 rounded-lg shadow hover:shadow-lg border border-gray-200 transition-all flex flex-col"
                        >
                          <h3 className="font-medium text-gray-800">{task.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          <span
                            className={`px-2 py-1 text-xs font-bold rounded-md mt-3 self-start ${getPriorityStyles(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanView;
