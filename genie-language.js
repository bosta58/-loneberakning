
/*
  GENIE – CENTRALNI SISTEM JEZIKA
  Svenska | English | Srpski
*/

const GENIE_LANGUAGES = ["sv", "en", "sr"];

const GENIE_MAIN_TRANSLATIONS = {
  sv: {
    subtitle: "Enkel och professionell löneberäkning",
    timlon: "Timlön",
    manadslon: "Månadslön",
    kollektivavtal: "Kollektivavtal",
    arbetsgivare: "Arbetsgivare",
    guideButton: "Användarhandbok"
  },
  en: {
    subtitle: "Simple and professional salary calculation",
    timlon: "Hourly pay",
    manadslon: "Monthly salary",
    kollektivavtal: "Collective agreement",
    arbetsgivare: "Employer",
    guideButton: "User Guide"
  },
  sr: {
    subtitle: "Jednostavan i profesionalan obračun plate",
    timlon: "Satnica",
    manadslon: "Mesečna plata",
    kollektivavtal: "Kolektivni ugovor",
    arbetsgivare: "Poslodavac",
    guideButton: "Uputstvo za korišćenje"
  }
};
const GENIE_CALENDAR_TRANSLATIONS = {
  sv: {
    title: "📅 Arbetstidskalender",
    summary: "Sammanställning",
    weekday: "Vardag",
    weekend: "Helg",
    holiday: "Helgdag",
    hour: "tim",
    regularWeekday: "Ordinarie vardag:",
    overtimeWeekday: "Övertid vardag:",
    regularWeekend: "Ordinarie helg:",
    overtimeWeekend: "Övertid helg:",
    regularHoliday: "Ordinarie helgdag:",
    overtimeHoliday: "Övertid helgdag:",
    totalHours: "Totalt timmar:",
    workDays: "Antal arbetsdagar:",
    save: "💾 Spara",
    clear: "🗑️ Rensa",
    back: "← Tillbaka",
    next: "Fortsätt →",
    saved: "Kalendern är sparad.",
    confirmClear: "Vill du rensa alla timmar för denna månad?",
    months: [
      "Januari", "Februari", "Mars", "April",
      "Maj", "Juni", "Juli", "Augusti",
      "September", "Oktober", "November", "December"
    ],
    weekdays: ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"]
  },

  en: {
    title: "📅 Work time calendar",
    summary: "Summary",
    weekday: "Weekday",
    weekend: "Weekend",
    holiday: "Public holiday",
    hour: "hours",
    regularWeekday: "Regular weekday:",
    overtimeWeekday: "Overtime weekday:",
    regularWeekend: "Regular weekend:",
    overtimeWeekend: "Overtime weekend:",
    regularHoliday: "Regular public holiday:",
    overtimeHoliday: "Overtime public holiday:",
    totalHours: "Total hours:",
    workDays: "Number of workdays:",
    save: "💾 Save",
    clear: "🗑️ Clear",
    back: "← Back",
    next: "Continue →",
    saved: "Calendar saved.",
    confirmClear: "Do you want to clear all hours for this month?",
    months: [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December"
    ],
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  },

  sr: {
    title: "📅 Kalendar radnog vremena",
    summary: "Pregled",
    weekday: "Radni dan",
    weekend: "Vikend",
    holiday: "Praznik",
    hour: "sati",
    regularWeekday: "Redovni radni dan:",
    overtimeWeekday: "Prekovremeni radni dan:",
    regularWeekend: "Redovni vikend:",
    overtimeWeekend: "Prekovremeni vikend:",
    regularHoliday: "Redovni praznik:",
    overtimeHoliday: "Prekovremeni praznik:",
    totalHours: "Ukupno sati:",
    workDays: "Broj radnih dana:",
    save: "💾 Sačuvaj",
    clear: "🗑️ Obriši",
    back: "← Nazad",
    next: "Nastavi →",
    saved: "Kalendar je sačuvan.",
    confirmClear: "Da li želiš da obrišeš sve sate za ovaj mesec?",
    months: [
      "Januar", "Februar", "Mart", "April",
      "Maj", "Jun", "Jul", "Avgust",
      "Septembar", "Oktobar", "Novembar", "Decembar"
    ],
    weekdays: ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"]
  }
};

/*
  Prvi element je švedski prevod.
  Drugi element je engleski prevod.
  Srpski je osnovni jezik.
*/

const GENIE_EXTRA_TRANSLATIONS = {
  "Dobro došli u Genie": ["Välkommen till Genie", "Welcome to Genie"],
  "Izaberite vrstu naloga:": ["Välj kontotyp:", "Choose account type:"],
  "Radnik": ["Arbetstagare", "Worker"],
  "Poslodavac": ["Arbetsgivare", "Employer"],
  "Izaberite Radnik ili Poslodavac": ["Välj arbetstagare eller arbetsgivare", "Choose Worker or Employer"],
  "Izabrali ste: Radnik": ["Du har valt: Arbetstagare", "You selected: Worker"],
  "Izabrali ste: Poslodavac": ["Du har valt: Arbetsgivare", "You selected: Employer"],
  "E-mail adresa": ["E-postadress", "Email address"],
  "Unesite e-mail": ["Ange e-postadress", "Enter email"],
  "Lozinka": ["Lösenord", "Password"],
  "Unesite lozinku": ["Ange lösenord", "Enter password"],
  "Prijava": ["Logga in", "Log in"],
  "Kreiraj nalog": ["Skapa konto", "Create account"],
  "Odjava": ["Logga ut", "Log out"],
  "Povezivanje sa radnikom": ["Anslut till arbetstagare", "Connect to worker"],
  "Unesite e-mail adresu radnika. Radnik zatim može da prihvati ili odbije vaš zahtev.": [
    "Ange arbetstagarens e-postadress. Arbetstagaren kan sedan acceptera eller avvisa din förfrågan.",
    "Enter the worker's email address. The worker can then accept or reject your request."
  ],
  "E-mail radnika": ["Arbetstagarens e-postadress", "Worker email"],
  "Pošalji zahtev": ["Skicka förfrågan", "Send request"],
  "Povezani radnici": ["Anslutna arbetstagare", "Connected workers"],
  "Povezani radnici će se prikazati ovde.": ["Anslutna arbetstagare visas här.", "Connected workers will appear here."],
  "Zahtevi poslodavaca": ["Förfrågningar från arbetsgivare", "Employer requests"],
  "Ovde možete da prihvatite ili odbijete zahtev za povezivanje.": [
    "Här kan du acceptera eller avvisa en anslutningsförfrågan.",
    "Here you can accept or reject a connection request."
  ],
  "Provera zahteva...": ["Kontrollerar förfrågningar...", "Checking requests..."],
  "Povezani poslodavci": ["Anslutna arbetsgivare", "Connected employers"],
  "Provera povezanih poslodavaca...": ["Kontrollerar anslutna arbetsgivare...", "Checking connected employers..."],
  "Trenutno nemate novih zahteva.": ["Du har inga nya förfrågningar.", "You have no new requests."],
  "Zahtev za povezivanje": ["Anslutningsförfrågan", "Connection request"],
  "Poslodavac: ": ["Arbetsgivare: ", "Employer: "],
  "E-mail nije dostupan": ["E-postadress saknas", "Email unavailable"],
  "Prihvati": ["Acceptera", "Accept"],
  "Odbij": ["Avvisa", "Reject"],
  "Obrađujem zahtev...": ["Behandlar förfrågan...", "Processing request..."],
  "Zahtev je prihvaćen.": ["Förfrågan har accepterats.", "Request accepted."],
  "Zahtev je odbijen.": ["Förfrågan har avvisats.", "Request rejected."],
  "Trenutno nemate povezanih poslodavaca.": ["Du har inga anslutna arbetsgivare.", "You have no connected employers."],
  "Povezan poslodavac": ["Ansluten arbetsgivare", "Connected employer"],
  "ID poslodavca: ": ["Arbetsgivar-ID: ", "Employer ID: "],
  "Povezan radnik": ["Ansluten arbetstagare", "Connected worker"],
  "ID radnika: ": ["Arbetstagar-ID: ", "Worker ID: "],
  "Nije dostupan": ["Inte tillgängligt", "Unavailable"],
  "Status: aktivna veza": ["Status: aktiv anslutning", "Status: active connection"],
  "Učitavanje povezanih radnika...": ["Laddar anslutna arbetstagare...", "Loading connected workers..."],
  "Još nema povezanih radnika.": ["Inga arbetstagare är anslutna ännu.", "No workers connected yet."],
  "Učitavanje zahteva...": ["Laddar förfrågningar...", "Loading requests..."],
  "Šaljem zahtev...": ["Skickar förfrågan...", "Sending request..."],
  "Zahtev je poslat. Radnik može da ga prihvati ili odbije.": [
    "Förfrågan har skickats. Arbetstagaren kan acceptera eller avvisa den.",
    "Request sent. The worker can accept or reject it."
  ],
  "Unesite ispravnu e-mail adresu radnika.": [
    "Ange en giltig e-postadress till arbetstagaren.",
    "Enter a valid worker email address."
  ],
  "Slanje zahteva nije uspelo.": ["Det gick inte att skicka förfrågan.", "Failed to send request."],
  "Uspešno ste se odjavili.": ["Du har loggat ut.", "You have logged out."],
  "Prijavljeni ste kao radnik.": ["Du är inloggad som arbetstagare.", "You are logged in as a worker."],
  "Prijavljeni ste kao poslodavac.": ["Du är inloggad som arbetsgivare.", "You are logged in as an employer."],
  "Nalog je kreiran.": ["Kontot har skapats.", "Account created."],
  "Nalog je kreiran. Poslodavac može poslati zahtev radniku.": [
    "Kontot har skapats. Arbetsgivaren kan skicka en förfrågan till arbetstagaren.",
    "Account created. The employer can send a request to the worker."
  ],
  "Uspešna prijava.": ["Inloggningen lyckades.", "Login successful."],
  "Prijava u toku...": ["Loggar in...", "Logging in..."],
  "Kreiranje naloga...": ["Skapar konto...", "Creating account..."],
  "Prvo izaberite Radnik ili Poslodavac.": ["Välj först arbetstagare eller arbetsgivare.", "First choose Worker or Employer."],
  "Unesite e-mail i lozinku.": ["Ange e-postadress och lösenord.", "Enter email and password."],
  "Lozinka mora imati najmanje 6 znakova.": ["Lösenordet måste innehålla minst 6 tecken.", "Password must contain at least 6 characters."],
  "Greška pri kreiranju naloga.": ["Ett fel uppstod när kontot skapades.", "Error creating account."],
  "Greška pri prijavi.": ["Ett fel uppstod vid inloggning.", "Login error."],
  "Odjava nije uspela.": ["Utloggningen misslyckades.", "Logout failed."],
  "Uloga naloga nije odgovarajuća. Odjavite se i proverite nalog.": [
    "Kontots roll stämmer inte. Logga ut och kontrollera kontot.",
    "The account role is incorrect. Log out and check the account."
  ],
  "Nalog je prijavljen, ali profil nije učitan: ": [
    "Kontot är inloggat, men profilen kunde inte laddas: ",
    "The account is signed in, but the profile could not be loaded: "
  ],
  "Ne mogu da učitam zahteve: ": ["Kan inte ladda förfrågningar: ", "Cannot load requests: "],
  "Ne mogu da učitam povezane poslodavce: ": ["Kan inte ladda anslutna arbetsgivare: ", "Cannot load connected employers: "],
  "Ne mogu da učitam povezane radnike: ": ["Kan inte ladda anslutna arbetstagare: ", "Cannot load connected workers: "],
  "Učitavanje zahteva nije uspelo.": ["Det gick inte att ladda förfrågningarna.", "Failed to load requests."],
  "Učitavanje povezanih poslodavaca nije uspelo.": ["Det gick inte att ladda anslutna arbetsgivare.", "Failed to load connected employers."],
  "Učitavanje povezanih radnika nije uspelo.": ["Det gick inte att ladda anslutna arbetstagare.", "Failed to load connected workers."],
  
  "📚 ISTORIJA": ["📚 HISTORIA", "📚 HISTORY"],

  "Prethodni obračunski periodi": [
    "Tidigare löneperioder",
    "Previous salary periods"
  ],

  "Još nema završenih obračunskih perioda.": [
    "Inga avslutade löneperioder ännu.",
    "No completed salary periods yet."
  ],

  "Još nema prethodnih obračunskih perioda.": [
  "Inga tidigare löneperioder ännu.",
  "No previous salary periods yet."
],

"Radno vreme:": [
  "Arbetad tid:",
  "Worked time:"
],
  "Radni sati:": [
  "Arbetade timmar:",
  "Hours worked:"
],

"Bruto plata:": [
  "Bruttolön:",
  "Gross salary:"
],

"Neto plata:": [
  "Nettolön:",
  "Net salary:"
],

  "💬 Komunikacija sa poslodavcem": [
    "💬 Kommunikation med arbetsgivaren",
    "💬 Communication with employer"
  ],

  "Nema poruka poslodavca za kolektivni ugovor.": [
    "Inga meddelanden från arbetsgivaren för kollektivavtalet.",
    "No messages from the employer for the collective agreement."
  ],

  "Pošalji odgovor": [
    "Skicka svar",
    "Send reply"
  ],

"Prethodni obračunski periodi": [
  "Tidigare löneperioder",
  "Previous salary periods"
],
  
};


const GENIE_EMPLOYER_TRANSLATIONS = {
  sv: {
    subtitle: "Arbetsgivare",
    companyTitle: "Företagsinformation",
    logoPlaceholder: "🏢<br>Företagslogotyp",
    companyNamePlaceholder: "Företagets namn",
    companyInfoPlaceholder: "Uppgifter om arbetsgivaren",
    saveCompany: "💾 Spara företagsuppgifter",
    companySaved: "Företagsuppgifterna har sparats.",
    employees: "Anställda",
    noEmployees: "Inga anställda registrerade",
    employeeOne: "anställd",
    employeeMany: "anställda",
    addEmployee: "＋ Lägg till anställd",
    addEmployeePrompt: "Ange arbetstagarens namn:",
    unknownEmployee: "Okänd anställd",
    startAdd: "Lägg till en anställd för att börja.",
    view: "👁 Visa uppgifter",
    contact: "💬 Kontakta anställd",
    deleteEmployee: "🗑️ Ta bort anställd",
    deleteConfirm: "Är du säker på att du vill ta bort denna anställd?",
    latestMessage: "💬 Senaste meddelande:",
    status: "Status",
    noSalary: "Ingen löneuppgift registrerad",
    noSalaryDetails: "Det finns ännu inga sparade löneuppgifter för denna anställda.",
    communication: "💬 Kommunikation",
    close: "← Stäng",
    back: "← Tillbaka",
    footer: "Genie – Enkel och transparent löneberäkning",
    period: "Löneperiod",
    regularHours: "Vanliga timmar",
    overtime: "Övertid",
    night: "Natt",
    nightOvertime: "Nattövertid",
    weekend: "Helg",
    weekendOvertime: "Helgövertid",
    holiday: "Helgdag",
    holidayOvertime: "Helgdagsövertid",
    vacationPay: "Semesterersättning",
    grossSalary: "Bruttolön",
    tax: "Skatt",
    netSalary: "Nettolön",
    regularPay: "Vanlig lön",
    overtimePay: "Övertidslön",
    weekendPay: "Helglön",
    weekendOvertimePay: "Helgövertidslön",
    holidayPayAmount: "Helgdagslön",
    holidayOvertimePay: "Helgdagsövertidslön",
    monthlySalary: "Månadslön",
    workTarget: "Arbetstidsmål",
    totalHours: "Totalt arbetad tid",
    targetHours: "Måltid",
    difference: "Skillnad",
    noMessages: "Inga meddelanden ännu.",
    employerMessage: "📤 Meddelande från arbetsgivaren",
    employeeReply: "↩️ Svar från arbetstagaren",
    messagePrompt: "Skriv ett meddelande till ",
    messageSent: "Meddelandet har skickats till ",
    fixed: "Åtgärdad",
    newComment: "Ny kommentar",
    replyFromEmployee: "Svar från arbetstagaren"
  },

  en: {
    subtitle: "Employer",
    companyTitle: "Company information",
    logoPlaceholder: "🏢<br>Company logo",
    companyNamePlaceholder: "Company name",
    companyInfoPlaceholder: "Employer information",
    saveCompany: "💾 Save company information",
    companySaved: "Company information has been saved.",
    employees: "Employees",
    noEmployees: "No employees registered",
    employeeOne: "employee",
    employeeMany: "employees",
    addEmployee: "＋ Add employee",
    addEmployeePrompt: "Enter the employee's name:",
    unknownEmployee: "Unknown employee",
    startAdd: "Add an employee to get started.",
    view: "👁 View details",
    contact: "💬 Contact employee",
    deleteEmployee: "🗑️ Delete employee",
    deleteConfirm: "Are you sure you want to delete this employee?",
    latestMessage: "💬 Latest message:",
    status: "Status",
    noSalary: "No salary information registered",
    noSalaryDetails: "There are no saved salary details for this employee yet.",
    communication: "💬 Communication",
    close: "← Close",
    back: "← Back",
    footer: "Genie – Simple and transparent salary calculation",
    period: "Pay period",
    regularHours: "Regular hours",
    overtime: "Overtime",
    night: "Night",
    nightOvertime: "Night overtime",
    weekend: "Weekend",
    weekendOvertime: "Weekend overtime",
    holiday: "Holiday",
    holidayOvertime: "Holiday overtime",
    vacationPay: "Holiday pay",
    grossSalary: "Gross salary",
    tax: "Tax",
    netSalary: "Net salary",
    regularPay: "Regular pay",
    overtimePay: "Overtime pay",
    weekendPay: "Weekend pay",
    weekendOvertimePay: "Weekend overtime pay",
    holidayPayAmount: "Holiday pay",
    holidayOvertimePay: "Holiday overtime pay",
    monthlySalary: "Monthly salary",
    workTarget: "Working time target",
    totalHours: "Total worked time",
    targetHours: "Target hours",
    difference: "Difference",
    noMessages: "No messages yet.",
    employerMessage: "📤 Message from employer",
    employeeReply: "↩️ Reply from employee",
    messagePrompt: "Write a message to ",
    messageSent: "Message has been sent to ",
    fixed: "Handled",
    newComment: "New comment",
    replyFromEmployee: "Reply from employee"
  },

  sr: {
    subtitle: "Poslodavac",
    companyTitle: "Podaci o poslodavcu",
    logoPlaceholder: "🏢<br>Logo poslodavca",
    companyNamePlaceholder: "Naziv firme",
    companyInfoPlaceholder: "Podaci o poslodavcu",
    saveCompany: "💾 Sačuvaj podatke poslodavca",
    companySaved: "Podaci o poslodavcu su sačuvani.",
    employees: "Zaposleni",
    noEmployees: "Nema registrovanih zaposlenih",
    employeeOne: "zaposleni",
    employeeMany: "zaposlenih",
    addEmployee: "＋ Dodaj zaposlenog",
    addEmployeePrompt: "Unesite ime zaposlenog:",
    unknownEmployee: "Nepoznat zaposleni",
    startAdd: "Dodajte zaposlenog da biste počeli.",
    view: "👁 Prikaži podatke",
    contact: "💬 Kontaktiraj zaposlenog",
    deleteEmployee: "🗑️ Obriši zaposlenog",
    deleteConfirm: "Da li ste sigurni da želite da obrišete ovog zaposlenog?",
    latestMessage: "💬 Poslednja poruka:",
    status: "Status",
    noSalary: "Nema registrovanih podataka o plati",
    noSalaryDetails: "Za ovog zaposlenog još nema sačuvanih podataka o plati.",
    communication: "💬 Komunikacija",
    close: "← Zatvori",
    back: "← Nazad",
    footer: "Genie – Jednostavan i transparentan obračun plate",
    period: "Obračunski period",
    regularHours: "Redovni sati",
    overtime: "Prekovremeni sati",
    night: "Noćni sati",
    nightOvertime: "Noćni prekovremeni sati",
    weekend: "Vikend",
    weekendOvertime: "Vikend prekovremeni sati",
    holiday: "Praznik",
    holidayOvertime: "Praznični prekovremeni sati",
    vacationPay: "Naknada za godišnji odmor",
    grossSalary: "Bruto plata",
    tax: "Porez",
    netSalary: "Neto plata",
    regularPay: "Redovna plata",
    overtimePay: "Prekovremena plata",
    weekendPay: "Vikend plata",
    weekendOvertimePay: "Vikend prekovremena plata",
    holidayPayAmount: "Praznična plata",
    holidayOvertimePay: "Praznični prekovremeni sati",
    monthlySalary: "Mesečna plata",
    workTarget: "Radno vreme – cilj",
    totalHours: "Ukupno radno vreme",
    targetHours: "Ciljani sati",
    difference: "Razlika",
    noMessages: "Još nema poruka.",
    employerMessage: "📤 Poruka od poslodavca",
    employeeReply: "↩️ Odgovor zaposlenog",
    messagePrompt: "Napišite poruku zaposlenom ",
    messageSent: "Poruka je poslata zaposlenom ",
    fixed: "Rešeno",
    newComment: "Nova poruka",
    replyFromEmployee: "Odgovor zaposlenog"
  }
};


function validLanguage(language) {
  return GENIE_LANGUAGES.includes(language);
}

function languageStorageKey(userUid) {
  return userUid
    ? "genieLanguage_" + userUid
    : "genieLanguage";
}

export function getGenieLanguage(userUid = null) {
  try {
    const saved = localStorage.getItem(
      languageStorageKey(userUid)
    );

    if (validLanguage(saved)) return saved;

    const previous = localStorage.getItem("genieLanguage");

    return validLanguage(previous) ? previous : "sv";
  } catch (error) {
    return "sv";
  }
}
export function getGenieEmployerTranslations(language = null) {
  const selectedLanguage =
    validLanguage(language)
      ? language
      : getGenieLanguage();

  return GENIE_EMPLOYER_TRANSLATIONS[selectedLanguage];
}

export function getGenieCalendarTranslations(language = null) {
  const selectedLanguage =
    validLanguage(language)
      ? language
      : getGenieLanguage();

  return GENIE_CALENDAR_TRANSLATIONS[selectedLanguage];
}
function translateText(text, language) {
  if (!text || !text.trim()) return text;

  const leading = text.match(/^\s*/)?.[0] || "";
  const trailing = text.match(/\s*$/)?.[0] || "";
  const original = text.trim();

  const entries = Object.entries(GENIE_EXTRA_TRANSLATIONS)
    .sort((a, b) => b[0].length - a[0].length);

  for (const [serbian, versions] of entries) {
    const variants = [
      [serbian, serbian],
      [versions[0], serbian],
      [versions[1], serbian]
    ];

    for (const [variant, source] of variants) {
      if (original === variant ||
          (original.startsWith(variant) && variant.length > 8)) {

        const translated = language === "en"
          ? GENIE_EXTRA_TRANSLATIONS[source][1]
          : language === "sr"
            ? source
            : GENIE_EXTRA_TRANSLATIONS[source][0];

        const suffix = original.slice(variant.length);

        return leading + translated + suffix + trailing;
      }
    }
  }

  return text;
}

function applyMainTranslations(language) {
  const dictionary = GENIE_MAIN_TRANSLATIONS[language];
  if (!dictionary) return;

  const elements = {
    subtitle: "subtitle",
    timlon: "timlonText",
    manadslon: "manadslonText",
    kollektivavtal: "kollektivavtalText",
    arbetsgivare: "arbetsgivareText",
    guideButton: "guideButtonText"
  };

  Object.entries(elements).forEach(([key, id]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = dictionary[key];
    }
  });
}


function applyExtraTranslations(language) {
  document.querySelectorAll("body *").forEach(element => {
    if (element.children.length !== 0) return;

    for (const node of element.childNodes) {
      if (node.nodeType !== Node.TEXT_NODE) continue;

      const translated = translateText(node.nodeValue, language);

      if (translated !== node.nodeValue) {
        node.nodeValue = translated;
      }
    }

    if (element.placeholder) {
      element.placeholder = translateText(
        element.placeholder,
        language
      );
    }
  });

  const historyTitle = document.getElementById("kollektivHistoryTitle");

if (historyTitle) {
  const translatedTitle =
    language === "en"
      ? "Previous salary periods"
      : language === "sv"
        ? "Tidigare löneperioder"
        : "Prethodni obračunski periodi";

    if (historyTitle.textContent !== translatedTitle) {
    historyTitle.textContent = translatedTitle;
  }
 }
}

export function applyGenieLanguage(userUid = null) {
  const language = getGenieLanguage(userUid);

  document.documentElement.lang = language;

  const selector = document.getElementById("languageSelect");
  if (selector) selector.value = language;

  applyMainTranslations(language);
  applyExtraTranslations(language);

  return language;
}

let observerStarted = false;

function startGenieLanguageObserver() {
  if (observerStarted || !document.body) return;

  observerStarted = true;

  const observer = new MutationObserver(() => {
    applyExtraTranslations(getGenieLanguage());
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
}

export function setGenieLanguage(language, userUid = null) {
  if (!validLanguage(language)) return false;

  try {
    localStorage.setItem(
      languageStorageKey(userUid),
      language
    );

    // Kompatibilnost sa starim Genie stranicama
    localStorage.setItem("genieLanguage", language);

    document.documentElement.lang = language;

    const selector = document.getElementById("languageSelect");
    if (selector) selector.value = language;

    applyMainTranslations(language);
    applyExtraTranslations(language);

    startGenieLanguageObserver();

    return true;
  } catch (error) {
    console.error("Genie language error:", error);
    return false;
  }
}
