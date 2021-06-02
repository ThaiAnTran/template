!function (f) { 
    f.fn.simpleMoneyFormat = function () { 
        function a(t, e, n) { 
            for (var l = "", a = n.split(""), i = [], p = 0, u = "", r = a.length - 1; 0 <= r; r--)
            u += a[r], 3 == ++p && (i.push(u), p = 0, u = ""); 
            0 < p && i.push(u);
             for (r = i.length - 1; 0 <= r; r--) 
            { 
                for (var o = i[r].split(""), c = o.length - 1; 0 <= c; c--)
                    l += o[c]; 0 < r && (l += ",")
            }
            "input" == e ? f(t).val(l) : f(t).empty().text(l) 
        } this.each(function (t, e) { 
            var n = null, l = null,
            n = f(e).is("input") || f(e).is("textarea") ? (l = f(e).val().replace(/,/g, ""), "input") : (l = f(e).text().replace(/,/g, ""), "other");
            f(e).on("paste keyup", function () {
                 l = f(e).val().replace(/,/g, ""), a(e, n, l)
            }),
            a(e, n, l)
         })
    }
}(jQuery);