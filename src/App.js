import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: `task-${tasks.length}`, content: newTask }]);
      setNewTask('');
    }
  };

  const editTaskHandler = (index) => {
    setEditIndex(index);
    setEditTask(tasks[index].content);
  };

  const saveEditTask = () => {
    if (editTask.trim()) {
      const updatedTasks = tasks.map((task, index) =>
        index === editIndex ? { ...task, content: editTask } : task
      );
      setTasks(updatedTasks);
      setEditIndex(null);
      setEditTask('');
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  };

  return (
    <div className="App">
      <h1 className="app-title">Task Manager</h1>
      <div className="task-input-container">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="task-input"
        />
        <button onClick={addTask} className="add-button">Add Task</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="task-list"
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="task-item"
                    >
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editTask}
                          onChange={(e) => setEditTask(e.target.value)}
                          className="edit-input"
                        />
                      ) : (
                        task.content
                      )}
                      <div className="task-actions">
                        {editIndex === index ? (
                          <button onClick={saveEditTask} className="save-button">Save</button>
                        ) : (
                          <>
                            <button onClick={() => editTaskHandler(index)} className="edit-button">Edit</button>
                            <button onClick={() => deleteTask(index)} className="delete-button">Delete</button>
                          </>
                        )}
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default App;
