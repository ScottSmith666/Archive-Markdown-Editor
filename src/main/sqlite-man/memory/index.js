export class SqliteManMemory {
    constructor (connection, pageId) {
        this.connection = connection;
        this.pageId = pageId;
    }

    initEditorPage(content) {
        // 新建或打开文件时将原始内容写入表
        // 新建文件：原始内容为空字符串
        // 打开文件：原始内容为第一次打开这个文件的内容
    }

    addOperation(operationJsonStr) {
        // 每次内容发生更改后在表中新增一条operation
    }

    deleteLastOperation() {
        // 执行撤销指令时删除表中最后一条operation
        // 返回这条被删除的operation object
    }

    clearOperations() {
        // 保存文件时，清除operations表中所有内容，原始内容表更新为最新Monaco Editor中的内容
    }

    deletePage() {
        // 关闭标签页时，删除这个pageId对应的所有表格
    }
}
