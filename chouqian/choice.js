function source(){
    window.location.href = "drawlots.html";
}
function participater(){
    window.location.href = "participate.html";
}
function examine(){
    //var ownername=sessionStorage.getItem("uid");
    window.location.href="examine.html";
    autorefresh();
}

function autorefresh() {
    var ul1 = document.getElementById('u1');
    var li = document.createElement('li');//新建一个<li>
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
            console.log(res);
            var theme = res[0].theme;
            var owner = res[0].ownername;
            if (id) {
                li.id = 'li' + id;
                //往li里添加内容
                li.innerHTML = '<span>' + '主题：' + '</span>&nbsp;&nbsp;' + '<span>' + theme.value + '</span>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<span><button class="b3"style=" width: 54px;height: 30px;bottom: 78px;font-size: 7px;background: rgb(255, 255, 255);" onclick="examine(id)">查看</button> </span>';
                //判断后加入到ul1里面去
                ul1.appendChild(li);
                id++;
            }
        },
        error: function (res) {
            alert(res.responseText);
        }
    })
}