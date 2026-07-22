export class SqliteMan {
    // 私有属性
    #Sqlite3;
    #dbPath;
    #windowW;
    #windowH;
    #windowX;
    #windowY;
    constructor(Sqlite3, dbPath) {
        this.#Sqlite3 = Sqlite3;
        this.#dbPath = dbPath;

        // 定义初始化打开时的窗口宽高和坐标
        this.#windowW = 1600;
        this.#windowH = 1000;
        this.#windowX = 0;
        this.#windowY = 0;
    }

    // 私有方法
    #historiesTable(needType = true) {
        return {
            'AME_OPEN_HISTORIES': [  // 打开文件历史记录相关的表
                `hsId${needType ? ' TEXT' : ""}`,
                `fileName${needType ? ' TEXT' : ""}`,
                `filePath${needType ? ' TEXT' : ""}`,
                `openTime${needType ? ' INT' : ""}`,
            ],
            'AME_WINDOW_HW_POS': [  // 窗口属性相关的表
                `w${needType ? ' INTEGER' : ""}`,
                `h${needType ? ' INTEGER' : ""}`,
                `x${needType ? ' INTEGER' : ""}`,
                `y${needType ? ' INTEGER' : ""}`,
            ],
        };
    }

    // 公有方法
    init() {
        // 检查设置相关和历史记录相关的表存不存在，如不存在就新建
        let hsTable = Object.keys(this.#historiesTable())[0];
        let cols = `(${this.#historiesTable()[hsTable].join(", ")})`;
        let connection = new this.#Sqlite3(this.#dbPath);
        connection.prepare(`CREATE TABLE IF NOT EXISTS ${hsTable} ${cols};`).run();

        // 检查窗口属性相关的表存不存在，如不存在就新建并插入默认值
        let wdTable = Object.keys(this.#historiesTable())[1];
        let wdCols = `(${this.#historiesTable()[wdTable].join(", ")})`;
        let wdColsWithoutType = `(${this.#historiesTable(false)[wdTable].join(", ")})`;
        connection.prepare(`CREATE TABLE IF NOT EXISTS ${wdTable} ${wdCols};`).run();

        // 当窗口属性表内存在数据，则不插入
        connection.prepare(
            `INSERT INTO ${wdTable} ${wdColsWithoutType} SELECT ${this.#windowW}, ${this.#windowH}, ${this.#windowX}, ${this.#windowY} WHERE NOT EXISTS (SELECT 1 FROM ${wdTable});`
        ).run();
        connection.close();
    }

    getAllHistories() {
        // 获得所有的历史记录
        let hsTable = Object.keys(this.#historiesTable())[0];
        let connection = new this.#Sqlite3(this.#dbPath);
        let res = connection.prepare(`SELECT *
                                         FROM ${hsTable};`).all();
        connection.close();
        return res;
    }

    setHistory(hsId, fileName, filePath, openTime) {
        // 写入一条历史记录
        let hsTableObject = this.#historiesTable(false);
        let hsTable = Object.keys(hsTableObject)[0];
        let cols = `(${hsTableObject[hsTable].join(", ")})`;
        let values = `('${hsId}', '${fileName}', '${filePath}', '${openTime}')`;

        // 检查表中是否存在同路径文件，若存在，则只修改打开时间和hsId
        let connection = new this.#Sqlite3(this.#dbPath);
        const stmt = connection.prepare(`SELECT filePath FROM ${hsTable} WHERE filePath = '${filePath}' LIMIT 1;`);
        const exists = !!stmt.get(); // 如果 get 返回对象则为 true，返回 undefined 则为 false
        if (exists) {
            connection.prepare(`UPDATE ${hsTable} SET hsId = '${hsId}', openTime = '${openTime}' `
                + `WHERE filePath = '${filePath}';`).run();
        } else {
            connection.prepare(`INSERT INTO ${hsTable} ${cols} VALUES ${values};`).run();
        }
        connection.close();
    }

    deleteHistory(hsId) {
        // 删除某条指定的历史记录
        let hsTableObject = this.#historiesTable(false);
        let hsTable = Object.keys(hsTableObject)[0];
        let col = hsTableObject[hsTable][0];
        let connection = new this.#Sqlite3(this.#dbPath);
        connection.prepare(`DELETE FROM ${hsTable} WHERE ${col} = '${hsId}';`).run();
        connection.close();
    }

    deleteAllHistories() {
        // 清除所有的历史记录
        let hsTableObject = this.#historiesTable(false);
        let hsTable = Object.keys(hsTableObject)[0];
        let connection = new this.#Sqlite3(this.#dbPath);
        connection.prepare(`DELETE FROM ${hsTable};`).run();
        connection.close();
    }

    getLastExitWhAndPos() {
        // 读取窗口属性
        let connection = new this.#Sqlite3(this.#dbPath);
        let wdTable = Object.keys(this.#historiesTable())[1];
        let res = connection.prepare(`SELECT *
                                         FROM ${wdTable};`).all();
        connection.close();
        return res;
    }

    setLastExitWhAndPos(whXyArray) {
        // 在退出应用前写入窗口的宽高和坐标
        let connection = new this.#Sqlite3(this.#dbPath);
        let wdTable = Object.keys(this.#historiesTable())[1];
        let wdColsWithoutType = this.#historiesTable(false)[wdTable];
        let assign = "";
        for (let i = 0; i < whXyArray.length; i++) {
            assign = assign + `${wdColsWithoutType[i]} = ${whXyArray[i]},`;
        }
        connection.prepare(`UPDATE ${wdTable} SET ${assign.substring(0, assign.length - 1)};`).run();
        connection.close();
    }
}
