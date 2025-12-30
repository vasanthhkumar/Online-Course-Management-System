const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/coursesDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));

const courseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true
    },
    courseName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
});

const Course = mongoose.model('Course', courseSchema);

app.post('/api/courses', async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

app.get('/api/courses', async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
})

app.get('/api/courses/:id', async (req, res) => {
    const coursesId = await Course.findById(req.params.id);
    if (!coursesId) {
        return res.status(404).json({ message: 'Course not found' });
    }
    res.json(coursesId);
})

app.put('/api/courses/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId, req.body, {
            new: true, runValidators: true
        }
        );
        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/courses/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        const deletedCourse = await Course.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});