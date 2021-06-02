const admin = require("./AdminRoute");
const user = require("./UserRoute");


function route(app){
    
    app.use("/admin",admin);
    
    app.use("/",user);
}

module.exports = route;