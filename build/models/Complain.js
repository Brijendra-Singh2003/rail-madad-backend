"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ComplaintSchema = new Schema({
    phone: {
        type: String,
        required: true,
    },
    discription: {
        type: String,
        required: true,
    },
    image_url: {
        type: String,
        required: true,
    },
    pnr: {
        type: String,
        required: true,
    },
});
// Export the model
const Complain = mongoose_1.default.model("Complain", ComplaintSchema);
exports.default = Complain;
