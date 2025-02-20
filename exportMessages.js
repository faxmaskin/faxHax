/*
exportMessages - exportera alla ärendets meddelanden och interna noteringar till pdf-filer
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

//#region KONSTANTER OCH VARIABLER

/*
OBS! 
Kontrollera sökvägen till din pdf-logo (const imgURL nedan), i mitt fall är det profil 2, vanligtvis är det 1
*/
const imgURL = "/administration/profiler/file/1/pdf.flowinstance.logofile/pdf-logo.png";
const tjanst = document.querySelector(".title").querySelector('h1').textContent.trim();
const errandno = document.querySelector(".title").querySelector('span').textContent.trim();
const arende = `#${errandno.split(":")[1].trim()}`;
let inskickatAv = "";
let inskickat = "";
const historyDiv = document.querySelector('#history');
const rows = historyDiv.querySelectorAll('table.oep-table tbody tr');
for (const row of rows) {
    const eventCell = row.querySelector('td[data-title="Händelse"]');
    if (eventCell && eventCell.textContent.trim() === "Inskickat") {
        inskickatAv = row.querySelector('td[data-title="Person"]').textContent.trim();
        inskickat = row.querySelector('td[data-title="Datum"]').textContent.trim();
    }
}
//#endregion
//#region FÖRBREDELSER I DOM
// Lägg till script för att använda jsPDF
const jspdf = document.createElement("script");
jspdf.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
document.head.appendChild(jspdf);

// Lägg till knappar för att hämta meddelanden och interna noteringar
let btn = document.createElement("button");
btn.id = "generateMsgPDF";
btn.innerHTML = "Hämta meddelanden";
btn.classList.add("btn", "btn-green", "btn-inline", "bigmarginright");
document.querySelector(".editbutton").append(btn);
btn = document.createElement("button");
btn.id = "generateNotePDF";
btn.innerHTML = "Hämta interna noteringar";
btn.classList.add("btn", "btn-green", "btn-inline", "bigmarginright");
document.querySelector(".editbutton").append(btn);
//#endregion

//#region FUNKTIONER
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

async function createPDF(id, title, arende, inskickatAv, inskickat, tjanst, imgURL) {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();
    let y = 13.63;
    const response = await fetch(imgURL);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.onloadend = function () {
        const base64data = reader.result.split(",")[1];
        // Översta raden (logotyp, datumrubrik, ärendenummerrubrik och sida och sidoantal)
        doc.addImage(base64data, "PNG", 17.97, y, 31.75, 12.96, 180);
        doc.setFontSize(7.5);
        doc.setFont("Helvetica");
        doc.text("Datum", 117.47, y);
        doc.text("Ärendenummer", 144.03, y);
        y += 3.18;
        // Andra raden (datum och ärendenummer)
        doc.text(getCurrentDate(), 117.47, y);
        doc.text(arende, 144.03, y);
        // Fjärde raden (inskickat av)
        y += 3.18 * 2;
        doc.text(`Inskickat av: ${inskickatAv}`, 117.47, y);
        doc.setFontSize(10.5, 'bold');
        // Nioende raden (rubrik)
        y += 3.18 * 5;
        doc.text(`Samtliga ${title} för ärendenummer ${arende}, ${tjanst}`, 17.97, y);
        // Förbered för meddelanden
        y += 3.18 * 2.5;
        doc.setDrawColor(0);
        doc.setFontSize(7.5);
        doc.setFont("Times-Roman");
        // Första sidfot
        doc.line(15.89, 283.93, 189, 283.93, "S");
        doc.text(`Ärendenummer: ${arende} | Inskickat av: ${inskickatAv.split('(')[0].trim()} | Datum: ${inskickat}`, 15.89, 288.7);
        doc.setDrawColor(150);

        // Hämta alla meddelanden eller interna noteringar
        let messages = document.querySelectorAll(`#${id} .messages > li`);

        // Loopa igenom alla meddelanden/noteringar
        messages.forEach((msg, index) => {
            let authorText = msg.querySelector(".author")?.innerText.trim() || "";
            let messageText = msg.querySelector(".message div:first-child")?.innerText.trim() || "";

            // Kontrollera om ny sida behövs
            if (y > 260) {
                doc.addPage();
                doc.setDrawColor(0);
                doc.line(15.89, 283.93, 189, 283.93, "S");
                doc.text(`Ärendenummer: ${arende} | Inskickat av: ${inskickatAv.split('(')[0].trim()} | Datum: ${inskickat}`, 15.89, 288.7);
                y = 18.81;
                doc.setDrawColor(150);
            }
            // Lägg till författare
            doc.setFontSize(7.5);
            doc.setFont("Helvetica", "bold");
            doc.text(`# ${index + 1}`, 17.97, y, { maxWidth: 180 });
            doc.setFont("Helvetica", "normal");
            y += 3.18;
            doc.text(`Avsändare: ${authorText.split('·')[0].trim()} | Skickat: ${authorText.split('·')[1].split('Skapad:')[1].trim()}`, 17.97, y, { maxWidth: 180 });

            // Dela upp meddelandetexten om det är för långt
            let messageLines = doc.splitTextToSize(messageText, 180);
            let lineHeight = 3.18;

            // Lägg till meddelandetext i PDF
            y += 3.18 * 1.5;
            let ry = y - 3.18;
            doc.setFontSize(7.5);
            doc.setFont("Times-Roman", "normal");
            doc.text(messageLines, 17.97, y);
            doc.rect(15.89, ry, 172.89, messageLines.length * lineHeight + 3.18, "S");
            y += messageLines.length * lineHeight + 10;
        });

        // Lägg till sidnummer i sidhuvudet
        const addPageNumbers = () => {
            const totalPages = doc.internal.getNumberOfPages();

            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(7.5);
                doc.setFont("Helvetica", "normal");
                doc.text(`Sida ${i} (${totalPages})`, 192.85, 13.63);
            }
        };
        addPageNumbers();

        // Ladda ner PDF
        doc.save(`${title}-${arende}-${getCurrentDate()}.pdf`);
    };
    reader.readAsDataURL(blob);
}
//#endregion
//#region 2.0 KÖR SCRIPTET
if (window.location.href.includes('/manage/flowinstanceadmin/overview/')) {
    document.querySelector("#generateMsgPDF").addEventListener("click", async function () {
        createPDF("messages", "meddelanden", arende, inskickatAv, inskickat, tjanst, imgURL);
    });

    document.querySelector("#generateNotePDF").addEventListener("click", async function () {
        createPDF("notes", "interna noteringar", arende, inskickatAv, inskickat, tjanst, imgURL);
    });
}
//#endregion