import mongoose from 'mongoose';

// Create the schema using the generic constructor
const studentSchema = new mongoose.Schema({
    studentNumber: { type: Number, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String, required: false },
    fullName: { type: String, required: true },
    faceSamples: { type: Array, required: true },
    courseYear: { type: String, required: true },
    attendanceData: [
        {
            date: {
                type: String,
                required: true,
            },
            isPresent: {
                type: String,
                default: "Absent",
            },
            timeIn: {
                type: String,
                default: "NA"
            },
        },
    ],

});

mongoose.model("StudentSchema", studentSchema);
export default studentSchema
