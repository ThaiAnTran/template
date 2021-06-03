// khai báo các biến
const express = require("express");
const bodyParser = require("body-parser");
const route = express.Router();
const md5 = require("md5");
const conn = require("../config/config");
 
const session = require("express-session");
var cookieParser = require('cookie-parser');

// sử dụng public/ body-parser 
route.use(express.static("public/"));
route.use(express.json());
route.use(express.urlencoded({
  extended: true
})); 
/////////////////////////////////////////////           Go to View              //////////////////////////////////////////////////////////
/// index
route.get("/",(req,res)=>{
  let today = new Date();
  var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
  let sql =`SELECT post.IdPost
                    , DATE_FORMAT(post.CreateDate, '%Y-%m-%d %H:%m:%s') AS 'CreateDate'
                    , DATEDIFF( DATE_FORMAT(post.EndDate, '%Y/%m/%d'), '${date}' ) AS 'songay' 
                    , post.Title
                    , post.Content 
                    , post.Status 
                    , post.Image 
                    , post.Total_Amount
                    , FORMAT(post.Total_Amount, 0) AS 'Total_money' 
                    , post.LikePost 
                    , post.IdSO 
                    , post.IdEmployee
                    , FORMAT((SELECT SUM(donater.Amount) FROM donater WHERE donater.IdPost=post.IdPost),0)as sumMoney
                    , (SELECT SUM(donater.Amount) FROM donater WHERE donater.IdPost=post.IdPost) as sumAmount
                    from post   where Status=1`;
  conn.query(sql,(err,result)=>{
    if(err)
    {
       console.log(err);
    }
    else{ 
      let post = result;
      
      return res.render("User/index.ejs",{
            post: result
          });
         
      } 
      
    
  })
})
route.get("/index",(req,res)=>{
  let today = new Date();
  var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
  let sql =`SELECT post.IdPost
                    , DATEDIFF( DATE_FORMAT(post.EndDate, '%Y/%m/%d'), '${date}' ) AS 'songay' 
                    , post.Title
                    , post.Status 
                    , post.Image 
                    , post.Total_Amount
                    , FORMAT(post.Total_Amount, 0) AS 'Total_money' 
                    , post.LikePost 
                    , post.IdSO 
                    , FORMAT((SELECT SUM(donater.Amount) FROM donater WHERE donater.IdPost=post.IdPost),0)as sumMoney
                    , (SELECT SUM(donater.Amount) FROM donater WHERE donater.IdPost=post.IdPost) as sumAmount
                    from post   where Status=1`;
  conn.query(sql,(err,result)=>{
    if(err)
    {
       console.log(err);
    }
    else{ 
      return res.render("User/index.ejs",{
            post: result
          });
         
      } 
      
    
  })
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
  let idpost = req.query.idPost;
  let today = new Date();
  var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
  let sql_chitiet= `SELECT post.IdPost
                          , DATE_FORMAT(post.CreateDate, '%Y-%m-%d %H:%m:%s') AS 'CreateDate'
                          , DATEDIFF( DATE_FORMAT(post.EndDate, '%Y/%m/%d'), '${date}' ) AS 'songay' 
                          , post.Title
                          , post.Content 
                          , post.Status 
                          , post.Image 
                          , post.Total_Amount
                          , FORMAT(post.Total_Amount, 0) AS 'Total_money' 
                          , post.LikePost 
                          , post.IdSO 
                          , post.IdEmployee
                          , FORMAT((SELECT SUM(donater.Amount) FROM donater WHERE donater.IdPost=post.IdPost),0)as sumMoney
                          , (SELECT SUM(donater.Amount) FROM donater WHERE donater.IdPost=post.IdPost) as sumAmount
                          from post  where IdPost='${idpost}' `;
  conn.query(sql_chitiet,(err,result)=>{
    if(err) console.log(err);
    if(result.length!=0){
      return res.render("User/Post/chitietPost.ejs",{
        chitietPost: result
      });

    }
  })
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
// xu ly LIKE
route.get("/xulylike",(req,res)=>{
  let idpost = req.query.idpost;

  let sql = `Select post.LikePost from post where IdPost='${idpost}'`;
  conn.query(sql,(err,result)=>{
    if(err) console.log(err);
    if(result.length!=0){
      let like = result[0].LikePost+1;
      let likeold= result[0].LikePost;
      
      let sql_upLike = `Update post Set LikePost='${like}' where IdPost=${idpost}`;
      conn.query(sql_upLike,(err,result)=>{
        if(err) console.log(err);
        
        return res.json(likeold)
      })
    }
  })
})

route.get("/test",(req,res)=>{
  let today = new Date();
  var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
  console.log(date);
  
})

//////////// EXPORTs
module.exports = route;