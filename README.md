This app uses the GitHub api to authorize and fetch information about the user. 


# Features
- Connect your repository and kanban workflow in one place
- Easily give your repository collaborators tasks
- Keep an eye on the latest commits
- easy access to documentation for programming languages used in repository


# How to start app locally

1. Clone repository to your local folder(this is optional if you already have a local copy of the repository)
2. $ "cd path\to\folder" which contains the app
3. $ npm install
4. $ node app.js

Server is now running on localhost:3000






# Gruppe 7
Prosjektstyringsapp
- Truls Istre - Morten Olsen - Richard Greger - Ghulam Ahmad - Håkon Hess - Ingrid Victoria

Link til Trello: https://trello.com/b/FLL4lMIf/prosjektstyringsapp

Husk å ALLTID pulle ned fra repository før man gjør endringer lokalt! :)











Ideer:
- Kobles til GitHubs commit message?
- drag 'n' drop brukernavn for å tildele oppgaver

## Hvordan filstrukturen fungerer:
- HTML filer legges i view-mappen og endres fra .html til .ejs. EJS er en form for HTML som gir oss mulighet til å benytte javascript direkte inn i html

https://www.figma.com/file/WSdBuMBUvZqwTLJ0fI3OjRKm/Gruppe-7?node-id=1%3A2 (Ghulam og Morten har fikset skisser av prosjektet i Figma som ble anbefalt av veileder)


## Kommentering av kode
- Alle kommentarer gjøres på engelsk
- Kommentarer skal skrives over eventuelle funksjoner eller elementer



# Oppgaver 

## Done:
- Grid-view lagt opp med vagt innslag av flexbox
- Opprette oppgave i javascript
- Figma modell/wireframe
- Førsteutkast på papir
- Førsteutkast/mal med statisk HTML og CSS
- Kobling mot Github API på plass
- Lage klasse for oppgave-objekter

### Truls
  - Starter på prosjektrapport
  - Lager logg ut mulighet
  - Modulariserer serveren
  - Få colaborators listet opp på siden
### Richard
  - Ser på pop-up vindu ved opprettelse av oppgaver
  - Fullføre pop-up
### Håkon
  - Legger opp HTML i prosjektrepo og gjør det klart til javascript 
  - Ser på hvordan OOP fungerer i Javascript
  - Starte med checkbox
### Morten
  - Ordna dropdown meny


## To-Do: 
- Få på plass designprinsipper
  - Lage farge palette
  - Style alle sidene ihht til designprinsipper
  - Lage logo
- Navn på app
- Få på plass kolonnenavn på mainpage
- Få på plass kolonnenavn på dashboard
- Starte på prosjektrapport
  - Innledning
  - Ide og konsept
  - Utviklingsmetodikk
  - Prototype
  - Design og utforming
  - Bruk av git
  - Tekniske valg
  - Referanser

### Teknisk:
- Oppgave-objekter skal inneholde
  - Status
- Flytte oppgaver
  - Drag and drop og/eller knapper
- On-click funksjon på oppgavene slik at de kan endres etter opprettelse
- Tidsfrist (eventuelt kalender)
 
## Delmål til 03.06:
### Truls
  - Sette opp mottaker av formet som Richard lager
  - Vise colaborators i dropdown menyen "Owner" i newTask elementet
  - Mulighet for å lage repo fra appen
  - Sjekke litt på checkbox med Håkon
### Morten
  - Noterer hva som er gjort så langt og sender til Truls
  - Rapport: Ide og konsept
  - On-click funksjon på oppgavene slik at de kan endres etter opprettelse
### Richard
  - Begynne på renderItems fuksjonen
  - Rapport: Tekniske valg
### Håkon
  - Legge inn dette på Trello
  - Fortsette med checkbox
  - Rapport: kodestandarder / semantikk
  - Rapport: Designprinsipper (Design og utforming)
  - Starte med css på dashboard/Login
### Ghulam
  - Lage logo
  - Rapport: Innledning
### Vixen
  - Fortsette med design og utforming i Figma
  - Rapport: Design og utforming
