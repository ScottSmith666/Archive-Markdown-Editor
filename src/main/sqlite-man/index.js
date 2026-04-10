export class SqliteMan {
    #connection;  // 私有属性
    constructor(connection) {
        this.#connection = connection;
    }

    // 私有方法
    #settingsTable(needType = true) {
        return {
            'AME_SETTINGS': [
                // colName colType
                `instruction${needType ? ' TEXT' : ""}`,
                `value${needType ? ' INT' : ""}`,
            ]
        };
    };

    #historiesTable(needType = true) {
        return {
            'AME_OPEN_HISTORIES': [
                `hsId${needType ? ' TEXT' : ""}`,
                `fileName${needType ? ' TEXT' : ""}`,
                `filePath${needType ? ' TEXT' : ""}`,
                `openTime${needType ? ' INT' : ""}`,
            ],
        };
    };

    // 公有方法
    init() {
        // 检查设置相关和历史记录相关的表存不存在，如不存在就新建
        let hsTable = Object.keys(this.#historiesTable())[0];
        let cols = `(${this.#historiesTable()[hsTable].join(", ")})`;
        this.#connection.prepare(`CREATE TABLE IF NOT EXISTS ${hsTable} ${cols};`).run();
    }

    getAllHistories() {
        // 获得所有的历史记录
        let hsTable = Object.keys(this.#historiesTable())[0];
        return this.#connection.prepare(`SELECT *
                                         FROM ${hsTable};`).all();
    }

    setHistory(hsId, fileName, filePath, openTime) {
        // 写入一条历史记录
        let hsTableObject = this.#historiesTable(false);
        let hsTable = Object.keys(hsTableObject)[0];
        let cols = `(${hsTableObject[hsTable].join(", ")})`;
        let values = `('${hsId}', '${fileName}', '${filePath}', '${openTime}')`;

        // 检查表中是否存在同路径文件，若存在，则只修改打开时间和hsId
        const stmt = this.#connection.prepare(`SELECT filePath FROM ${hsTable} WHERE filePath = '${filePath}' LIMIT 1;`);
        const exists = !!stmt.get(); // 如果 get 返回对象则为 true，返回 undefined 则为 false
        if (exists) {
            this.#connection.prepare(`UPDATE ${hsTable} SET hsId = '${hsId}', openTime = '${openTime}' `
                + `WHERE filePath = '${filePath}';`).run();
        } else {
            this.#connection.prepare(`INSERT INTO ${hsTable} ${cols} VALUES ${values};`).run();
        }
    }

    deleteHistory(hsId) {
        // 删除某条指定的历史记录
        let hsTableObject = this.#historiesTable(false);
        let hsTable = Object.keys(hsTableObject)[0];
        let col = hsTableObject[hsTable][0];
        this.#connection.prepare(`DELETE FROM ${hsTable} WHERE ${col} = '${hsId}';`).run();
    }

    deleteAllHistories() {
        // 清除所有的历史记录
        let hsTableObject = this.#historiesTable(false);
        let hsTable = Object.keys(hsTableObject)[0];
        this.#connection.prepare(`DELETE FROM ${hsTable};`).run();
    }
}
