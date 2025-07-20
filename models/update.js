import mongoose from "mongoose";
const ChapterSchema = new mongoose.Schema({
  chapterName: String,
});

const SubjectSchema = new mongoose.Schema({
  subjectName: String,
  chapters: [ChapterSchema],
});

const StudentSchema = new mongoose.Schema({
  semester: Number,
  subjects: [SubjectSchema],
});

export const Update = mongoose.model('update', StudentSchema);

