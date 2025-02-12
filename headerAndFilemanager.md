# Sidhuvud och filhanterare

För att de funktioner som går att hitta i denna repo ska fungera behöver vissa förberedelser göras, nedan beskrivs en förberedelse som förenklar och en som är rent nödvädndig.

## Nice to have - Enklare åtkomst till ***Filemanager***

### Inget måste, men det förenklar livet en smula

I varje installation av Open ePlatform finns ett antal statiska sidor med filer, bland annat den filhanterare där alla bilder och filer som laddas upp till plattformen när du bygger e-tjänster via gränsnittet. Som systemadministratör kan denna yta vara ett bra ställe att förvara designelement och annat som nyttjas i plattformen, och det är också där lösningen i vår installation har lagts.

För att enklare åtkomst till denna fillagringsyta kan du skapa upp en sida för Filhantering. Källkod till den sida vi i Lilla Edet använder delas nedan. Detta är som sagt en nice to have; **du behöver en lagringsplats för filer som du kan anropa från plattformen**, men det är upp till er själva vart den platsen är.

### Gör så här - enklaste lösningen

1. Kontrollera så att sökvägen är densamma i er plattform genom att öppna den i en webbläsare: **/static/f/9/188/ckeditor/filemanager/index.html?Connector=/fileconnector/connector/** (Det vill säga: <https://ERPLATTFORM.ERKOMMUN.se/static/f/9/188/ckeditor/filemanager/index.html?Connector=/fileconnector/connector/>)  

    **Om inte, workaround:**  

    i. I vilken e-tjänst som helst, som **e-tjänstebyggare**, redigera en fråga  
    ii. I ***"Beskrivning"***, klicka på ikonen för ***"Lägg till bild"***  
    iii. Klicka på ***"Bläddra på server"***  
    iv. Kopiera adressen som visas i webbläsarfönstret som öppnas  

2. I menyn ***"Systemadministration"*** välj menyvalet ***"Menyer"***
3. I trädvyn som visas, klicka på ikonen som ser ut som ett ***"Abc+"*** intill ***"Systemadm."*** ("Lägg till menyalternativ i sektionen: Systemadm.")
4. Ge menyvalet ett namn, förslagsvis ***"Filhanterare"***, en beskrivning och klistra in er sökväg där
5. Kryssa i rutorna ***"Administratörer"*** och ***"Inloggade användare"*** i alternativen för åtkomst (endast inloggade administratörer får tillgång till menyn)
6. Lägg till gruppen ***"Systemadministratörer"*** för grupper och lämna användare tomt
7. Spara ändringar - du har nu en genväg i menyn ***"Systemadministration"***

Fördelen med detta är att det är enkelt att lägga in, nackdelen är att genvägen till filhanteraren kommer sakna e-tjänsteportalens header och för att navigera tillbaka får du använda webbläsarens "Tillbaka-knapp".  

### Gör så här - iFrame  

1. Se **steg 1** ovan, vi behöver säkerställa sökvägen till filhanteraren även för denna metod
2. I menyn ***"Systemadministration"*** välj menyvalet "Sidor"
3. Klicka på ikonen som ser ut som ett dokument med ett grönt plustecken till höger om ***"Systemadm."*** i trädvyn (Lägg till en ny sida i sektionen: Systemadm.)
4. Ge sidan ett namn, (förslagsvis ***"Filhanterare"***), en beskrivning och ett alias
5. I textredigeraren för ***"Innehåll"***, klicka på källa och lägg in källkod för en iFrame (länkas nedan)
6. Gör val kring övriga inställningar, åtkomst ska vara ***"Administratörer"*** och Grupper ska vara ***"Systemadministratörer"***
7. Spara ändringar - du har nu en genväg i menyn ***"Systemadministration"***

Fördelen med detta är främst "Look and feel", nackdelen är att det är lite omständligare att sätta upp.

#### Förslag på källkod till sida för filhantering

```html
<style type="text/css">
    .iframeWrapper {
        position: relative;
        padding-bottom: 56.25%;
        padding-top: 25px;
        height: 0;
    }

    .iframeWrapper iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    /* Styling för textarea */
    #fileContent {
        background-color: #1e1e1e;
        color: #d4d4d4;
        border: 1px solid #3c3c3c;
        border-radius: 4px;
        padding: 10px;
        font-family: Consolas, "Courier New", monospace;
        font-size: 1rem;
        resize: vertical;
        width: 80%;
        height: 400px;
    }

    /* Styling för knappen */
    #saveButton {
        background-color: #007acc;
        color: #ffffff;
        border: none;
        border-radius: 4px;
        padding: 10px 20px;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 15px;
        transition: background-color 0.3s;
    }

    #saveButton:hover {
        background-color: #005f9e;
    }

    /* Scrollbars för textarea */
    #fileContent::-webkit-scrollbar {
        width: 10px;
    }

    #fileContent::-webkit-scrollbar-thumb {
        background-color: #4a4a4a;
        border-radius: 4px;
    }

    #fileContent::-webkit-scrollbar-thumb:hover {
        background-color: #5e5e5e;
    }

    /* Placeholder för textens innehåll */
    #fileContent::placeholder {
        color: #606060;
    }
</style>
<h1>Filhanterare</h1>

<p>
    I filhanteraren (iframe nedan) så finns en mapp <strong>oto</strong> - där förvaras script och css 
    filer som påverkar sitens utseende. (oto = Override the overrides, vilket är vad det låter som).
    </p>
<p>
    <a class="btn btn-blue btn-inline" href="/administration/profiler" target="_blank">Profiler</a>
</p>
<div class="iframeWrapper">
    <iframe frameborder="0" height="500px" scrolling="no" src="/static/f/9/188/ckeditor/filemanager/index.html?Connector=/fileconnector/connector/35&amp;CKEditor=description&amp;CKEditorFuncNum=3&amp;langCode=sv" width="100%"></iframe>
</div>
```

## Need to have - Script i profilens sidhuvud

Det som listas nedan behöver finnas på plats för att lösningen ska fungera.

### Script i profilens sidhuvud

Systemadministratör i plattformen har tillgång till menyvalet ***"Profiler"*** i menyn ***"Systemadm."***, där innehållet i plattformens sidhuvud kan redigeras. Då sidhuvudet visas på plattformens alla sidor är det också här du har möjlighet att implementera kod som gäller över hela plattformen (och de delar du väljer).

Nedan visas det script som lagts till i Lilla Edet kommuns profil.

Följande behöver tas hänsyn till och ändras efter behov:

- I funktionen **spcFunctions()** behöver du se till att de script-filer du vill initiera ligger i en sökväg som kan läsas, i exemplet nedan är det `/fileconnector/file/oto/`, och att sökvägen avslutas med '/'.
- Script-filerna i denna repo är alltid senaste version, men de är inte döpta med versionsummer - så detta behöver ni själva göra vid nedladdning och implementering. Versionsnummer läggs till i filnamnet, t.ex. `handlerExtended_v_2.js` eller `messageToManagers_v_1_2.js`. Döps de på annat vis behöver ni justera för det i funktionen **initScript()**
- Samtliga script behöver konstanter för **version**, t.ex. `1_2`, och om de ska vara aktiverade eller ej, `true` eller `false`.
- I övrigt ska inte mycket behöva justeras, funktionerna ska fungera dynamsiskt så länge variablerna är korrekta satta

```html
<!-- #region SCRIPT -->
<script>
    async function spcFunctions() {
        //#region Övergripande
        // Beroende på vilka funktioner du vill använda sätter du true eller false nedan

        // Sökväg till scripten
        const sokvag = '/fileconnector/file/oto/';

        // Utökad ärendehandläggning, enklare variant med bara genvägar till handläggar- och statusbyten
        // Glöm inte att ändra version nedan vid byte, om det är version x.x skrivs det som x_x, t.ex. 2.1 skrivs som "2_1"
        const handlerExtendedLightVersion = 1;
        const handlerExtendedLight = false;

        // Utökad ärendehandläggning
        // Glöm inte att ändra version nedan vid byte, om det är version x.x skrivs det som x_x, t.ex. 2.1 skrivs som "2_1"
        const handlerExtendedVersion = 2;
        const handlerExtended = true;

        // Funktion som möjliggör meddelande till handläggare
        // Glöm inte att ändra version nedan vid byte, om det är version x.x skrivs det som x_x, t.ex. 2.1 skrivs som "2_1"
        const messageToManagersVersion = "1_2";
        const messageToManagers = false;
        //#endregion Övergripande

        //#region Initiera valda funktioner
        if (handlerExtendedLight) {
            try {
                await initScript(sokvag, 'handlerExtendedLight', handlerExtendedLightVersion);
            } catch (error) {
                console.error("Fel vid inläsning av handlerExtendedLight:", error);
            }
        }

        if (handlerExtended) {
            try {
                await initScript(sokvag, 'handlerExtended', handlerExtendedVersion);
            } catch (error) {
                console.error("Fel vid inläsning av handlerExtended:", error);
            }
        }

        if (messageToManagers) {
            try {
                await initScript(sokvag, 'messageToManagers', messageToManagersVersion);
            } catch (error) {
                console.error("Fel vid inläsning av messageToManagers:", error);
            }
        }
    }

    async function initScript(sokvag, script, version) {
        const s = `${sokvag}${script}_v_${version}.js`;
        return new Promise((resolve, reject) => {
            const scriptLink = document.createElement("script");
            scriptLink.src = s;
            scriptLink.onload = resolve;
            scriptLink.onerror = reject;
            document.head.appendChild(scriptLink);
        });
    }

    window.addEventListener("load", function () {
        spcFunctions();
    });
    //#region Initiera valda funktioner
</script>
<!-- #endregion SCRIPT -->
```

## Bonusfakta

Lägger du till `<style>`-taggar i profilens sidhuvud och skriver CSS inom dessa kommer dessa räknas som inline och du kan på så sätt "override the overrides", det vill säga, du kan på egen hand byta portalens färgschema. Kundspecifika färgval hittar du i filen overrides.css (som du till exempel ser om du via webbläsarens nätverksövervakare vid sidladdning).
