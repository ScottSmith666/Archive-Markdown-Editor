let generalItem = document.getElementById('general');
let editItem = document.getElementById('edit');
let updateItem = document.getElementById('update');

function settingsItemClickEvent(indexOfItems, ...itemsDom) {
    let shouldApplyItem = itemsDom[indexOfItems];  // 定义点击就应用style的Item
    shouldApplyItem.addEventListener('click', () => {  // 通用
        itemsDom.forEach((item) => {
            let applyClass = (item === shouldApplyItem) ? "options-items side-item-focused-for-js" : "options-items";
            let showApplyClass = (item === shouldApplyItem) ? "" : " hide-content";
            let itemDomId = item.getAttribute('id');
            item.removeAttribute("class");
            item.setAttribute("class", applyClass);
            // 设置各项对应页面内容显示
            let pageDom = document.getElementById(`settings-item-${ itemDomId }-content`);
            pageDom.removeAttribute("class");
            pageDom.setAttribute("class", `settings-item-content${ showApplyClass }`);
        });
    });
}

const closeButton = document.getElementById('close');
closeButton.addEventListener('click', () => {
    window.close();
});

// 设置菜单栏点击事件
settingsItemClickEvent(0, generalItem, editItem, updateItem);
settingsItemClickEvent(1, generalItem, editItem, updateItem);
settingsItemClickEvent(2, generalItem, editItem, updateItem);
