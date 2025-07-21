import express from "express";
import cors from "cors";
import { connectDB } from "./data/database.js";
import student from "./routes/student.js";
import teacher from "./routes/teacher.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { TEAC } from "./models/teacherM.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
connectDB();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000","https://college-connect-frontend.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // set in .env
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer + Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "teacher-images", // Optional folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => Date.now().toString(),
  },
});
const upload = multer({ storage });

// Routes
app.use(student);
app.use(teacher);

/* ============================================
   POST: Upload Image & Link to Teacher (Cloudinary)
============================================ */
app.post("/upload-image/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  if (!req.file || !req.file.path) {
    return res.status(400).send({ error: "No file uploaded" });
  }

  const fileUrl = req.file.path; // Cloudinary URL
  const publicId = req.file.filename || req.file.originalname; // Use for deletion later

  try {
    const updated = await TEAC.findOneAndUpdate(
      { email: id },
      { fileUrl, publicId }, // Save both in DB
      { new: true }
    );

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
   DELETE: Delete Image from Cloudinary & DB
============================================ */
app.delete("/delete-image/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await TEAC.findOne({ email: id });

    if (!teacher || !teacher.fileUrl) {
      return res.status(404).send({ error: "Image not found for this teacher" });
    }

    // Extract public_id from the URL or store separately
    const publicId = teacher.fileUrl.split('/').pop().split('.')[0];

    cloudinary.uploader.destroy(`teacher-images/${publicId}`, async (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).send({ error: "Error deleting from Cloudinary" });
      }

      teacher.fileUrl = undefined;
      teacher.publicId = undefined;
      await teacher.save();

      res.send({ message: "Image deleted from Cloudinary and DB updated" });
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
