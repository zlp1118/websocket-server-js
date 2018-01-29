
var name = "新虚拟设备";
var tt;
var wss;

var info = {
    name: "虚拟v1.5.0设备IP51",
    group: "group1", 
    serial: "513e4567-e89b-12d3-a456-426655440123",
    controlled: false, 
    username: "",
    device_ip: "192.168.1.51",
    model: "robot4x", 
    status: 0,
    request_ip: "192.168.1.172",
    program_name: "",
    version: "1.5.0",
    controller_ip: ""
};

var initReadCount = 1;
var init = {
    "mode": 0,
    "stage": 0,
    "connect": {
        "joint1": true,
        "joint2": true,
        "joint3": true,
        "joint4": true,
        "main_io": true,
        "tool_io": true
    },
    "init": {
        "joint1": true,
        "joint2": true,
        "joint3": true,
        "joint4": true
    },
    "executing": {
        "joint1": true,
        "joint2": true,
        "joint3": true,
        "joint4": true
    },
    "result": {
        "joint1": true,
        "joint2": true,
        "joint3": true,
        "joint4": true
    }

};


var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ port: 3051 });
wss.on('connection', function (ws) {
    console.log('#_____________________ws: %s', ws.target);
    ws.on('message', function (message) {
        console.log('#_____________________received: %s', message);
        try {
            var json = JSON.parse(message);
            switch (json.action) {
                case "device.info.read": sendinfo(ws, json); break;
                case "device.control": sendinfo2(ws, json); break;
                case "device.release": sendRelease(ws, json); break;
                case "device.install": sendinfo3(ws, json); break;
                case "device.run": sendRun(ws, json); break;
                case "device.velocity": sendVelocity(ws, json); break;
                case "device.drag.stop": sendSuccess(ws, json); break;
                case "device.drag.run": sendSuccess(ws, json); break;
                case "device.param.read": sendJointInfo(ws, json); break;
                case "download.file": sendinfo3(ws, json); break;
                case "program.update": sendinfo101(ws, json); break;
                case "device.initialize": sendinfo4(ws, json); break;
                case "device.info.change": sendinfo102(ws, json); break;
                case "device.initialize.check": sendinfo5(ws, json); break;
                case "device.running.info": sendrunninginfo(ws); break;
                case "device.power.off": sendPowerOff(ws,json); break;
            }

        } catch (error) {
            console.log('#_____________________error: %s', error);
        }

    });

    ws.on('error', function (error) {
        console.log("#_________error:%s",error);
        info.controlled = false;
        info.ui_ip = "";
        info.username = "";
    });

    ws.on('close', function (code,message) {
        console.log("#_________close:%s",code,message);
        info.controlled = false;
        info.ui_ip = "";
        info.username = "";
    });
    //wss = ws;

    // tt = setInterval(function () {
    //     var str = `{"action":"log.info.reported","error":{
    // "time":"2017-01-01 02:33:02","status":101,"description":"#turn on"}}
    // `
    //     wss.send(str);
    // }, 15000);
    //ws.send('something');
});

/** 读取设备信息 */
function sendinfo(ws, json) {
    var data = { action: json.action, data: info };
    var str = JSON.stringify(data);
    ws.send(str);
    
    console.log('#_________________________send: %s', str);
    // setTimeout(()=>{ws.send(0x09)},2000)
}

/** 控制 */
function sendinfo2(ws, json) {
    let success = false;
    var data = { action: json.action }
    console.log('#_________________________pass: %s', json.data.password, info.password);
    if (json.data.password === "123456") {
        if (!info.controlled) {
            info.controlled = true;
            success = true;
            info.ui_ip = json.data.ui_ip;
            info.username = json.data.username;

            data.data = { success: success, ui_ip: info.ui_ip, username: info.username + "51" };
        } else {
            data.error = { status: 1002, description: "device is controlled for "+info.username }
        }
    }
    else {
        data.error = { status: 999, description: "password error." }
    }


    var str = JSON.stringify(data);

    //setTimeout(()=>{ws.send(JSON.stringify({"action":"log.info.reported","error":{
    // "time":"2017-01-01 02:33:02","status":9001,"description":"#turn on"}}));
    //console.log('#_________________________send: %s', str);},3000);

   setTimeout(function () {

ws.send(str);
     console.log('#_________________________send: %s', str);//
    },3000);
    
}

/** 释放 */
function sendRelease(ws, json) {
    var data = { action: json.action }

    if (json.data.password === info.password) {

        info.controlled = false;
        info.ui_ip = "";
        info.username = "";

        data.data = { success: true };
    }
    else {
        data.error = { status: 999, description: "password error." }
    }


    var str = JSON.stringify(data);
    setTimeout(function () {
        ws.send(str);
        console.log('#_________________________send: %s', str);
    }, 3000);

}

/** 安装程序 */
function sendinfo3(ws, json) {
    var str = `{"action":"` + json.action + `","data":{
    "success":true}}
`//,"no":`+ json.data.no + `
    ws.send(str);
    console.log('#_________________________send: %s', str);
}

/** 发送成功 */
function sendSuccess(ws, json) {
    var data = { action: json.action };
    data.data = { success: true };
    var str = JSON.stringify(data);
    ws.send(str);
    console.log('#_________________________send: %s', str);
}

/** 读取设备信息 */
function sendRun(ws, json) {
    var data = { action: json.action };
    data.data = { success: true };
    var str = JSON.stringify(data);

    setTimeout(function () {
        ws.send(str);
        console.log('#_________________________send: %s', str);
    }, 3000);
}

/** 关机 */
function sendPowerOff(ws, json) {
    var data = { action: json.action };
    data.data = { success: true };
    var str = JSON.stringify(data);

    setTimeout(function () {
        ws.send(str);
        console.log('#_________________________send: %s', str);
    }, 3000);
}

function sendVelocity(ws, json) {
    var data = { action: json.action };
    data.data = { success: true };
    var str = JSON.stringify(data);
    ws.send(str);
    console.log('#_________________________send: %s', str);
}

/** 开始初始化 */
function sendinfo4(ws, json) {
    var data = { action: json.action }
    data.data = { success: true }
    var str = JSON.stringify(data);
    setTimeout(function () {
        ws.send(str);
        console.log('#_________________________send: %s', str);
    },3000);
    initReadCount = 1;
    init = {
        "mode": 0,
        "stage": 0,
        "connect": {
            "joint1": false,
            "joint2": false,
            "joint3": false,
            "joint4": false,
            "main_io": false,
            "tool_io": false
        },
        "init": {
            "joint1": false,
            "joint2": false,
            "joint3": false,
            "joint4": false
        },
        "executing": {
            "joint1": false,
            "joint2": false,
            "joint3": false,
            "joint4": false
        },
        "result": {
            "joint1": false,
            "joint2": false,
            "joint3": false,
            "joint4": false
        }

    };
}

function semdSuccess(ws, json) {
    var str = `{"action":"` + json.action + `","data": {
        "success": true
    }
}
`
    ws.send(str);
    console.log('#_________________________send: \r\n%s', str);
}


/** 读取初始化状态 */
function sendinfo5(ws, json) {
    switch (initReadCount) {
        case 1: init.connect.joint1 = true; break;
        case 2: init.connect.joint2 = true; break;
        case 3: init.connect.joint3 = true; break;
        case 4: init.connect.joint4 = true; break;
        case 5: init.connect.main_io = true; break;
        case 6: init.connect.tool_io = true; break;

        case 7: init.executing.joint1 = true; break;
        case 8: init.executing.joint1 = false; init.result.joint1 = true; break;

        case 9: init.executing.joint2 = true; break;
        case 10: init.executing.joint2 = false; init.result.joint2 = true; break;

        case 11: init.executing.joint3 = true; break;
        case 12: init.executing.joint3 = false; init.result.joint3 = true; break;

        case 13: init.executing.joint4 = true; break;
        case 14: init.executing.joint4 = false; init.result.joint4 = true;
            info.status = 1;//初始化完成。
            initReadCount = 1;
            break;
    }
    initReadCount += 1;

    var data = { action: json.action }

    data.data = init;

    var str = JSON.stringify(data);
    ws.send(str);
    console.log('#_________________________send: %s', str);


}

/** 读取关节信息 */
function sendJointInfo(ws, json) {
    var data = { action: json.action }

    data.data = {
        "joint1": {
            "voltage": 48.022,
            "current": 1.235,
            "velocity": 32.25,
            "position": 1.235,
            "acceleration": {
                "x": 0.1,
                "y": 0.1,
                "z": 0.1
            }
        },
        "joint2": {
            "voltage": 48.022,
            "current": 1.235,
            "velocity": 32.25,
            "position": 1.235,
            "acceleration": {
                "x": 0.1,
                "y": 0.1,
                "z": 0.1
            }
        },
        "joint3": {
            "voltage": 48.022,
            "current": 1.235,
            "velocity": 32.25,
            "position": 1.235,
            "acceleration": {
                "x": 0.1,
                "y": 0.1,
                "z": 0.1
            }
        },
        "joint4": {
            "voltage": 48.022,
            "current": 1.235,
            "velocity": 32.25,
            "position": 1.235,
            "acceleration": {
                "x": 0.1,
                "y": 0.1,
                "z": 0.1
            }
        }
    };

    var str = JSON.stringify(data);
    ws.send(str);
    console.log('#_________________________send: %s', str);

}

function sendinfo101(ws, json) {
    var str = `{"action":"` + json.action + `","data":{
        "progress":100,"name":"`+ json.data.name + `"}}
        `
    ws.send(str);
    console.log('#_________________________send: %s', str);
}

function sendinfo102(ws, json) {
    var str = `{"action":"` + json.action + `","data": {
        "success": true
        }
    }
    `
    ws.send(str);
    console.log('#_________________________send: %s', str);
    info.name = json.data.name;
}

function sendrunninginfo(ws) {
    var str = `{"action":"device.running.info","data": {
        "name": "test_dev1",
        "model": "axis4",
        "serial": "67d09df8-e15b-43ea-ba18-ce6782f4e4c1",
        "driver_version": {
            "x": "v1.1",
            "y": "v1.1",
            "r": "v1.1",
            "z": "v1.1"
        },
        "controller_version": "v3.0.1.2",
        "io_version": {
            "mio": "v1.1",
            "gio": "v1.1"
        },
        "algorithm_version": "v1.4",
        "status": 0,
        "boot_time": "2016-02-15 06:02:01",
        "run_time": 150,
        "program": "test123451",
        "run_count": 50
    }}
`
    ws.send(str);
    console.log('#_________________________send: %s', str);
}