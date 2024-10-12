// import { GoogleGenerativeAI } from "@google/generative-ai";
import http from "http"
import WebSocket from "ws";

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function createChatWSS(wss: WebSocket.Server<typeof WebSocket, typeof http.IncomingMessage>) {
    wss.on("connection", (ws) => {
        // const chat = model.startChat();
    
        ws.on("message", async (data) => {
            // const result = await chat.sendMessage(data.toString());
            ws.send("result.response.text()");
        });
    });
}

export default createChatWSS;