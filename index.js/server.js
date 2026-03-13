import express from 'express';
import cors from 'cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// 极其稳健的路径获取方式
const __dirname = dirname(fileURLToPath(import.meta.url));

// 记事本：存最新的指令
let lastInstruction = "none";

app.use(cors());

// 1. 访问首页，发送 HTML
app.get('/', (req, res) => {
    // 确保你的 index.html 就在 server.js 旁边
    res.sendFile(join(__dirname, 'index.html'));
});

// 2. 接收网页发来的控制信号 (on/off)
app.get('/led/:action', (req, res) => {
    lastInstruction = req.params.action;
    console.log(`[云端] 收到并存入指令: ${lastInstruction}`);
    res.send(`服务器已记录指令: ${lastInstruction}`);
});

// 3. 供本地 bridge.js 取货的接口
app.get('/get-instruction', (req, res) => {
    res.send(lastInstruction);
    lastInstruction = "none"; // 取完重置
});

app.listen(port, '0.0.0.0', () => {
    console.log(`\n🚀 云端大脑启动成功！`);
    console.log(`🔗 控制面板: http://00.00.00.00:${port}`);
    console.log(`📂 当前目录: ${__dirname}\n`);
});
