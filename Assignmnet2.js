/*
 * Assignment 2 
----Mohamed emad eldin asaad Mohamed-----
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const EventEmitter = require('events');
const http = require('http');
const { pipeline } = require('stream');
const zlib = require('zlib');

// ==========================================
// Part 1: Node.js Core Modules
// ==========================================

// 1. Write a function that logs the current file path and directory.
function logPathAndDir() {
    console.log({ File: __filename, Dir: __dirname });
}

// 2. Write a function that takes a file path and returns its file name.
function getFileName(filePath) {
    return path.basename(filePath);
}

// 3. Write a function that builds a path from an object
function buildPath(pathObj) {
    return path.format(pathObj);
}

// 4. Write a function that returns the file extension from a given file path.
function getFileExtension(filePath) {
    return path.extname(filePath);
}

// 5. Write a function that parses a given path and returns its name and ext.
function parsePath(filePath) {
    const parsed = path.parse(filePath);
    return { Name: parsed.name, Ext: parsed.ext };
}

// 6. Write a function that checks whether a given path is absolute.
function isAbsolutePath(filePath) {
    return path.isAbsolute(filePath);
}

// 7. Write a function that joins multiple segments
function joinSegments(...segments) {
    return path.join(...segments);
}

// 8. Write a function that resolves a relative path to an absolute one.
function resolvePath(relativePath) {
    return path.resolve(relativePath);
}

// 9. Write a function that joins two paths.
function joinTwoPaths(path1, path2) {
    return path.join(path1, path2);
}

// 10. Write a function that deletes a file asynchronously.
function deleteFileAsync(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) console.error(err);
        else console.log(`The ${path.basename(filePath)} is deleted.`);
    });
}

// 11. Write a function that creates a folder synchronously.
function createFolderSync(folderPath) {
    try {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log("Success");
    } catch (err) {
        console.error(err);
    }
}

// 12. Create an event emitter that listens for a "start" event and logs a welcome message.
const myEmitter = new EventEmitter();
myEmitter.on('start', () => {
    console.log("Welcome event triggered!");
});
// To trigger: myEmitter.emit('start');

// 13. Emit a custom "login" event with a username parameter.
myEmitter.on('login', (username) => {
    console.log(`User logged in: ${username}`);
});
// To trigger: myEmitter.emit('login', 'Ahmed');

// 14. Read a file synchronously and log its contents.
function readFileSync(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        console.log(`the file content => "${content}"`);
    } catch (err) {
        console.error(err);
    }
}

// 15. Write asynchronously to a file.
function writeAsyncToFile(filePath, content) {
    fs.writeFile(filePath, content, (err) => {
        if (err) console.error(err);
        else console.log('Async save');
    });
}

// 16. Check if a directory exists.
function checkDirExists(dirPath) {
    const exists = fs.existsSync(dirPath);
    console.log(exists);
    return exists;
}

// 17. Write a function that returns the OS platform and CPU architecture.
function getOsInfo() {
    return { Platform: os.platform(), Arch: os.arch() };
}

// 18. Use a readable stream to read a file in chunks and log each chunk.
function readInChunks(filePath) {
    const readable = fs.createReadStream(filePath, { encoding: 'utf-8' });
    readable.on('data', (chunk) => {
        console.log(chunk);
    });
}

// 19. Use readable and writable streams to copy content from one file to another.
function copyFileStream(source, dest) {
    const readable = fs.createReadStream(source);
    const writable = fs.createWriteStream(dest);
    readable.pipe(writable);
    writable.on('finish', () => {
        console.log("File copied using streams");
    });
}

// 20. Create a pipeline that reads a file, compresses it, and writes it to another file.
function compressFile(source, dest) {
    const gzip = zlib.createGzip();
    const readable = fs.createReadStream(source);
    const writable = fs.createWriteStream(dest);
    
    pipeline(readable, gzip, writable, (err) => {
        if (err) {
            console.error('Pipeline failed.', err);
        } else {
            console.log('Compressed');
        }
    });
}


// ==========================================
// Part 2: Simple CRUD Operations Using HTTP
// ==========================================
const USERS_FILE = path.join(__dirname, 'users.json');

// Helper to read and write users
const readUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
};
const writeUsers = (data) => fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));

const server = http.createServer((req, res) => {
    const urlSegments = req.url.split('/').filter(Boolean);
    const resource = urlSegments[0];
    const id = urlSegments[1] ? parseInt(urlSegments[1]) : null;

    res.setHeader('Content-Type', 'application/json');

    if (resource === 'user') {
        
        // 4) Create an API that gets all users from the JSON file.
        if (req.method === 'GET' && !id) {
            const users = readUsers();
            res.writeHead(200);
            res.end(JSON.stringify(users));
            return;
        }

        // 5) Create an API that gets User by ID.
        if (req.method === 'GET' && id) {
            const users = readUsers();
            const user = users.find(u => u.id === id);
            if (user) {
                res.writeHead(200);
                res.end(JSON.stringify(user));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ message: "User not found." }));
            }
            return;
        }

        // 1) Create an API that adds a new user to your users stored in a JSON file
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                const payload = JSON.parse(body);
                const users = readUsers();
                const exists = users.find(u => u.email === payload.email);
                if (exists) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ message: "Email already exists." }));
                } else {
                    const newUser = { id: users.length ? users[users.length - 1].id + 1 : 1, ...payload };
                    users.push(newUser);
                    writeUsers(users);
                    res.writeHead(201);
                    res.end(JSON.stringify({ message: "User added successfully." }));
                }
            });
            return;
        }

        // 2) Create an API that updates an existing user's name, age, or email by their ID
        if (req.method === 'PATCH' && id) {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                const payload = JSON.parse(body);
                const users = readUsers();
                const index = users.findIndex(u => u.id === id);
                if (index !== -1) {
                    users[index] = { ...users[index], ...payload };
                    writeUsers(users);
                    // Determine which field was updated for response message (e.g., age)
                    let field = Object.keys(payload)[0] || 'details';
                    res.writeHead(200);
                    res.end(JSON.stringify({ message: `User ${field} updated successfully.` }));
                } else {
                    res.writeHead(404);
                    res.end(JSON.stringify({ message: "User ID not found." }));
                }
            });
            return;
        }

        // 3) Create an API that deletes a User by ID.
        if (req.method === 'DELETE' && id) {
            let users = readUsers();
            const index = users.findIndex(u => u.id === id);
            if (index !== -1) {
                users.splice(index, 1);
                writeUsers(users);
                res.writeHead(200);
                res.end(JSON.stringify({ message: "User deleted successfully." }));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ message: "User ID not found." }));
            }
            return;
        }
    }

    res.writeHead(404);
    res.end(JSON.stringify({ message: "Route not found" }));
});

// To start the server uncomment the line below:
// server.listen(3000, () => console.log('Server running on port 3000'));


// ==========================================
// Part 3: Bonus (LeetCode: kth-missing-positive-number)
// ==========================================
/*
 * Instructions for Bonus:
 * Inside your assignment folder, create a SEPARATE FILE and name it "bonus.js".
 * Copy the function below inside the "bonus.js" file.
 */

/* bonus.js code */
var findKthPositive = function(arr, k) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        // Calculate how many numbers are missing before the number at 'mid' index
        let missing = arr[mid] - (mid + 1);
        
        if (missing < k) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    // The missing number will be at 'left + k'
    return left + k;
};