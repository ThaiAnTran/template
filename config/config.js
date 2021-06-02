const mysql= require("mysql");

const conn = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"",
    database:"tu_thien",
    port:3306
});
conn.connect(function(err) {
    if(err){
        throw err;
        console.log("kết nối db thất bại");
        return;
    }
    console.log("kết nối DB thành công");
})
module.exports = conn;