    const http = require("http");
    const fs = require("fs");
    const path = require("path");

    let courses = [
    { id: 1, coursename: "fsd", coursecode: "fsd301", department: "CSEDS" },
    { id: 2, coursename: "applied mathematics", coursecode: "MA101", department: "CSEDS" },
    { id: 3, coursename: "oops", coursecode: "cs351", department: "CSEDS" },
    { id: 4, coursename: "dsa", coursecode: "cs352", department: "CSEDS" }
    ];

    const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  const parts = req.url.split("/");
  const id = Number(parts[2]);

  if (req.method === "GET" && req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    fs.readFile(path.join(__dirname, "index.html"), (error, html) => {
      if (error) {
        res.statusCode = 5000
        res.end("Unable to load index.html");
      } else {
        res.end(html);
      }
    });
  } else if (req.method === "GET" && parts[1] === "courses") {
    res.setHeader("Content-Type", "application/json");
    if (parts[2]) {
      const course = courses.find(item => item.id === id);
      if (course) {
        res.end(JSON.stringify(course));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Course not found" }));
      }
    } else {
      res.end(JSON.stringify(courses));
    }
  } else if (req.method === "POST" && req.url === "/courses") {
    let body = "";
    req.on("data", part => body += part);
    req.on("end", () => {
      try {
        const newCourse = JSON.parse(body);
        courses.push(newCourse);
        res.statusCode = 201;
        res.end(JSON.stringify(newCourse));
      } catch {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: "Invalid JSON" }));
      }
    });
  } else if (req.method === "PUT" && parts[1] === "courses") {
    let body = "";
    req.on("data", part => body += part);
    req.on("end", () => {
      try {
        const updatedCourse = JSON.parse(body);
        const index = courses.findIndex(item => item.id === id);

        if (index === -1) {
          res.statusCode = 404;
          res.end(JSON.stringify({ message: "Course not found" }));
        } else {
          updatedCourse.id = id;
          courses[index] = updatedCourse;
          res.end(JSON.stringify(updatedCourse));
        }
      } catch {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: "Invalid JSON" }));
      }
    });
  } else if (req.method === "DELETE" && parts[1] === "courses") {
    const oldLength = courses.length;
    courses = courses.filter(item => item.id !== id);

    if (courses.length === oldLength) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "Course not found" }));
    } else {
      res.end(JSON.stringify({ message: "Course deleted" }));
    }
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Page not found" }));
  }
});

server.listen(3000, () => {
  console.log("Course management server running at http://localhost:3000");
});
 