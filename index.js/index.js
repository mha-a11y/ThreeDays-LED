<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>云端控制台</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</head>
<body>
    <h1>STM32 云端指挥部</h1>
    <hr>
    <button onclick="sendCmd('on')" style="padding:20px">点亮 LED</button>
    <button onclick="sendCmd('off')" style="padding:20px">关闭 LED</button>
    <h2 id="status">等待指令...</h2>

    <script>
        function sendCmd(action) {
            document.getElementById('status').innerText = "指令传输中...";
            // 这里直接填你服务器的公网 IP
            axios.get('http://你的服務器ip：端口/led/' + action)
                .then(res => { document.getElementById('status').innerText = res.data; })
                .catch(err => { document.getElementById('status').innerText = "通信失败"; });
        }
    </script>
</body>
</html>
