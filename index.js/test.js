const { SerialPort } = require('serialport');
// 注意把 COM3 换成你实际的端口号
const port = new SerialPort({ path: 'COM3', baudRate: 14400 });

port.on('open', () => {
  console.log('串口已打开，正在发送指令...');
  port.write('1'); // 发送任意字符触发翻转
  setTimeout(() => process.exit(), 500); // 发完 0.5 秒后自动退出
});