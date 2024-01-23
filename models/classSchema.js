import mongoose from 'mongoose';

// Create the schema using the generic constructor
const classSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    courseCode: { type: String, required: true },
    courseSection: { type: String, required: true },
    courseNameSection: { type: String, required: true },
    courseSchedule: { type: Array, required: true },
    courseStartDate: { type: String, required: true },
    courseEndDate: { type: String, required: true },
    courseStartTime: { type: String, required: true },
    courseEndTime: { type: String, required: true },
});

mongoose.model("ClassSchema", classSchema);
export default classSchema
