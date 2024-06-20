import express from "express";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "db.json");

interface Submission {
  name: string;
  email: string;
  phone: string;
  Githublink: string;
  Stopwatchtime: string;
}

app.get("/ping", (req, res) => {
  res.json(true);
});

app.post("/submit", (req, res) => {
  const { name, email, phone, Githublink, Stopwatchtime } = req.body;

  const newSubmission: Submission = {
    name,
    email,
    phone,
    Githublink,
    Stopwatchtime,
  };

  fs.readFile(dbPath, (err, data) => {
    if (err) throw err;
    const submissions: Submission[] = JSON.parse(data.toString());
    submissions.push(newSubmission);
    fs.writeFile(dbPath, JSON.stringify(submissions, null, 2), (err) => {
      if (err) throw err;
      res.json({ success: true });
    });
  });
});

app.get("/read", (req, res) => {
  const index = parseInt(req.query.index as string);
  fs.readFile(dbPath, (err, data) => {
    if (err) throw err;
    const submissions: Submission[] = JSON.parse(data.toString());
    if (index >= 0 && index < submissions.length) {
      res.json(submissions[index]);
    } else {
      res.status(404).json({ error: "Submission not found" });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
