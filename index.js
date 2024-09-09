import http from "http";
import getStaticFilesInFolder from "./mod/get-static-files.js";
import API_HANDLER from "./mod/api.js";

const staticFiles = getStaticFilesInFolder("frontend");

http
  .createServer((req, res) => {
    function send(type, data, status = 200) {
      res.writeHead(status, { "Content-Type": type });
      res.end(data);
    }

    try {
      const url = new URL("http:localhost" + req.url);
      const pathParts = url.pathname.split("/");

      if (pathParts[1] == "api" && pathParts.length > 2) {
        API_HANDLER(res, send, url, pathParts);
      } else if (staticFiles[url.pathname]) {
        send(...staticFiles[url.pathname]);
      } else {
        send(...staticFiles["/404"]);
      }
    } catch (error) {
      console.error(error);
      res.end(error + "");
    }
  })
  .listen(80);

process.on("uncaughtException", (err) => console.error(err));
