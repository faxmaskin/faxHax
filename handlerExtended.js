/*
handLerExtended - Ut�kad �rendehantering i Open ePlatform
https://github.com/faxmaskin/faxHax
*/
//#region Licens
/*
MIT License

Copyright (c) 2025 Joakim Curt Olsson (faxmaskin@duck.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
//#endregion
//#region 0. KONSTANTER - dessa ska vanligtvis inte �ndras, utan �r samma i alla installationer
const version = "2.0.1";
const lastEditDate = "2025-02-11";
const author = "faxmaskin@duck.com"

// En samling konstanter med adress, som �r k�nda eller h�mtas fr�n url
const url = window.location.href;
const flowInstanceId = url.substring(url.lastIndexOf('/') + 1);
const statusUrl = `/manage/flowinstanceadmin/status/${flowInstanceId}`;
const managersUrl = `/manage/flowinstanceadmin/getmentionusers/${flowInstanceId}`;
const updateManagersURL = `/manage/flowinstanceadmin/managers/${flowInstanceId}`;
//#endregion
//#region 1.0 FUNKTIONER F�R H�MTNING AV INNEH�LL OCH SKAPANDE AV ELEMENT
// Funktion f�r att h�mta och infoga elementen
async function fetchAndInsertElements() {
    try {
        //#region 1.1 H�MTNING OCH LISTNING 

        // H�mta och lista tilldelade handl�ggare
        const responseAssignedManagers = await fetch(updateManagersURL);
        const assignedManagersText = await responseAssignedManagers.text();
        const tempDivManagers = document.createElement('div');
        tempDivManagers.innerHTML = assignedManagersText;
        const allfromMan = Array.from(tempDivManagers.querySelectorAll('#userID-list li input'));
        const filfromMan = allfromMan.slice(0, -3); // De tre sista v�rdena i denna lista �r inte kopplade till handl�ggare, s� de plockas bort
        const assignedManagers = [];
        for (let i = 0; i < filfromMan.length; i += 2) { // Varje handl�ggare har tv� v�rden i tv� objekt, d�rf�r beh�ver vi h�mta ett fr�n j�mna rader, och ett fr�n oj�mna
            const idInput = filfromMan[i];
            const nameInput = filfromMan[i + 1];
            assignedManagers.push({
                userId: idInput.value,
                userName: nameInput.value
            });
        }

        // H�mta och lista m�jliga handl�ggare (fr�n getmentionusers) och filtrera bort redan tilldelade handl�ggare
        const responseManagers = await fetch(managersUrl);
        const buffer = await responseManagers.arrayBuffer();
        const decoder = new TextDecoder('iso-8859-1');
        const text = decoder.decode(buffer);
        const possibleManagersTemp = JSON.parse(text);

        const possibleManagers = [];
        possibleManagersTemp.forEach(pos => {
            if (!assignedManagers.some(assigned => assigned.userId === pos.ID)) {
                possibleManagers.push({
                    userId: pos.ID,
                    userName: `${pos.Name} (${pos.Username})`
                });
            }
        });

        // H�mta och lista statusar
        const responseStatus = await fetch(statusUrl);
        const statusHTML = await responseStatus.text();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = statusHTML;
        const theForm = tempDiv.querySelector('form');
        const formSec = theForm.querySelectorAll('.section-full');
        formSec[0].style.display = 'none';
        formSec[3].id = "formBtns";
        formSec[3].style.display = 'none';
        const statuses = tempDiv.querySelectorAll('.bigmarginleft'); // Alla statusar har denna class, d�rf�r kan det anv�ndas som selector
        //#endregion 
        //#region 1.2 SKAPA STRUKTUREN 

        // NIV� 1 
        const startDiv = document.querySelector('.description');
        const spcWrapper = Object.assign(document.createElement('div'), { className: "spc-handlerExtendedByJooL", id: version });
        const divider = Object.assign(document.createElement('div'), { className: "divider" });
        spcWrapper.append(divider);

        // NIV� 2 - VISA/D�LJ �NDRA HANDL�GGARE
        const manChgDiv = Object.assign(document.createElement('div'), { id: "man-handler-div" });
        const manChgBtnShow = (Object.assign(document.createElement('a'), { id: "manShowBtn", href: "#", textContent: "�ndra handl�ggare" }));
        manChgBtnShow.classList.add('btn', 'btn-green', 'btn-inline');
        manChgBtnShow.style.display = '';
        const manChgBtnHide = (Object.assign(document.createElement('a'), { id: "manHideBtn", href: "#", textContent: "D�lj �ndra handl�ggare" }));
        manChgBtnHide.classList.add('btn', 'btn-red', 'btn-inline');
        manChgBtnHide.style.display = 'none';
        manChgDiv.appendChild(manChgBtnShow);
        manChgDiv.appendChild(manChgBtnHide);
        manChgDiv.appendChild(document.createElement('p'));
        spcWrapper.append(manChgDiv);

        // NIV� 3 - HANTERING AV HANDL�GGARE
        const manHandler = Object.assign(document.createElement('fieldset'), { id: "spc-flowinstance-manager-handler", style: "font-size: 14px;" });
        const manHandlerLeg = Object.assign(document.createElement('legend'), {
            textContent: "�ndra handl�ggare",
            style: "font-weight:600; line-height:2em; font-size:18px; padding: 0 4px 0 4px; color: #393939;"
        });
        manHandler.style.display = 'none';
        const manHandlerIn = Object.assign(document.createElement('div'), { id: "spc-flowinstance-manager-handler-inner" });
        manHandlerIn.classList.add('full', 'bigmarginbottom', 'user-group-list-container');
        const ulMan = Object.assign(document.createElement('ul'), { id: "spc-man-userID-list" });
        ulMan.classList.add('list-style-type-none', 'margintop', 'usergroup-list');
        assignedManagers.forEach(man => {
            ulMan.appendChild(createManListItem(man, "Ta bort handl�ggare", "Ta bort handl�ggare", "spcRemoveBtn", 'btn-red'));
        });
        possibleManagers.forEach(man => {
            ulMan.appendChild(createManListItem(man, "L�gg till handl�ggare", "L�gg till handl�ggare", "spcAddBtn", 'btn-green'));
        });
        manHandler.appendChild(manHandlerLeg);
        manHandlerIn.appendChild(ulMan);
        manHandler.appendChild(manHandlerIn);
        spcWrapper.append(manHandler);

        // NIV� 4 - VISA/D�LJ �NDRA STATUS
        const staChgDiv = Object.assign(document.createElement('div'), { id: "sta-handler-div" });
        const staChgBtnShow = (Object.assign(document.createElement('a'), { id: "staShowBtn", href: "#", textContent: "�ndra �rendestatus" }));
        staChgBtnShow.classList.add('btn', 'btn-green', 'btn-inline');
        staChgBtnShow.style.display = 'none';
        const staChgBtnHide = (Object.assign(document.createElement('a'), { id: "staHideBtn", href: "#", textContent: "D�lj �ndra �rendestatus" }));
        staChgBtnHide.classList.add('btn', 'btn-red', 'btn-inline');
        staChgBtnHide.style.display = '';
        staChgDiv.appendChild(document.createElement('h1'));
        staChgDiv.appendChild(staChgBtnShow);
        staChgDiv.appendChild(staChgBtnHide);
        staChgDiv.appendChild(document.createElement('p'));
        spcWrapper.append(staChgDiv);

        // NIV� 5 - HANTERING AV STATUS
        const staHandler = Object.assign(document.createElement('fieldset'), { id: "spc-flowinstance-status-handler", style: "font-size: 14px;" });
        staHandler.style.display = 'block';
        const staHandlerLeg = Object.assign(document.createElement('legend'), {
            textContent: "�ndra �rendestatus",
            style: "font-weight:600; line-height:2em; font-size:18px; padding: 0 4px 0 4px; color: #393939;"
        });
        const staFormDiv = Object.assign(document.createElement('div'), { className: "spc-formDiv" });

        statuses.forEach(status => {
            const staInput = status.querySelector('input[type="radio"]');
            const staDis = staInput ? staInput.disabled : null;
            const staID = staInput ? staInput.value : null;
            const staSel = staInput.checked ? true : false;
            const staIntMsg = staInput ? staInput.getAttribute('data-add-internal-message') : null;
            const staExtMsg = staInput ? staInput.getAttribute('data-add-external-message') : null;
            const staIntMsgDef = staInput ? staInput.getAttribute('data-default-internal-message-template-id') : null;
            const staExtMsgDef = staInput ? staInput.getAttribute('data-default-internal-message-template-id') : null;
            const staLabel = status.querySelector('label.radio');
            const staName = staLabel ? staLabel.textContent : null;
            const descDiv = status.querySelector('.internal-description');
            const staDesc = descDiv ? descDiv.textContent : null;

            // Skapa knapp f�r statusbyte
            const staBtn = (Object.assign(document.createElement('a'), { id: staID, href: "#", textContent: staName }));
            if (staDesc) {
                staBtn.title = staDesc;
            }
            if (staSel) {
                staBtn.classList.add('btn', 'btn-green', 'btn-inline', 'spc-sta-btn');
            } else {
                if (staDis) {
                    staBtn.classList.add('btn', 'btn-light', 'btn-inline', 'spc-sta-btn', 'disabled');
                } else {
                    staBtn.classList.add('btn', 'btn-light', 'btn-inline', 'spc-sta-btn');
                }
            }
            if (staIntMsg || staExtMsg) {
                if (staIntMsg) {
                    staBtn.classList.add('spc-sta-btn-msg-int')
                    staBtn.setAttribute('data-default-internal-message-template-id', staIntMsgDef)
                }

                if (staExtMsg) {
                    staBtn.classList.add('spc-sta-btn-msg-ext')
                    staBtn.setAttribute('data-default-external-message-template-id', staExtMsgDef)
                }
            }
            staFormDiv.appendChild(staBtn);
        });

        // Skapa div f�r statusbeskrivning
        const staDescDiv = Object.assign(document.createElement('div'), { id: "spcStatusDesc" });
        staDescDiv.style.fontWeight = 100;
        const staTextP = Object.assign(document.createElement('p'), {
            className: "spc-statusText",
            innerHTML: 'Aktuell status �r <span class="spc-highlight-green">gr�nmarkerad</span><br>Klicka p� den status du vill byta till f�r att �ndra �rendets status.',
            style: "font-size: 14px;"
        });

        // Knyt ihop statusar
        staHandler.appendChild(staHandlerLeg);
        staHandler.appendChild(staFormDiv);
        spcWrapper.append(staHandler);
        spcWrapper.append(document.createElement('h1'));
        spcWrapper.append(staDescDiv);
        spcWrapper.append(divider);
        spcWrapper.append(staTextP);
        spcWrapper.append(theForm);

        // Knyt ihop s�cken
        startDiv.insertAdjacentElement("afterend", spcWrapper);

        //#endregion 
        //#region 1.3 FUNKTIONER OCH EVENTHANDLERS 
        //#region 1.3.0. Funktion f�r att s�tta r�tt teckenkodning vid behov
        function decodeISO88591(encodedString) {
            const isoDecoder = new TextDecoder("iso-8859-1");
            const bytes = new Uint8Array(encodedString.split('').map(c => c.charCodeAt(0)));
            return isoDecoder.decode(bytes);
        }
        //#endregion 
        //#region 1.3.1. L�gg till funktion f�r att d�lja och visa knappar och div f�r hantering av handl�ggare
        // P�verkar NIV� 2 och NIV� 3
        function toggleButtonMan(event) {
            event.preventDefault();
            const showHideClicked = event.target;
            const showHideNotClickedId = showHideClicked.id === 'manShowBtn' ? 'manHideBtn' : 'manShowBtn';
            const showHideNotClicked = document.getElementById(showHideNotClickedId);
            showHideClicked.style.display = 'none';
            showHideNotClicked.style.display = '';

            const manHandlerShow = document.getElementById("spc-flowinstance-manager-handler");
            if (showHideNotClickedId === 'manShowBtn') {
                manHandlerShow.style.display = 'none';
            } else {
                manHandlerShow.style.display = 'block';
            }
        }
        manChgBtnShow.addEventListener('click', toggleButtonMan);
        manChgBtnHide.addEventListener('click', toggleButtonMan);
        //#endregion 
        //#region 1.3.2 Funktion f�r att skapa li element f�r l�gg till eller ta bort knappar
        // P�verkar NIV� 3
        function createManListItem(man, actionText, actionTitle, actionClass, colorClass) {
            const spcUserID = decodeISO88591(man.userId);
            const spcUserName = decodeISO88591(man.userName);

            const liMan = Object.assign(document.createElement('li'), {
                id: `userID_${spcUserID}`,
                className: 'spc-userID-list-entry',
                style: "display: flex; align-items: center;"
            });
            const liManA = Object.assign(document.createElement('a'), {
                title: `${actionTitle}: ${spcUserName}`,
                textContent: actionText,
                style: "width: 167px; max-height: 30px; padding: inherit;",
                id: `${spcUserID},${spcUserName}`
            });
            liManA.classList.add(actionClass, 'btn', 'btn-inline', colorClass);
            liManA.addEventListener('click', () => addRemoveBtn(actionClass, liManA.id))
            const liManImg = Object.assign(document.createElement('img'), {
                className: "vertical-align-middle",
                src: "/static/f/11/133/pics/user.png",
                alt: ""
            });
            const liManSpan = Object.assign(document.createElement('span'), {
                className: "text",
                textContent: spcUserName
            });
            liMan.appendChild(liManA);
            liMan.appendChild(liManImg);
            liMan.appendChild(liManSpan);

            return liMan;
        }
        //#endregion 
        //#region 1.3.3 Funktion f�r att l�gga till eller ta bort anv�ndare
        // P�verkar NIV� 3
        async function addRemoveBtn(actionClass, data) {
            const updatedManagers = [];
            if (actionClass === 'spcAddBtn') {
                assignedManagers.push({
                    userId: data.split(',')[0],
                    userName: data.split(',')[1]
                });
                assignedManagers.forEach(user => {
                    updatedManagers.push({
                        userId: user.userId,
                        userName: user.userName
                    });
                });
            }
            if (actionClass === 'spcRemoveBtn') {
                temp = assignedManagers.filter(manager => manager.userId !== data.split(',')[0]);
                temp.forEach(user => {
                    updatedManagers.push({
                        userId: user.userId,
                        userName: user.userName
                    });
                });
            }
            const formData = new URLSearchParams();
            updatedManagers.forEach(user => {
                formData.append("userID", user.userId);
                formData.append("userID-name" + user.userId, user.userName);
            });
            const appendManagerList = await fetch(updateManagersURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData.toString()
            });

            if (appendManagerList.status === 200) {
                location.reload();
            }
        }
        //#endregion 
        //#region 1.3.4 L�gg till funktion f�r att d�lja och visa knappar och div f�r hantering av status
        // P�verkar NIV� 4 och NIV� 5
        function toggleButtonSta(event) {
            const showHideClicked = event.target;
            const showHideNotClickedId = showHideClicked.id === 'staShowBtn' ? 'staHideBtn' : 'staShowBtn';
            const showHideNotClicked = document.getElementById(showHideNotClickedId);
            showHideClicked.style.display = 'none';
            showHideNotClicked.style.display = '';

            const staHandlerShow = document.getElementById("spc-flowinstance-status-handler");
            if (showHideNotClickedId === 'staShowBtn') {
                staHandlerShow.style.display = 'none';
            } else {
                staHandlerShow.style.display = 'block';
            }
        }
        staChgBtnShow.addEventListener('click', toggleButtonSta);
        staChgBtnHide.addEventListener('click', toggleButtonSta);
        //#endregion 
        //#region 1.3.5 H�mta eventuell statusbeskrivning och visa i spcStatusDesc vid hover
        // P�verkar NIV� 5
        const statusDescs = document.querySelectorAll('.spc-sta-btn');
        statusDescs.forEach(statusDesc => {
            statusDesc.addEventListener('mouseover', function () {
                if (!this.getAttribute('title')) {
                    staDescDiv.textContent = '';
                } else {
                    staDescDiv.innerHTML = '<strong>Statusbeskrivning: </strong>' + this.getAttribute('title');
                }
            });
            statusDesc.addEventListener('mouseout', function () {
                staDescDiv.textContent = '';
            });
        });
        //#endregion 
        //#region 1.3.6 L�gg till en eventlistener f�r alla status-knappar
        // P�verkar NIV� 5
        const statusBtns = staFormDiv.querySelectorAll('.spc-sta-btn');
        statusBtns.forEach(btn => {
            if (btn.classList.contains('disabled')) {
                btn.addEventListener('click', function () {
                    alert('Du kan inte byta tilla denna status, se statusbeskrivning f�r mer information.');
                });
            } else {
                btn.addEventListener('click', function () {
                    const statusText = btn.textContent;
                    const statusMessageRequired = btn.classList.contains('spc-sta-btn-msg-int') || btn.classList.contains('spc-sta-btn-msg-ext');
                    const confirmSave = confirm(`Vill du �ndra status till "${statusText}"?`);
                    if (btn.classList.contains('btn-light')) {
                        btn.classList.remove('btn-light');
                        btn.classList.add('btn-blue');
                    }
                    if (confirmSave) {
                        if (statusMessageRequired) {
                            alert(`Byte till status: "${statusText}"\n\nByte till denna status kr�ver att du l�gger ett meddelande och/eller en intern notering.\n\n Skriv i textf�lt nedan och bekr�fta med knappen "Spara �ndringar".`);
                            document.querySelector(`#status_${btn.id}`).checked = true;
                            document.querySelector(`#status_${btn.id}`).dispatchEvent(new Event('change', { bubbles: true }));
                            document.querySelector('#formBtns').style.display = 'block';
                            document.querySelectorAll('#message').forEach(el => el.removeAttribute('disabled'));
                            document.querySelectorAll('#internal-message').forEach(el => el.removeAttribute('disabled'));
                            document.querySelectorAll('#external-message').forEach(el => el.removeAttribute('disabled'));
                            if (btn.classList.contains('spc-sta-btn-msg-int')) {
                                document.querySelector('#new-note').style.display = "block";
                            } else {
                                document.querySelector('#new-note').style.display = "none";
                            }
                            if (btn.classList.contains('spc-sta-btn-msg-ext')) {
                                document.querySelector('#new-message').style.display = "block";
                            } else {
                                document.querySelector('#new-message').style.display = "none";
                            }
                        } else {
                            document.querySelector(`#status_${btn.id}`).checked = true;
                            document.querySelector(`#status_${btn.id}`).dispatchEvent(new Event('change', { bubbles: true }));
                            theForm.submit();
                        }
                    } else {
                        if (btn.classList.contains('btn-blue')) {
                            btn.classList.remove('btn-blue');
                            btn.classList.add('btn-light');
                        }
                        document.querySelector('#formBtns').style.display = 'none';
                    }
                });
            }
        });
        //#endregion
        //region 1.3.7 Uppdatera n�dv�ndiga script
        // P�verkar NIV� 5
        function reloadDynamicScripts(scriptBaseNames) {
            scriptBaseNames.forEach(baseName => {
                let oldScript = [...document.querySelectorAll("script")].find(script =>
                    script.src.includes(baseName)
                );

                if (oldScript) {
                    let dynamicUrl = oldScript.src;
                    oldScript.remove();

                    let newScript = document.createElement("script");
                    newScript.src = dynamicUrl;
                    newScript.onload = () => console.log(`Laddat om: ${dynamicUrl}`);
                    document.head.appendChild(newScript);
                }
            });
        }

        // Lista �ver script som beh�ver laddas om
        const scriptBaseNames = [
            "jquery.qloader.js",
            "featherlight.min.js",
            "confirmpost.js",
            "bootstrap-typeahead.js",
            "jquery.ui.touch.min.js",
            "jquery.blockui.js",
            "jquery.qloader-init.js",
            "flowinstanceadmin2.js"
        ];

        reloadDynamicScripts(scriptBaseNames);
        //#endregion
        //#endregion    
    } catch (error) {
        console.error('N�got gick fel vid h�mtning av elementen:', error);
    }
}
//#region 2.0 K�R SCRIPTET
if (window.location.href.includes('/manage/flowinstanceadmin/overview/')) {
    document.body.classList.add('spc-overview-page');
    const style = document.createElement("style");
    style.textContent = `body.override.spc-overview-page {
        .spc-heading {
            color: #363636;
            text-decoration: none;
        }
        .spc-formDiv {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .spc-formDiv>div {
            box-sizing: border-box;
        }
        .spc-statusText {
            font-weight: 100;
            font-style: italic;
        }
        .spc-highlight-green {
            font-weight: bold;
            font-style: normal;
            color: #1a7f37;
        }
        .spc-sta-btn:hover {
            transform: translateY(5px);
        }
    }`;
    document.head.appendChild(style);
    fetchAndInsertElements()
}
//#endregion