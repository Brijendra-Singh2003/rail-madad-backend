"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./configurations/db"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const complaint_1 = __importDefault(require("./routes/complaint"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8800;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
// CORS configuration
const corsOptions = {
    origin: FRONTEND_URL,
    credential: true,
};
// Middlewares
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api/auth", auth_1.default);
app.use("/api/user", user_1.default);
app.use("/api/complaints", complaint_1.default);
app.get("/hi", (req, res) => {
    console.log("hello");
    res.json("hi");
});
app.get("*", (req, res) => {
    res.sendStatus(404);
});
async function main() {
    await (0, db_1.default)(); // await database connection before listening to incoming requests
    app.listen(PORT, () => {
        console.log(`Your backend is running at http://localhost:${PORT}`);
    });
}
main();
