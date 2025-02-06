# faxHax

Här lägger jag mer eller mindre kompletta modifieringar till e-tjänsteplattformen **Open-ePlatform** för de som köper
plattformen som tjänst och bara vill modifiera upplevelsen.

All kod som tillhandahålls på denna sida är fri att använda som den är eller modifierad enligt slutanvändarens önskemål.
MIT-licensen ligger med i varje fil, och syftar till att förtydliga två (2) huvudpoänger:

1. Det är fritt fram att använda

2. Användningen är på egen risk och eget ansvar

Med det sagt, funktionaliteten bygger på manipulation av DOM, så egentligen görs ingen förändring på källkoden.
Huvudsyftet med de funktioner som delas här är att förenkla och förbättra. Hittar du någon bugg eller potentiellt
problem - hör av dig!

<details open>
    <summary>
        <h2>Att göra</h2>
    </summary>
    Nedan listar jag min planering. Är allt checkat så har jag gjort allt jag planerat för stunden, är något öppet så är
    det på gång!


    - [ ] Beskrivning av aktivering av funktioner via sidhuvud
    - [x] handlerExtendLight
    - [ ] handlerExtended
    - [ ] messageToManagers

</details>

<details open>
    <summary>
        <h2>Beskrivning av aktivering av funktioner via sidhuvud</h2>
    </summary>
    Nedan följer en detaljerad beskrivning om hur du hanterar och aktiverar scripten i denna repo.
    

    <details open>
        <summary>
            <h3>1. Filhantering
        </summary>
        #nicetohave = sådant som inte är ett måste, men som i min mening förenklar livet en smula.
        <h4>En genväg till <i>filemanager</i></h4>
        <p>
            I varje installation av Open ePlatform finns ett antal statiska sidor med filer, bland annat
            den filhanterare där alla bilder och filer som laddas upp till plattformen när du bygger
            e-tjänster via gränsnittet. Som systemadministratör kan denna yta vara ett bra ställe att
            förvara designelement och annat som nyttjas i plattformen, och det är också där lösningen i
            vår installation har lagts.
        </p>
        <p>
            För att enklare åtkomst till denna fillagringsyta kan du skapa upp en sida för Filhantering.
            Källkod till den sida vi i Lilla Edet använder delas nedan. Detta är som sagt en nice to
            have; du behöver en lagringsplats för filer som du kan anropa från plattformen, men det är
            upp till er själva vart den platsen är.
        </p>
        <p>
            <strong>Gör så här - enklaste lösningen:</strong>
        </p>
        <ol>
            <li>
                Kontrollera så att sökvägen är densamma i er plattform genom att öppna den i en
                webbläsare:
                /static/f/9/188/ckeditor/filemanager/index.html?Connector=/fileconnector/connector/
                (Det vill säga:
                https://ERPLATTFORM.ERKOMMUN.se/static/f/9/188/ckeditor/filemanager/index.html?Connector=/fileconnector/connector/)
                <ol type="i">
                    <strong>Om inte, workaround:</strong>
                    <li>
                        I vilken e-tjänst som helst, som e-tjänstebyggare, redigera en fråga
                    </li>
                    <li>
                        I "Beskrivning", klicka på ikonen för "Lägg till bild"
                    </li>
                    <li>
                        Klicka på "Bläddra på server"
                    </li>
                    <li>
                        Kopiera adressen som visas i webbläsarfönstret som öppnas
                    </li>
                </ol>
            </li>
            <li>
                I menyn "Systemadministration" välj menyvalet "Menyer"
            </li>
            <li>
                I trädvyn som visas, klicka på ikonen som ser ut som ett "Abc+" intill "Systemadm." ("Lägg till
                menyalternativ i sektionen: Systemadm.")
            </li>
            <li>
                Ge menyvalet ett namn, förslagsvis "Filhanterare", en beskrivning och klistra in er
                sökväg där
            </li>
            <li>
                Kryssa i rutorna "Administratörer" och "Inloggade användare" i alternativen för åtkomst
                (endast inloggade administratörer får tillgång till menyn)
            </li>
            <li>
                Lägg till gruppen "Systemadministratörer" för grupper och lämna användare tomt
            </li>
            <li>
                Spara ändringar - du har nu en genväg i menyn "Systemadministration"
            </li>
        </ol>
        <strong>Gör så här - iFrame:</strong>
        <ol>
            <li>
                Se steg 1 ovan, vi behöver säkerställa sökvägen till filhanteraren även för denna metod
            </li>
            <li>
                I menyn "Systemadministration" välj menyvalet "Sidor"
            </li>
            <li>
                Klicka på ikonen som ser ut som ett dokument med ett grönt plustecken till höger om
                "Systemadm." i trädvyn (Lägg till en ny sida i sektionen: Systemadm.)
            </li>
            <li>
                Ge sidan ett namn, (förslagsvis "Filhanterare"), en beskrivning och ett alias
            </li>
            <li>
                I textredigeraren för "Innehåll", klicka på källa och lägg in källkod för en iFrame (länkas nedan)
            </li>
            <li>
                Gör val kring övriga inställningar, åtkomst ska vara "Administratörer" och Grupper ska vara
                "Systemadministratörer"
            </li>
            <li>
                Spara ändringar - du har nu en genväg i menyn "Systemadministration"
            </li>
        </ol>
    </details>

    <details open>
        <summary>
            <h3>2. Sidhuvud
        </summary>
        Ipsum lorem dolor est

    </details>
</details>