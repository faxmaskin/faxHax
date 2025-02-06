# Sidhuvud och filhanterare

F�r att de funktioner som g�r att hitta i denna repo ska fungera beh�ver vissa f�rberedelser g�ras, nedan beskrivs en f�rberedelse som f�renklar och en som �r rent n�dv�dndig.

## Nice to have - Enklare �tkomst till ***Filemanager***

### Inget m�ste, men det f�renklar livet en smula

I varje installation av Open ePlatform finns ett antal statiska sidor med filer, bland annat den filhanterare d�r alla bilder och filer som laddas upp till plattformen n�r du bygger e-tj�nster via gr�nsnittet. Som systemadministrat�r kan denna yta vara ett bra st�lle att f�rvara designelement och annat som nyttjas i plattformen, och det �r ocks� d�r l�sningen i v�r installation har lagts.

F�r att enklare �tkomst till denna fillagringsyta kan du skapa upp en sida f�r Filhantering. K�llkod till den sida vi i Lilla Edet anv�nder delas nedan. Detta �r som sagt en nice to have; **du beh�ver en lagringsplats f�r filer som du kan anropa fr�n plattformen**, men det �r upp till er sj�lva vart den platsen �r.

### G�r s� h�r - enklaste l�sningen

1. Kontrollera s� att s�kv�gen �r densamma i er plattform genom att �ppna den i en webbl�sare: **/static/f/9/188/ckeditor/filemanager/index.html?Connector=/fileconnector/connector/** (Det vill s�ga: <https://ERPLATTFORM.ERKOMMUN.se/static/f/9/188/ckeditor/filemanager/index.html?Connector=/fileconnector/connector/>)  

    **Om inte, workaround:**  

    i. I vilken e-tj�nst som helst, som **e-tj�nstebyggare**, redigera en fr�ga  
    ii. I ***"Beskrivning"***, klicka p� ikonen f�r ***"L�gg till bild"***  
    iii. Klicka p� ***"Bl�ddra p� server"***  
    iv. Kopiera adressen som visas i webbl�sarf�nstret som �ppnas  

2. I menyn ***"Systemadministration"*** v�lj menyvalet ***"Menyer"***
3. I tr�dvyn som visas, klicka p� ikonen som ser ut som ett ***"Abc+"*** intill ***"Systemadm."*** ("L�gg till menyalternativ i sektionen: Systemadm.")
4. Ge menyvalet ett namn, f�rslagsvis ***"Filhanterare"***, en beskrivning och klistra in er s�kv�g d�r
5. Kryssa i rutorna ***"Administrat�rer"*** och ***"Inloggade anv�ndare"*** i alternativen f�r �tkomst (endast inloggade administrat�rer f�r tillg�ng till menyn)
6. L�gg till gruppen ***"Systemadministrat�rer"*** f�r grupper och l�mna anv�ndare tomt
7. Spara �ndringar - du har nu en genv�g i menyn ***"Systemadministration"***

F�rdelen med detta �r att det �r enkelt att l�gga in, nackdelen �r att genv�gen till filhanteraren kommer sakna e-tj�nsteportalens header och f�r att navigera tillbaka f�r du anv�nda webbl�sarens "Tillbaka-knapp".  

### G�r s� h�r - iFrame  

1. Se **steg 1** ovan, vi beh�ver s�kerst�lla s�kv�gen till filhanteraren �ven f�r denna metod
2. I menyn ***"Systemadministration"*** v�lj menyvalet "Sidor"
3. Klicka p� ikonen som ser ut som ett dokument med ett gr�nt plustecken till h�ger om ***"Systemadm."*** i tr�dvyn (L�gg till en ny sida i sektionen: Systemadm.)
4. Ge sidan ett namn, (f�rslagsvis ***"Filhanterare"***), en beskrivning och ett alias
5. I textredigeraren f�r ***"Inneh�ll"***, klicka p� k�lla och l�gg in k�llkod f�r en iFrame (l�nkas nedan)
6. G�r val kring �vriga inst�llningar, �tkomst ska vara ***"Administrat�rer"*** och Grupper ska vara ***"Systemadministrat�rer"***
7. Spara �ndringar - du har nu en genv�g i menyn ***"Systemadministration"***

F�rdelen med detta �r fr�mst "Look and feel", nackdelen �r att det �r lite omst�ndligare att s�tta upp.

[H�r hittar du f�rslag p� k�llkod till sida f�r filhantering](filePage.html)

## Need to have - Script i profilens sidhuvud

Det som listas nedan beh�ver finnas p� plats f�r att l�sningen ska fungera.

### Script i profilens sidhuvud

Systemadministrat�r i plattformen har tillg�ng till menyvalet ***"Profiler"*** i menyn ***"Systemadm."***, d�r inneh�llet i plattformens sidhuvud kan redigeras. D� sidhuvudet visas p� plattformens alla sidor �r det ocks� h�r du har m�jlighet att implementera kod som g�ller �ver hela plattformen (och de delar du v�ljer).

Nedan visas det script som lagts till i Lilla Edet kommuns profil.

F�ljande beh�ver tas h�nsyn till och �ndras efter behov:

- I funktionen **spcFunctions()** beh�ver du se till att de script-filer du vill initiera ligger i en s�kv�g som kan l�sas, i exemplet nedan �r det `/fileconnector/file/oto/`, och att s�kv�gen avslutas med '/'.
- Script-filerna i denna repo �r alltid senaste version, men de �r inte d�pta med versionsummer - s� detta beh�ver ni sj�lva g�ra vid nedladdning och implementering. Versionsnummer l�ggs till i filnamnet, t.ex. `handlerExtended_v_2.js` eller `messageToManagers_v_1_2.js`. D�ps de p� annat vis beh�ver ni justera f�r det i funktionen **initScript()**
- Samtliga script beh�ver konstanter f�r **version**, t.ex. `1_2`, och om de ska vara aktiverade eller ej, `true` eller `false`.
- I �vrigt ska inte mycket beh�va justeras, funktionerna ska fungera dynamsiskt s� l�nge variablerna �r korrekta satta


```html
<!-- #region SCRIPT -->
<script>
    async function spcFunctions() {
        //#region �vergripande
        // Beroende p� vilka funktioner du vill anv�nda s�tter du true eller false nedan

        // S�kv�g till scripten
        const sokvag = '/fileconnector/file/oto/';

        // Ut�kad �rendehandl�ggning, enklare variant med bara genv�gar till handl�ggar- och statusbyten
        // Gl�m inte att �ndra version nedan vid byte, om det �r version x.x skrivs det som x_x, t.ex. 2.1 skrivs som 2_1
        const handlerExtendedLightVersion = 1;
        const handlerExtendedLight = false;

        // Ut�kad �rendehandl�ggning
        // Gl�m inte att �ndra version nedan vid byte, om det �r version x.x skrivs det som x_x, t.ex. 2.1 skrivs som 2_1
        const handlerExtendedVersion = 2;
        const handlerExtended = true;

        // Funktion som m�jligg�r meddelande till handl�ggare
        // Gl�m inte att �ndra version nedan vid byte, om det �r version x.x skrivs det som x_x, t.ex. 2.1 skrivs som 2_1
        const messageToManagersVersion = 1_2;
        const messageToManagers = false;
        //#endregion �vergripande

        //#region Initiera valda funktioner
        if (handlerExtendedLight) {
            try {
                await initScript(sokvag, 'handlerExtendedLight', handlerExtendedLightVersion);
            } catch (error) {
                console.error("Fel vid inl�sning av handlerExtendedLight:", error);
            }
        }

        if (handlerExtended) {
            try {
                await initScript(sokvag, 'handlerExtended', handlerExtendedVersion);
            } catch (error) {
                console.error("Fel vid inl�sning av handlerExtended:", error);
            }
        }

        if (messageToManagers) {
            try {
                await initScript(sokvag, 'messageToManagers', messageToManagersVersion);
            } catch (error) {
                console.error("Fel vid inl�sning av messageToManagers:", error);
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

L�gger du till `<style>`-taggar i profilens sidhuvud och skriver CSS inom dessa kommer dessa r�knas som inline och du kan p� s� s�tt "override the overrides", det vill s�ga, du kan p� egen hand byta portalens f�rgschema. Kundspecifika f�rgval hittar du i filen overrides.css (som du till exempel ser om du via webbl�sarens n�tverks�vervakare vid sidladdning).
