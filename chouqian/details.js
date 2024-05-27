function refresh() {
    var str = sessionStorage.getItem('password');
    var id=str.split('&')[1];
    // 获取后端数据
    $.ajax({
        url: "http://127.0.0.1:8888/information",
        type: "GET",
        dataTypes: "json",
        data: {
            "id": id,
        },
        success: function (res) {
            var theme=res[0].theme;
            var owner = res[0].ownername;
            //var allnums=res[0].allnums;
            var getnums = res[0].getnums
            var joinnums = res[0].joinnums;
            var remainingall = res[0].remainingall;
            var remainingaward = res[0].remainingward;
            $("#h1").text(owner); // 修改p2标签
            $("#h2").text(str); // 修改p3标签
            $("#p4").text("已抽签人数：" + joinnums); // 修改p4标签
            $("#p5").text("最大中奖人数：" + getnums); // 修改p5标签
            $("#p6").text("剩余中奖名额：" + remainingaward); // 修改p6标签
            $("#p7").text("剩余参与名额：" + remainingall); // 修改p7标签
            $("#p8").text("抽签主题："+theme);
        },
        error: function (res) {
            alert(res.responseText);
        }
    })


}

function end() {
    var str = sessionStorage.getItem('password');
    var id=str.split('&')[1];
    var status='over'
    //向后端发送结束信号
    $.ajax({
        url: "http://127.0.0.1:8888/renewendinfo",
        type: "PUT",
        dataTypes: "json",
        data: {
            "id": id,
            "status":status
        },
        success: function (res) {
            alert(res);
        },
        error: function (res) {
            alert(res);
        }
    })
}
window.onload = function () {
    window.onload = refresh();
}