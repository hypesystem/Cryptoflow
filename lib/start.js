const build = require("./build");
const express = require("express");
const openurl = require("openurl");
const path = require("path");

let port = 9876;

build((error) => {
    if(error) {
        return console.error("Failed to build", error);
    }
    let app = express();
    app.use(express.static(path.join(__dirname, "..", "_site")));
    app.listen(port, (error) => {
        if(error) {
            return console.error("Failed to launch env locally", error);
        }
        openurl.open(`http://localhost:${port}`, (error) => {
            if(error) {
                return console.error(`Failed to open env. Please open http://localhost:${port} manually.`);
            }
            console.log("Launched env and opened in your default browser.");
        });
    });
});
