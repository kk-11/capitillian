export type Country = {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  capital: string;
  flag: string; // emoji
  continent: string;
  lat: number;
  lng: number;
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

// ---------------------------------------------------------------------------
// AFRICA (54 countries)
// ---------------------------------------------------------------------------
const AFRICA: Country[] = [
  { code: "DZ", name: "Algeria", capital: "Algiers", flag: "🇩🇿", continent: "Africa" },
  { code: "AO", name: "Angola", capital: "Luanda", flag: "🇦🇴", continent: "Africa" },
  { code: "BJ", name: "Benin", capital: "Porto-Novo", flag: "🇧🇯", continent: "Africa" },
  { code: "BW", name: "Botswana", capital: "Gaborone", flag: "🇧🇼", continent: "Africa" },
  { code: "BF", name: "Burkina Faso", capital: "Ouagadougou", flag: "🇧🇫", continent: "Africa" },
  { code: "BI", name: "Burundi", capital: "Gitega", flag: "🇧🇮", continent: "Africa" },
  { code: "CV", name: "Cape Verde", capital: "Praia", flag: "🇨🇻", continent: "Africa" },
  { code: "CM", name: "Cameroon", capital: "Yaoundé", flag: "🇨🇲", continent: "Africa" },
  { code: "CF", name: "Central African Republic", capital: "Bangui", flag: "🇨🇫", continent: "Africa" },
  { code: "TD", name: "Chad", capital: "N'Djamena", flag: "🇹🇩", continent: "Africa" },
  { code: "KM", name: "Comoros", capital: "Moroni", flag: "🇰🇲", continent: "Africa" },
  { code: "CD", name: "DR Congo", capital: "Kinshasa", flag: "🇨🇩", continent: "Africa" },
  { code: "CG", name: "Republic of the Congo", capital: "Brazzaville", flag: "🇨🇬", continent: "Africa" },
  { code: "CI", name: "Ivory Coast", capital: "Yamoussoukro", flag: "🇨🇮", continent: "Africa" },
  { code: "DJ", name: "Djibouti", capital: "Djibouti", flag: "🇩🇯", continent: "Africa" },
  { code: "EG", name: "Egypt", capital: "Cairo", flag: "🇪🇬", continent: "Africa" },
  { code: "GQ", name: "Equatorial Guinea", capital: "Malabo", flag: "🇬🇶", continent: "Africa" },
  { code: "ER", name: "Eritrea", capital: "Asmara", flag: "🇪🇷", continent: "Africa" },
  { code: "SZ", name: "Eswatini", capital: "Mbabane", flag: "🇸🇿", continent: "Africa" },
  { code: "ET", name: "Ethiopia", capital: "Addis Ababa", flag: "🇪🇹", continent: "Africa" },
  { code: "GA", name: "Gabon", capital: "Libreville", flag: "🇬🇦", continent: "Africa" },
  { code: "GM", name: "Gambia", capital: "Banjul", flag: "🇬🇲", continent: "Africa" },
  { code: "GH", name: "Ghana", capital: "Accra", flag: "🇬🇭", continent: "Africa" },
  { code: "GN", name: "Guinea", capital: "Conakry", flag: "🇬🇳", continent: "Africa" },
  { code: "GW", name: "Guinea-Bissau", capital: "Bissau", flag: "🇬🇼", continent: "Africa" },
  { code: "KE", name: "Kenya", capital: "Nairobi", flag: "🇰🇪", continent: "Africa" },
  { code: "LS", name: "Lesotho", capital: "Maseru", flag: "🇱🇸", continent: "Africa" },
  { code: "LR", name: "Liberia", capital: "Monrovia", flag: "🇱🇷", continent: "Africa" },
  { code: "LY", name: "Libya", capital: "Tripoli", flag: "🇱🇾", continent: "Africa" },
  { code: "MG", name: "Madagascar", capital: "Antananarivo", flag: "🇲🇬", continent: "Africa" },
  { code: "MW", name: "Malawi", capital: "Lilongwe", flag: "🇲🇼", continent: "Africa" },
  { code: "ML", name: "Mali", capital: "Bamako", flag: "🇲🇱", continent: "Africa" },
  { code: "MR", name: "Mauritania", capital: "Nouakchott", flag: "🇲🇷", continent: "Africa" },
  { code: "MU", name: "Mauritius", capital: "Port Louis", flag: "🇲🇺", continent: "Africa" },
  { code: "MA", name: "Morocco", capital: "Rabat", flag: "🇲🇦", continent: "Africa" },
  { code: "MZ", name: "Mozambique", capital: "Maputo", flag: "🇲🇿", continent: "Africa" },
  { code: "NA", name: "Namibia", capital: "Windhoek", flag: "🇳🇦", continent: "Africa" },
  { code: "NE", name: "Niger", capital: "Niamey", flag: "🇳🇪", continent: "Africa" },
  { code: "NG", name: "Nigeria", capital: "Abuja", flag: "🇳🇬", continent: "Africa" },
  { code: "RW", name: "Rwanda", capital: "Kigali", flag: "🇷🇼", continent: "Africa" },
  { code: "ST", name: "São Tomé and Príncipe", capital: "São Tomé", flag: "🇸🇹", continent: "Africa" },
  { code: "SN", name: "Senegal", capital: "Dakar", flag: "🇸🇳", continent: "Africa" },
  { code: "SC", name: "Seychelles", capital: "Victoria", flag: "🇸🇨", continent: "Africa" },
  { code: "SL", name: "Sierra Leone", capital: "Freetown", flag: "🇸🇱", continent: "Africa" },
  { code: "SO", name: "Somalia", capital: "Mogadishu", flag: "🇸🇴", continent: "Africa" },
  { code: "ZA", name: "South Africa", capital: "Pretoria", flag: "🇿🇦", continent: "Africa" },
  { code: "SS", name: "South Sudan", capital: "Juba", flag: "🇸🇸", continent: "Africa" },
  { code: "SD", name: "Sudan", capital: "Khartoum", flag: "🇸🇩", continent: "Africa" },
  { code: "TZ", name: "Tanzania", capital: "Dodoma", flag: "🇹🇿", continent: "Africa" },
  { code: "TG", name: "Togo", capital: "Lomé", flag: "🇹🇬", continent: "Africa" },
  { code: "TN", name: "Tunisia", capital: "Tunis", flag: "🇹🇳", continent: "Africa" },
  { code: "UG", name: "Uganda", capital: "Kampala", flag: "🇺🇬", continent: "Africa" },
  { code: "ZM", name: "Zambia", capital: "Lusaka", flag: "🇿🇲", continent: "Africa" },
  { code: "ZW", name: "Zimbabwe", capital: "Harare", flag: "🇿🇼", continent: "Africa" },
];

// ---------------------------------------------------------------------------
// ASIA (48 countries + Taiwan, Palestine, Kosovo-adjacent)
// ---------------------------------------------------------------------------
const ASIA: Country[] = [
  { code: "AF", name: "Afghanistan", capital: "Kabul", flag: "🇦🇫", continent: "Asia" },
  { code: "AM", name: "Armenia", capital: "Yerevan", flag: "🇦🇲", continent: "Asia" },
  { code: "AZ", name: "Azerbaijan", capital: "Baku", flag: "🇦🇿", continent: "Asia" },
  { code: "BH", name: "Bahrain", capital: "Manama", flag: "🇧🇭", continent: "Asia" },
  { code: "BD", name: "Bangladesh", capital: "Dhaka", flag: "🇧🇩", continent: "Asia" },
  { code: "BT", name: "Bhutan", capital: "Thimphu", flag: "🇧🇹", continent: "Asia" },
  { code: "BN", name: "Brunei", capital: "Bandar Seri Begawan", flag: "🇧🇳", continent: "Asia" },
  { code: "KH", name: "Cambodia", capital: "Phnom Penh", flag: "🇰🇭", continent: "Asia" },
  { code: "CN", name: "China", capital: "Beijing", flag: "🇨🇳", continent: "Asia" },
  { code: "CY", name: "Cyprus", capital: "Nicosia", flag: "🇨🇾", continent: "Asia" },
  { code: "GE", name: "Georgia", capital: "Tbilisi", flag: "🇬🇪", continent: "Asia" },
  { code: "IN", name: "India", capital: "New Delhi", flag: "🇮🇳", continent: "Asia" },
  { code: "ID", name: "Indonesia", capital: "Jakarta", flag: "🇮🇩", continent: "Asia" },
  { code: "IR", name: "Iran", capital: "Tehran", flag: "🇮🇷", continent: "Asia" },
  { code: "IQ", name: "Iraq", capital: "Baghdad", flag: "🇮🇶", continent: "Asia" },
  { code: "IL", name: "Israel", capital: "Jerusalem", flag: "🇮🇱", continent: "Asia" },
  { code: "JP", name: "Japan", capital: "Tokyo", flag: "🇯🇵", continent: "Asia" },
  { code: "JO", name: "Jordan", capital: "Amman", flag: "🇯🇴", continent: "Asia" },
  { code: "KZ", name: "Kazakhstan", capital: "Astana", flag: "🇰🇿", continent: "Asia" },
  { code: "KW", name: "Kuwait", capital: "Kuwait City", flag: "🇰🇼", continent: "Asia" },
  { code: "KG", name: "Kyrgyzstan", capital: "Bishkek", flag: "🇰🇬", continent: "Asia" },
  { code: "LA", name: "Laos", capital: "Vientiane", flag: "🇱🇦", continent: "Asia" },
  { code: "LB", name: "Lebanon", capital: "Beirut", flag: "🇱🇧", continent: "Asia" },
  { code: "MY", name: "Malaysia", capital: "Kuala Lumpur", flag: "🇲🇾", continent: "Asia" },
  { code: "MV", name: "Maldives", capital: "Malé", flag: "🇲🇻", continent: "Asia" },
  { code: "MN", name: "Mongolia", capital: "Ulaanbaatar", flag: "🇲🇳", continent: "Asia" },
  { code: "MM", name: "Myanmar", capital: "Naypyidaw", flag: "🇲🇲", continent: "Asia" },
  { code: "NP", name: "Nepal", capital: "Kathmandu", flag: "🇳🇵", continent: "Asia" },
  { code: "KP", name: "North Korea", capital: "Pyongyang", flag: "🇰🇵", continent: "Asia" },
  { code: "OM", name: "Oman", capital: "Muscat", flag: "🇴🇲", continent: "Asia" },
  { code: "PK", name: "Pakistan", capital: "Islamabad", flag: "🇵🇰", continent: "Asia" },
  { code: "PH", name: "Philippines", capital: "Manila", flag: "🇵🇭", continent: "Asia" },
  { code: "QA", name: "Qatar", capital: "Doha", flag: "🇶🇦", continent: "Asia" },
  { code: "SA", name: "Saudi Arabia", capital: "Riyadh", flag: "🇸🇦", continent: "Asia" },
  { code: "SG", name: "Singapore", capital: "Singapore", flag: "🇸🇬", continent: "Asia" },
  { code: "KR", name: "South Korea", capital: "Seoul", flag: "🇰🇷", continent: "Asia" },
  { code: "LK", name: "Sri Lanka", capital: "Sri Jayawardenepura Kotte", flag: "🇱🇰", continent: "Asia" },
  { code: "SY", name: "Syria", capital: "Damascus", flag: "🇸🇾", continent: "Asia" },
  { code: "TW", name: "Taiwan", capital: "Taipei", flag: "🇹🇼", continent: "Asia" },
  { code: "TJ", name: "Tajikistan", capital: "Dushanbe", flag: "🇹🇯", continent: "Asia" },
  { code: "TH", name: "Thailand", capital: "Bangkok", flag: "🇹🇭", continent: "Asia" },
  { code: "TL", name: "Timor-Leste", capital: "Dili", flag: "🇹🇱", continent: "Asia" },
  { code: "TR", name: "Turkey", capital: "Ankara", flag: "🇹🇷", continent: "Asia" },
  { code: "TM", name: "Turkmenistan", capital: "Ashgabat", flag: "🇹🇲", continent: "Asia" },
  { code: "AE", name: "United Arab Emirates", capital: "Abu Dhabi", flag: "🇦🇪", continent: "Asia" },
  { code: "UZ", name: "Uzbekistan", capital: "Tashkent", flag: "🇺🇿", continent: "Asia" },
  { code: "VN", name: "Vietnam", capital: "Hanoi", flag: "🇻🇳", continent: "Asia" },
  { code: "YE", name: "Yemen", capital: "Sana'a", flag: "🇾🇪", continent: "Asia" },
  // Palestinian territory (observer state)
  { code: "PS", name: "Palestine", capital: "Ramallah", flag: "🇵🇸", continent: "Asia" },
];

// ---------------------------------------------------------------------------
// EUROPE (44 countries + Kosovo + Vatican City)
// ---------------------------------------------------------------------------
const EUROPE: Country[] = [
  { code: "AL", name: "Albania", capital: "Tirana", flag: "🇦🇱", continent: "Europe" },
  { code: "AD", name: "Andorra", capital: "Andorra la Vella", flag: "🇦🇩", continent: "Europe" },
  { code: "AT", name: "Austria", capital: "Vienna", flag: "🇦🇹", continent: "Europe" },
  { code: "BY", name: "Belarus", capital: "Minsk", flag: "🇧🇾", continent: "Europe" },
  { code: "BE", name: "Belgium", capital: "Brussels", flag: "🇧🇪", continent: "Europe" },
  { code: "BA", name: "Bosnia and Herzegovina", capital: "Sarajevo", flag: "🇧🇦", continent: "Europe" },
  { code: "BG", name: "Bulgaria", capital: "Sofia", flag: "🇧🇬", continent: "Europe" },
  { code: "HR", name: "Croatia", capital: "Zagreb", flag: "🇭🇷", continent: "Europe" },
  { code: "CZ", name: "Czech Republic", capital: "Prague", flag: "🇨🇿", continent: "Europe" },
  { code: "DK", name: "Denmark", capital: "Copenhagen", flag: "🇩🇰", continent: "Europe" },
  { code: "EE", name: "Estonia", capital: "Tallinn", flag: "🇪🇪", continent: "Europe" },
  { code: "FI", name: "Finland", capital: "Helsinki", flag: "🇫🇮", continent: "Europe" },
  { code: "FR", name: "France", capital: "Paris", flag: "🇫🇷", continent: "Europe" },
  { code: "DE", name: "Germany", capital: "Berlin", flag: "🇩🇪", continent: "Europe" },
  { code: "GR", name: "Greece", capital: "Athens", flag: "🇬🇷", continent: "Europe" },
  { code: "HU", name: "Hungary", capital: "Budapest", flag: "🇭🇺", continent: "Europe" },
  { code: "IS", name: "Iceland", capital: "Reykjavik", flag: "🇮🇸", continent: "Europe" },
  { code: "IE", name: "Ireland", capital: "Dublin", flag: "🇮🇪", continent: "Europe" },
  { code: "IT", name: "Italy", capital: "Rome", flag: "🇮🇹", continent: "Europe" },
  { code: "XK", name: "Kosovo", capital: "Pristina", flag: "🇽🇰", continent: "Europe" },
  { code: "LV", name: "Latvia", capital: "Riga", flag: "🇱🇻", continent: "Europe" },
  { code: "LI", name: "Liechtenstein", capital: "Vaduz", flag: "🇱🇮", continent: "Europe" },
  { code: "LT", name: "Lithuania", capital: "Vilnius", flag: "🇱🇹", continent: "Europe" },
  { code: "LU", name: "Luxembourg", capital: "Luxembourg City", flag: "🇱🇺", continent: "Europe" },
  { code: "MT", name: "Malta", capital: "Valletta", flag: "🇲🇹", continent: "Europe" },
  { code: "MD", name: "Moldova", capital: "Chișinău", flag: "🇲🇩", continent: "Europe" },
  { code: "MC", name: "Monaco", capital: "Monaco", flag: "🇲🇨", continent: "Europe" },
  { code: "ME", name: "Montenegro", capital: "Podgorica", flag: "🇲🇪", continent: "Europe" },
  { code: "NL", name: "Netherlands", capital: "Amsterdam", flag: "🇳🇱", continent: "Europe" },
  { code: "MK", name: "North Macedonia", capital: "Skopje", flag: "🇲🇰", continent: "Europe" },
  { code: "NO", name: "Norway", capital: "Oslo", flag: "🇳🇴", continent: "Europe" },
  { code: "PL", name: "Poland", capital: "Warsaw", flag: "🇵🇱", continent: "Europe" },
  { code: "PT", name: "Portugal", capital: "Lisbon", flag: "🇵🇹", continent: "Europe" },
  { code: "RO", name: "Romania", capital: "Bucharest", flag: "🇷🇴", continent: "Europe" },
  { code: "RU", name: "Russia", capital: "Moscow", flag: "🇷🇺", continent: "Europe" },
  { code: "SM", name: "San Marino", capital: "San Marino", flag: "🇸🇲", continent: "Europe" },
  { code: "RS", name: "Serbia", capital: "Belgrade", flag: "🇷🇸", continent: "Europe" },
  { code: "SK", name: "Slovakia", capital: "Bratislava", flag: "🇸🇰", continent: "Europe" },
  { code: "SI", name: "Slovenia", capital: "Ljubljana", flag: "🇸🇮", continent: "Europe" },
  { code: "ES", name: "Spain", capital: "Madrid", flag: "🇪🇸", continent: "Europe" },
  { code: "SE", name: "Sweden", capital: "Stockholm", flag: "🇸🇪", continent: "Europe" },
  { code: "CH", name: "Switzerland", capital: "Bern", flag: "🇨🇭", continent: "Europe" },
  { code: "UA", name: "Ukraine", capital: "Kyiv", flag: "🇺🇦", continent: "Europe" },
  { code: "GB", name: "United Kingdom", capital: "London", flag: "🇬🇧", continent: "Europe" },
  { code: "VA", name: "Vatican City", capital: "Vatican City", flag: "🇻🇦", continent: "Europe" },
];

// ---------------------------------------------------------------------------
// NORTH AMERICA (23 countries)
// ---------------------------------------------------------------------------
const NORTH_AMERICA: Country[] = [
  { code: "AG", name: "Antigua and Barbuda", capital: "Saint John's", flag: "🇦🇬", continent: "North America" },
  { code: "BS", name: "Bahamas", capital: "Nassau", flag: "🇧🇸", continent: "North America" },
  { code: "BB", name: "Barbados", capital: "Bridgetown", flag: "🇧🇧", continent: "North America" },
  { code: "BZ", name: "Belize", capital: "Belmopan", flag: "🇧🇿", continent: "North America" },
  { code: "CA", name: "Canada", capital: "Ottawa", flag: "🇨🇦", continent: "North America" },
  { code: "CR", name: "Costa Rica", capital: "San José", flag: "🇨🇷", continent: "North America" },
  { code: "CU", name: "Cuba", capital: "Havana", flag: "🇨🇺", continent: "North America" },
  { code: "DM", name: "Dominica", capital: "Roseau", flag: "🇩🇲", continent: "North America" },
  { code: "DO", name: "Dominican Republic", capital: "Santo Domingo", flag: "🇩🇴", continent: "North America" },
  { code: "SV", name: "El Salvador", capital: "San Salvador", flag: "🇸🇻", continent: "North America" },
  { code: "GD", name: "Grenada", capital: "Saint George's", flag: "🇬🇩", continent: "North America" },
  { code: "GT", name: "Guatemala", capital: "Guatemala City", flag: "🇬🇹", continent: "North America" },
  { code: "HT", name: "Haiti", capital: "Port-au-Prince", flag: "🇭🇹", continent: "North America" },
  { code: "HN", name: "Honduras", capital: "Tegucigalpa", flag: "🇭🇳", continent: "North America" },
  { code: "JM", name: "Jamaica", capital: "Kingston", flag: "🇯🇲", continent: "North America" },
  { code: "MX", name: "Mexico", capital: "Mexico City", flag: "🇲🇽", continent: "North America" },
  { code: "NI", name: "Nicaragua", capital: "Managua", flag: "🇳🇮", continent: "North America" },
  { code: "PA", name: "Panama", capital: "Panama City", flag: "🇵🇦", continent: "North America" },
  { code: "KN", name: "Saint Kitts and Nevis", capital: "Basseterre", flag: "🇰🇳", continent: "North America" },
  { code: "LC", name: "Saint Lucia", capital: "Castries", flag: "🇱🇨", continent: "North America" },
  { code: "VC", name: "Saint Vincent and the Grenadines", capital: "Kingstown", flag: "🇻🇨", continent: "North America" },
  { code: "TT", name: "Trinidad and Tobago", capital: "Port of Spain", flag: "🇹🇹", continent: "North America" },
  { code: "US", name: "United States", capital: "Washington, D.C.", flag: "🇺🇸", continent: "North America" },
];

// ---------------------------------------------------------------------------
// SOUTH AMERICA (12 countries)
// ---------------------------------------------------------------------------
const SOUTH_AMERICA: Country[] = [
  { code: "AR", name: "Argentina", capital: "Buenos Aires", flag: "🇦🇷", continent: "South America" },
  { code: "BO", name: "Bolivia", capital: "Sucre", flag: "🇧🇴", continent: "South America" },
  { code: "BR", name: "Brazil", capital: "Brasília", flag: "🇧🇷", continent: "South America" },
  { code: "CL", name: "Chile", capital: "Santiago", flag: "🇨🇱", continent: "South America" },
  { code: "CO", name: "Colombia", capital: "Bogotá", flag: "🇨🇴", continent: "South America" },
  { code: "EC", name: "Ecuador", capital: "Quito", flag: "🇪🇨", continent: "South America" },
  { code: "GY", name: "Guyana", capital: "Georgetown", flag: "🇬🇾", continent: "South America" },
  { code: "PY", name: "Paraguay", capital: "Asunción", flag: "🇵🇾", continent: "South America" },
  { code: "PE", name: "Peru", capital: "Lima", flag: "🇵🇪", continent: "South America" },
  { code: "SR", name: "Suriname", capital: "Paramaribo", flag: "🇸🇷", continent: "South America" },
  { code: "UY", name: "Uruguay", capital: "Montevideo", flag: "🇺🇾", continent: "South America" },
  { code: "VE", name: "Venezuela", capital: "Caracas", flag: "🇻🇪", continent: "South America" },
];

// ---------------------------------------------------------------------------
// OCEANIA (14 countries)
// ---------------------------------------------------------------------------
const OCEANIA: Country[] = [
  { code: "AU", name: "Australia", capital: "Canberra", flag: "🇦🇺", continent: "Oceania" },
  { code: "FJ", name: "Fiji", capital: "Suva", flag: "🇫🇯", continent: "Oceania" },
  { code: "KI", name: "Kiribati", capital: "South Tarawa", flag: "🇰🇮", continent: "Oceania" },
  { code: "MH", name: "Marshall Islands", capital: "Majuro", flag: "🇲🇭", continent: "Oceania" },
  { code: "FM", name: "Micronesia", capital: "Palikir", flag: "🇫🇲", continent: "Oceania" },
  { code: "NR", name: "Nauru", capital: "Yaren", flag: "🇳🇷", continent: "Oceania" },
  { code: "NZ", name: "New Zealand", capital: "Wellington", flag: "🇳🇿", continent: "Oceania" },
  { code: "PW", name: "Palau", capital: "Ngerulmud", flag: "🇵🇼", continent: "Oceania" },
  { code: "PG", name: "Papua New Guinea", capital: "Port Moresby", flag: "🇵🇬", continent: "Oceania" },
  { code: "WS", name: "Samoa", capital: "Apia", flag: "🇼🇸", continent: "Oceania" },
  { code: "SB", name: "Solomon Islands", capital: "Honiara", flag: "🇸🇧", continent: "Oceania" },
  { code: "TO", name: "Tonga", capital: "Nukuʻalofa", flag: "🇹🇴", continent: "Oceania" },
  { code: "TV", name: "Tuvalu", capital: "Funafuti", flag: "🇹🇻", continent: "Oceania" },
  { code: "VU", name: "Vanuatu", capital: "Port Vila", flag: "🇻🇺", continent: "Oceania" },
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
  all:             "All",
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
