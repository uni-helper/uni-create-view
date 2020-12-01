"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const utils_1 = require("./utils");
function activate(context) {
    /** 声明创建页面命令 */
    const createPageExt = utils_1.getCommandExt({
        tipsViewNmae: '页面',
        extname: 'create-uniapp-view.createPage'
    });
    /** 声明创建分包页面目录 */
    const createSubcontractPage = utils_1.getCommandExt({
        tipsViewNmae: '页面',
        options: { subcontract: true },
        extname: 'create-uniapp-view.createSubcontractPage'
    });
    /** 声明创建组件命令 */
    const createComponentsExt = utils_1.getCommandExt({
        tipsViewNmae: '组件',
        options: { component: true },
        extname: 'create-uniapp-view.createComponent'
    });
    /** 进行添加命令 */
    context.subscriptions.push(createPageExt);
    context.subscriptions.push(createSubcontractPage);
    context.subscriptions.push(createComponentsExt);
}
exports.activate = activate;
// 停用您的扩展程序时调用此方法
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map