🚀 WorldMonitor: Cross-Stack IoT Control System
本项目是一个打通了 “云端-中继-终端” 的全栈物联网控制原型。它展示了在硬件资源受限且存在缺陷的情况下，如何构建一套稳定可靠的控制链。
🏗️ 整体系统架构 (System Architecture)
该系统由以下三个核心模块组成：
 * Cloud Server (Vultr):
   * Env: Node.js, Linux (Ubuntu)
   * Role: 托管控制后台与 Web 界面，提供远程控制接口。
 * Local Bridge (PC/Trae):
   * Env: Node.js (serialport library)
   * Role: 作为“云端”与“硬件”的桥梁，负责 Socket/HTTP 数据与 UART 串口数据的双向转换。
 * Hardware Terminal (STM32):
   * Env: Standard Library, Keil uVision5
   * Role: 执行具体硬件动作（如 LED 控制），并反馈实时状态。
🛠️ 环境配置与部署 (Setup & Deployment)
1. 云端后台 (Server)
 * 部署工具: Putty (SSH)
 * 关键配置:
   * [vultr开放22端口，5173端口3000端口]
     22端口为通过SSH控制服务器端口
     5173端口为Vite默认端口，负责展示vue页面
     3000端口为网页开放端口,是Node.js指挥部
   * [vultr中安装express库用来接收HTTP请求]
   * [vulter中安装COR来处理跨域请求]
2. 本地中继 (Bridge)
 * 运行环境: Trae 终端 / Node.js
 * 关键配置:
   * [bridge.js 如何识别串口号及占用问题]
     务必在设备管理器中查看COM号，负责在串口传输过程可能引起错误。
     务必保证该COM没有被第三方软件占用
   * [Node.js 安装路径（C盘 vs D盘）对环境的影响]
     经测试Node.js最优安装路径为C盘，否则会有小概率解码错误
  *  [trae运行npm install serialport axios(串口库）]
3. 硬件固件 (Firmware)
 * 核心逻辑:
   * [GPIO 复用功能 (PA9/PA10) 的初始化代码]
     初始化串口和PA9/PA10/PA0/PA3引脚，PA9为接收引脚，PA10为发送引脚，PA0为LED引脚,PA3引脚为后续测试所用引脚
   * [UART 串口波特率配置的注意事项]
   * 
⚠️ 核心问题与解决方案 (Troubleshooting)
本项目在开发中经历了多次关键调试，以下是避坑重点：
📌 问题 A：putty配置好index.html后网页打不开(WEB page issue)
 * 现象: [待填写：网页打开显示服务器连接失败]
 * 1.排查方法: 检查server.js和index.html文件和端口开放。
 *   解决方案: [手动打开3000端口并释放vulter对3000端口的防火墙]
 * 2.排查方法：检查node.js版本，v24.14.0等新版本默认强制使用ES Module标准，不支持老格式require写法。
 *   解决方案: 修改server.js文件写法，使用现代版写法。
 *   解决方案: 修改package.json明确使用现代模板
📌 问题 B:ES Module模式下不可使用——dirname，否则引起错误
 *    解决方案：1.使用const _filename 格式修正
               2.直接返回简单网站，不需要额外配置路径
📌 问题 C：本项目开始的逻辑是借用bridge访问后端货架是否为0，但这种逻辑需要频繁访问网站，极易导致网站崩溃
 * 现象: 短时间多次访问，系统环境意外崩溃
 * 修复过程: [待填写：关于目录命名拼写纠正及注册表修复的心得]
📌 问题 D:stm32,stlink和USB转串口模块公地问题
 * 现象：如果不共地，信息传输过程会乱码
📌 问题 D：波特率不匹配问题！！！
 * 现象：网页1不能正常控制LED
 * 解决方案：我的Xtal是12MHz，stm32跑快，BRIDGE.JS同比例加快
 * 解决方案：在stm32里写入返回函数，发现写入“1”stm32收到的是乱码
📂 项目目录结构
├── cloud_server/        # 运行在 Vultr 上的 server.js 和 index.html
├── local_bridge/        # 运行在本地的 bridge.js
├── stm32_firmware/      # STM32 工程源码
└── docs/                # 调试日志与原理图

🌟 总结与收获
[此处留给你写下这次“跨专业调试”的心路历程，比如对硬件底层和材料质量的思考]
