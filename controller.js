import mongoose from 'mongoose';
import classSchema from './models/classSchema.js';

const Class = mongoose.model("Class Schema", classSchema);

const addCourse = (req, res) => {
    const newCourse = new Class({
        courseName: req.body.courseName,
        courseCode: req.body.courseCode,
        courseSection: req.body.courseSection,
        courseNameSection: req.body.courseNameSection,
        courseSchedule: req.body.courseSchedule,
        courseStartDate: req.body.courseStartDate,
        courseEndDate: req.body.courseEndDate,
        courseStartTime: req.body.courseStartTime,
        courseEndTime: req.body.courseEndTime,
    })

    // console.log(newCourse)
    newCourse.save()
}

const getClasses = async (req, res) => {
    let classes = [];
    const classesDocuments = await Class.find({});
    for (let i = 0; i < classesDocuments.length; i++) {
        classes.push(classesDocuments[i].courseNameSection);
    }
    res.send(classes);

}

export { addCourse, getClasses }