/*
handLerExtendedLight - Knappar med länkar till statusbyte och handläggarbyte
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
//#region KONSTANTER - dessa ska vanligtvis inte ändras, utan är samma i alla installationer
const version = "1.0.0";
const lastEditDate = "2025-02-06";
const author = "faxmaskin@duck.com"

// En samling konstanter med adress, som är kända eller hämtas från url
const url = window.location.href;
const flowInstanceId = url.substring(url.lastIndexOf('/') + 1);
const statusUrl = `/manage/flowinstanceadmin/status/${flowInstanceId}`;
const managersURL = `/manage/flowinstanceadmin/managers/${flowInstanceId}`;
//#endregion
//#region FUNKTIONER FÖR SKAPANDE AV ELEMENT
function insertElements() {
    const startDiv = document.querySelector('.description');
    const spcWrapper = Object.assign(document.createElement('div'), { className: "spc-handlerExtendedLightByJooL", id: version });
    const divider = Object.assign(document.createElement('div'), { className: "divider" });
    const manChgBtnShow = (Object.assign(document.createElement('a'), { id: "manShowBtn", href: managersURL, textContent: "Ändra handläggare" }));
    const staChgBtnShow = (Object.assign(document.createElement('a'), { id: "staShowBtn", href: statusUrl, textContent: "Ändra ärendestatus" }));
    manChgBtnShow.classList.add('btn', 'btn-light', 'btn-inline'); // 'btn-light' kan ersättas med btn-blue, btn-green, btn-red, btn-yellow osv. 
    staChgBtnShow.classList.add('btn', 'btn-yellow', 'btn-inline'); // 'btn-yellow' kan ersättas med btn-blue, btn-green, btn-red, btn-light osv.
    spcWrapper.append(divider);
    spcWrapper.append(manChgBtnShow);
    spcWrapper.append(staChgBtnShow);
    startDiv.insertAdjacentElement("afterend", spcWrapper);
}
//#endregion 
if (window.location.href.includes('/manage/flowinstanceadmin/overview/')) {
    insertElements()
}