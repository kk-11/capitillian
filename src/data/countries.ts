export type Country = {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  capital: string;
  flag: string; // emoji
  continent: string;
  lat: number;
  lng: number;
  population: number; // 2026 estimate
  area: number;       // km²
  landlocked: boolean;
  island: boolean;
  language: string;   // primary official language
  currencyCode: string; // ISO 4217
  callingCode: string;
};

export function getFaceValue(
  country: Country,
  face: "name" | "capital" | "flag"
): string {
  switch (face) {
    case "name":
      return country.name;
    case "capital":
      return country.capital;
    case "flag":
      return country.flag;
  }
}

export function formatArea(km2: number): string {
  if (km2 >= 1e6) return (km2 / 1e6).toFixed(2).replace(/\.?0+$/, "") + "M km²";
  if (km2 >= 1000) return Math.round(km2 / 1000) + "K km²";
  return km2 + " km²";
}

export function formatPopulation(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.?0+$/, "") + "M";
  if (n >= 1e3) return Math.round(n / 1e3) + "K";
  return n.toString();
}

// ---------------------------------------------------------------------------
// AFRICA (54 countries)
// ---------------------------------------------------------------------------
const AFRICA: Country[] = [
  { code: "DZ", name: "Algeria", capital: "Algiers", flag: "🇩🇿", continent: "Africa", lat: 36.7, lng: 3.1, population: 48028300, area: 2381741, landlocked: false, island: false, language: "Arabic", currencyCode: "DZD", callingCode: "+213" },
  { code: "AO", name: "Angola", capital: "Luanda", flag: "🇦🇴", continent: "Africa", lat: -8.8, lng: 13.2, population: 40215200, area: 1246700, landlocked: false, island: false, language: "Portuguese", currencyCode: "AOA", callingCode: "+244" },
  { code: "BJ", name: "Benin", capital: "Porto-Novo", flag: "🇧🇯", continent: "Africa", lat: 6.4, lng: 2.6, population: 15170400, area: 114763, landlocked: false, island: false, language: "French", currencyCode: "XOF", callingCode: "+229" },
  { code: "BW", name: "Botswana", capital: "Gaborone", flag: "🇧🇼", continent: "Africa", lat: -24.7, lng: 25.9, population: 2603390, area: 581730, landlocked: true, island: false, language: "English", currencyCode: "BWP", callingCode: "+267" },
  { code: "BF", name: "Burkina Faso", capital: "Ouagadougou", flag: "🇧🇫", continent: "Africa", lat: 12.4, lng: -1.5, population: 24601700, area: 274222, landlocked: true, island: false, language: "French", currencyCode: "XOF", callingCode: "+226" },
  { code: "BI", name: "Burundi", capital: "Gitega", flag: "🇧🇮", continent: "Africa", lat: -3.4, lng: 29.9, population: 14729200, area: 27834, landlocked: true, island: false, language: "French", currencyCode: "BIF", callingCode: "+257" },
  { code: "CV", name: "Cape Verde", capital: "Praia", flag: "🇨🇻", continent: "Africa", lat: 14.9, lng: -23.5, population: 529630, area: 4033, landlocked: false, island: true, language: "Portuguese", currencyCode: "CVE", callingCode: "+238" },
  { code: "CM", name: "Cameroon", capital: "Yaoundé", flag: "🇨🇲", continent: "Africa", lat: 3.9, lng: 11.5, population: 30640800, area: 475442, landlocked: false, island: false, language: "French", currencyCode: "XAF", callingCode: "+237" },
  { code: "CF", name: "Central African Republic", capital: "Bangui", flag: "🇨🇫", continent: "Africa", lat: 4.4, lng: 18.6, population: 5698980, area: 622984, landlocked: true, island: false, language: "French", currencyCode: "XAF", callingCode: "+236" },
  { code: "TD", name: "Chad", capital: "N'Djamena", flag: "🇹🇩", continent: "Africa", lat: 12.1, lng: 15.0, population: 21560400, area: 1284000, landlocked: true, island: false, language: "French", currencyCode: "XAF", callingCode: "+235" },
  { code: "KM", name: "Comoros", capital: "Moroni", flag: "🇰🇲", continent: "Africa", lat: -11.7, lng: 43.3, population: 899010, area: 1862, landlocked: false, island: true, language: "Comorian", currencyCode: "KMF", callingCode: "+269" },
  { code: "CD", name: "DR Congo", capital: "Kinshasa", flag: "🇨🇩", continent: "Africa", lat: -4.3, lng: 15.3, population: 116452000, area: 2344858, landlocked: false, island: false, language: "French", currencyCode: "CDF", callingCode: "+243" },
  { code: "CG", name: "Republic of the Congo", capital: "Brazzaville", flag: "🇨🇬", continent: "Africa", lat: -4.3, lng: 15.3, population: 6637780, area: 342000, landlocked: false, island: false, language: "French", currencyCode: "XAF", callingCode: "+242" },
  { code: "CI", name: "Ivory Coast", capital: "Yamoussoukro", flag: "🇨🇮", continent: "Africa", lat: 6.8, lng: -5.3, population: 33494300, area: 322463, landlocked: false, island: false, language: "French", currencyCode: "XOF", callingCode: "+225" },
  { code: "DJ", name: "Djibouti", capital: "Djibouti", flag: "🇩🇯", continent: "Africa", lat: 11.6, lng: 43.1, population: 1199460, area: 23200, landlocked: false, island: false, language: "French", currencyCode: "DJF", callingCode: "+253" },
  { code: "EG", name: "Egypt", capital: "Cairo", flag: "🇪🇬", continent: "Africa", lat: 30.1, lng: 31.2, population: 120101000, area: 1002450, landlocked: false, island: false, language: "Arabic", currencyCode: "EGP", callingCode: "+20" },
  { code: "GQ", name: "Equatorial Guinea", capital: "Malabo", flag: "🇬🇶", continent: "Africa", lat: 3.8, lng: 8.8, population: 1984470, area: 28051, landlocked: false, island: false, language: "Spanish", currencyCode: "XAF", callingCode: "+240" },
  { code: "ER", name: "Eritrea", capital: "Asmara", flag: "🇪🇷", continent: "Africa", lat: 15.3, lng: 38.9, population: 3682670, area: 117600, landlocked: false, island: false, language: "Tigrinya", currencyCode: "ERN", callingCode: "+291" },
  { code: "SZ", name: "Eswatini", capital: "Mbabane", flag: "🇸🇿", continent: "Africa", lat: -26.3, lng: 31.1, population: 1269860, area: 17364, landlocked: true, island: false, language: "Swati", currencyCode: "SZL", callingCode: "+268" },
  { code: "ET", name: "Ethiopia", capital: "Addis Ababa", flag: "🇪🇹", continent: "Africa", lat: 9.0, lng: 38.7, population: 138902000, area: 1104300, landlocked: true, island: false, language: "Amharic", currencyCode: "ETB", callingCode: "+251" },
  { code: "GA", name: "Gabon", capital: "Libreville", flag: "🇬🇦", continent: "Africa", lat: 0.4, lng: 9.5, population: 2647400, area: 267668, landlocked: false, island: false, language: "French", currencyCode: "XAF", callingCode: "+241" },
  { code: "GM", name: "Gambia", capital: "Banjul", flag: "🇬🇲", continent: "Africa", lat: 13.5, lng: -16.6, population: 2884080, area: 11295, landlocked: false, island: false, language: "English", currencyCode: "GMD", callingCode: "+220" },
  { code: "GH", name: "Ghana", capital: "Accra", flag: "🇬🇭", continent: "Africa", lat: 5.6, lng: -0.2, population: 35697600, area: 238533, landlocked: false, island: false, language: "English", currencyCode: "GHS", callingCode: "+233" },
  { code: "GN", name: "Guinea", capital: "Conakry", flag: "🇬🇳", continent: "Africa", lat: 9.5, lng: -13.7, population: 15442000, area: 245857, landlocked: false, island: false, language: "French", currencyCode: "GNF", callingCode: "+224" },
  { code: "GW", name: "Guinea-Bissau", capital: "Bissau", flag: "🇬🇼", continent: "Africa", lat: 11.9, lng: -15.6, population: 2297810, area: 36125, landlocked: false, island: false, language: "Portuguese", currencyCode: "XOF", callingCode: "+245" },
  { code: "KE", name: "Kenya", capital: "Nairobi", flag: "🇰🇪", continent: "Africa", lat: -1.3, lng: 36.8, population: 58636400, area: 580367, landlocked: false, island: false, language: "Swahili", currencyCode: "KES", callingCode: "+254" },
  { code: "LS", name: "Lesotho", capital: "Maseru", flag: "🇱🇸", continent: "Africa", lat: -29.3, lng: 27.5, population: 2389340, area: 30355, landlocked: true, island: false, language: "Sesotho", currencyCode: "LSL", callingCode: "+266" },
  { code: "LR", name: "Liberia", capital: "Monrovia", flag: "🇱🇷", continent: "Africa", lat: 6.3, lng: -10.8, population: 5853950, area: 111369, landlocked: false, island: false, language: "English", currencyCode: "LRD", callingCode: "+231" },
  { code: "LY", name: "Libya", capital: "Tripoli", flag: "🇱🇾", continent: "Africa", lat: 32.9, lng: 13.2, population: 7539850, area: 1759540, landlocked: false, island: false, language: "Arabic", currencyCode: "LYD", callingCode: "+218" },
  { code: "MG", name: "Madagascar", capital: "Antananarivo", flag: "🇲🇬", continent: "Africa", lat: -18.9, lng: 47.5, population: 33522100, area: 587041, landlocked: false, island: true, language: "Malagasy", currencyCode: "MGA", callingCode: "+261" },
  { code: "MW", name: "Malawi", capital: "Lilongwe", flag: "🇲🇼", continent: "Africa", lat: -14.0, lng: 33.8, population: 22785500, area: 118484, landlocked: true, island: false, language: "Chichewa", currencyCode: "MWK", callingCode: "+265" },
  { code: "ML", name: "Mali", capital: "Bamako", flag: "🇲🇱", continent: "Africa", lat: 12.7, lng: -8.0, population: 25932300, area: 1240192, landlocked: true, island: false, language: "French", currencyCode: "XOF", callingCode: "+223" },
  { code: "MR", name: "Mauritania", capital: "Nouakchott", flag: "🇲🇷", continent: "Africa", lat: 18.1, lng: -15.9, population: 5461320, area: 1030700, landlocked: false, island: false, language: "Arabic", currencyCode: "MRU", callingCode: "+222" },
  { code: "MU", name: "Mauritius", capital: "Port Louis", flag: "🇲🇺", continent: "Africa", lat: -20.2, lng: 57.5, population: 1265060, area: 2040, landlocked: false, island: true, language: "English", currencyCode: "MUR", callingCode: "+230" },
  { code: "MA", name: "Morocco", capital: "Rabat", flag: "🇲🇦", continent: "Africa", lat: 34.0, lng: -6.8, population: 38762400, area: 446550, landlocked: false, island: false, language: "Arabic", currencyCode: "MAD", callingCode: "+212" },
  { code: "MZ", name: "Mozambique", capital: "Maputo", flag: "🇲🇿", continent: "Africa", lat: -25.9, lng: 32.6, population: 36639900, area: 801590, landlocked: false, island: false, language: "Portuguese", currencyCode: "MZN", callingCode: "+258" },
  { code: "NA", name: "Namibia", capital: "Windhoek", flag: "🇳🇦", continent: "Africa", lat: -22.6, lng: 17.1, population: 3153250, area: 824292, landlocked: false, island: false, language: "English", currencyCode: "NAD", callingCode: "+264" },
  { code: "NE", name: "Niger", capital: "Niamey", flag: "🇳🇪", continent: "Africa", lat: 13.5, lng: 2.1, population: 28814900, area: 1267000, landlocked: true, island: false, language: "French", currencyCode: "XOF", callingCode: "+227" },
  { code: "NG", name: "Nigeria", capital: "Abuja", flag: "🇳🇬", continent: "Africa", lat: 9.1, lng: 7.2, population: 242432000, area: 923768, landlocked: false, island: false, language: "English", currencyCode: "NGN", callingCode: "+234" },
  { code: "RW", name: "Rwanda", capital: "Kigali", flag: "🇷🇼", continent: "Africa", lat: -1.9, lng: 30.1, population: 14889700, area: 26338, landlocked: true, island: false, language: "Kinyarwanda", currencyCode: "RWF", callingCode: "+250" },
  { code: "ST", name: "São Tomé and Príncipe", capital: "São Tomé", flag: "🇸🇹", continent: "Africa", lat: 0.3, lng: 6.7, population: 244994, area: 964, landlocked: false, island: true, language: "Portuguese", currencyCode: "STN", callingCode: "+239" },
  { code: "SN", name: "Senegal", capital: "Dakar", flag: "🇸🇳", continent: "Africa", lat: 14.7, lng: -17.4, population: 19366500, area: 196722, landlocked: false, island: false, language: "French", currencyCode: "XOF", callingCode: "+221" },
  { code: "SC", name: "Seychelles", capital: "Victoria", flag: "🇸🇨", continent: "Africa", lat: -4.6, lng: 55.5, population: 134959, area: 459, landlocked: false, island: true, language: "French", currencyCode: "SCR", callingCode: "+248" },
  { code: "SL", name: "Sierra Leone", capital: "Freetown", flag: "🇸🇱", continent: "Africa", lat: 8.5, lng: -13.2, population: 8996740, area: 71740, landlocked: false, island: false, language: "English", currencyCode: "SLL", callingCode: "+232" },
  { code: "SO", name: "Somalia", capital: "Mogadishu", flag: "🇸🇴", continent: "Africa", lat: 2.1, lng: 45.3, population: 20305900, area: 637657, landlocked: false, island: false, language: "Somali", currencyCode: "SOS", callingCode: "+252" },
  { code: "ZA", name: "South Africa", capital: "Pretoria", flag: "🇿🇦", continent: "Africa", lat: -25.7, lng: 28.2, population: 65453100, area: 1221037, landlocked: false, island: false, language: "Zulu", currencyCode: "ZAR", callingCode: "+27" },
  { code: "SS", name: "South Sudan", capital: "Juba", flag: "🇸🇸", continent: "Africa", lat: 4.9, lng: 31.6, population: 12436000, area: 619745, landlocked: true, island: false, language: "English", currencyCode: "SSP", callingCode: "+211" },
  { code: "SD", name: "Sudan", capital: "Khartoum", flag: "🇸🇩", continent: "Africa", lat: 15.6, lng: 32.5, population: 53282700, area: 1886068, landlocked: false, island: false, language: "Arabic", currencyCode: "SDG", callingCode: "+249" },
  { code: "TZ", name: "Tanzania", capital: "Dodoma", flag: "🇹🇿", continent: "Africa", lat: -6.2, lng: 35.7, population: 72563800, area: 945087, landlocked: false, island: false, language: "Swahili", currencyCode: "TZS", callingCode: "+255" },
  { code: "TG", name: "Togo", capital: "Lomé", flag: "🇹🇬", continent: "Africa", lat: 6.1, lng: 1.2, population: 9930920, area: 56785, landlocked: false, island: false, language: "French", currencyCode: "XOF", callingCode: "+228" },
  { code: "TN", name: "Tunisia", capital: "Tunis", flag: "🇹🇳", continent: "Africa", lat: 36.8, lng: 10.2, population: 12415100, area: 163610, landlocked: false, island: false, language: "Arabic", currencyCode: "TND", callingCode: "+216" },
  { code: "UG", name: "Uganda", capital: "Kampala", flag: "🇺🇬", continent: "Africa", lat: 0.3, lng: 32.6, population: 52761500, area: 241551, landlocked: true, island: false, language: "English", currencyCode: "UGX", callingCode: "+256" },
  { code: "ZM", name: "Zambia", capital: "Lusaka", flag: "🇿🇲", continent: "Africa", lat: -15.4, lng: 28.3, population: 22521900, area: 752618, landlocked: true, island: false, language: "English", currencyCode: "ZMW", callingCode: "+260" },
  { code: "ZW", name: "Zimbabwe", capital: "Harare", flag: "🇿🇼", continent: "Africa", lat: -17.8, lng: 31.0, population: 17273600, area: 390757, landlocked: true, island: false, language: "English", currencyCode: "ZWL", callingCode: "+263" },
];

// ---------------------------------------------------------------------------
// ASIA (48 countries + Taiwan, Palestine)
// ---------------------------------------------------------------------------
const ASIA: Country[] = [
  { code: "AF", name: "Afghanistan", capital: "Kabul", flag: "🇦🇫", continent: "Asia", lat: 34.5, lng: 69.2, population: 45047100, area: 652230, landlocked: true, island: false, language: "Pashto", currencyCode: "AFN", callingCode: "+93" },
  { code: "AM", name: "Armenia", capital: "Yerevan", flag: "🇦🇲", continent: "Asia", lat: 40.2, lng: 44.5, population: 2930920, area: 29743, landlocked: true, island: false, language: "Armenian", currencyCode: "AMD", callingCode: "+374" },
  { code: "AZ", name: "Azerbaijan", capital: "Baku", flag: "🇦🇿", continent: "Asia", lat: 40.4, lng: 49.9, population: 10454900, area: 86600, landlocked: false, island: false, language: "Azerbaijani", currencyCode: "AZN", callingCode: "+994" },
  { code: "BH", name: "Bahrain", capital: "Manama", flag: "🇧🇭", continent: "Asia", lat: 26.2, lng: 50.6, population: 1685000, area: 778, landlocked: false, island: true, language: "Arabic", currencyCode: "BHD", callingCode: "+973" },
  { code: "BD", name: "Bangladesh", capital: "Dhaka", flag: "🇧🇩", continent: "Asia", lat: 23.7, lng: 90.4, population: 177818000, area: 147570, landlocked: false, island: false, language: "Bengali", currencyCode: "BDT", callingCode: "+880" },
  { code: "BT", name: "Bhutan", capital: "Thimphu", flag: "🇧🇹", continent: "Asia", lat: 27.5, lng: 89.6, population: 802214, area: 38394, landlocked: true, island: false, language: "Dzongkha", currencyCode: "BTN", callingCode: "+975" },
  { code: "BN", name: "Brunei", capital: "Bandar Seri Begawan", flag: "🇧🇳", continent: "Asia", lat: 4.9, lng: 115.0, population: 469775, area: 5765, landlocked: false, island: false, language: "Malay", currencyCode: "BND", callingCode: "+673" },
  { code: "KH", name: "Cambodia", capital: "Phnom Penh", flag: "🇰🇭", continent: "Asia", lat: 11.6, lng: 104.9, population: 18051200, area: 181035, landlocked: false, island: false, language: "Khmer", currencyCode: "KHR", callingCode: "+855" },
  { code: "CN", name: "China", capital: "Beijing", flag: "🇨🇳", continent: "Asia", lat: 39.9, lng: 116.4, population: 1412910000, area: 9596960, landlocked: false, island: false, language: "Mandarin", currencyCode: "CNY", callingCode: "+86" },
  { code: "CY", name: "Cyprus", capital: "Nicosia", flag: "🇨🇾", continent: "Asia", lat: 35.2, lng: 33.4, population: 1382330, area: 9251, landlocked: false, island: true, language: "Greek", currencyCode: "EUR", callingCode: "+357" },
  { code: "GE", name: "Georgia", capital: "Tbilisi", flag: "🇬🇪", continent: "Asia", lat: 41.7, lng: 44.8, population: 3804640, area: 69700, landlocked: false, island: false, language: "Georgian", currencyCode: "GEL", callingCode: "+995" },
  { code: "IN", name: "India", capital: "New Delhi", flag: "🇮🇳", continent: "Asia", lat: 28.6, lng: 77.2, population: 1476630000, area: 3287263, landlocked: false, island: false, language: "Hindi", currencyCode: "INR", callingCode: "+91" },
  { code: "ID", name: "Indonesia", capital: "Jakarta", flag: "🇮🇩", continent: "Asia", lat: -6.2, lng: 106.8, population: 287887000, area: 1904569, landlocked: false, island: true, language: "Indonesian", currencyCode: "IDR", callingCode: "+62" },
  { code: "IR", name: "Iran", capital: "Tehran", flag: "🇮🇷", continent: "Asia", lat: 35.7, lng: 51.4, population: 93168500, area: 1648195, landlocked: false, island: false, language: "Persian", currencyCode: "IRR", callingCode: "+98" },
  { code: "IQ", name: "Iraq", capital: "Baghdad", flag: "🇮🇶", continent: "Asia", lat: 33.3, lng: 44.4, population: 48007400, area: 438317, landlocked: false, island: false, language: "Arabic", currencyCode: "IQD", callingCode: "+964" },
  { code: "IL", name: "Israel", capital: "Jerusalem", flag: "🇮🇱", continent: "Asia", lat: 31.8, lng: 35.2, population: 9647690, area: 20770, landlocked: false, island: false, language: "Hebrew", currencyCode: "ILS", callingCode: "+972" },
  { code: "JP", name: "Japan", capital: "Tokyo", flag: "🇯🇵", continent: "Asia", lat: 35.7, lng: 139.7, population: 122428000, area: 377930, landlocked: false, island: true, language: "Japanese", currencyCode: "JPY", callingCode: "+81" },
  { code: "JO", name: "Jordan", capital: "Amman", flag: "🇯🇴", continent: "Asia", lat: 31.9, lng: 35.9, population: 11589500, area: 89342, landlocked: false, island: false, language: "Arabic", currencyCode: "JOD", callingCode: "+962" },
  { code: "KZ", name: "Kazakhstan", capital: "Astana", flag: "🇰🇿", continent: "Asia", lat: 51.2, lng: 71.5, population: 21083600, area: 2724900, landlocked: true, island: false, language: "Kazakh", currencyCode: "KZT", callingCode: "+7" },
  { code: "KW", name: "Kuwait", capital: "Kuwait City", flag: "🇰🇼", continent: "Asia", lat: 29.4, lng: 47.9, population: 5102770, area: 17818, landlocked: false, island: false, language: "Arabic", currencyCode: "KWD", callingCode: "+965" },
  { code: "KG", name: "Kyrgyzstan", capital: "Bishkek", flag: "🇰🇬", continent: "Asia", lat: 42.9, lng: 74.6, population: 7400460, area: 199951, landlocked: true, island: false, language: "Kyrgyz", currencyCode: "KGS", callingCode: "+996" },
  { code: "LA", name: "Laos", capital: "Vientiane", flag: "🇱🇦", continent: "Asia", lat: 17.9, lng: 102.6, population: 7974020, area: 236800, landlocked: true, island: false, language: "Lao", currencyCode: "LAK", callingCode: "+856" },
  { code: "LB", name: "Lebanon", capital: "Beirut", flag: "🇱🇧", continent: "Asia", lat: 33.9, lng: 35.5, population: 5897470, area: 10452, landlocked: false, island: false, language: "Arabic", currencyCode: "LBP", callingCode: "+961" },
  { code: "MY", name: "Malaysia", capital: "Kuala Lumpur", flag: "🇲🇾", continent: "Asia", lat: 3.1, lng: 101.7, population: 36385100, area: 329847, landlocked: false, island: false, language: "Malay", currencyCode: "MYR", callingCode: "+60" },
  { code: "MV", name: "Maldives", capital: "Malé", flag: "🇲🇻", continent: "Asia", lat: 4.2, lng: 73.5, population: 531517, area: 298, landlocked: false, island: true, language: "Dhivehi", currencyCode: "MVR", callingCode: "+960" },
  { code: "MN", name: "Mongolia", capital: "Ulaanbaatar", flag: "🇲🇳", continent: "Asia", lat: 47.9, lng: 106.9, population: 3556800, area: 1564116, landlocked: true, island: false, language: "Mongolian", currencyCode: "MNT", callingCode: "+976" },
  { code: "MM", name: "Myanmar", capital: "Naypyidaw", flag: "🇲🇲", continent: "Asia", lat: 19.8, lng: 96.2, population: 55184800, area: 676578, landlocked: false, island: false, language: "Burmese", currencyCode: "MMK", callingCode: "+95" },
  { code: "NP", name: "Nepal", capital: "Kathmandu", flag: "🇳🇵", continent: "Asia", lat: 27.7, lng: 85.3, population: 29629400, area: 147181, landlocked: true, island: false, language: "Nepali", currencyCode: "NPR", callingCode: "+977" },
  { code: "KP", name: "North Korea", capital: "Pyongyang", flag: "🇰🇵", continent: "Asia", lat: 39.0, lng: 125.8, population: 26633700, area: 120538, landlocked: false, island: false, language: "Korean", currencyCode: "KPW", callingCode: "+850" },
  { code: "OM", name: "Oman", capital: "Muscat", flag: "🇴🇲", continent: "Asia", lat: 23.6, lng: 58.6, population: 5671460, area: 309500, landlocked: false, island: false, language: "Arabic", currencyCode: "OMR", callingCode: "+968" },
  { code: "PK", name: "Pakistan", capital: "Islamabad", flag: "🇵🇰", continent: "Asia", lat: 33.7, lng: 73.1, population: 259300000, area: 881913, landlocked: false, island: false, language: "Urdu", currencyCode: "PKR", callingCode: "+92" },
  { code: "PH", name: "Philippines", capital: "Manila", flag: "🇵🇭", continent: "Asia", lat: 14.6, lng: 121.0, population: 117724000, area: 300000, landlocked: false, island: true, language: "Filipino", currencyCode: "PHP", callingCode: "+63" },
  { code: "QA", name: "Qatar", capital: "Doha", flag: "🇶🇦", continent: "Asia", lat: 25.3, lng: 51.5, population: 3173560, area: 11586, landlocked: false, island: false, language: "Arabic", currencyCode: "QAR", callingCode: "+974" },
  { code: "SA", name: "Saudi Arabia", capital: "Riyadh", flag: "🇸🇦", continent: "Asia", lat: 24.7, lng: 46.7, population: 35165800, area: 2149690, landlocked: false, island: false, language: "Arabic", currencyCode: "SAR", callingCode: "+966" },
  { code: "SG", name: "Singapore", capital: "Singapore", flag: "🇸🇬", continent: "Asia", lat: 1.3, lng: 103.8, population: 5905750, area: 728, landlocked: false, island: true, language: "English", currencyCode: "SGD", callingCode: "+65" },
  { code: "KR", name: "South Korea", capital: "Seoul", flag: "🇰🇷", continent: "Asia", lat: 37.6, lng: 127.0, population: 51600400, area: 100210, landlocked: false, island: false, language: "Korean", currencyCode: "KRW", callingCode: "+82" },
  { code: "LK", name: "Sri Lanka", capital: "Sri Jayawardenepura Kotte", flag: "🇱🇰", continent: "Asia", lat: 6.9, lng: 79.9, population: 23348300, area: 65610, landlocked: false, island: true, language: "Sinhala", currencyCode: "LKR", callingCode: "+94" },
  { code: "SY", name: "Syria", capital: "Damascus", flag: "🇸🇾", continent: "Asia", lat: 33.5, lng: 36.3, population: 26472500, area: 185180, landlocked: false, island: false, language: "Arabic", currencyCode: "SYP", callingCode: "+963" },
  { code: "TW", name: "Taiwan", capital: "Taipei", flag: "🇹🇼", continent: "Asia", lat: 25.0, lng: 121.5, population: 23011300, area: 36193, landlocked: false, island: true, language: "Mandarin", currencyCode: "TWD", callingCode: "+886" },
  { code: "TJ", name: "Tajikistan", capital: "Dushanbe", flag: "🇹🇯", continent: "Asia", lat: 38.6, lng: 68.8, population: 10978600, area: 143100, landlocked: true, island: false, language: "Tajik", currencyCode: "TJS", callingCode: "+992" },
  { code: "TH", name: "Thailand", capital: "Bangkok", flag: "🇹🇭", continent: "Asia", lat: 13.8, lng: 100.5, population: 71559600, area: 513120, landlocked: false, island: false, language: "Thai", currencyCode: "THB", callingCode: "+66" },
  { code: "TL", name: "Timor-Leste", capital: "Dili", flag: "🇹🇱", continent: "Asia", lat: -8.6, lng: 125.6, population: 1400000, area: 14874, landlocked: false, island: true, language: "Tetum", currencyCode: "USD", callingCode: "+670" },
  { code: "TR", name: "Turkey", capital: "Ankara", flag: "🇹🇷", continent: "Asia", lat: 39.9, lng: 32.9, population: 87926100, area: 783356, landlocked: false, island: false, language: "Turkish", currencyCode: "TRY", callingCode: "+90" },
  { code: "TM", name: "Turkmenistan", capital: "Ashgabat", flag: "🇹🇲", continent: "Asia", lat: 37.9, lng: 58.4, population: 7736630, area: 488100, landlocked: true, island: false, language: "Turkmen", currencyCode: "TMT", callingCode: "+993" },
  { code: "AE", name: "United Arab Emirates", capital: "Abu Dhabi", flag: "🇦🇪", continent: "Asia", lat: 24.5, lng: 54.4, population: 11574700, area: 83600, landlocked: false, island: false, language: "Arabic", currencyCode: "AED", callingCode: "+971" },
  { code: "UZ", name: "Uzbekistan", capital: "Tashkent", flag: "🇺🇿", continent: "Asia", lat: 41.3, lng: 69.3, population: 37724200, area: 447400, landlocked: true, island: false, language: "Uzbek", currencyCode: "UZS", callingCode: "+998" },
  { code: "VN", name: "Vietnam", capital: "Hanoi", flag: "🇻🇳", continent: "Asia", lat: 21.0, lng: 105.8, population: 102177000, area: 331212, landlocked: false, island: false, language: "Vietnamese", currencyCode: "VND", callingCode: "+84" },
  { code: "YE", name: "Yemen", capital: "Sana'a", flag: "🇾🇪", continent: "Asia", lat: 15.4, lng: 44.2, population: 42961700, area: 527968, landlocked: false, island: false, language: "Arabic", currencyCode: "YER", callingCode: "+967" },
  // Palestinian territory (observer state)
  { code: "PS", name: "Palestine", capital: "Ramallah", flag: "🇵🇸", continent: "Asia", lat: 31.9, lng: 35.2, population: 5692790, area: 6220, landlocked: false, island: false, language: "Arabic", currencyCode: "ILS", callingCode: "+970" },
];

// ---------------------------------------------------------------------------
// EUROPE (44 countries + Kosovo + Vatican City)
// ---------------------------------------------------------------------------
const EUROPE: Country[] = [
  { code: "AL", name: "Albania", capital: "Tirana", flag: "🇦🇱", continent: "Europe", lat: 41.3, lng: 19.8, population: 2751020, area: 28748, landlocked: false, island: false, language: "Albanian", currencyCode: "ALL", callingCode: "+355" },
  { code: "AD", name: "Andorra", capital: "Andorra la Vella", flag: "🇦🇩", continent: "Europe", lat: 42.5, lng: 1.5, population: 83753, area: 468, landlocked: true, island: false, language: "Catalan", currencyCode: "EUR", callingCode: "+376" },
  { code: "AT", name: "Austria", capital: "Vienna", flag: "🇦🇹", continent: "Europe", lat: 48.2, lng: 16.4, population: 9107270, area: 83871, landlocked: true, island: false, language: "German", currencyCode: "EUR", callingCode: "+43" },
  { code: "BY", name: "Belarus", capital: "Minsk", flag: "🇧🇾", continent: "Europe", lat: 53.9, lng: 27.6, population: 8937020, area: 207600, landlocked: true, island: false, language: "Belarusian", currencyCode: "BYN", callingCode: "+375" },
  { code: "BE", name: "Belgium", capital: "Brussels", flag: "🇧🇪", continent: "Europe", lat: 50.8, lng: 4.3, population: 11774600, area: 30528, landlocked: false, island: false, language: "Dutch", currencyCode: "EUR", callingCode: "+32" },
  { code: "BA", name: "Bosnia and Herzegovina", capital: "Sarajevo", flag: "🇧🇦", continent: "Europe", lat: 43.9, lng: 18.4, population: 3114240, area: 51197, landlocked: false, island: false, language: "Bosnian", currencyCode: "BAM", callingCode: "+387" },
  { code: "BG", name: "Bulgaria", capital: "Sofia", flag: "🇧🇬", continent: "Europe", lat: 42.7, lng: 23.3, population: 6667660, area: 110879, landlocked: false, island: false, language: "Bulgarian", currencyCode: "BGN", callingCode: "+359" },
  { code: "HR", name: "Croatia", capital: "Zagreb", flag: "🇭🇷", continent: "Europe", lat: 45.8, lng: 16.0, population: 3822340, area: 56594, landlocked: false, island: false, language: "Croatian", currencyCode: "EUR", callingCode: "+385" },
  { code: "CZ", name: "Czech Republic", capital: "Prague", flag: "🇨🇿", continent: "Europe", lat: 50.1, lng: 14.4, population: 10527800, area: 78866, landlocked: true, island: false, language: "Czech", currencyCode: "CZK", callingCode: "+420" },
  { code: "DK", name: "Denmark", capital: "Copenhagen", flag: "🇩🇰", continent: "Europe", lat: 55.7, lng: 12.6, population: 6023520, area: 42924, landlocked: false, island: false, language: "Danish", currencyCode: "DKK", callingCode: "+45" },
  { code: "EE", name: "Estonia", capital: "Tallinn", flag: "🇪🇪", continent: "Europe", lat: 59.4, lng: 24.7, population: 1331060, area: 45228, landlocked: false, island: false, language: "Estonian", currencyCode: "EUR", callingCode: "+372" },
  { code: "FI", name: "Finland", capital: "Helsinki", flag: "🇫🇮", continent: "Europe", lat: 60.2, lng: 24.9, population: 5621740, area: 338145, landlocked: false, island: false, language: "Finnish", currencyCode: "EUR", callingCode: "+358" },
  { code: "FR", name: "France", capital: "Paris", flag: "🇫🇷", continent: "Europe", lat: 48.9, lng: 2.3, population: 66746400, area: 551695, landlocked: false, island: false, language: "French", currencyCode: "EUR", callingCode: "+33" },
  { code: "DE", name: "Germany", capital: "Berlin", flag: "🇩🇪", continent: "Europe", lat: 52.5, lng: 13.4, population: 83644300, area: 357114, landlocked: false, island: false, language: "German", currencyCode: "EUR", callingCode: "+49" },
  { code: "GR", name: "Greece", capital: "Athens", flag: "🇬🇷", continent: "Europe", lat: 37.9, lng: 23.7, population: 9897120, area: 131957, landlocked: false, island: false, language: "Greek", currencyCode: "EUR", callingCode: "+30" },
  { code: "HU", name: "Hungary", capital: "Budapest", flag: "🇭🇺", continent: "Europe", lat: 47.5, lng: 19.0, population: 9585820, area: 93028, landlocked: true, island: false, language: "Hungarian", currencyCode: "HUF", callingCode: "+36" },
  { code: "IS", name: "Iceland", capital: "Reykjavik", flag: "🇮🇸", continent: "Europe", lat: 64.1, lng: -21.9, population: 402329, area: 103000, landlocked: false, island: true, language: "Icelandic", currencyCode: "ISK", callingCode: "+354" },
  { code: "IE", name: "Ireland", capital: "Dublin", flag: "🇮🇪", continent: "Europe", lat: 53.3, lng: -6.3, population: 5356950, area: 70273, landlocked: false, island: true, language: "English", currencyCode: "EUR", callingCode: "+353" },
  { code: "IT", name: "Italy", capital: "Rome", flag: "🇮🇹", continent: "Europe", lat: 41.9, lng: 12.5, population: 58926200, area: 301340, landlocked: false, island: false, language: "Italian", currencyCode: "EUR", callingCode: "+39" },
  { code: "XK", name: "Kosovo", capital: "Pristina", flag: "🇽🇰", continent: "Europe", lat: 42.7, lng: 21.2, population: 1800000, area: 10887, landlocked: true, island: false, language: "Albanian", currencyCode: "EUR", callingCode: "+383" },
  { code: "LV", name: "Latvia", capital: "Riga", flag: "🇱🇻", continent: "Europe", lat: 57.0, lng: 24.1, population: 1835940, area: 64589, landlocked: false, island: false, language: "Latvian", currencyCode: "EUR", callingCode: "+371" },
  { code: "LI", name: "Liechtenstein", capital: "Vaduz", flag: "🇱🇮", continent: "Europe", lat: 47.1, lng: 9.5, population: 40368, area: 160, landlocked: true, island: false, language: "German", currencyCode: "CHF", callingCode: "+423" },
  { code: "LT", name: "Lithuania", capital: "Vilnius", flag: "🇱🇹", continent: "Europe", lat: 54.7, lng: 25.3, population: 2797340, area: 65300, landlocked: false, island: false, language: "Lithuanian", currencyCode: "EUR", callingCode: "+370" },
  { code: "LU", name: "Luxembourg", capital: "Luxembourg City", flag: "🇱🇺", continent: "Europe", lat: 49.6, lng: 6.1, population: 687448, area: 2586, landlocked: true, island: false, language: "Luxembourgish", currencyCode: "EUR", callingCode: "+352" },
  { code: "MT", name: "Malta", capital: "Valletta", flag: "🇲🇹", continent: "Europe", lat: 35.9, lng: 14.5, population: 549011, area: 316, landlocked: false, island: true, language: "Maltese", currencyCode: "EUR", callingCode: "+356" },
  { code: "MD", name: "Moldova", capital: "Chișinău", flag: "🇲🇩", continent: "Europe", lat: 47.0, lng: 28.8, population: 2961250, area: 33846, landlocked: true, island: false, language: "Romanian", currencyCode: "MDL", callingCode: "+373" },
  { code: "MC", name: "Monaco", capital: "Monaco", flag: "🇲🇨", continent: "Europe", lat: 43.7, lng: 7.4, population: 38087, area: 2, landlocked: false, island: false, language: "French", currencyCode: "EUR", callingCode: "+377" },
  { code: "ME", name: "Montenegro", capital: "Podgorica", flag: "🇲🇪", continent: "Europe", lat: 42.4, lng: 19.3, population: 626233, area: 13812, landlocked: false, island: false, language: "Montenegrin", currencyCode: "EUR", callingCode: "+382" },
  { code: "NL", name: "Netherlands", capital: "Amsterdam", flag: "🇳🇱", continent: "Europe", lat: 52.4, lng: 4.9, population: 18448800, area: 41543, landlocked: false, island: false, language: "Dutch", currencyCode: "EUR", callingCode: "+31" },
  { code: "MK", name: "North Macedonia", capital: "Skopje", flag: "🇲🇰", continent: "Europe", lat: 42.0, lng: 21.4, population: 1804060, area: 25713, landlocked: true, island: false, language: "Macedonian", currencyCode: "MKD", callingCode: "+389" },
  { code: "NO", name: "Norway", capital: "Oslo", flag: "🇳🇴", continent: "Europe", lat: 59.9, lng: 10.7, population: 5652990, area: 385207, landlocked: false, island: false, language: "Norwegian", currencyCode: "NOK", callingCode: "+47" },
  { code: "PL", name: "Poland", capital: "Warsaw", flag: "🇵🇱", continent: "Europe", lat: 52.2, lng: 21.0, population: 37843200, area: 312696, landlocked: false, island: false, language: "Polish", currencyCode: "PLN", callingCode: "+48" },
  { code: "PT", name: "Portugal", capital: "Lisbon", flag: "🇵🇹", continent: "Europe", lat: 38.7, lng: -9.1, population: 10395400, area: 92212, landlocked: false, island: false, language: "Portuguese", currencyCode: "EUR", callingCode: "+351" },
  { code: "RO", name: "Romania", capital: "Bucharest", flag: "🇷🇴", continent: "Europe", lat: 44.4, lng: 26.1, population: 18800600, area: 238397, landlocked: false, island: false, language: "Romanian", currencyCode: "RON", callingCode: "+40" },
  { code: "RU", name: "Russia", capital: "Moscow", flag: "🇷🇺", continent: "Europe", lat: 55.8, lng: 37.6, population: 143394000, area: 17098242, landlocked: false, island: false, language: "Russian", currencyCode: "RUB", callingCode: "+7" },
  { code: "SM", name: "San Marino", capital: "San Marino", flag: "🇸🇲", continent: "Europe", lat: 43.9, lng: 12.4, population: 33605, area: 61, landlocked: true, island: false, language: "Italian", currencyCode: "EUR", callingCode: "+378" },
  { code: "RS", name: "Serbia", capital: "Belgrade", flag: "🇷🇸", continent: "Europe", lat: 44.8, lng: 20.5, population: 6641960, area: 77474, landlocked: true, island: false, language: "Serbian", currencyCode: "RSD", callingCode: "+381" },
  { code: "SK", name: "Slovakia", capital: "Bratislava", flag: "🇸🇰", continent: "Europe", lat: 48.1, lng: 17.1, population: 5451340, area: 49035, landlocked: true, island: false, language: "Slovak", currencyCode: "EUR", callingCode: "+421" },
  { code: "SI", name: "Slovenia", capital: "Ljubljana", flag: "🇸🇮", continent: "Europe", lat: 46.1, lng: 14.5, population: 2114570, area: 20273, landlocked: false, island: false, language: "Slovenian", currencyCode: "EUR", callingCode: "+386" },
  { code: "ES", name: "Spain", capital: "Madrid", flag: "🇪🇸", continent: "Europe", lat: 40.4, lng: -3.7, population: 47850800, area: 505990, landlocked: false, island: false, language: "Spanish", currencyCode: "EUR", callingCode: "+34" },
  { code: "SE", name: "Sweden", capital: "Stockholm", flag: "🇸🇪", continent: "Europe", lat: 59.3, lng: 18.1, population: 10701000, area: 450295, landlocked: false, island: false, language: "Swedish", currencyCode: "SEK", callingCode: "+46" },
  { code: "CH", name: "Switzerland", capital: "Bern", flag: "🇨🇭", continent: "Europe", lat: 46.9, lng: 7.4, population: 9007800, area: 41285, landlocked: true, island: false, language: "German", currencyCode: "CHF", callingCode: "+41" },
  { code: "UA", name: "Ukraine", capital: "Kyiv", flag: "🇺🇦", continent: "Europe", lat: 50.4, lng: 30.5, population: 39535800, area: 603550, landlocked: false, island: false, language: "Ukrainian", currencyCode: "UAH", callingCode: "+380" },
  { code: "GB", name: "United Kingdom", capital: "London", flag: "🇬🇧", continent: "Europe", lat: 51.5, lng: -0.1, population: 69931500, area: 242900, landlocked: false, island: true, language: "English", currencyCode: "GBP", callingCode: "+44" },
  { code: "VA", name: "Vatican City", capital: "Vatican City", flag: "🇻🇦", continent: "Europe", lat: 41.9, lng: 12.5, population: 506, area: 1, landlocked: true, island: false, language: "Italian", currencyCode: "EUR", callingCode: "+379" },
];

// ---------------------------------------------------------------------------
// NORTH AMERICA (23 countries)
// ---------------------------------------------------------------------------
const NORTH_AMERICA: Country[] = [
  { code: "AG", name: "Antigua and Barbuda", capital: "Saint John's", flag: "🇦🇬", continent: "North America", lat: 17.1, lng: -61.8, population: 94626, area: 442, landlocked: false, island: true, language: "English", currencyCode: "XCD", callingCode: "+1-268" },
  { code: "BS", name: "Bahamas", capital: "Nassau", flag: "🇧🇸", continent: "North America", lat: 25.1, lng: -77.4, population: 404628, area: 13943, landlocked: false, island: true, language: "English", currencyCode: "BSD", callingCode: "+1-242" },
  { code: "BB", name: "Barbados", capital: "Bridgetown", flag: "🇧🇧", continent: "North America", lat: 13.1, lng: -59.6, population: 282724, area: 431, landlocked: false, island: true, language: "English", currencyCode: "BBD", callingCode: "+1-246" },
  { code: "BZ", name: "Belize", capital: "Belmopan", flag: "🇧🇿", continent: "North America", lat: 17.3, lng: -88.8, population: 428644, area: 22966, landlocked: false, island: false, language: "English", currencyCode: "BZD", callingCode: "+501" },
  { code: "CA", name: "Canada", capital: "Ottawa", flag: "🇨🇦", continent: "North America", lat: 45.4, lng: -75.7, population: 40467700, area: 9984670, landlocked: false, island: false, language: "English", currencyCode: "CAD", callingCode: "+1" },
  { code: "CR", name: "Costa Rica", capital: "San José", flag: "🇨🇷", continent: "North America", lat: 9.9, lng: -84.1, population: 5174790, area: 51100, landlocked: false, island: false, language: "Spanish", currencyCode: "CRC", callingCode: "+506" },
  { code: "CU", name: "Cuba", capital: "Havana", flag: "🇨🇺", continent: "North America", lat: 23.1, lng: -82.4, population: 10892700, area: 109884, landlocked: false, island: true, language: "Spanish", currencyCode: "CUP", callingCode: "+53" },
  { code: "DM", name: "Dominica", capital: "Roseau", flag: "🇩🇲", continent: "North America", lat: 15.3, lng: -61.4, population: 65511, area: 751, landlocked: false, island: true, language: "English", currencyCode: "XCD", callingCode: "+1-767" },
  { code: "DO", name: "Dominican Republic", capital: "Santo Domingo", flag: "🇩🇴", continent: "North America", lat: 18.5, lng: -69.9, population: 11609500, area: 48671, landlocked: false, island: true, language: "Spanish", currencyCode: "DOP", callingCode: "+1-809" },
  { code: "SV", name: "El Salvador", capital: "San Salvador", flag: "🇸🇻", continent: "North America", lat: 13.7, lng: -89.2, population: 6391250, area: 21041, landlocked: false, island: false, language: "Spanish", currencyCode: "USD", callingCode: "+503" },
  { code: "GD", name: "Grenada", capital: "Saint George's", flag: "🇬🇩", continent: "North America", lat: 12.1, lng: -61.7, population: 117362, area: 344, landlocked: false, island: true, language: "English", currencyCode: "XCD", callingCode: "+1-473" },
  { code: "GT", name: "Guatemala", capital: "Guatemala City", flag: "🇬🇹", continent: "North America", lat: 14.6, lng: -90.5, population: 18968000, area: 108889, landlocked: false, island: false, language: "Spanish", currencyCode: "GTQ", callingCode: "+502" },
  { code: "HT", name: "Haiti", capital: "Port-au-Prince", flag: "🇭🇹", continent: "North America", lat: 18.5, lng: -72.3, population: 12037500, area: 27750, landlocked: false, island: true, language: "French", currencyCode: "HTG", callingCode: "+509" },
  { code: "HN", name: "Honduras", capital: "Tegucigalpa", flag: "🇭🇳", continent: "North America", lat: 14.1, lng: -87.2, population: 11184800, area: 112492, landlocked: false, island: false, language: "Spanish", currencyCode: "HNL", callingCode: "+504" },
  { code: "JM", name: "Jamaica", capital: "Kingston", flag: "🇯🇲", continent: "North America", lat: 18.0, lng: -76.8, population: 2833400, area: 10991, landlocked: false, island: true, language: "English", currencyCode: "JMD", callingCode: "+1-876" },
  { code: "MX", name: "Mexico", capital: "Mexico City", flag: "🇲🇽", continent: "North America", lat: 19.4, lng: -99.1, population: 132998000, area: 1964375, landlocked: false, island: false, language: "Spanish", currencyCode: "MXN", callingCode: "+52" },
  { code: "NI", name: "Nicaragua", capital: "Managua", flag: "🇳🇮", continent: "North America", lat: 12.1, lng: -86.3, population: 7097330, area: 130373, landlocked: false, island: false, language: "Spanish", currencyCode: "NIO", callingCode: "+505" },
  { code: "PA", name: "Panama", capital: "Panama City", flag: "🇵🇦", continent: "North America", lat: 8.9, lng: -79.5, population: 4625720, area: 75417, landlocked: false, island: false, language: "Spanish", currencyCode: "PAB", callingCode: "+507" },
  { code: "KN", name: "Saint Kitts and Nevis", capital: "Basseterre", flag: "🇰🇳", continent: "North America", lat: 17.3, lng: -62.7, population: 46992, area: 261, landlocked: false, island: true, language: "English", currencyCode: "XCD", callingCode: "+1-869" },
  { code: "LC", name: "Saint Lucia", capital: "Castries", flag: "🇱🇨", continent: "North America", lat: 14.0, lng: -61.0, population: 180488, area: 616, landlocked: false, island: true, language: "English", currencyCode: "XCD", callingCode: "+1-758" },
  { code: "VC", name: "Saint Vincent and the Grenadines", capital: "Kingstown", flag: "🇻🇨", continent: "North America", lat: 13.2, lng: -61.2, population: 99245, area: 389, landlocked: false, island: true, language: "English", currencyCode: "XCD", callingCode: "+1-784" },
  { code: "TT", name: "Trinidad and Tobago", capital: "Port of Spain", flag: "🇹🇹", continent: "North America", lat: 10.7, lng: -61.5, population: 1513270, area: 5130, landlocked: false, island: true, language: "English", currencyCode: "TTD", callingCode: "+1-868" },
  { code: "US", name: "United States", capital: "Washington, D.C.", flag: "🇺🇸", continent: "North America", lat: 38.9, lng: -77.0, population: 349035000, area: 9372610, landlocked: false, island: false, language: "English", currencyCode: "USD", callingCode: "+1" },
];

// ---------------------------------------------------------------------------
// SOUTH AMERICA (12 countries)
// ---------------------------------------------------------------------------
const SOUTH_AMERICA: Country[] = [
  { code: "AR", name: "Argentina", capital: "Buenos Aires", flag: "🇦🇷", continent: "South America", lat: -34.6, lng: -58.4, population: 46003700, area: 2780400, landlocked: false, island: false, language: "Spanish", currencyCode: "ARS", callingCode: "+54" },
  { code: "BO", name: "Bolivia", capital: "Sucre", flag: "🇧🇴", continent: "South America", lat: -19.0, lng: -65.3, population: 12749300, area: 1098581, landlocked: true, island: false, language: "Spanish", currencyCode: "BOB", callingCode: "+591" },
  { code: "BR", name: "Brazil", capital: "Brasília", flag: "🇧🇷", continent: "South America", lat: -15.8, lng: -47.9, population: 213563000, area: 8515767, landlocked: false, island: false, language: "Portuguese", currencyCode: "BRL", callingCode: "+55" },
  { code: "CL", name: "Chile", capital: "Santiago", flag: "🇨🇱", continent: "South America", lat: -33.5, lng: -70.7, population: 19945800, area: 756102, landlocked: false, island: false, language: "Spanish", currencyCode: "CLP", callingCode: "+56" },
  { code: "CO", name: "Colombia", capital: "Bogotá", flag: "🇨🇴", continent: "South America", lat: 4.7, lng: -74.1, population: 53936200, area: 1141748, landlocked: false, island: false, language: "Spanish", currencyCode: "COP", callingCode: "+57" },
  { code: "EC", name: "Ecuador", capital: "Quito", flag: "🇪🇨", continent: "South America", lat: -0.2, lng: -78.5, population: 18444500, area: 283561, landlocked: false, island: false, language: "Spanish", currencyCode: "USD", callingCode: "+593" },
  { code: "GY", name: "Guyana", capital: "Georgetown", flag: "🇬🇾", continent: "South America", lat: 6.8, lng: -58.2, population: 840890, area: 214969, landlocked: false, island: false, language: "English", currencyCode: "GYD", callingCode: "+592" },
  { code: "PY", name: "Paraguay", capital: "Asunción", flag: "🇵🇾", continent: "South America", lat: -25.3, lng: -57.6, population: 7095280, area: 406752, landlocked: true, island: false, language: "Spanish", currencyCode: "PYG", callingCode: "+595" },
  { code: "PE", name: "Peru", capital: "Lima", flag: "🇵🇪", continent: "South America", lat: -12.1, lng: -77.0, population: 34922100, area: 1285216, landlocked: false, island: false, language: "Spanish", currencyCode: "PEN", callingCode: "+51" },
  { code: "SR", name: "Suriname", capital: "Paramaribo", flag: "🇸🇷", continent: "South America", lat: 5.8, lng: -55.2, population: 645256, area: 163820, landlocked: false, island: false, language: "Dutch", currencyCode: "SRD", callingCode: "+597" },
  { code: "UY", name: "Uruguay", capital: "Montevideo", flag: "🇺🇾", continent: "South America", lat: -34.9, lng: -56.2, population: 3382540, area: 176215, landlocked: false, island: false, language: "Spanish", currencyCode: "UYU", callingCode: "+598" },
  { code: "VE", name: "Venezuela", capital: "Caracas", flag: "🇻🇪", continent: "South America", lat: 10.5, lng: -66.9, population: 28633700, area: 912050, landlocked: false, island: false, language: "Spanish", currencyCode: "VES", callingCode: "+58" },
];

// ---------------------------------------------------------------------------
// OCEANIA (14 countries)
// ---------------------------------------------------------------------------
const OCEANIA: Country[] = [
  { code: "AU", name: "Australia", capital: "Canberra", flag: "🇦🇺", continent: "Oceania", lat: -35.3, lng: 149.1, population: 27227100, area: 7692024, landlocked: false, island: false, language: "English", currencyCode: "AUD", callingCode: "+61" },
  { code: "FJ", name: "Fiji", capital: "Suva", flag: "🇫🇯", continent: "Oceania", lat: -18.1, lng: 178.4, population: 937282, area: 18274, landlocked: false, island: true, language: "English", currencyCode: "FJD", callingCode: "+679" },
  { code: "KI", name: "Kiribati", capital: "South Tarawa", flag: "🇰🇮", continent: "Oceania", lat: 1.3, lng: 173.0, population: 138445, area: 811, landlocked: false, island: true, language: "English", currencyCode: "AUD", callingCode: "+686" },
  { code: "MH", name: "Marshall Islands", capital: "Majuro", flag: "🇲🇭", continent: "Oceania", lat: 7.1, lng: 171.4, population: 35075, area: 181, landlocked: false, island: true, language: "Marshallese", currencyCode: "USD", callingCode: "+692" },
  { code: "FM", name: "Micronesia", capital: "Palikir", flag: "🇫🇲", continent: "Oceania", lat: 6.9, lng: 158.2, population: 114183, area: 702, landlocked: false, island: true, language: "English", currencyCode: "USD", callingCode: "+691" },
  { code: "NR", name: "Nauru", capital: "Yaren", flag: "🇳🇷", continent: "Oceania", lat: -0.5, lng: 166.9, population: 12101, area: 21, landlocked: false, island: true, language: "Nauruan", currencyCode: "AUD", callingCode: "+674" },
  { code: "NZ", name: "New Zealand", capital: "Wellington", flag: "🇳🇿", continent: "Oceania", lat: -41.3, lng: 174.8, population: 5287480, area: 270467, landlocked: false, island: true, language: "English", currencyCode: "NZD", callingCode: "+64" },
  { code: "PW", name: "Palau", capital: "Ngerulmud", flag: "🇵🇼", continent: "Oceania", lat: 7.5, lng: 134.6, population: 17614, area: 459, landlocked: false, island: true, language: "Palauan", currencyCode: "USD", callingCode: "+680" },
  { code: "PG", name: "Papua New Guinea", capital: "Port Moresby", flag: "🇵🇬", continent: "Oceania", lat: -9.4, lng: 147.2, population: 10947800, area: 462840, landlocked: false, island: true, language: "English", currencyCode: "PGK", callingCode: "+675" },
  { code: "WS", name: "Samoa", capital: "Apia", flag: "🇼🇸", continent: "Oceania", lat: -13.8, lng: -171.8, population: 220528, area: 2842, landlocked: false, island: true, language: "Samoan", currencyCode: "WST", callingCode: "+685" },
  { code: "SB", name: "Solomon Islands", capital: "Honiara", flag: "🇸🇧", continent: "Oceania", lat: -9.4, lng: 160.0, population: 858288, area: 28896, landlocked: false, island: true, language: "English", currencyCode: "SBD", callingCode: "+677" },
  { code: "TO", name: "Tonga", capital: "Nukuʻalofa", flag: "🇹🇴", continent: "Oceania", lat: -21.1, lng: -175.2, population: 103291, area: 747, landlocked: false, island: true, language: "Tongan", currencyCode: "TOP", callingCode: "+676" },
  { code: "TV", name: "Tuvalu", capital: "Funafuti", flag: "🇹🇻", continent: "Oceania", lat: -8.5, lng: 179.2, population: 9362, area: 26, landlocked: false, island: true, language: "Tuvaluan", currencyCode: "AUD", callingCode: "+688" },
  { code: "VU", name: "Vanuatu", capital: "Port Vila", flag: "🇻🇺", continent: "Oceania", lat: -17.7, lng: 168.3, population: 342564, area: 12189, landlocked: false, island: true, language: "Bislama", currencyCode: "VUV", callingCode: "+678" },
];

export const COUNTRIES: Country[] = [
  ...AFRICA,
  ...ASIA,
  ...EUROPE,
  ...NORTH_AMERICA,
  ...SOUTH_AMERICA,
  ...OCEANIA,
];

// ---------------------------------------------------------------------------
// Regions
// ---------------------------------------------------------------------------

const CARIBBEAN_CODES = new Set([
  "AG","BS","BB","CU","DM","DO","GD","HT","JM","KN","LC","VC","TT",
]);

export type GameMode =
  | "all"
  | "africa"
  | "europe"
  | "asia"
  | "eurasia"
  | "oceania"
  | "north america"
  | "south america"
  | "caribbean";

export const MODE_LABELS: Record<GameMode, string> = {
  all:             "World",
  africa:          "Africa",
  europe:          "Europe",
  asia:            "Asia",
  eurasia:         "Eurasia",
  oceania:         "Oceania",
  "north america": "N. America",
  "south america": "S. America",
  caribbean:       "Caribbean",
};

export const REGIONS: Record<GameMode, Country[]> = {
  all:             COUNTRIES,
  africa:          AFRICA,
  europe:          EUROPE,
  asia:            ASIA,
  eurasia:         [...EUROPE, ...ASIA],
  oceania:         OCEANIA,
  "north america": NORTH_AMERICA,
  "south america": SOUTH_AMERICA,
  caribbean:       NORTH_AMERICA.filter(c => CARIBBEAN_CODES.has(c.code)),
};
