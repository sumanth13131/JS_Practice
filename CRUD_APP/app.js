const http = require("http");
const fs = require("fs");

const DATA_FILE_NAME = "./data.json";
const PORT = 8080;
var id;

// Seq generator auto increment
function idGen(id) {
    let seq = id;
    return {
        id: () => seq++,
    };
}

// Create db or file on first time.
(function () {
    fs.open(DATA_FILE_NAME, "wx", (err, fd) => {
        if (err) {
            if (err.code == "EEXIST") {
                console.log("File Already existed.");
                fs.readFile(DATA_FILE_NAME, (err, data) => {
                    id = idGen(JSON.parse(data).seq + 1);
                });
            }
        } else {
            fs.writeFileSync(DATA_FILE_NAME, "{}");
            id = idGen(1);
        }
    });
})();

// Check either user id exist or not.
function isIdExist(dataObj, id) {
    return Object.keys(dataObj).includes(id);
}

/* 
    '/': Home route,
    '/addUser': add user data into db or file(json),            C
    '/getUserData': get user data from db or file(json),        R
    '/updateUser': update the user data,                        U
    '/deleteUser': delete the respective user id data,          D        
*/
const server = http.createServer((req, res) => {
    // Home Route
    if (req.url == "/") {
        res.write("Welcome to basic CRUD application.");
        res.end();
        return;
    }

    // Add User Route
    if (req.url == "/addUser" && req.method == "GET") {
        //Appending Chunks of stream.
        let data = "";
        req.on("data", (ch) => {
            data += ch;
        });
        req.on("end", () => {
            let dataObj = JSON.parse(data);
            fs.readFile(DATA_FILE_NAME, (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    res.write(
                        "Internal Server Error :: error while reading data file"
                    );
                    res.end();
                    return;
                } else {
                    let dbData = JSON.parse(data);
                    let currId = id.id();
                    dbData[currId] = dataObj;
                    dbData.seq = currId;
                    fs.writeFileSync(DATA_FILE_NAME, JSON.stringify(dbData));
                    res.statusCode = 200;
                    res.write(`Added User: ${currId} Succesfully...`);
                    res.end();
                    return;
                }
            });
        });
    }

    // Get User Details Route
    if (req.url == "/getUserData" && req.method == "GET") {
        let id = req.headers.id;
        let dataObj = JSON.parse(fs.readFileSync(DATA_FILE_NAME));
        if (isIdExist(dataObj, id)) {
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.write(JSON.stringify(dataObj[id]));
            res.end();
            return;
        } else {
            res.statusCode = 404;
            res.write(`UserID: ${id} dosn't existed.`);
            res.end();
            return;
        }
    }

    // Update User Details Route
    if (req.url == "/updateUser" && req.method == "POST") {
        let id = req.headers.id;
        let dbObj = JSON.parse(fs.readFileSync(DATA_FILE_NAME));
        if (isIdExist(dbObj, id)) {
            let data = "";
            req.on("data", (ch) => {
                data += ch;
            });
            req.on("end", () => {
                let userUpdateData = JSON.parse(data);
                let checkField = false;
                Object.keys(userUpdateData).forEach((field) => {
                    if (field == "name" || field === "email") {
                        checkField = true;
                        dbObj[id][field] = userUpdateData[field];
                    } else {
                        checkField = false;
                        res.statusCode = 500;
                        res.write(`field: ${field} does not exist.`);
                        res.end();
                        return;
                    }
                });
                if (checkField) {
                    fs.writeFileSync(DATA_FILE_NAME, JSON.stringify(dbObj));
                    res.statusCode = 200;
                    res.write("User Data Updated Succesfully");
                    res.end();
                    return;
                }
            });
        } else {
            res.statusCode = 404;
            res.write(`UserID: ${id} dosn't existed.`);
            res.end();
            return;
        }
    }

    // Delete UserData With ID.
    if (req.url == "/deleteUser" && req.method == "POST") {
        let id = req.headers.id;
        let dbObj = JSON.parse(fs.readFileSync(DATA_FILE_NAME));
        if (isIdExist(dbObj, id)) {
            delete dbObj[id];
            fs.writeFileSync(DATA_FILE_NAME, JSON.stringify(dbObj));
            res.statusCode = 200;
            res.write(`Deleted User: ${id} Succesfully`);
            res.end();
            return;
        } else {
            res.statusCode = 404;
            res.write(`UserID: ${id} dosn't existed.`);
            res.end();
            return;
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
