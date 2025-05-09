// 渲染语言
async function loadLanguage() {
    let presentLangPackage = await window.aboutDialogLang.getAboutDialogLangContent();

    let descID = document.getElementById("desc");
    let contactID = document.getElementById("contact");
    let githubID = document.getElementById("github");
    let closeID = document.getElementById("close");

    // Edit&Render placeholder language
    let presentLangIndex = presentLangPackage[1];
    let presentLangAboutDialog = presentLangPackage[0][presentLangIndex];
    descID.innerHTML = presentLangAboutDialog.description + `
            <small>
                <span class="cre">
                    <span>${ presentLangAboutDialog.credit }</span><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" x="0px" y="0px"
                                 viewBox="0 0 100 100"
                                 width="15" height="15" class="icon outbound">
                        <path fill="currentColor"
                              d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path>
                        <polygon fill="currentColor"
                                 points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon>
                    </svg>
                </span>
            </small>`;
    contactID.innerText = presentLangAboutDialog.contact + " - scottsmith666@163.com";
    githubID.innerText = "GitHub" + presentLangAboutDialog.github;
    closeID.innerText = presentLangAboutDialog.button;
}

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
    window.openOutLink.openLink("https://github.com/scottsmith666");
});
