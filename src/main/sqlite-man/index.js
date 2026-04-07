export class SqliteMan {
    constructor (connection, pageId) {
        this.connection = connection;
        this.pageId = pageId;
    }

    clearOperations() {
        // 保存文件时，清除operations表中所有内容，原始内容表更新为最新Monaco Editor中的内容
    }

    deletePage() {
        // 关闭标签页时，删除这个pageId对应的所有表格
    }
}
