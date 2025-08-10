// 聊天室服务器
// 需安装ws模块: npm install ws
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// 存储在线用户
let users = new Set();

// 广播消息给所有连接的客户端
function broadcast(data) {
    const message = JSON.stringify(data);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// 更新并广播在线用户数量
function updateUserCount() {
    broadcast({
        type: 'userCount',
        count: users.size
    });
}

console.log('聊天室服务器启动，监听端口 8080');

// 处理新连接
wss.on('connection', (ws) => {
    console.log('新客户端连接');
    
    // 处理收到的消息
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            switch(data.type) {
                case 'join':
                    // 用户加入
                    if (data.username && !users.has(data.username)) {
                        users.add(data.username);
                        ws.username = data.username;
                        broadcast({
                            type: 'system',
                            content: `${data.username} 加入了聊天室`
                        });
                        updateUserCount();
                        console.log(`${data.username} 加入了聊天室`);
                    }
                    break;
                    
                case 'message':
                    // 转发用户消息
                    if (data.username && data.content && users.has(data.username)) {
                        broadcast({
                            type: 'message',
                            username: data.username,
                            content: data.content
                        });
                        console.log(`${data.username}: ${data.content}`);
                    }
                    break;
                    
                case 'leave':
                    // 用户离开
                    if (data.username && users.has(data.username)) {
                        users.delete(data.username);
                        broadcast({
                            type: 'system',
                            content: `${data.username} 离开了聊天室`
                        });
                        updateUserCount();
                        console.log(`${data.username} 离开了聊天室`);
                    }
                    break;
            }
        } catch (error) {
            console.error('消息解析错误:', error);
        }
    });
    
    // 处理连接关闭
    ws.on('close', () => {
        console.log('客户端断开连接');
        if (ws.username && users.has(ws.username)) {
            users.delete(ws.username);
            broadcast({
                type: 'system',
                content: `${ws.username} 离开了聊天室`
            });
            updateUserCount();
            console.log(`${ws.username} 离开了聊天室`);
        }
    });
    
    // 处理错误
    ws.on('error', (error) => {
        console.error('WebSocket错误:', error);
    });
});

