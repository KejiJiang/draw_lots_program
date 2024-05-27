function refresh() {
    var ul1 = document.getElementById('u1');
    ul1.innerHTML=("");
    var myname = sessionStorage.getItem("uid");
    // 获取后端数据
    $.ajax({
        url: "http://127.0.0.1:8888/myallchouqian",
        type: "GET",
        dataTypes: "json",
        data: {
            "ownername": myname,
        },
        success: function (res) {
            var index;
            var theme;
            for(index=0;index<res.length;index++){
                theme=res[index].theme;
                var li = document.createElement('li');//新建一个<li>
                li.id = 'li' + res[index].id;
                //往li里添加内容
                li.innerHTML = '<span>' + '主题：' + '</span>&nbsp;&nbsp;' + '<span>' + theme + '</span>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<span><button class="b3"style=" width: 54px;height: 30px;bottom: 78px;font-size: 7px;background: rgb(255, 255, 255);" onclick="examine('+res[index].id+')">查看</button> </span>';
                //判断后加入到ul1里面去
                ul1.appendChild(li);
            }
        },
        error: function (res) {
            alert(res.responseText);
        }
    })
}

function examine(id) {
    var ownername=sessionStorage.getItem("uid");
    var str=ownername+'&'+id;
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
            window.location.href = "./details.html";
            sessionStorage.setItem('password', str);
        },
        error: function (res) {
            alert(res.responseText);
        }
    })
}

window.onload = function () {
    window.onload = refresh();
}