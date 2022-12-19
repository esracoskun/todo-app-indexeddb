import React, { useEffect, useState } from 'react'
import { Layout, TaskList, NewTask, NoTasks, ToggleCompleted } from './component'
import { openDB } from 'idb'
import { DragDropContext } from 'react-beautiful-dnd'

const originalShowOnlyIncomplete =
  typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('__showOnlyIncomplete')) || false : false

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  const ordered = result.map((t, i) => ({ ...t, order: i + 1 }))
  return ordered
}

function App() {
  const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(originalShowOnlyIncomplete)
  const [tasks, setTasks] = useState([])
  const [dbConnection, setDbConnection] = useState()

  useEffect(() => {
    let database, closed
    const getDatabase = async () => {
      const db = await openDB('TASKS-DB', 1, upgradeDB => {
        upgradeDB.createObjectStore('tasks', {
          keyPath: 'id',
          autoIncrement: true,
        })
      })
      if (closed) {
        db.close()
      } else {
        setDbConnection(db)
        database = db
      }
    }

    getDatabase()
    return () => {
      if (database) {
        database.close()
      }
      closed = true
    }
  }, [])

  useEffect(() => {
    getTasksToState()
    console.log(dbConnection)
  }, [dbConnection])

  const addTask = async e => {
    e.preventDefault()
    const taskField = e.target.task
    const taskTitle = taskField.value
    taskField.value = ''
    await dbConnection
      .then(db => {
        const tx = db.transaction('tasks', 'readwrite')
        tx.objectStore('tasks').put({
          title: taskTitle,
          order: tasks.length + 1,
          done: false,
        })
        return tx.complete
      })
      .then(getTasksToState())
  }

  const editTask = async e => {
    const taskId = Math.trunc(e.currentTarget.id)
    const newTitle = e.target.value

    await dbConnection
      .then(db => {
        return db.transaction('tasks').objectStore('tasks').get(taskId)
      })
      .then(obj => {
        obj.title = newTitle
        updateTask(obj)
      })
  }

  const updateTask = async task => {
    await dbConnection
      .then(db => {
        const tx = db.transaction('tasks', 'readwrite')
        tx.objectStore('tasks').put(task)
        return tx.complete
      })
      .then(getTasksToState())
  }

  const deleteTask = async e => {
    const id = Math.trunc(e.target.value)
    await dbConnection
      .then(db => {
        const tx = db.transaction('tasks', 'readwrite')
        tx.objectStore('tasks').delete(id)
        return tx.complete
      })
      .then(getTasksToState())
  }

  const changeStatus = async e => {
    const value = e.target.checked
    const id = Math.trunc(e.target.dataset.id)
    await dbConnection
      .then(db => {
        return db.transaction('tasks').objectStore('tasks').get(id)
      })
      .then(obj => {
        obj.done = value
        updateTask(obj)
      })
  }

  const toggleShowOnlyIncomplete = () => {
    const newState = !showOnlyIncomplete
    localStorage.setItem('__showOnlyIncomplete', newState)
    setShowOnlyIncomplete(newState)
  }

  const getTasksToState = async () => {
    await dbConnection
      .then(db => {
        return db.transaction('tasks').objectStore('tasks').getAll()
      })
      .then(tasks =>
        setTasks(
          tasks.sort(function (a, b) {
            return a.order - b.order
          })
        )
      )
  }

  const onDragEnd = result => {
    if (!result.destination) {
      return
    }

    const items = reorder(tasks, result.source.index, result.destination.index)
    items.map(item => updateTask(item))
    setTasks(items)
  }

  return (
    <div className='App'>
      <Layout>
        <div className='App'>
          <NewTask addTask={e => addTask(e)} />
          {tasks.length > 0 ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <TaskList
                tasks={tasks}
                deleteTask={deleteTask}
                changeStatus={changeStatus}
                showOnlyIncomplete={showOnlyIncomplete}
                editTask={e => editTask(e)}
                setTasks={newTasks => setTasks(newTasks)}
              />
            </DragDropContext>
          ) : (
            <NoTasks />
          )}
          <ToggleCompleted handleChange={toggleShowOnlyIncomplete} checked={showOnlyIncomplete} />
        </div>
      </Layout>
    </div>
  )
}

export default App
