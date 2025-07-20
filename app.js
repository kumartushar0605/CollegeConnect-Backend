import express from "express";
import cors from "cors";
import { connectDB } from "./data/database.js";
import student from "./routes/student.js";
import teacher from "./routes/teacher.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import { TEAC } from "./models/teacherM.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
connectDB();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use(student);
app.use(teacher);


// Serve static files
app.use("/uploads", express.static("uploads"));

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/* ============================================
   POST: Upload Image & Link to Teacher (by email)
============================================ */
app.post("/upload-image/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params; // This is email
  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  try {
    const updated = await TEAC.findOneAndUpdate({ email: id }, { fileUrl }, { new: true });

    if (!updated) {
      return res.status(404).send({ error: "Teacher not found" });
    }

    res.send({ message: "Image uploaded and linked", data: updated });
  } catch (err) {
    res.status(500).send({ error: "Failed to update teacher" });
  }
});

/* ============================================
   GET: Get Image URL for Teacher (by email)
============================================ */
app.get("/get-image/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await TEAC.findOne({ email: id });

    if (!teacher || !teacher.fileUrl) {
      return res.status(404).send({ error: "Image not found" });
    }

    res.send({ fileUrl: teacher.fileUrl });
  } catch (err) {
    res.status(500).send({ error: "Failed to retrieve image" });
  }
});

/* ============================================
   DELETE: Delete Image from Server & DB (by email)
============================================ */
app.delete("/delete-image/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await TEAC.findOne({ email: id });

    if (!teacher || !teacher.fileUrl) {
      return res.status(404).send({ error: "Image not found for this teacher" });
    }

    const filename = path.basename(teacher.fileUrl);
    const filePath = path.join(__dirname, "uploads", filename);

    fs.unlink(filePath, async (err) => {
      if (err) {
        return res.status(500).send({ error: "Error deleting file from server" });
      }

      teacher.fileUrl = undefined;
      await teacher.save();

      res.send({ message: "Image deleted and DB updated" });
    });
  } catch (err) {
    res.status(500).send({ error: "Failed to delete image" });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("working");
});

app.listen(5000, () => {
  console.log("server is working at port 5000");
});
