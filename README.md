# Kaplaaki ry — Kulukorvauslomake

Selainpohjainen lomake Kaplaaki ry:n jäsenille kulukorvausten ja ESTIEM-matkakorvausten hakemiseen. Lomake tuottaa yhden valmiin PDF-anomuksen liitteineen, joka lähetetään sähköpostilla taloudenhoidolle käsiteltäväksi.

## Miksi tämä tehtiin

Kulukorvausten hakeminen hoidettiin aiemmin käsin täytettävillä lomakkeilla ja erillisillä liitesähköposteilla, mikä aiheutti töitä sekä hakijalle että talousvastaavalle: puuttuvia tietoja, virheellisiä IBAN- tai puhelinnumeroita, hajallaan olevia kuitteja ja epäyhtenäistä ulkoasua kirjanpitoa varten. Tämä sovellus digitalisoi prosessin:

- **Validointi ajossa** — IBAN, puhelinnumero ja sähköposti tarkistetaan ja muotoillaan automaattisesti ennen kuin lomake voi mennä eteenpäin.
- **Yksi PDF, ei erillisiä liitteitä** — anomustiedot, kuluerittely, mahdollinen kilometrikorvaus ja kuittiliitteet (kuvat ja PDF:t) yhdistetään yhdeksi tiedostoksi, jossa on myös valmis kenttä talousvastaavan hyväksynnälle.
- **ESTIEM-matkat omana logiikkanaan** — matkan tyyppi (akateeminen / muu / edustustapahtuma) määrää automaattisesti korvausprosentin, ja talousvastaavalle on oma osio lopullisen korvaussumman vahvistamiseen.
- **Kohtuullinen tiedostokoko** — puhelimella otetut kuittikuvat ja skannatut PDF-liitteet pakataan automaattisesti, jotta anomukset eivät paisu tarpeettoman suuriksi sähköpostiliitteinä.
- **Kaksikielisyys** — lomake toimii suomeksi ja englanniksi, koska Kaplaaki ry:n jäsenistössä on myös kansainvälisiä opiskelijoita.

## Mihin tätä käytetään

Kaplaaki ry:n jäsen täyttää lomakkeen hakiessaan korvausta kuluista (esim. kiltatapahtumat, hankinnat) tai matkakuluista ESTIEM-tapahtumiin:

1. Hakija valitsee lomaketyypin (normaali kulukorvaus tai ESTIEM-matka), täyttää tietonsa, kuluerittelyn ja tarvittaessa kilometrikorvauksen, sekä liittää kuittikuvat/-PDF:t.
2. Sovellus generoi selaimessa yhden PDF-tiedoston, joka sisältää kaikki tiedot, liitteet ja talousvastaavan täytettävän hyväksymisosion.
3. Hakija lataa PDF:n ja lähettää sen sähköpostilla osoitteeseen `talous@kaplaaki.fi` (ESTIEM-matkoista myös `estiem@kaplaaki.fi`).
4. Talousvastaava tarkistaa, hyväksyy ja kirjaa korvauksen Kitsas-kirjanpitoon.

## Tekniikka

- React (Create React App) -yksisivusovellus, ei backendiä — kaikki PDF-generointi ja kuvien pakkaus tapahtuu käyttäjän selaimessa.
- PDF kootaan `jsPDF`:llä ja `pdf-lib`:llä; liite-PDF:t renderöidään ja pakataan `pdfjs-dist`:llä.
- Staattinen build, joka voidaan julkaista millä tahansa staattisen sisällön hostingilla (esim. cPanel).

## Kehitys

```bash
npm install
npm start       # kehityspalvelin, http://localhost:3000
npm run build   # tuotantobuild build/-kansioon
```

## Julkaisu

`npm run build` tuottaa staattiset tiedostot `build/`-kansioon. Kansion sisältö puretaan sellaisenaan palvelimen julkiseen hakemistoon (esim. cPanelin File Managerilla).
