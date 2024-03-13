import { addCourse, getClasses, addStudent, deleteStudent, getStudentsName, downloadClassInfo, deleteCourse, deleteAllStudents, logAttendance, cancelAttendance } from "./controller.js";

const setUpRoutes = (app) => {
    app.post("/AddCourse", addCourse);
    app.get("/getClasses", getClasses);
    app.post("/AddStudent", addStudent);
    app.post("/getStudentsName", getStudentsName);
    app.post("/downloadClassInfo", downloadClassInfo);
    app.post("/deleteCourse", deleteCourse);
    app.post("/deleteAllStudents", deleteAllStudents);
    app.post("/deleteStudent", deleteStudent);
    app.post("/logAttendance", logAttendance);
    app.post("/cancelAttendance", cancelAttendance);
}

export default setUpRoutes;