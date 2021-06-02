// khai báo các biến
const express = require("express");
const bodyParser = require("body-parser");
const route = express.Router();
const md5 = require("md5");
const conn = require("../config/config");
const session = require("express-session");
var cookieParser = require('cookie-parser');
const multer = require('multer');
var flash = require("connect-flash");
const mapVietNam = require('../diachivietnam.json'); 

// sử dụng public/ body-parser 
route.use(flash());
route.use(express.static("public/backend"));
route.use(express.json());
route.use(express.urlencoded({
    extended: true
}));
route.use(cookieParser());
route.use(session({
    cookie: { maxAge: 60000 },
    secret: 'woot',
    resave: false,
    saveUninitialized: false
}));



//set storage

//const upload = multer({ storage: multer.memoryStorage() });
// lưu hình ảnh vào folder
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/backend/images/supported_object')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })
    // chuyển mạch:
    //chuyển hướng vào login
route.get("/login", function(req, res) {

    if (req.query.error) {
        res.render("admin/login.ejs", {
            message: ' Tài khoản hoặc mật khẩu không đúng!'
        });
    }
    res.render("admin/login.ejs", { message: '' });
})

// đăng xuất tài khoản

route.get("/logout", (req, res) => {
    let boss = req.cookies.boss;
    res.cookie("boss", boss, { maxAge: 0 });
    res.redirect("/admin/login");
})

// chuyển hướng vào trang chủ index

route.get("/", (req, res) => {
    if (!req.cookies.boss) {
        return res.redirect("/admin/login");
    }
    return res.render("admin/index.ejs")
});
/////////////////////////////////////////////////// QUẢN LÝ ĐỐI TƯỢNG /////////////////////////////////////////
// chuyển hướng vào trang hiển thị danh sách SO
route.get("/danhsachSO/", (req, res) => {
        if (!req.cookies.boss) {
            return res.redirect("/admin/login");
        }
        // phân trang
        let page = 1;
        if (req.query.page) {
            page = parseInt(req.query.page);
        } // thứ tự trang
        let perPage = 5; // số đối tượng trong 1 trang
        let start = (page - 1) * perPage;
        let count = 0;
        let que = `SELECT * from Supported_Object `;
        conn.query(que, (err, result) => {
            count = result.length;
        })
        let sql = `SELECT * from Supported_Object  LIMIT ${start}, ${perPage}`;
        conn.query(sql, (err, result) => {
            if (err) console.log(err);
            else {
                if (req.query.note == 1) {
                    return res.render("admin/QLY_SO/DanhsachSO.ejs", {
                        ds: result,
                        current: page, // page hiện tại
                        pages: Math.ceil(count / perPage), // tổng số các page
                        message: "Thêm thành công!"
                    });
                }
                if (req.query.note == 2) {
                    return res.render("admin/QLY_SO/DanhsachSO.ejs", {
                        ds: result,
                        current: page, // page hiện tại
                        pages: Math.ceil(count / perPage), // tổng số các page
                        message: "Stop thành công!"
                    });
                }
                if (req.query.note == 3) {
                    return res.render("admin/QLY_SO/DanhsachSO.ejs", {
                        ds: result,
                        current: page, // page hiện tại
                        pages: Math.ceil(count / perPage), // tổng số các page
                        message: "Kích hoạt thành công!"
                    });
                }
                if (req.query.note == 4) {
                    return res.render("admin/QLY_SO/DanhsachSO.ejs", {
                        ds: result,
                        current: page, // page hiện tại
                        pages: Math.ceil(count / perPage), // tổng số các page
                        message: "Cập nhật thành công!"
                    });
                }
                if (req.query.note == 5) {
                    return res.render("admin/QLY_SO/DanhsachSO.ejs", {
                        ds: result,
                        current: page, // page hiện tại
                        pages: Math.ceil(count / perPage), // tổng số các page
                        message: "Bạn hãy lựa chọn đối tượng cần sửa!"
                    });
                }
                // console.log(JSON.stringify(result));
                res.render("admin/QLY_SO/DanhsachSO.ejs", {
                    ds: result,
                    current: page, // page hiện tại
                    pages: Math.ceil(count / perPage), // tổng số các page
                    message: ''
                });
            }
        })
    })
    // tắt trạng thái của đối tượng
route.get("/StopSO", (req, res) => {
        if (!req.cookies.boss) {
            return res.redirect("/admin/login");
        }
        let idSO = req.query.IdSO;
        let sql = `UPDATE supported_object SET Status=0 WHERE IdSO='${idSO}'`;
        conn.query(sql, (err, result) => {
            if (err) console.log(err);
            console.log(idSO);
            res.redirect("/admin/DanhsachSO?note=2");
        })
    })
    // kích hoạt trạng thái của đối tượng
route.get("/StartSO", (req, res) => {
        if (!req.cookies.boss) {
            return res.redirect("/admin/login");
        }
        let idSO = req.query.IdSO;
        let sql = `UPDATE supported_object SET Status=1 WHERE IdSO='${idSO}'`;
        conn.query(sql, (err, result) => {
            if (err) console.log(err);
            console.log(idSO);
            res.redirect("/admin/DanhsachSO?note=3");
        })
    })
    //chuyển hướng vào trang Thêm đối tượng SO
route.get("/ThemSO", (req, res) => {
        if (!req.cookies.boss) {
            return res.redirect("/admin/login");
        }
        let sql = `SELECT MAX(IdSO) as IDMAX FROM supported_object`;
        conn.query(sql, (err, result) => {

            if (req.query.empty) {
                res.render("admin/QLY_SO/ThemSO.ejs", {
                    maxID: result,
                    mapVN: mapVietNam,
                    message: 'Vui lòng nhập đầy đủ không để trống'
                })
            }
            res.render("admin/QLY_SO/ThemSO.ejs", {
                maxID: result,
                mapVN: mapVietNam,
                message: ''
            });
        })
    })
    /////////////////// lấy địa chỉ của huyện
route.get("/GetDistricts", (req, res) => {

        //console.log(req.query.idtinh);
        let dis = mapVietNam.filter((el => el.id === req.query.idtinh));
        res.json(dis[0].districts);

    })
    //// lấy thông tin địa chỉ của wards/ phường
route.get("/GetPhuong", (req, res) => {

        let tinh = mapVietNam.filter((el => el.id === req.query.idtinh));
        let dis = tinh[0].districts.filter((el) => el.id === req.query.idhuyen);
        let phuong = dis[0].wards;
       // console.log(phuong);
        res.json(phuong);


    })
    // chuyển hướng sang sửa đối tượng
route.get("/SuaSO", (req, res) => {
    if (!req.cookies.boss) {
        return res.redirect("/admin/login");
    }

    let idSO = req.query.IdSO;
    //kiểm tra tồn tại của 
    if (idSO == 0) {
        res.redirect("/admin/DanhsachSO?note=5");
    }
    else{
        
        let sql = `SELECT * from supported_object where IdSO='${idSO}'`;
        conn.query(sql, (err, result) => {
            if (err) console.log(err);
            let tinh = mapVietNam.filter((element)=>element.name=== result[0].Province);
            let huyen = tinh[0].districts.filter((el)=>el.name=== result[0].Dicstrict);
            let xa = huyen[0].wards.filter((el)=>el.name===result[0].Commune);
             
            if (req.query.empty == 1) {
                res.render("admin/QLY_SO/SuaSO.ejs", {
                    SO: result,
                    mapVN: mapVietNam,
                    tinh: tinh,
                    huyen: huyen,
                    xa: xa,
                    message: ' Vui lòng điền đủ thông tin! '
                });
            }
            
            res.render("admin/QLY_SO/SuaSO.ejs", {
                SO: result,
                mapVN: mapVietNam,
                tinh: tinh,
                huyen: huyen,
                xa: xa,
                message: ''
            });
        })
    }
})


///////////////////////////////////////////////// xử lý quản lý đối tượng ///////////////////////////////////////////////////////////

// xử lý chức năng đăng nhập
route.post("/xulyDangnhap", function(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    password = md5(password);
    let sql = `SELECT * from employee where Username= '${email}' and Password='${password}' `;

    conn.query(sql, (err, result) => {
        if (err) {
            console.log("SQL sai");
        } else {
            if (result.length != 0) { 
                res.cookie("boss", result, "/admin");
                return res.redirect("/admin");
            } else {
                res.redirect("/admin/login?error=1");
                return;
            }
        }
    })
})

// xử lý chức năng thêm SO
route.post("/themDoituong", upload.single('hinh'), function(req, res) {
        let tenSO = req.body.tenSO; 
        let address = req.body.address;
        
        let tinh = mapVietNam.filter((element)=>element.id===req.body.tinh);
        let nameTinh=tinh[0].name;
        let huyen = tinh[0].districts.filter((el)=>el.id===req.body.huyen);
        let nameHuyen=huyen[0].name;
        let xa = huyen[0].wards.filter((el)=>el.id===req.body.xa);
        let nameXa=xa[0].name;
        console.log("xã:"+nameXa+", Huyện: "+nameHuyen+", Tỉnh:"+nameTinh);
        let hinh = "";
        // lấy thông tin admin
        let admin = req.cookies.boss;
        let IdEmployee = admin[0].IdEmployee;
        // kiểm tra và gán file
        if (req.file) {
            hinh = req.file.originalname;
            //console.log('Uploaded:', req.file);
        }
        if (tenSO === "" || address === "" || nameTinh === "" || nameHuyen === "" || nameXa === "" || hinh === "") {
            
            return res.redirect("/admin/ThemSO?empty=1");
        }
        let sql = `INSERT INTO supported_object( NameSO, Address, Province, Dicstrict, Commune, Status, IdEmployee, Image)
        VALUES ('${tenSO}' ,'${address}','${nameTinh}','${nameHuyen}','${nameXa}','1','${IdEmployee}','${hinh}')`;

        conn.query(sql, (err, result) => {
            if (err) console.log(err);
            res.redirect("/admin/DanhsachSO?note=1");
        })
    })
    // xử lý chức năng sửa đối tượng
route.post("/xulyUpdate", upload.single('hinh'), function(req, res) {
    let idSO = req.body.IdSO;
    let tenSO = req.body.tenSO; 
    let address = req.body.address;
    //lấy địa chỉ
    let tinh = mapVietNam.filter((element)=>element.id == req.body.tinh);
    let nameTinh=tinh[0].name;
      
    let huyen = tinh[0].districts.filter((el)=>el.id ===req.body.huyen.trim()); 
    let nameHuyen=huyen[0].name;

    let xa = huyen[0].wards.filter((el)=>el.id == req.body.xa.trim());
    let nameXa=xa[0].name; 

    let hinh = '';
    // lấy admin
    let admin = req.cookies.boss;
    let IdEmployee = admin[0].IdEmployee;
     
    // kiểm tra và gán file
    if (req.file) {
        hinh = req.file.originalname;
        //console.log('Uploaded:', req.file);
    }
    if (tenSO === ""  || address === "" || nameTinh === "" || nameHuyen === "" || nameXa === ""  ) {
        console.log(IdEmployee);
        return res.redirect(`/admin/SuaSO?empty=1&&IdSO=${idSO}`);
    }
    //console.log(hinh);
    if(hinh=='')
    {
        let sql = `UPDATE supported_object SET NameSO='${tenSO}' ,Address='${address}',Province='${nameTinh}',
        Dicstrict='${nameHuyen}',Commune='${nameXa}',IdEmployee='${IdEmployee}' ,DateUpdate= Now()  WHERE IdSO= '${idSO}' `;
        conn.query(sql, (err, result) => {
            if (err) console.log(err);
            res.redirect("/admin/DanhsachSO?note=4");
        }) 
    }
    else{
        let sql = `UPDATE supported_object SET NameSO='${tenSO}' ,Address='${address}',Province='${nameTinh}',
        Dicstrict='${nameHuyen}',Commune='${nameXa}',IdEmployee='${IdEmployee}',Image='${hinh}' ,DateUpdate= Now()  WHERE IdSO= '${idSO}' `;
        conn.query(sql, (err, result) => {
            if (err) console.log(err);
            res.redirect("/admin/DanhsachSO?note=4");
        })

    }
})
    // xử lý tìm kiếm
route.post("/xulySearch",(req,res)=>{
    let nd = req.body.noidungSearch;
    console.log(nd);
})

/////////////////////////////////////               QUẢN LÝ BÀI  VIẾT               ///////////////////////////////////

///// chuyển hướng: 
// lấy đối tượng đưa vào thêm
route.get("/GetSO", (req, res) => {
    let id = req.query.idSO;
    let sql = `SELECT * from supported_object where IdSO= '${id}'`;
    conn.query(sql, (err, result) => {
        if (err) console.log(err);
        return res.json(result);
    })
})
// go to view page Thêm bài viết
route.get("/ThemPost", (req, res) => {
        // kiểm tra tồn tại của admin
        if (!req.cookies.boss) {
            return res.redirect("/admin/login");
        }

        let username = req.cookies.boss[0].Username;
        let password = req.cookies.boss[0].Password;
        let sql = `SELECT * from employee where Username='${username}' and Password='${password}' `;
        conn.query(sql, (err, result) => {
            if (err) console.log(err);
            else {
                if (result.length == 0) {
                    return res.redirect("/admin/login");
                }
            }
        });
        ////// go to views thêm bài viết
        let msg = req.query.msg;
        let que = `SELECT * FROM supported_object WHERE NOT EXISTS( SELECT * from post where post.IdSO= supported_object.IdSO ) AND supported_object.Status=1 `;
        conn.query(que, (err, result) => {
            if (err) console.log(err);
            if(msg){
                return res.render("admin/QLY_POST/themPost", {
                    SO: result,
                    message: 'Thêm thành công!'
                });
                
            }
            return res.render("admin/QLY_POST/themPost", {
                SO: result,
                message: ''
            });
        })
})
// go to view page danh sách bài viết:
route.get("/DanhsachPost",(req,res)=>{
    // kiểm tra tồn tại của admin
        if (!req.cookies.boss) {
            return res.redirect("/admin/login");
        }

        let username = req.cookies.boss[0].Username;
        let password = req.cookies.boss[0].Password;
        let sql = `SELECT * from employee where Username='${username}' and Password='${password}' `;
        conn.query(sql, (err, result) => {
            if (err) console.log(err);
            else {
                if (result.length == 0) {
                    return res.redirect("/admin/login");
                }
            }
        });
    // phân trang
    let page = 1;
    if (req.query.page) {
        page = parseInt(req.query.page);
    } // thứ tự trang
    let perPage = 5; // số đối tượng trong 1 trang
    let start = (page - 1) * perPage;
    let count = 0;
    let que = `SELECT * from post `;
    conn.query(que, (err, result) => {
        count = result.length;
    })
    // lấy data xuất ra giao diện:
    let message = req.query.msg;
    let sql_page = `SELECT post.IdPost,DATE_FORMAT(post.CreateDate, '%Y-%m-%d %H:%m:%s') AS 'CreateDate'
                           , DATE_FORMAT(post.EndDate, '%Y-%m-%d %H:%m:%s') AS 'EndDate'
                           , post.Title, post.Content
                           , post.Status
                           , FORMAT(post.Total_Amount, 0) AS 'Total_Amount'
                           , post.LikePost
                           , post.IdSO
                           , post.IdEmployee 
                    FROM post LIMIT ${start},${perPage}`;

    conn.query(sql_page,(err,result)=>{
        if(err) console.log(err);
        if(message == 1){
            return res.render("admin/QLY_POST/danhsachPost.ejs",{
                dsPost: result,
                current: page, // page hiện tại
                pages: Math.ceil(count / perPage), // tổng số các page
                message: 'Thêm thành công'
            })
        }
        if(message == 2){
            return res.render("admin/QLY_POST/danhsachPost.ejs",{
                dsPost: result,
                current: page, // page hiện tại
                pages: Math.ceil(count / perPage), // tổng số các page
                message: 'Không thể sửa!Bài viết này đã được quyên góp.'
            })
        }
        return res.render("admin/QLY_POST/danhsachPost.ejs",{
            dsPost: result,
            current: page, // page hiện tại
            pages: Math.ceil(count / perPage), // tổng số các page
            message: ''
        })
    })
})
//go to view page form sửa bài viết:
route.get("/formSuaPost",(req,res)=>{
    // kiểm tra tồn tại của admin
    if (!req.cookies.boss) {
        return res.redirect("/admin/login");
    }

    let username = req.cookies.boss[0].Username;
    let password = req.cookies.boss[0].Password;
    let sql_admin = `SELECT * from employee where Username='${username}' and Password='${password}' `;
    conn.query(sql_admin, (err, result) => {
        if (err) console.log(err);
        else {
            if (result.length == 0) {
                return res.redirect("/admin/login");
            }
        }
    });
    // lấy thông tin bài viết và đôi tượng
    let idPost = req.query.IdPost; 
    let que=`SELECT post.IdPost,DATE_FORMAT(post.CreateDate, '%Y-%m-%dT%H:%m:%s') AS 'CreateDate'
                , DATE_FORMAT(post.EndDate, '%Y-%m-%dT%H:%m:%s') AS 'EndDate'
                , post.Title, post.Content
                , post.Status
                , post.Total_Amount 
                , post.LikePost
                , post.IdSO
                , post.IdEmployee 
            FROM post where IdPost='${idPost}'`;
    conn.query(que,(err,result)=>{
        if(err) console.log(err);
        let idso= result[0].IdSO;
        let post =result;
        let message = req.query.msg;
        if(post[0].Status==2){
            return res.redirect('/admin/DanhsachPost?msg=2')
        }
        let sql_SO=`SELECT * from supported_object where IdSO=${idso} `;
        conn.query(sql_SO,(err,result)=>{
            if(err) console.log(err);
            if(message==1){
                
                return res.render("admin/QLY_POST/formSuaPost.ejs",{
                    post: post,
                    SO:result,
                    message: 'Sửa thành công'
                })
            }
            return res.render("admin/QLY_POST/formSuaPost.ejs",{
                post: post,
                SO:result,
                message: ''
            })
        })
    })
})
route.get("/xemchitietPost",(req,res)=>{
    // kiểm tra tồn tại của admin
    if (!req.cookies.boss) {
        return res.redirect("/admin/login");
    }

    let username = req.cookies.boss[0].Username;
    let password = req.cookies.boss[0].Password;
    let sql = `SELECT * from employee where Username='${username}' and Password='${password}' `;
    conn.query(sql, (err, result) => {
        if (err) console.log(err);
        else {
            if (result.length == 0) {
                return res.redirect("/admin/login");
            }
        }
    });
    // lấy dữ liệu:
    let idpost = req.query.IdPost;
    let que = `SELECT post.IdPost,DATE_FORMAT(post.CreateDate, '%Y-%m-%d %H:%m:%s') AS 'CreateDate'
                    , DATE_FORMAT(post.EndDate, '%Y-%m-%d %H:%m:%s') AS 'EndDate'
                    , post.Title, post.Content
                    , post.Status
                    , FORMAT(post.Total_Amount, 0) AS 'Total_Amount'
                    , post.LikePost
                    , post.IdSO
                    , post.IdEmployee 
                FROM post  where IdPost=${idpost}`;
    conn.query(que,(err,result)=>{
        if(err) console.log(err);
        let post= result;
        let sql_SO = `Select * from supported_object where IdSO= ${post[0].IdSO}`;
        conn.query(sql_SO,(err,result)=>{
            if(err) throw err;
            return  res.render("admin/QLY_POST/chitietPost.ejs",{
                post: post, 
                SO: result
            })
        })
    })
})
  ///////////////////////////////////// XỬ LÝ Bài viết ////////////////////////////////
route.post("/xulyThemPost", (req, res) => {
        let idSO = req.body.idSO;
        let tieude = req.body.tieude;
        let noidung = req.body.noidung;
        let tien = req.body.tien;
        let EndDate = req.body.EndDate;
        console.log(EndDate);
        let IdEmployee =  req.cookies.boss[0].IdEmployee;
        let sql = ` INSERT INTO post(CreateDate, Title,Content, Status, LikePost, IdSO,IdEmployee,Total_Amount,EndDate)
        VALUES (Now(),'${tieude}','${noidung}','1','0','${idSO}','${IdEmployee}','${tien}','${EndDate}')`;
        conn.query(sql,(err,result)=>{
            if(err) console.log(err);
            return res.redirect("/admin/DanhsachPost?msg=1" )
        })
})
//// xử lý cập nhật bài viết
route.post("/xulySuaPost",(req,res)=>{
     
    let idPost= req.body.idpost;
    let tieude = req.body.tieude;
    let noidung = req.body.noidung;
    let tien = req.body.tien;
    let endDate = req.body.EndDate;
    let IdEmployee =  req.cookies.boss[0].IdEmployee;
    
    let sql=`UPDATE post SET CreateDate=Now(),Title='${tieude}',Content='${noidung}',
    Status='1',Total_Amount='${tien}',LikePost='0',IdEmployee='${IdEmployee}', EndDate='${endDate}' WHERE IdPost=${idPost}`;
    conn.query(sql,(err,result)=>{
        if(err) console.log(err);
        return res.redirect(`/admin/formSuaPost?IdPost=${idPost}&&msg=1`)
    })
})
    // exports route 
module.exports = route;