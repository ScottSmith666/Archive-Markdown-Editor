import fs from "fs";

export const setOpenedFileHistory = (sqliteMan, fileName, filePath, openTime) => {
    // 成功打开文件后，将一条记录写入sqlite，一条记录包括：文件名、文件路径和打开时间str
    let uuid = crypto.randomUUID();
    sqliteMan.setHistory(uuid, fileName, filePath, openTime);
};

export const getNow = () => {
    const now = new Date();
    return now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false  // 使用24小时制
    }).replace(/\//g, '-');
};

export const stox = (XLSX, wb) => {
    let out = [];
    wb.SheetNames.forEach(function (name) {
        let o = { name: name, rows: {} };
        let ws = wb.Sheets[name];
        if(!ws || !ws["!ref"]) return;
        let range = XLSX.utils.decode_range(ws['!ref']);
        // sheet_to_json will lost empty row and col at begin as default
        range.s = { r: 0, c: 0 };
        let aoa = XLSX.utils.sheet_to_json(ws, {
            raw: false,
            header: 1,
            range: range
        });

        aoa.forEach(function (r, i) {
            let cells = {};
            r.forEach(function (c, j) {
                cells[j] = { text: c || String(c) };

                let cellRef = XLSX.utils.encode_cell({ r: i, c: j });

                if ( ws[cellRef] != null && ws[cellRef].f != null) {
                    cells[j].text = "=" + ws[cellRef].f;
                }
            });
            o.rows[i] = { cells: cells };
        });
        o.rows.len = aoa.length;

        o.merges = [];
        (ws["!merges"]||[]).forEach(function (merge, i) {
            //Needed to support merged cells with empty content
            if (o.rows[merge.s.r] == null) {
                o.rows[merge.s.r] = { cells: {} };
            }
            if (o.rows[merge.s.r].cells[merge.s.c] == null) {
                o.rows[merge.s.r].cells[merge.s.c] = {};
            }

            o.rows[merge.s.r].cells[merge.s.c].merge = [
                merge.e.r - merge.s.r,
                merge.e.c - merge.s.c
            ];

            o.merges[i] = XLSX.utils.encode_range(merge);
        });

        out.push(o);
    });

    return out;
}

export const copyOnHarmony = async (src, dest) => {
    // 开始流式写入
    return new Promise((resolve) => {
        // 使用 Node.js 的 Stream (文件流) 异步分块写入
        const readStream = fs.createReadStream(src);
        const writeStream = fs.createWriteStream(dest);

        readStream.on('error', (err) => {
            resolve({ success: false, message: `读取失败: ${err.message}` }); // 用 resolve 代替 return
        });

        writeStream.on('error', (err) => {
            resolve({ success: false, message: `写入失败: ${err.message}` });
        });

        writeStream.on('finish', () => {
            resolve({
                success: true,
                message: '写入成功',
            });
        });

        readStream.pipe(writeStream);
    });
};

export const fileNameIsContainsIllegalChar = (fileName) => {
    const fileForbiddenChars = [">", "<", ":", "'", "|", "*", "?", "(", ")"];
    for (let i = 0; i < fileForbiddenChars.length; i++) {
        if (fileName.includes(fileForbiddenChars[i])) {
            return true;
        }
    }
    return false;
};

export const getCurrentDateTime = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
