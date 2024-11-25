import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faUsers, faComment, faSliders, faPlus, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../utilities/axios/axiosInstance";
import { Link, useNavigate } from 'react-router-dom';
import TaskDetails from "../components/TaskDetails";

const Board = () => {
  const [taskData, setTaskData] = useState({
    inTestTasks: [],
    inProgressTasks: [],
    completedTasks: [],
    todayAssignedTasks: [],
  });
  const [filterLabel, setFilterLabel] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [collapsedColumns, setCollapsedColumns] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  // Fetch tasks from the API
  useEffect(() => {
    axiosInstance.get("task/getTaskDashboard/TeamLead1")
      .then(response => {
        setTaskData(response.data.message || {
          inTestTasks: [],
          inProgressTasks: [],
          completedTasks: [],
          todayAssignedTasks: [],
        });  
      })
      .catch(error => {
        console.error("Error fetching task data:", error);
      });
  }, []);

  const labels = [
    ...new Set([
      ...taskData.inTestTasks?.flatMap((task) => task.taskName) || [],
      ...taskData.inProgressTasks?.flatMap((task) => task.taskName) || [],
      ...taskData.completedTasks?.flatMap((task) => task.taskName) || [],
      ...taskData.todayAssignedTasks?.flatMap((task) => task.taskName) || []
    ]),
  ];

  const handleFilterChange = (label) => {
    setFilterLabel(label);
    setShowFilterDropdown(false);
  };

  const filteredColumns = [
    {
      title: "TODAY ASSIGNED",
      color: "green",
      tasks: taskData.todayAssignedTasks.filter(task => filterLabel ? task.taskName === filterLabel : true),
      path: "today-assigned", // Unique identifier for the column
    },
    {
      title: "IN PROGRESS",
      color: "yellow",
      tasks: taskData.inProgressTasks.filter(task => filterLabel ? task.taskName === filterLabel : true),
      path: "in-progress",
    },
    {
      title: "IN TEST",
      color: "red",
      tasks: taskData.inTestTasks.filter(task => filterLabel ? task.taskName === filterLabel : true),
      path: "in-test",
    },
    {
      title: "COMPLETED",
      color: "teal",
      tasks: taskData.completedTasks.filter(task => filterLabel ? task.taskName === filterLabel : true),
      path:"completed",
    },
  ];

  const generateRandomColor = () => {
    const colors = [
      "bg-green-200", "bg-blue-200", "bg-yellow-200", "bg-red-200", "bg-teal-200", "bg-purple-200", "bg-pink-200",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const toggleColumn = (colIndex) => {
    setCollapsedColumns((prev) => ({
      ...prev,
      [colIndex]: !prev[colIndex],
    }));
  };

  const handleAddTask = () => {
    navigate('/addtasks'); 
  };


  // const handleTaskClick = (task) => {
  //   navigate(`/task/${task.id}`, { state: { task } }); 
  // };

  // const handleTaskClick = (task) => {
  //   setSelectedTask(task);
  // };

  const handleTaskClick = (task, columnTitle) => {
    setSelectedTask({ task, columnTitle });
  };
  

  return (
    <div className="p-2 bg-gray-100 min-h-screen">
    {/* Header Section */}
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 md:space-y-0">
      <h1 className="text-2xl font-bold text-gray-700 bg-teal-100 rounded-lg w-60 h-9 text-center">DESIGN TEAM</h1>
      <div className="flex space-x-4 flex-wrap items-center sm:ml-auto sm:space-x-4 md:space-x-6">
          <button onClick={handleAddTask} className="flex items-center px-4 py-2 bg-teal-500 text-white font-bold rounded-2xl hover:bg-green-600">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add a task
          </button>
          <div className="relative">
            <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300">
              <FontAwesomeIcon icon={faSliders} className="mr-2" />
              Filter
            </button>
            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-2 w-30 max-w-13 bg-white border rounded shadow-lg z-10">
                <button onClick={() => handleFilterChange("")} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">All</button>
                {labels.map((label, index) => (
                  <button key={index} onClick={() => handleFilterChange(label)} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">{label}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Board Columns */}
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
      {filteredColumns.map((column, colIndex) => (
   <div key={colIndex} className="flex-2">
    {/* <Link to={column.path} className="w-full"> */}
      <div className="flex items-center justify-between lg:justify-between cursor-pointer border-b-2 pb-2"
        style={{
          borderColor: column.color === "green" ? "green" :
            column.color === "yellow" ? "yellow" :
              column.color === "red" ? "red" :
                column.color === "teal" ? "teal" : "gray"
        }}
        onClick={() => toggleColumn(colIndex)}
      >
                <h2 className={`font-semibold p-2 ${column.color === "green" ? "text-gray-600" :
                  column.color === "yellow" ? "text-gray-600" :
                    column.color === "red" ? "text-gray-600" :
                      column.color === "teal" ? "text-gray-600" : "text-gray-600"} flex-grow`}>
                  {column.title}
                </h2>

                {/* Task Count */}
                <span className="flex items-center justify-center w-6 h-6 bg-gray-200 text-xs rounded-full ml-auto">
                  {column.tasks.length}
                </span>

                {/* Toggle Icon for mobile */}
                <FontAwesomeIcon
                  icon={collapsedColumns[colIndex] ? faChevronDown : faChevronUp}
                  className="ml-5 lg:hidden cursor-pointer"
                  onClick={(e) => { e.preventDefault(); toggleColumn(colIndex); }} // Only toggle visibility on click for mobile
                />
              </div>
            {/* </Link> */}

           {/* Mobile Dropdown */}
{showFilterDropdown && (
  <div className="absolute top-full left-0 mt-2 w-30 max-w-13 bg-white border rounded shadow-lg z-10">
    <button onClick={() => handleFilterChange("")} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">All</button>
    {labels.map((label, index) => (
      <button key={index} onClick={() => handleFilterChange(label)} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">{label}</button>
    ))}
  </div>
)} 

            {/* Tasks - Visible on Desktop and toggled on Mobile */}
            {!collapsedColumns[colIndex] && (
  <div className="mt-4">
    {column.tasks.map((task, taskIndex) => (
      <div
        key={taskIndex}
        className="bg-white shadow rounded-lg p-4 mb-4 relative border border-gray-400"
        onClick={() => handleTaskClick(task, column.title)}
        // Added onClick for selecting task
      >
        {/* Task Details with Conditional Rendering for Completed Tasks */}
        <div className="absolute top-2 right-2">
          {task.taskStatus === "Completed" ? (
            <div className="flex items-center text-green-500 text-xs font-bold">
              <span className="mr-1">✔✔</span>
              <span>Done</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-500 text-xs">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="mr-1"
              />
              <span>{task.deadline}</span>
            </div>
          )}
        </div>
        {task.taskName && (
          <span
            className={`text-xs font-semibold mb-2 inline-block px-2 py-1 rounded ${generateRandomColor()}`}
          >
            {task.taskName}
          </span>
        )}
        <div className="flex justify-between">
          <div>
            <div className="text-sm text-gray-600">
              <FontAwesomeIcon icon={faUsers} className="mr-1" />
              {task.assignedTo}
            </div>
            <div className="text-sm text-gray-600">
              <FontAwesomeIcon icon={faComment} className="mr-1" />
              {task.commentsCount} Comments
            </div>
          </div>
          <div className="text-xs text-gray-600">
            <FontAwesomeIcon icon={faSliders} className="mr-1" />
            {task.status}
          </div>
        </div>
      </div>
    ))}
  </div>
)}

          </div>
        ))}
      </div>
{/* Task Details Modal */}
{selectedTask && (
  <TaskDetails task={selectedTask.task} onClose={() => setSelectedTask(null)} />
)}
    </div>
  );
};

export default Board;
