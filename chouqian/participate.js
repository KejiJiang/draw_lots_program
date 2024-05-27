function participate() {
    var drawlots = document.getElementById('i1');
    var password = drawlots.value;
    if (password === ' ') {
        alert('输入不能为空');
        return
    }
    var string = password.split('&');
    var id = string[1];
    var ownername=string[0];
    $.ajax({
        url: "http://127.0.0.1:8888/information",
        type: "GET",
        dataTypes: "json",
        data: {
            "id": id,
        },
        success: function (res) {
            if(res[0].ownername==ownername){
                if(res[0].status=="over"){
                    alert("抽签已结束");
                    return;
                }
            }else{
                alert("密令错误");
                return;
            }
            chou(res[0].id, res[0].theme, res[0].allnums, res[0].getnums, res[0].joinnums, res[0].remainingall, res[0].remainingward,res[0].status);
        },
        error: function (res) {
            alert(res.responseText);
        }
    })
}

//用户进行抽签函数
function chou(id, theme, allnums, getnums, joinnums, remainingall, remainingward,status) {
    var flag;//标志是否中奖
    var percent = getnums / allnums;//中奖概率
    if(remainingward==0){//剩余中奖签数为0，必不会中奖
        flag=0;
    }else if(remainingall==remainingward){//剩余签数等于剩余中奖签数，必中奖
        flag=1;
        remainingward--;
    }else{
        if(Math.random()<percent){//中奖
            remainingward--;
            flag=1;
        }else{//未中奖
            flag=0;
        }
    }
    joinnums++;
    remainingall--;
    if(remainingall==0){//剩余可抽签数为0，结束
        status='over';
        $.ajax({
            url: "http://127.0.0.1:8888/renewendinfo",
            type: "PUT",
            dataTypes: "json",
            data: {
                "id": id,
                "status":status
            },
            success: function (res) {
            },
            error: function (res) {
                alert(res.responseText);
            }
        })
    }
    if(flag==1){
        $.ajax({
            url: "http://127.0.0.1:8888/renewinfo",
            type: "PUT",
            dataTypes: "json",
            data: {
                "id": id,
                "theme": theme,
                "joinnums": joinnums,
                "remainingall": remainingall,
                "remainingward": remainingward,
            },
            success: function (res) {
                window.location.href = "./award.html";
            },
            error: function (res) {
                alert(res.responseText);
            }
        })
    }else{
        $.ajax({
            url: "http://127.0.0.1:8888/renewinfo",
            type: "PUT",
            dataTypes: "json",
            data: {
                "id": id,
                "theme": theme,
                "joinnums": joinnums,
                "remainingall": remainingall,
                "remainingward": remainingward,
            },
            success: function (res) {
                window.location.href = "./lose.html"
            },
            error: function (res) {
                alert(res.responseText);
            }
        })
    }

}