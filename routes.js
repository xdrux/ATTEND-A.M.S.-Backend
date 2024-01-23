import { addCourse, getClasses } from "./controller.js";

const setUpRoutes = (app) => {
    app.post("/AddCourse", addCourse);
    app.get("/getClasses", getClasses)
}

export default setUpRoutes;