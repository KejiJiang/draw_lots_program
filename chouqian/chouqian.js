var allarray = [];

//初始化混乱数组
function init() {
    var getarray = [];
    var percent = getnums / allnums;
    for (var i = 0; i < allnums; i++) {
        getarray[i] = 0;
    }
    for (var i = 0, j = 0; i < allnums && j < getnums;) {
        if (Math.random() < percent) {//中奖签
            if (getarray[i] == 1) {
                i++;
            } else {
                if (i != allnums - 1) {
                    getarray[i] = 1;
                    i++;
                    j++;
                } else {
                    getarray[i] = 1;
                    i = 0;
                    j++;
                }
            }
        } else {
            if (i != allnums - 1) {
                i++;
            } else {
                i = 0;
            }
        }
    }
    create(theme, allnums, getnums, ownername, getarray, allarray);
}


//创建抽签
function create(theme, allnums, getnums, ownername, getarray, allarray) {
    remainingall = allnums;
    remainingward = getnums;
    //创建抽签时发送的请求
    $.ajax({
        url: "http://127.0.0.1:8888/newinfo",
        type: "POST",
        dataTypes: "json",
        data: {
            "theme": theme.value,
            "allnums": allnums.value,
            "getnums": getnums.value,
            "joinnums": joinnums.value,
            "ownername": ownername.value,
            "remianingall": remainingall.value,
            "remainingward": remainingward.value,
        },
        success: function (res) {
            console.log(res);
            allarray[res.id] = getarray;
            join(res.id, theme, allnums, getarray, allarray);
        },
        error: function (res) {
            alert(res.responseText);
        }
    })
}

//用户加入抽签功能
function join(id, theme, allnums, getarray, allarray) {
    //参加时进行一次获取后台数据
    $.ajax({
        url: "http://127.0.0.1:8888/information",
        type: "GET",
        dataTypes: "json",
        data: {
            "id": id.value,
            "theme": theme.value,
        },
        success: function (res) {
            var obj = JSON.parse(res);//把返回的json字符串转化为对象
            console.log(res.joinnums);
            console.log(res.ownername);
            console.log(res.remainingall);
            console.log(res.remainingward);
            chou(res.id,theme,allnums,res.joinnums,getarray,allarray);
        },
        error: function (res) {
            alert(res.responseText);
        }
    })
}

//用户进行抽签函数
function chou(id, theme, allnums, joinnums, getarray, allarray) {
    var flag = 0;
    var now;
    var i = 0;
    remainingall--;
    while (i == 0) {
        now = Math.round(Math.random() * allnums);
        if (getarray[now] == 1) {
            getarray[now] = 2;//2表示已经抽过了
            flag = 1;
            remainingward--;
            allarray[id] = getarray;
            break;
        } else if(getarray[now]==0){
            getarray[now] = 2;
            allarray[id]=getarray;
            break;
        }else{
            continue;
        }
    }
    //抽取后发送的请求
    $.ajax({
        url: "http://127.0.0.1:8888/renewinfo",
        type: "POST",
        dataTypes: "json",
        data: {
            "theme": theme.value,
            "joinnums": joinnums.value,
            "remianingall": remainingall.value,
            "remainingward": remainingward.value,
        },
        success: function (res) {
            console.log(res);
            if(flag==1){

            }else{

            }
        },
        error: function (res) {
            alert(res.responseText);
        }
    })
}