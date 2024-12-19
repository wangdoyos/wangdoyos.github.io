// 动态初始化mac风格代码高亮
function initMacStyle() {
    const observer = new MutationObserver(() => {
        const codeBlocks = document?.getElementsByTagName('code');
        if (codeBlocks !== undefined && codeBlocks.length > 0) {
            // 停止观察
            observer.disconnect();

            Array.from(codeBlocks).forEach(item => {
                // 检查是否已经添加了 pre-mac
                if (!item.parentElement.querySelector('.pre-mac')) {
                    item.style.whiteSpace = 'pre-wrap';

                    // 插入 pre-mac 元素
                    const preMac = document.createElement('div');
                    preMac.classList.add('pre-mac');
                    preMac.innerHTML = '<span></span><span></span><span></span>';
                    item.parentElement.insertBefore(preMac, item);
                }
            });
        }
    });

    // 开始观察整个文档
    observer.observe(document.body, { childList: true, subtree: true });
}

// 动态初始化复制代码按钮
function initCopyButton() {
    const observer = new MutationObserver(() => {
        const buttons = document?.getElementsByClassName('copy-to-clipboard-button');
        if (buttons !== undefined && buttons.length > 0) {
            // 停止观察
            observer.disconnect();

            Array.from(buttons).forEach(item => {
                // 检查是否已经添加了 copy-icon
                if (!item.parentElement.querySelector('.copy-icon')) {
                    // 插入 copy-icon 元素
                    const copyIcon = document.createElement('img');
                    copyIcon.classList.add('copy-icon');
                    copyIcon.setAttribute('src', '/_media/copy.svg');
                    item.insertBefore(copyIcon, item.firstChild);
                }
            });
        }
    });

    // 开始观察整个文档
    observer.observe(document.body, { childList: true, subtree: true });
}

