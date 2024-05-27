function ensure() {
    var the = document.getElementById('k1');
    var allnum = document.getElementById('k2');
    var getnum = document.getElementById('k3');
    var theme = the.value;//抽签主题
    var allnums = Number(allnum.value);//总计人数
    var getnums = Number(getnum.value);//总共可获奖人数
    if (theme == '') {
        alert('抽签主题不能为空');
        return
    }
    if (allnums == '') {
        alert('总人数不能为空');
        return
    }
    if (getnums == "") {
        alert("获奖人数不能为空");
        return
    }
    if (allnums < 2) {
        alert("抽签人数必须大于等于2");
        return
    }
    if (allnums < getnums) {
        alert('获奖人数必须小于总人数')
        return
    }
    var ownername=window.sessionStorage.getItem("uid");
    create(theme, allnums, getnums, ownername);
}


//创建抽签
function create(theme, allnums, getnums, ownername) {
    remainingall = allnums;
    remainingward = getnums;
    joinnums = 0;//当前参加的人数
    var status='ing';
    //创建抽签时发送的请求
    $.ajax({
        url: "http://127.0.0.1:8888/newinfo",
        type: "POST",
        dataTypes: "json",
        data: {
            "theme": theme,
            "allnums": allnums,
            "getnums": getnums,
            "joinnums": joinnums,
            "ownername": ownername,
            "remainingall": remainingall,
            "remainingward": remainingward,
            "status":status
        },
        success: function (res) {
            window.location.href = "./details.html";
            sessionStorage.setItem('uid', ownername);
            var str = ownername + '&' + res.id;
            sessionStorage.setItem('password', str);
        },
        error: function (res) {
            alert(res.responseText);
        }
    })
}