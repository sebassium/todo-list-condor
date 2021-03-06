import React, { useContext, useState, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faTimes,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import { TaskContext } from '../../context/TaskContext';
import TaskInput from '../TaskInput';
import getUsernameFromUserId from '../../utils/getUsernameFromUserId';
import isUserAssigned from '../../utils/isUserAssigned';

const TaskCard = ({ task, allUsers, handleDelete, isSearch }) => {
  const { editTask, assignUser, unassignUser } = useContext(TaskContext);
  const [isEdit, setIsEdit] = useState(false);

  const handleStatus = (e, taskId) => {
    editTask(taskId, { status: e.target.value });
  };

  const handleAssign = (e, taskId) => {
    assignUser(taskId, { userId: e.target.value });
  };

  const handleUnassignUser = (taskId, userId) => {
    unassignUser(taskId, { userId });
  };

  return (
    <div className="bg-teal-400 rounded shadow my-1 p-2 pt-0">
      <div className="flex items-center">
        {!isEdit ? (
          <div className="w-full">
            <p className="text-2xl p-2 text-white font-semibold">
              {task.title}
            </p>
          </div>
        ) : (
          <TaskInput
            title={task.title}
            taskId={task._id}
            action={editTask}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            isSearch={isSearch}
          />
        )}
        {!isEdit && !isSearch ? (
          <Fragment>
            <div className="mx-4">
              <button onClick={() => setIsEdit(!isEdit)}>
                <FontAwesomeIcon
                  icon={faEdit}
                  className="text-xl text-white hover:text-orange-500"
                />
              </button>
            </div>
            <div className="mr-4">
              <button onClick={() => handleDelete(task._id)}>
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-xl text-white hover:text-orange-500 focus:outline-none"
                />
              </button>
            </div>
          </Fragment>
        ) : null}
      </div>

      <div className="lg:flex items-center">
        <div className="w-full lg:w-1/6">
          <div className="inline-block relative w-full">
            {!isSearch ? (
              <form>
                <select
                  name="status"
                  id="status"
                  defaultValue={task.status}
                  onChange={(e) => handleStatus(e, task._id)}
                  className="block w-full appearance-none text-white pl-3 p-2 rounded-full leading-tight focus:outline-none"
                  style={{
                    backgroundColor:
                      task.status === 'open'
                        ? '#3182ce'
                        : task.status === 'in-progress'
                        ? '#d69e2e'
                        : task.status === 'completed'
                        ? '#48bb78'
                        : '#718096',
                  }}
                >
                  <option value="open">open</option>
                  <option value="in-progress">in-progress</option>
                  <option value="completed">completed</option>
                  <option value="archived">archived</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <FontAwesomeIcon
                    icon={faCaretDown}
                    className="text-xl text-white"
                  />
                </div>
              </form>
            ) : (
              <div
                className="block w-full appearance-none text-white pl-3 p-2 rounded-full leading-tight focus:outline-none"
                style={{
                  backgroundColor:
                    task.status === 'open'
                      ? '#3182ce'
                      : task.status === 'in-progress'
                      ? '#d69e2e'
                      : task.status === 'completed'
                      ? '#48bb78'
                      : '#718096',
                }}
              >
                {task.status}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-5/6">
          <div className="inline-block">
            <p className="text-white text-lg mr-1 mt-1 lg:mt-0 lg:mx-2 lg:mr-1">
              Members:
            </p>
          </div>
          <div className="inline-block">
            {task.assignedUsers.map((assignedUserId) => (
              <div
                className="bg-teal-500 rounded-full inline-block px-2 mx-1"
                key={assignedUserId}
              >
                {!isSearch && (
                  <button
                    onClick={() => handleUnassignUser(task._id, assignedUserId)}
                    className="inline-block mr-1 focus:outline-none"
                  >
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="text-md text-white"
                    />
                  </button>
                )}

                <p className="text-xl text-white inline-block">
                  {allUsers && getUsernameFromUserId(assignedUserId, allUsers)}
                </p>
              </div>
            ))}
            {task.assignedUsers.length === 0 && isSearch && (
              <p className="text-xl text-white inline-block bg-teal-500 rounded-full px-2 mx-1">
                no-one
              </p>
            )}
          </div>

          {!isSearch && (
            <div className="inline-block mt-2 lg:mt-0">
              <form>
                <select
                  name="assignedUsers"
                  id="assignedUsers"
                  value="choose"
                  className="bg-orange-500 w-12 text-white rounded-full focus:outline-none appearance-none pl-2 py-1"
                  onChange={(e) => handleAssign(e, task._id)}
                >
                  <option value="choose" disabled>
                    Add
                  </option>
                  {allUsers &&
                    allUsers.map((user) => (
                      <option
                        key={user._id}
                        value={user._id}
                        disabled={isUserAssigned(user._id, task)}
                      >
                        {user.username}
                      </option>
                    ))}
                </select>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
