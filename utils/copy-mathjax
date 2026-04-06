#!/usr/bin/env node

import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const startDir = path.join(__dirname, "..", "src", "renderer", "libs", "MathJax");
const destDir = path.join(__dirname, "..", "out", "renderer", "libs", "MathJax");

fs.cp(startDir, destDir, {
    recursive: true,
}, (err) => {
    if (err) {
        console.error('目录拷贝出错:', err);
    } else {
        console.log(`将:${startDir}拷贝至 -> ${destDir}`);
        console.log("MathJax copy successfully! Enjoy!");
    }
});
