"use strict";
let data = `{
	"pages": [ //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
		{ //dioawdnwioandwioa
			"path": "pages/index/index",
			"style": {
				"navigationBarTitleText": "uni-app"
			}
		} //dwaoidnwaidniao
	],
	"globalStyle": {
		"navigationBarTextStyle": "black",
		"navigationBarTitleText": "uni-app",
		"navigationBarBackgroundColor": "#F8F8F8",
		"backgroundColor": "#F8F8F8"
	}
}
`;
data = data.replace(/\/\/.*?\n|/sg, "\n");
data = data.replace(/\/\*.*?\*\//sg, "");
console.log(data);
//# sourceMappingURL=tempCodeRunnerFile.js.map