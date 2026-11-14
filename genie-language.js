
/*
  GENIE – CENTRALNI SISTEM JEZIKA
  Jezici: Svenska, English, Srpski
*/

const GENIE_LANGUAGES = ["sv", "en", "sr"];

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

    if (validLanguage(saved)) {
      return saved;
    }

    // Preuzimanje ranijeg izbora jezika
    const previous = localStorage.getItem("genieLanguage");

    return validLanguage(previous) ? previous : "sv";

  } catch (error) {
    return "sv";
  }
}

export function setGenieLanguage(language, userUid = null) {
  if (!validLanguage(language)) {
    return false;
  }

  try {
    localStorage.setItem(
      languageStorageKey(userUid),
      language
    );

    // Kompatibilnost sa postojećim stranicama
    localStorage.setItem("genieLanguage", language);

    document.documentElement.lang = language;

    return true;

  } catch (error) {
    console.error("Genie language error:", error);
    return false;
  }
}

export function applyGenieLanguage(
  translations,
  userUid = null
) {
  const language = getGenieLanguage(userUid);
  const dictionary = translations[language];

  if (!dictionary) {
    return language;
  }

  document.documentElement.lang = language;

  document.querySelectorAll("[data-genie-i18n]")
    .forEach(element => {
      const key = element.dataset.genieI18n;
      const value = dictionary[key];

      if (value === undefined) return;

      const attribute = element.dataset.genieI18nAttr;

      if (attribute) {
        element.setAttribute(attribute, value);
      } else {
        element.textContent = value;
      }
    });

  return language;
}

