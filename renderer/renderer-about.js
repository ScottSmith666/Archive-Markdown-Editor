"use strict";

loadLanguage();

const closeButton = document.getElementById('close');
closeButton.addEventListener('click', () => {
    window.close();
});

const selfIntro = document.getElementById('self');
selfIntro.innerText = "2025 - " + new Date().getFullYear() + " Designed & Developed by Scott Smith";

// 获取打开外部链接的元素
let openContact = document.getElementById('contact-card');
let openGitHub = document.getElementById('github-card');
openContact.addEventListener('click', () => {
    window.openOutLink.openLink("https://mail.163.com");
});
openGitHub.addEventListener('click', () => {
    window.openOutLink.openLink("https://github.com/ScottSmith666/Archive-Markdown-Editor");
});

// version
// document.getElementById("about-version").innerText = "版本 " +
