const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

// Create dist directory if it doesn't exist
if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
}

// Create a file to stream archive data to
const output = fs.createWriteStream(path.join("dist", "LaserDog-Portable.zip"));
const archive = archiver("zip", {
  zlib: { level: 9 }, // Sets the compression level
});

// Listen for all archive data to be written
output.on("close", function () {
  console.log("Archive created successfully!");
  console.log("Total bytes: " + archive.pointer());
});

// Handle errors
archive.on("error", function (err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add files
archive.file("main.js", { name: "main.js" });
archive.file("preload.js", { name: "preload.js" });
archive.file("package.json", { name: "package.json" });
archive.file("install-and-run.bat", { name: "install-and-run.bat" });

// Add build directory
archive.directory("build/", "build");

// Add node_modules directory (optional, makes the zip much larger)
// archive.directory('node_modules/', 'node_modules');

// Finalize the archive
archive.finalize();
