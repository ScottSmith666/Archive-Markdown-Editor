#!/usr/bin/env node

// 根据package.json内的版本，同步至document/about(-en && -zh-TW).md

import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function repl(originContent, regex, replacement) {
    return originContent.replace(regex, replacement);
}

function getAppVersion() {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    // 读取并解析package.json文件
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    // 获取包名
    return packageJson.version;
}

const zhCNFilePath = path.join(__dirname, "..", "document", "about.md");
const zhTWFilePath = path.join(__dirname, "..", "document", "about-zh-TW.md");
const enFilePath = path.join(__dirname, "..", "document", "about-en.md");

const zhCNFilePathOpenHarmony = path.join(__dirname, "..", "document", "about-openharmony.md");
const zhTWFilePathOpenHarmony = path.join(__dirname, "..", "document", "about-zh-TW-openharmony.md");
const enFilePathOpenHarmony = path.join(__dirname, "..", "document", "about-en-openharmony.md");

const versionZhRegex = /\*\*版本 `\d+\.\d+\.\d+`\*\*/;
const versionEnRegex = /\*\*Version `\d+\.\d+\.\d+`\*\*/;

// zh
let zhCNContent = fs.readFileSync(zhCNFilePath, 'utf8');
let zhCNContentOpenHarmony = fs.readFileSync(zhCNFilePathOpenHarmony, 'utf8');
fs.writeFileSync(zhCNFilePath, repl(zhCNContent, versionZhRegex, '**版本 `' + getAppVersion() + '`**'));
fs.writeFileSync(zhCNFilePathOpenHarmony, repl(zhCNContentOpenHarmony, versionZhRegex, '**版本 `' + getAppVersion() + '`**'));

let zhTWContent = fs.readFileSync(zhTWFilePath, 'utf8');
let zhTWContentOpenHarmony = fs.readFileSync(zhTWFilePathOpenHarmony, 'utf8');
fs.writeFileSync(zhTWFilePath, repl(zhTWContent, versionZhRegex, '**版本 `' + getAppVersion() + '`**'));
fs.writeFileSync(zhTWFilePathOpenHarmony, repl(zhTWContentOpenHarmony, versionZhRegex, '**版本 `' + getAppVersion() + '`**'));

// en
let enContent = fs.readFileSync(enFilePath, 'utf8');
let enContentOpenHarmony = fs.readFileSync(enFilePathOpenHarmony, 'utf8');
fs.writeFileSync(enFilePath, repl(enContent, versionEnRegex, '**Version `' + getAppVersion() + '`**'));
fs.writeFileSync(enFilePathOpenHarmony, repl(enContentOpenHarmony, versionEnRegex, '**Version `' + getAppVersion() + '`**'));

console.log("版本号同步完成...");
