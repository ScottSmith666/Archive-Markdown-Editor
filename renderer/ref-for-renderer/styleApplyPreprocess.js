function processHTML(htmlStr) {
    let temp = document.createElement('div');
    temp.innerHTML = htmlStr;

    let out = temp.children[0];  // 刚刚从htmlStr转化完成的dom
    // console.log(out);

    /**
     * 处理解析后的HTML DOM，增加class
     */
    let CLASS_TABLE_FIGURE = "table-figure"
    let CLASS_LI_FINISHED_DEL = "md-task-list-item task-list-item task-list-done";

    // 开始处理HTML对象
    if (out) {
        // table外面加一层<figure>
        if (out.tagName.toLowerCase() === "table") {
            let figure = document.createElement('figure');
            figure.setAttribute("class", CLASS_TABLE_FIGURE);
            figure.appendChild(out);
            out = figure;
        } else if (out.tagName.toLowerCase() === "ol") {  // 判断input是否checked，如有则添加样式
            if (out.children[0]) {
                let lis = out.getElementsByTagName("li");
                // console.log(lis);
                for (let i = 0; i < lis.length; i++) {
                    if (lis[i].children.length !== 0) {
                        if (lis[i].children[0].tagName.toLowerCase() === "input"
                            && lis[i].children[0].hasAttribute("checked")) {
                            lis[i].setAttribute("class", CLASS_LI_FINISHED_DEL);
                        }
                    }
                }
            }
        }
        return out;
    } else return document.createElement("div");
}
