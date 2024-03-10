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
            let dateObj = new Date(currentDate);
            let dateToPush = dateObj.toDateString();
            dates.push({ date: dateToPush });
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

const isTimeAfterWithBuffer = (time1, time2) => {
    // Split the times into hours and minutes
    console.log(time1, time2)
    const [hours1, minutes1] = time1.split(':').map(Number);
    let [hours2, minutes2] = time2.split(':').map(Number);

    // Add 15 minutes to the second time
    minutes2 += 15;
    if (minutes2 >= 60) {
        minutes2 -= 60;
        hours2 += 1;
    }
    hours2 %= 24; // Normalize hours (in case it exceeds 24 hours)

    // Compare the hours
    if (hours1 > hours2) {
        return true;
    } else if (hours1 === hours2) {
        // If hours are the same, compare the minutes
        if (minutes1 > minutes2) {
            return true;
        }
    }

    // Return false if time1 is not after time2
    return false;
}

const logAttendance = async (req, res) => {
    try {
        // Find the student by student number and course name section
        const student = await Student.findOne({
            studentNumber: req.body.studentNumber,
            courseNameSection: req.body.courseNameSection
        });

        if (!student) {
            console.log('Student not found');
            res.send({ status: "failed" });
            return; // Exit the function if student not found
        }

        // Check if the attendance data for the given date exists
        const attendanceIndex = student.attendanceData.findIndex(data => data.date === "Mon Mar 11 2024");

        const updateData = {};
        if (attendanceIndex !== -1) {
            // Update attendance data if found
            const section = await Class.findOne({ courseNameSection: req.body.courseNameSection });
            if (isTimeAfterWithBuffer(req.body.timeIn, section.courseStartTime)) {
                updateData[`attendanceData.${attendanceIndex}.isPresent`] = "Late";
            } else {
                updateData[`attendanceData.${attendanceIndex}.isPresent`] = "Present";
            }
            updateData[`attendanceData.${attendanceIndex}.timeIn`] = req.body.timeIn;
        } else {
            console.log('Date not found');
            res.send({ status: "failed" });
            return; // Exit the function if date not found
        }

        // Update the student document using updateOne
        const updatedStudent = await Student.updateOne({ _id: student._id }, { $set: updateData });

        console.log('Attendance data updated successfully');
        res.send({ status: "success" }); // Update response message
    } catch (error) {
        console.error('Error updating attendance data:', error);
        res.send({ status: "failed" }); // Update response message on error
    }
}


export { addCourse, getClasses, addStudent, deleteStudent, getStudentsName, downloadClassInfo, deleteCourse, deleteAllStudents, logAttendance }