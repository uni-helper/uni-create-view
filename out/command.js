"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommand = void 0;
const vscode = require("vscode");
const generate_1 = require("./generate");
const utils_1 = require("./utils");
exports.createCommand = (options) => {
    return vscode.commands.registerCommand(options.command, (uri) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const input = yield vscode.window.showInputBox({ prompt: `输入${options.name}名称` });
        if (!input) {
            utils_1.logger("error", `${options.name}名称不能为空!`);
            throw new Error(`${options.name}名称不能为空!`);
        }
        const { message, status } = yield generate_1.generate({
            names: { view: input.split(' ')[0], page: input.split(' ')[1] || '' },
            nameType: utils_1.getConfiguration('create-uniapp-view.name'),
            path: uri.fsPath,
            component: (_a = options.options) === null || _a === void 0 ? void 0 : _a.component,
            subcontract: (_b = options.options) === null || _b === void 0 ? void 0 : _b.subcontract,
            typescript: utils_1.getConfiguration('create-uniapp-view.typescript'),
            styleType: utils_1.getConfiguration('create-uniapp-view.style'),
            directory: utils_1.getConfiguration('create-uniapp-view.directory'),
            vue3: utils_1.getConfiguration('create-uniapp-view.template') === 'vue3',
            setup: utils_1.getConfiguration('create-uniapp-view.setup'),
            scoped: utils_1.getConfiguration('create-uniapp-view.scoped'),
        });
        utils_1.logger(status, message);
    }));
};
//# sourceMappingURL=command.js.map