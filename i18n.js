// Dictionnaire de traduction de l'interface (FR / EN)
const I18N = {
  fr: {
    hero: {
      subtitle: "Réservation mondiale",
      tagline: "...un espace conçu sans intention finit par le montrer. Les usagers le sentent, même s'ils ne savent pas le nommer..."
    },
    stats: {
      architects: "Architectes",
      continents: "Continents",
      perVersion: "Par version",
      dateValue: "Juin 2026",
      release: "Parution"
    },
    form: {
      label: "Réservation",
      title: "Réservez votre exemplaire",
      desc: "Amazon ne livre pas partout. Inscrivez-vous pour être notifié dès que CONCEPT est disponible près de chez vous.",
      fullname: "Nom complet",
      fullnamePh: "Votre nom complet",
      email: "Email",
      country: "Pays",
      countryPh: "— Sélectionner —",
      countrySearchPh: "Rechercher un pays...",
      countryOtherPh: "Saisissez le nom de votre pays",
      city: "Ville",
      cityPh: "Votre ville",
      versionLabel: "Choisissez votre version",
      submit: "Réserver mon exemplaire →",
      note: "Aucun paiement requis. Vous serez contacté uniquement lorsque le livre sera disponible dans votre région.",
      errorFields: "Merci de remplir tous les champs.",
      errorEmail: "Veuillez saisir une adresse email valide.",
      errorVersion: "Veuillez sélectionner au moins une version.",
      errorSend: "Erreur lors de l'envoi. Veuillez réessayer.",
      sending: "Envoi en cours..."
    },
    version: {
      fr: "Version Française",
      en: "Version Anglaise",
      shipping: "Livraison offerte",
      hint: "Vous pouvez sélectionner les deux versions."
    },
    qty: {
      label: "Nombre d'exemplaires",
      unit: "ex."
    },
    total: {
      label: "Total estimé",
      shipping: "+ Livraison offerte",
      detail: "/ ex."
    },
    success: {
      title: "Réservation confirmée.",
      text: "Nous vous contacterons dès que CONCEPT est disponible dans votre ville."
    }
  },

  en: {
    hero: {
      subtitle: "Worldwide reservation",
      tagline: "...a space designed without intention ends up showing it. Users feel it, even if they can't quite name it..."
    },
    stats: {
      architects: "Architects",
      continents: "Continents",
      perVersion: "Per edition",
      dateValue: "June 2026",
      release: "Release"
    },
    form: {
      label: "Reservation",
      title: "Reserve your copy",
      desc: "Amazon doesn't deliver everywhere. Sign up to be notified as soon as CONCEPT is available near you.",
      fullname: "Full name",
      fullnamePh: "Your full name",
      email: "Email",
      country: "Country",
      countryPh: "— Select —",
      countrySearchPh: "Search a country...",
      countryOtherPh: "Type your country name",
      city: "City",
      cityPh: "Your city",
      versionLabel: "Choose your edition",
      submit: "Reserve my copy →",
      note: "No payment required. You will only be contacted once the book is available in your region.",
      errorFields: "Please fill in all fields.",
      errorEmail: "Please enter a valid email address.",
      errorVersion: "Please select at least one edition.",
      errorSend: "An error occurred. Please try again.",
      sending: "Sending..."
    },
    version: {
      fr: "French Edition",
      en: "English Edition",
      shipping: "Free shipping",
      hint: "You can select both editions."
    },
    qty: {
      label: "Number of copies",
      unit: "pc."
    },
    total: {
      label: "Estimated total",
      shipping: "+ Free shipping",
      detail: "/ copy"
    },
    success: {
      title: "Reservation confirmed.",
      text: "We will contact you as soon as CONCEPT is available in your city."
    }
  }
};

// Récupère une valeur imbriquée via une clé "a.b.c"
function i18nGet(lang, path) {
  return path.split('.').reduce((obj, key) => (obj ? obj[key] : undefined), I18N[lang]);
}