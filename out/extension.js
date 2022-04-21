"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const command_1 = require("./command");
function activate(context) {
    const subscriptions = [
        command_1.createCommand({
            name: '页面',
            command: 'create-uniapp-view.createPage'
        }),
        command_1.createCommand({
            name: '页面',
            options: { subcontract: true },
            command: 'create-uniapp-view.createSubcontractPage'
        }),
        command_1.createCommand({
            name: '组件',
            options: { component: true },
            command: 'create-uniapp-view.createComponent'
        })
    ];
    context.subscriptions.push(...subscriptions);
}
exports.activate = activate;
// 停用您的扩展程序时调用此方法
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map