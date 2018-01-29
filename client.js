var ws;// = new WebSocket("ws://127.0.0.1:444/");     
    

function connect(){
    let url = document.getElementById("in-url").value;
    ws = new WebSocket(url);
    ws.onopen = function() {  
    document.getElementById("diplayText").value +="\r\n" +"Opened";  
   
    localStorage.setItem("ws-url",url);
   //ws.send("I'm client");    
};    
    
ws.onmessage = function (evt) {     
    //alert(evt.data);    
    console.log(evt.data);
    document.getElementById("diplayText").value +="\r\n" +JSON.stringify(evt.data);    
};    
    
ws.onclose = function() {    
   document.getElementById("diplayText").value +="\r\n" +"Closed";    
};    
    
ws.onerror = function(err) {    
   document.getElementById("diplayText").value +="\r\n" +"Error: ";    
};
}

function init(){

    document.getElementById("in-url").value = localStorage.getItem("ws-url");
    document.getElementById("in-data1").value = `{
        "action": "device.info.read",
        "data": {
            "type": "server",
            "time": "2017-01-07 08:02:56"
        }
    }`
    
    document.getElementById("in-data2").value = `{
        "action": "apply.release",
        "data": {
            "name": "小明",
            "ip": "192.168.1.123",
            "message": "让我控制下？"
        }
        }`

document.getElementById("diplayText").value +="消息框";
}

window.onload = ()=>{
init();
}

function send(id){
    let data = document.getElementById(id).value;

    document.getElementById("diplayText").value +="\r\n" + data;
    ws.send(data);    
}
