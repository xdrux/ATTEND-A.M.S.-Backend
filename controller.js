import mongoose, { mongo } from 'mongoose';
import classSchema from './models/classSchema.js';
import studentSchema from './models/studentSchema.js';

const Class = mongoose.model("ClassSchema", classSchema);
const Student = mongoose.model("StudentSchema", studentSchema);

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
    newCourse.save();
    res.send({ status: "OK" })
}

const deleteCourse = async (req, res) => {
    const request1 = await Class.deleteOne({ courseNameSection: req.body.courseNameSection });
    const request2 = await Student.deleteMany({ courseNameSection: req.body.courseNameSection });
    res.send({ status: "OK" })
    // console.log(request);
    // res.send(request);
}

const deleteAllStudents = async (req, res) => {
    const request = await Student.deleteMany({ courseNameSection: req.body.courseNameSection });
    console.log(request);
    res.send(request);
}

const getClasses = async (req, res) => {
    let classes = [];
    const classesDocuments = await Class.find({});
    for (let i = 0; i < classesDocuments.length; i++) {
        classes.push(classesDocuments[i].courseNameSection);
    }
    res.send(classes);

}

const generateAttendanceDates = (startDate, endDate, classSchedule) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    console.log(currentDate, end);

    // Loop through the dates from startDate to endDate
    while (currentDate <= end) {
        console.log("a");
        // Check if the day of the week (0-6) is included in the class schedule
        if (classSchedule.includes(currentDate.getDay())) {
            // Push the date into the dates array
            dates.push({ date: new Date(currentDate) });
        }
        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};


const addStudent = async (req, res) => {
    // console.log(req.body.courseNameSection);
    const classObj = await Class.find({ courseNameSection: req.body.courseNameSection });
    // console.log(classObj);
    const classSched = classObj[0].courseSchedule;
    // console.log(classObj[0].courseStartDate, classObj[0].courseEndDate);

    // Assuming classObj[0].courseStartDate and classObj[0].courseEndDate are in ISO 8601 format
    const classDates = generateAttendanceDates(
        new Date(classObj[0].courseStartDate),
        new Date(classObj[0].courseEndDate),
        classSched
    );
    const middleName = req.body.middleName !== "" ? req.body.middleName + " " : "";


    const newStudent = new Student({
        studentNumber: req.body.studentNumber,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middleName: req.body.middleName,
        fullName: req.body.firstName + " " + middleName + req.body.lastName,
        faceSamples: req.body.faceSamples,
        courseNameSection: req.body.courseNameSection,
        attendanceData: classDates,
    })
    newStudent.save();

    // console.log(classSched);

    res.send({ status: "OK" })


}

const deleteStudent = async (req, res) => {
    // console.log(req.body);
    try {
        const student = await Student.deleteOne({
            courseNameSection: req.body.courseNameSection,
            fullName: req.body.fullName
        });
        console.log("Student document deleted:", student);
        res.send({ status: "OK" });
    } catch (error) {
        console.error("Error deleting student document:", error);
        res.status(500).send("Error deleting student document");
    }

}

const getStudentsName = async (req, res) => {
    let students = [];
    console.log(req.body);
    const studentsDocuments = await Student.find({ courseNameSection: req.body.courseNameSection });
    for (let i = 0; i < studentsDocuments.length; i++) {
        students.push(studentsDocuments[i].fullName);
    }
    res.send(students);

}

const downloadClassInfo = async (req, res) => {
    let studentNames = [];
    let faceData = [];

    const students = await Student.find({ courseNameSection: req.body.courseNameSection });
    for (let i = 0; i < students.length; i++) {
        studentNames.push(students[i].studentNumber);
        faceData.push(students[i].faceSamples);
    }

    res.send([studentNames, faceData]);

}

export { addCourse, getClasses, addStudent, deleteStudent, getStudentsName, downloadClassInfo, deleteCourse, deleteAllStudents }