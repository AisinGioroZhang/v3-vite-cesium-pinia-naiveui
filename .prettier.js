// 配置 prettier 格式化规则
module.exports = {
    tabWidth: 2,
    jsxSingleQuote: true,
    jsxBracketSameLine: true,
    printWidth: 100,
    singleQuote: true,
    semi: false,
    overrides: [
        {
            files: "*.json",
            options: {
                printWidth: 200,
            },
        },
    ],
    arrowParens: "always",
};
