import { Icon } from "@iconify/react";
import { useLocation } from "react-router-dom"; 

const TaskDetails = () => {
  const location = useLocation(); // To get state passed via navigate
  const { taskId } = useParams(); // If task ID is part of the URL
  const task = location.state?.task; // Extract the task passed via state

  

  
  if (!task) {
    return <div>No task selected or task data unavailable!</div>;
  }
  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
    <h3 className="mt-4 text-lg md:text-xl font-semibold text-gray-800">
      {task.taskName} {/* Updated */}
    </h3>


      {/* Task Info */}
      <div className="mt-4 text-sm md:text-base font-normal text-gray-600 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <Icon icon="ic:outline-watch-later" height={18} width={18} />
            <span className="ml-2">Status:</span>
            <span className="ml-1 font-medium">{task.taskStatus}</span> {/* Updated */}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <Icon icon="ic:outline-calendar-today" />
            <span className="ml-2">Due Date:</span>
            <span className="font-medium">{task.deadline}</span> {/* Updated */}
          </div>
        </div>

        {/* Assigned To */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <Icon icon="lucide:users" />
            <span className="ml-2">Assigned to:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {task.assignedTo.map((person, index) => (
              <div key={index} className="flex items-center gap-2">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-gray-700 font-medium">{person.name}</span>
              </div>
            ))}
          </div>
        </div>
      

        {/* Assigned By */}
        <div className="flex flex-wrap items-center">
          <Icon icon="mdi:user-outline" height={22} width={22} />
          <span className="ml-2">Assigned by:</span>
          <div className="flex items-center gap-2 ml-3">
            <img
              src={task.assignedBy.image}
              alt={task.assignedBy.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-gray-700 font-medium">
              {task.assignedBy.name}
            </span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-8">
        <div className="flex items-center gap-2">
          <Icon icon="tabler:file-description" height={22} width={22} />
          <h2 className="text-base font-semibold">Description</h2>
        </div>
        <textarea
  value={task.description || ''} // Ensure the value is from task
  placeholder="Description"
  className="w-full p-2 mt-4 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md resize-none focus:outline-none"
/>
      </div>

      {/* Attachments Section */}
      <div className="mt-4">
        <div className="flex justify-between">
          <div className=" flex gap-2">
            <Icon icon="cuida:attachment-clip-outline" height={22} width={22} />
            <h4 className="text-base font-semibold text-gray-400">
              Attachments ({task.attachments.length})
            </h4>
          </div>
          <div className=" flex gap-2 text-blue-400 cursor-pointer">
            <h2>Download</h2>
            <div>
              <Icon
                icon="material-symbols-light:download"
                height={22}
                width={22}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-2">
  {task.attachments && task.attachments.length > 0 ? (
    task.attachments.map((file, index) => (
      <div key={index} className="flex items-center gap-3 p-2 border rounded-md border-gray-300 bg-gray-50 w-full md:w-80">
        {/* File rendering */}
      </div>
    ))
  ) : (
    <div>No attachments available.</div> // If no attachments
  )}
</div>
      </div>

      {/* Comments Section */}
      <div className="mt-4">
        <div className="flex items-center gap-2">
        <Icon icon="ic:outline-watch-later" height={18} width={18} />

          <h4 className="text-base font-semibold">
            Comments ({task.comments.length})
          </h4>
        </div>
        <div className="space-y-2 mt-2">
  {task.comments.map((comment, index) => (
    <div
      key={index}
      className="flex items-center gap-2 p-2 text-sm text-gray-700 bg-blue-100 border border-gray-300 rounded-md"
    >
      <img
        src={comment.userImage}
        alt={comment.user}
        className="w-6 h-6 rounded-full"
      />
      <div>{comment.text}</div>
    </div>
  ))}
</div>

      </div>

      {/* Status Change Section */}
      <div
       className={`mt-4 flex flex-wrap gap-2 items-center ${
        task.status === "In Test" ? "bg-red-300" : "bg-orange-100"
      } p-4 rounded-md`}
    >
        <span className="text-sm font-semibold">Change Status</span>
        {["Low", "Normal", "Urgent"].map((status, index) => (
          <button
            key={index}
            className={`px-2 py-1 flex items-center gap-1 text-xs font-medium rounded-md ${
              status === "Low"
                ? "bg-green-100 text-green-600"
                : status === "Normal"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            <div
              className={`h-2 w-2 rounded-full ${
                status === "Low"
                  ? "bg-green-400"
                  : status === "Normal"
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }`}
            ></div>
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskDetails;
