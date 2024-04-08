import { addCourse, getClasses, addStudent, updateStudent, deleteStudent, getStudentInfo, getStudentsName, getClassInfo, downloadClassInfo, deleteCourse, deleteAllStudents, logAttendance, cancelAttendance, getClassStudents } from "./controller.js";
import { signUp, login, checkIfLoggedIn } from "./auth_controller.js"

const setUpRoutes = (app) => {
    app.post("/signUp", signUp);
    app.post("/login", login);
    app.post("/checkIfLoggedIn", checkIfLoggedIn);
    app.post("/AddCourse", addCourse);
    app.get("/getClasses", getClasses);
    app.post("/AddStudent", addStudent);
    app.post("/updateStudent", updateStudent);
    app.post("/getStudentInfo", getStudentInfo);
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