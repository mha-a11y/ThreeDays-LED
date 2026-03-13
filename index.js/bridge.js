// 1. 尝试加载模块并捕获可能的错误
try {
  var { SerialPort } = require('serialport');
  var axios = require('axios');
} catch (e) {
  console.log("致命错误：你还没安装插件！请在终端输入: npm install serialport axios");
  process.exit();
}

console.log("------------------------------------");
console.log("脚本执行自检中...");

// 配置区
const CLOUD_IP = '00.00.000.000';
const COM_PORT = 'COM3';  // 这里的数字你根据设备管理器再确认下，不行就试 COM12
const BAUD_RATE = 9600;

// 2. 尝试打开串口
try {
  const port = new SerialPort({
    path: COM_PORT,
    baudRate: BAUD_RATE,
  }, function (err) {
    if (err) {
      console.log("[串口失败] 无法连接到 " + COM_PORT + "，请检查：1.插紧了吗？ 2.端口号对吗？");
    } else {
      console.log("[串口成功] 已成功连接到 " + COM_PORT);
    }
    port.on('data', function (data) {
      // data 是 Buffer 类型，我们需要把它转成字符串
      console.log('<<< 来自单片机回传的内容:', data.toString());

      // 如果你想看它具体的 16 进制码（排查乱码神器）
      console.log('<<< 回传原始字节 (Hex):', data.toJSON().data);
    });
  });

  // 3. 循环请求云端
  console.log("[网络启动] 正在连接云端服务器 " + CLOUD_IP + "...");
  let lastCmd = ''; // 用来记录上一次的指令

  setInterval(async () => {
    try {
      const response = await axios.get(`http://${CLOUD_IP}:3000/get-instruction`);
      const cmd = response.data;
      // 在 socket.on('command', (data) => { ... }) 里面

      // 使用 Buffer 发送原始字节，绕过字符编码的问题


      // 只有当新指令和上次不一样时，才执行操作
      if (cmd !== lastCmd) {
        if (cmd === 'on') {
          console.log('>>> 指令更新: 开启灯光');
          port.write('a');
        } else if (cmd === 'off') {
          console.log('>>> 指令更新: 关闭灯光');
          port.write('b');
        }
        lastCmd = cmd; // 更新记录
      }
    } catch (error) {
      // 报错时清空记录，确保恢复后能重新发送
      lastCmd = '';
    }
  }, 2000); // 1秒一次就行

} catch (globalErr) {
  console.log("发生未知错误: " + globalErr.message);
}
// 当串口收到来自单片机的数据时触发
