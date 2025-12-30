import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css'

function App() {
  const [courseCode, setCourseCode] = useState('')
  const [courseName, setCourseName] = useState('')
  const [category, setCategory] = useState('')
  const [duration, setDuration] = useState('')
  const [course, setCourse] = useState([])
  const [flag, setFlag] = useState(false)
  const [editId, setEditId] = useState(null)

  const loadCourses = async () => {
    const res = await fetch('http://localhost:5000/api/courses');
    const data = await res.json();
    setCourse(Array.isArray(data) ? data : []);
  }

  const addCourse = async () => {
    const course = { courseCode, courseName, category, duration: Number(duration) }
    await fetch('http://localhost:5000/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    setCourseCode('')
    setCourseName('')
    setCategory('')
    setDuration('')
    loadCourses();
  }

  const deleteCourse = async (id) => {
    const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
      method: 'DELETE'
    });
    console.log(res)
    loadCourses();
  }

  const updateCourse = async (id) => {
    const course = { courseCode, courseName, category, duration: Number(duration) }
    await fetch(`http://localhost:5000/api/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    setCourseCode('')
    setCourseName('')
    setCategory('')
    setDuration('')
    setFlag(false)
    loadCourses();
  }

  useEffect(() => {
    loadCourses();
  }, [deleteCourse, updateCourse])

  return (
    <>
      <h2 className='bg-primary pt-3 pb-3 text-center'>Course Management System</h2>
      <div className='container'>
        <input
          className='form-control'
          placeholder='Course Code'
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
        />
        <br />
        <input
          className='form-control'
          placeholder='Course Name'
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        <br />
        <input
          className='form-control'
          placeholder='Category'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <br />
        <input
          className='form-control'
          placeholder='Duration'
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <br />
        <button className='btn btn-primary me-3' onClick={addCourse}>Add Course</button>
        {flag == true ? <button className='btn btn-primary'
          onClick={() => {
          updateCourse(editId)
        }}>Update Course</button> : null}
        <br />

        <table border="1" className='table table-striped mt-4'>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Category</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {course.length === 0 ? (
              <tr colSpan="4" align="center"><td>No courses found</td></tr>) :
              (course.map((c) => (
                <tr key={c._id}>
                  <td>{c.courseCode}</td>
                  <td>{c.courseName}</td>
                  <td>{c.category}</td>
                  <td>{c.duration}</td>
                  <td>
                    <button className='btn btn-primary me-3'
                      onClick={() => {
                        setFlag(true)
                        setEditId(c._id)
                        setCourseCode(c.courseCode)
                        setCourseName(c.courseName)
                        setCategory(c.category)
                        setDuration(c.duration)
                      }}>Edit</button>
                    <button className='btn btn-primary'
                      onClick={() => {
                        deleteCourse(c._id)
                      }}>Delete</button>
                  </td>
                </tr>
              )))
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App
