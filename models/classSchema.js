import mongoose from 'mongoose';

// Class schema
const classSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    courseCode: { type: String, required: true },
    courseSection: { type: String, required: true },
    courseNameSection: { type: String, required: true },
    gracePeriod: { type: Number, required: true },
    semester: { type: String, required: true },
    acadYear: { type: String, required: true },
    courseYear: { type: String, required: true },
    classType: { type: String, required: true },
    courseSchedule: { type: Array, required: true },
    courseStartDate: { type: String, required: true },
    courseEndDate: { type: String, required: true },
    courseStartTime: { type: String, required: true },
    courseEndTime: { type: String, required: true },
    instructor: { type: String, required: true }
});

mongoose.model("ClassSchema", classSchema);
export default classSchema
