// khai báo các biến
const express = require("express");
const bodyParser = require("body-parser");
const route = express.Router();
const md5 = require("md5");
const conn = require("../config/config");
 
const session = require("express-session");
var cookieParser = require('cookie-parser');

// sử dụng public/ body-parser 
route.use(express.static("public/frontend"));
route.use(express.json());
route.use(express.urlencoded({
  extended: true
})); 
/////////////////////////////////////////////           Go to View              //////////////////////////////////////////////////////////
/// index
route.get("/",(req,res)=>{
    res.render("User/index.ejs");
})
route.get("/index",(req,res)=>{
  res.render("User/index.ejs");
})
/// đăng ký
route.get("/dangky",(req,res)=>{
  let err = req.query.err;
  if(err==1){
    res.render("User/dangky.ejs",{
      message: 'Repeat Password không đúng'
    });

  }
  if(err==2){
    res.render("User/dangky.ejs",{
      message: 'Email này đã tồn tại'
    });

  }
  res.render("User/dangky.ejs",{
    message: ''
  });
})
// login
route.get("/login",(req,res)=>{
  let err= req.query.err;
  if(err==1){
    let email = req.query.email;
    let pass = req.query.pass;
     
  }
  res.render("User/login.ejs",{
    message:'',
    val:''
  });
})
// xem chi tiết bài viết:
route.get("/xemchitietPost",(req,res)=>{
  res.render("User/Post/chitietPost.ejs");
})
//////////////////////////////////////// //                XỬ LÝ                  //////////////////////////////////////////////////////////
// đăng ký:
route.post("/xulyDangKy",(req,res)=>{
  let firstname = req.body.firstname;
  let lastname= req.body.lastname;
  let email = req.body.email;
  let phone = req.body.phone;
  let password = req.body.password;
  let repeatpass = req.body.repeatpass;
  //console.log(firstname+','+lastname+','+email+','+phone+','+password+','+repeatpass);
  // kiểm tra
  if(password!= repeatpass){
    res.redirect("/dangky?err=1");
  }
  let sql_exitEmail=`SELECT Email from user where Email='${email}'`;
  conn.query(sql_exitEmail,(err,result)=>{
    if(err) console.log("lỗi sql");
    if(result.length!=0){
      return res.redirect("/dangky?err=2");
    }
    else{
      
      password=md5(password);
      sql_dangky=`INSERT INTO user(  Email, Password, FirstName,LastName, Phone, Image)
      VALUES ( '${email}','${password}','${firstname}','${lastname}','${phone}','member-2.jpg')`;
      conn.query(sql_dangky,(err,result)=>{
        if(err) console.log(err);
        return res.redirect("/login");
      })
    }
  })

})

// login:
route.post("/xulyDangNhap",(req,res)=>{
  let email = req.body.email;
  let password = req.body.password;
  password_md5 = md5(password);
  sql_dangnhap=`SELECT * FROM user WHERE Email='${email}' AND Password='${password_md5}' `;
  conn.query(sql_dangnhap,(err,result)=>{
    if(err) console.log(err);
    if(result.length==0){ 
      return res.render("User/login.ejs",{
        message: 'Email hoặc mật khẩu không đúng',
        val: [
          email,
          password
        ]
      })
    }
    return res.redirect("/index");
  })
})




//////////// EXPORTs
module.exports = route;