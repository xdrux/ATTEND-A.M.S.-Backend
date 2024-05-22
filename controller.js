import mongoose, { mongo } from 'mongoose';
import classSchema from './models/classSchema.js';
import studentSchema from './models/studentSchema.js';

const Class = mongoose.model("ClassSchema", classSchema);
const Student = mongoose.model("StudentSchema", studentSchema);

// for saving a new class
const addCourse = (req, res) => {
    const newCourse = new Class({
        courseName: req.body.courseName,
        courseCode: req.body.courseCode,
        courseSection: req.body.courseSection,
        semester: req.body.semester,
        gracePeriod: req.body.gracePeriod,
        acadYear: req.body.acadYear,
        classType: req.body.classType,
        courseYear: req.body.courseYear,
        courseNameSection: req.body.courseNameSection,
        courseSchedule: req.body.courseSchedule,
        courseStartDate: req.body.courseStartDate,
        courseEndDate: req.body.courseEndDate,
        courseStartTime: req.body.courseStartTime,
        courseEndTime: req.body.courseEndTime,
        instructor: req.body.instructor
    })

    newCourse.save();
    res.send({ status: "OK" })
}

//for deleting a class
const deleteCourse = async (req, res) => {
    const request1 = await Class.deleteOne({ courseYear: req.body.courseYear });
    const request2 = await Student.deleteMany({ courseYear: req.body.courseYear });
    res.send({ status: "OK" })
}

//for deleting all students of a class
const deleteAllStudents = async (req, res) => {
    const request = await Student.deleteMany({ courseYear: req.body.courseYear });
    console.log(request);
    res.send(request);
}

// getting classes of a specific instructor
const getClasses = async (req, res) => {
    let classes = [];
    let classesWithYear = [];
    let semester = [];
    let acadYear = [];
    const classesDocuments = await Class.find({ instructor: req.query.user });
    for (let i = 0; i < classesDocuments.length; i++) {
        classes.push(classesDocuments[i].courseNameSection);
        classesWithYear.push(classesDocuments[i].courseYear);
        semester.push(classesDocuments[i].semester);
        acadYear.push(classesDocuments[i].acadYear);
    }
    res.send({ classes: classes, classesWithYear: classesWithYear, semester: semester, acadYear: acadYear });

}

// generating atttence dates based on the class date range and class schedule
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

// saving a new student
const addStudent = async (req, res) => {
    const classObj = await Class.find({ courseYear: req.body.courseYear });
    const classSched = classObj[0].courseSchedule;

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
        courseYear: req.body.courseYear,
        attendanceData: classDates,
    })
    newStudent.save();

    res.send({ status: "OK" })
}

// updates the student's data
const updateStudent = async (req, res) => {
    const studNum = req.body.studentNumber;
    const courseYear = req.body.courseYear;
    const middleName = req.body.middleName !== "" ? req.body.middleName + " " : "";
    const updateData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middleName: req.body.middleName,
        fullName: req.body.firstName + " " + middleName + req.body.lastName,
        faceSamples: req.body.faceSamples
    }
    console.log(updateData)
    try {
        const updatedStudent = await Student.findOneAndUpdate(
            { studentNumber: studNum, courseYear: courseYear },
            updateData,
            { new: true } // Return the updated document
        );

        if (!updatedStudent) {
            // throw new Error('Student not found');
            res.send({ success: false })
        }

        res.send({ success: true })
    } catch (error) {
        console.error('Error updating student:', error.message);
        res.send({ success: false })
    }
}

// deletes a specific student
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.deleteOne({
            courseYear: req.body.courseYear,
            fullName: req.body.fullName
        });
        console.log("Student document deleted:", student);
        res.send({ status: "OK" });
    } catch (error) {
        console.error("Error deleting student document:", error);
        res.status(500).send("Error deleting student document");
    }

}

//  gets a student's info
const getStudentInfo = async (req, res) => {
    const student = await Student.findOne({ fullName: req.body.fullName, courseYear: req.body.courseYear });
    if (student === null) {
        res.send({ success: false })
    } else {
        res.send({ studentNumber: student.studentNumber, firstName: student.firstName, lastName: student.lastName, middleName: student.middleName, faceSamples: student.faceSamples })
    }
}

// gets a class' information
const getClassInfo = async (req, res) => {
    const classInfo = await Class.findOne({ courseYear: req.body.courseYear });
    if (classInfo === null) {
        res.send({ success: false })
    } else {
        res.send({
            courseNameSection: classInfo.courseNameSection, semester: classInfo.semester, acadYear: classInfo.acadYear, instructor: classInfo.instructor,
            courseCode: classInfo.courseCode,
            courseName: classInfo.courseName,
            courseSection: classInfo.courseSection,
            gracePeriod: classInfo.gracePeriod,
            courseYear: classInfo.courseYear,
            classType: classInfo.classType,
            courseSchedule: classInfo.courseSchedule,
            courseStartDate: classInfo.courseStartDate,
            courseEndDate: classInfo.courseEndDate,
            courseStartTime: classInfo.courseStartTime,
            courseEndTime: classInfo.courseEndTime,
        })
    }
}

// gets the name of all the students of a course
const getStudentsName = async (req, res) => {
    let students = [];
    console.log(req.body);
    const studentsDocuments = await Student.find({ courseYear: req.body.courseYear });
    for (let i = 0; i < studentsDocuments.length; i++) {
        students.push(studentsDocuments[i].fullName);
    }
    res.send(students);

}

// downloads the face images of the students of a section
const downloadClassInfo = async (req, res) => {
    let studentNames = [];
    let faceData = [];

    const students = await Student.find({ courseYear: req.body.courseYear });
    for (let i = 0; i < students.length; i++) {
        studentNames.push(students[i].studentNumber);
        faceData.push(students[i].faceSamples);
    }

    res.send([studentNames, faceData]);

}

//checks if the student is late
const isTimeAfterWithBuffer = (time1, time2, gracePeriod) => {
    // Split the times into hours and minutes
    console.log(time1, time2)
    const [hours1, minutes1] = time1.split(':').map(Number);
    let [hours2, minutes2] = time2.split(':').map(Number);

    // Add grace period minutes to the second time
    minutes2 += Number(gracePeriod);
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


// logs the attendance of a student
const logAttendance = async (req, res) => {
    try {
        // Find the student by student number and course name section
        const student = await Student.findOne({
            studentNumber: req.body.studentNumber,
            courseYear: req.body.courseYear
        });

        if (!student) {
            console.log('Student not found');
            res.send({ status: "failed", message: "Student not found. Please try again." });
            return; // Exit the function if student not found
        }

        // Check if the attendance data for the given date exists
        const attendanceIndex = student.attendanceData.findIndex(data => data.date === req.body.dateToday);
        const attendanceRecord = student.attendanceData.find(data => data.date === req.body.dateToday);

        const updateData = {};
        if (attendanceIndex !== -1) {
            // Update attendance data if found
            const section = await Class.findOne({ courseYear: req.body.courseYear });
            if (isTimeAfterWithBuffer(req.body.timeIn, section.courseStartTime, section.gracePeriod)) {
                updateData[`attendanceData.${attendanceIndex}.isPresent`] = "Late";
            } else {
                updateData[`attendanceData.${attendanceIndex}.isPresent`] = "Present";
            }
            updateData[`attendanceData.${attendanceIndex}.timeIn`] = req.body.timeIn;
        } else {
            console.log('Date not found');
            res.send({ status: "failed", message: "There is no class today!" });
            return; // Exit the function if date not found
        }

        // Update the student document using updateOne
        const updatedStudent = await Student.updateOne({ _id: student._id }, { $set: updateData });

        console.log('Attendance data updated successfully');
        res.send({ status: "success", identity: student.fullName, oldRecord: attendanceRecord }); // Update response message
    } catch (error) {
        console.error('Error updating attendance data:', error);
        res.send({ status: "failed", message: "Error occured. Please try again." }); // Update response message on error
    }
}

// function to cancel the latest attendance
const cancelAttendance = async (req, res) => {
    try {
        // Find the student by student number and course name section
        const student = await Student.findOne({
            studentNumber: req.body.studentNumber,
            courseYear: req.body.courseYear
        });

        if (!student) {
            console.log('Student not found');
            res.send({ status: "failed", message: "Error occured. Please try again." });
            return; // Exit the function if student not found
        }

        // Check if the attendance data for the given date exists
        const attendanceIndex = student.attendanceData.findIndex(data => data.date === req.body.dateToday);

        const updateData = {};
        if (attendanceIndex !== -1) {
            // Update attendance data if found
            const section = await Class.findOne({ courseYear: req.body.courseYear });
            updateData[`attendanceData.${attendanceIndex}.isPresent`] = req.body.isPresent;

            updateData[`attendanceData.${attendanceIndex}.timeIn`] = req.body.timeIn;
        } else {
            console.log('Date not found');
            res.send({ status: "failed", message: "There is no class today!" });
            return; // Exit the function if date not found
        }

        // Update the student document using updateOne
        const updatedStudent = await Student.updateOne({ _id: student._id }, { $set: updateData });

        console.log('Attendance data updated successfully');
        res.send({ status: "success", identity: student.fullName }); // Update response message
    } catch (error) {
        console.error('Error updating attendance data:', error);
        res.send({ status: "failed", message: "Error occured. Please try again." }); // Update response message on error
    }
}

// gets all the students' info
const getClassStudents = async (req, res) => {
    try {
        const studentsDocuments = await Student.find({ courseYear: req.body.courseYear }).sort({ lastName: 1, firstName: 1 });
        res.send(studentsDocuments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}



export { addCourse, getClasses, addStudent, updateStudent, deleteStudent, getStudentInfo, getStudentsName, getClassInfo, downloadClassInfo, deleteCourse, deleteAllStudents, logAttendance, cancelAttendance, getClassStudents }