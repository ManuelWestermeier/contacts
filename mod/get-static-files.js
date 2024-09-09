import fs from "fs";
import { extname, join } from "path";

export default function getStaticFilesInFolder(pathName) {
  const files = fs.readdirSync(pathName);

  const dir = {};

  files.forEach((filePath) => {
    var type = "";
    const ext = extname(filePath);

    if (ext == ".html") {
      type = "text/html";
    } else if (ext == ".css") {
      type = "text/css";
    } else if (ext == ".js") {
      type = "text/javascript";
    }

    var route = "/" + filePath;

    if (ext == ".html") {
      route = "/" + filePath.split(".")[0];
    }

    if (filePath == "index.html") {
      route = "/";
    }

    dir[route] = [type, fs.readFileSync(join(pathName, filePath), "utf-8")];
  });

  return dir;
}
