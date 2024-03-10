import { addCourse, getClasses, addStudent, deleteStudent, getStudentsName, downloadClassInfo, deleteCourse, deleteAllStudents, logAttendance } from "./controller.js";

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
}

export default setUpRoutes;