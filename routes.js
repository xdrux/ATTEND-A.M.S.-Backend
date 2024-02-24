import { addCourse, getClasses, addStudent, getStudentsName, downloadClassInfo } from "./controller.js";

const setUpRoutes = (app) => {
    app.post("/AddCourse", addCourse);
    app.get("/getClasses", getClasses);
    app.post("/AddStudent", addStudent);
    app.post("/getStudentsName", getStudentsName);
    app.post("/downloadClassInfo", downloadClassInfo);
}

export default setUpRoutes;