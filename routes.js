import { addCourse, getClasses, addStudent, deleteStudent, getStudentsName, getClassInfo, downloadClassInfo, deleteCourse, deleteAllStudents, logAttendance, cancelAttendance, getClassStudents } from "./controller.js";

const setUpRoutes = (app) => {
    app.post("/AddCourse", addCourse);
    app.get("/getClasses", getClasses);
    app.post("/AddStudent", addStudent);
    app.post("/getStudentsName", getStudentsName);
    app.post("/getClassInfo", getClassInfo);
    app.post("/downloadClassInfo", downloadClassInfo);
    app.post("/deleteCourse", deleteCourse);
    app.post("/deleteAllStudents", deleteAllStudents);
    app.post("/deleteStudent", deleteStudent);
    app.post("/logAttendance", logAttendance);
    app.post("/cancelAttendance", cancelAttendance);
    app.post("/getClassStudents", getClassStudents);
}

export default setUpRoutes;