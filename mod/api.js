import { createHash } from "crypto";
import { readFileSync, writeFileSync } from "fs";

const users = JSON.parse(readFileSync("mod/users.txt", "utf-8"));
const passwords = JSON.parse(readFileSync("mod/passwords.txt", "utf-8"));

const userDataKeys = ["name", "tel", "email", "website", "description"];

// send(type, data, status = 200)
export default function API_HANDLER(res, send, url, pathParts) {
  if (pathParts[2] == "search") {
    const out = [];

    const searchValue = url.searchParams.get("search");
    const searchTypeIndex = userDataKeys.indexOf(
      url.searchParams.get("search-type")
    );

    if (!searchValue || searchTypeIndex == -1) {
      return send("application/json", "[]", 404);
    }

    for (let i = 0; i < users.length; i++) {
      if (users[i][searchTypeIndex].includes(searchValue)) {
        out.push([i, users[i][searchTypeIndex], users[i][0]]);
      }
    }

    // [[id, value, name]]
    send("application/json", JSON.stringify(out));
  } else if (pathParts[2] == "user-data") {
    const id = parseInt(url.searchParams.get("id"));
    if (!id || id < 0 || id > users.length) {
      send("text/plain", "error:", 400);
      return;
    }
    send("application/json", JSON.stringify(users[id]));
  } else if (pathParts[2] == "get-user-names") {
    try {
      const usersList = JSON.parse(url.searchParams.get("u") || "[]");
      if (!(usersList instanceof Array)) {
        res.end("error:");
      }
      send(
        "application/json",
        JSON.stringify(
          usersList.map((userId = 0) => {
            if (
              typeof userId != "number" ||
              userId < 0 ||
              userId > users.length
            ) {
              return null;
            }
            return users[userId][0];
          })
        )
      );
    } catch (error) {
      res.end("error:");
    }
  } else if (pathParts[2] == "is-auth") {
    const userId = parseInt(url.searchParams.get("user-id"));
    const password = url.searchParams.get("user-password");

    if (userId < 0 || userId > passwords.length) {
      return res.end("error:");
    }

    const isAuth =
      createHash("sha256").update(password).digest("hex") == passwords[userId];

    send("application/json", isAuth);
  } else if (pathParts[2] == "create-account") {
    const password = url.searchParams.get("user-password") + "";
    const hashedPassword = createHash("sha256")
      .update(Buffer.from(password))
      .digest("hex");
    users.push(userDataKeys);
    send("application/json", users.length - 1);
    passwords.push(hashedPassword);
  } else {
    res.end("error:");
  }
}

setTimeout(() => {
  writeFileSync("mod/users.txt", JSON.stringify(users, null, 3), "utf-8");
  writeFileSync(
    "mod/passwords.txt",
    JSON.stringify(passwords, null, 3),
    "utf-8"
  );
}, 10000);
