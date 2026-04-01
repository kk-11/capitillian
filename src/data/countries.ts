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
  { code: "DZ", name: "Algeria", capital: "Algiers", flag: "🇩🇿", continent: "Africa", lat: 36.7, lng: 3.1 },
  { code: "AO", name: "Angola", capital: "Luanda", flag: "🇦🇴", continent: "Africa", lat: -8.8, lng: 13.2 },
  { code: "BJ", name: "Benin", capital: "Porto-Novo", flag: "🇧🇯", continent: "Africa", lat: 6.4, lng: 2.6 },
  { code: "BW", name: "Botswana", capital: "Gaborone", flag: "🇧🇼", continent: "Africa", lat: -24.7, lng: 25.9 },
  { code: "BF", name: "Burkina Faso", capital: "Ouagadougou", flag: "🇧🇫", continent: "Africa", lat: 12.4, lng: -1.5 },
  { code: "BI", name: "Burundi", capital: "Gitega", flag: "🇧🇮", continent: "Africa", lat: -3.4, lng: 29.9 },
  { code: "CV", name: "Cape Verde", capital: "Praia", flag: "🇨🇻", continent: "Africa", lat: 14.9, lng: -23.5 },
  { code: "CM", name: "Cameroon", capital: "Yaoundé", flag: "🇨🇲", continent: "Africa", lat: 3.9, lng: 11.5 },
  { code: "CF", name: "Central African Republic", capital: "Bangui", flag: "🇨🇫", continent: "Africa", lat: 4.4, lng: 18.6 },
  { code: "TD", name: "Chad", capital: "N'Djamena", flag: "🇹🇩", continent: "Africa", lat: 12.1, lng: 15.0 },
  { code: "KM", name: "Comoros", capital: "Moroni", flag: "🇰🇲", continent: "Africa", lat: -11.7, lng: 43.3 },
  { code: "CD", name: "DR Congo", capital: "Kinshasa", flag: "🇨🇩", continent: "Africa", lat: -4.3, lng: 15.3 },
  { code: "CG", name: "Republic of the Congo", capital: "Brazzaville", flag: "🇨🇬", continent: "Africa", lat: -4.3, lng: 15.3 },
  { code: "CI", name: "Ivory Coast", capital: "Yamoussoukro", flag: "🇨🇮", continent: "Africa", lat: 6.8, lng: -5.3 },
  { code: "DJ", name: "Djibouti", capital: "Djibouti", flag: "🇩🇯", continent: "Africa", lat: 11.6, lng: 43.1 },
  { code: "EG", name: "Egypt", capital: "Cairo", flag: "🇪🇬", continent: "Africa", lat: 30.1, lng: 31.2 },
  { code: "GQ", name: "Equatorial Guinea", capital: "Malabo", flag: "🇬🇶", continent: "Africa", lat: 3.8, lng: 8.8 },
  { code: "ER", name: "Eritrea", capital: "Asmara", flag: "🇪🇷", continent: "Africa", lat: 15.3, lng: 38.9 },
  { code: "SZ", name: "Eswatini", capital: "Mbabane", flag: "🇸🇿", continent: "Africa", lat: -26.3, lng: 31.1 },
  { code: "ET", name: "Ethiopia", capital: "Addis Ababa", flag: "🇪🇹", continent: "Africa", lat: 9.0, lng: 38.7 },
  { code: "GA", name: "Gabon", capital: "Libreville", flag: "🇬🇦", continent: "Africa", lat: 0.4, lng: 9.5 },
  { code: "GM", name: "Gambia", capital: "Banjul", flag: "🇬🇲", continent: "Africa", lat: 13.5, lng: -16.6 },
  { code: "GH", name: "Ghana", capital: "Accra", flag: "🇬🇭", continent: "Africa", lat: 5.6, lng: -0.2 },
  { code: "GN", name: "Guinea", capital: "Conakry", flag: "🇬🇳", continent: "Africa", lat: 9.5, lng: -13.7 },
  { code: "GW", name: "Guinea-Bissau", capital: "Bissau", flag: "🇬🇼", continent: "Africa", lat: 11.9, lng: -15.6 },
  { code: "KE", name: "Kenya", capital: "Nairobi", flag: "🇰🇪", continent: "Africa", lat: -1.3, lng: 36.8 },
  { code: "LS", name: "Lesotho", capital: "Maseru", flag: "🇱🇸", continent: "Africa", lat: -29.3, lng: 27.5 },
  { code: "LR", name: "Liberia", capital: "Monrovia", flag: "🇱🇷", continent: "Africa", lat: 6.3, lng: -10.8 },
  { code: "LY", name: "Libya", capital: "Tripoli", flag: "🇱🇾", continent: "Africa", lat: 32.9, lng: 13.2 },
  { code: "MG", name: "Madagascar", capital: "Antananarivo", flag: "🇲🇬", continent: "Africa", lat: -18.9, lng: 47.5 },
  { code: "MW", name: "Malawi", capital: "Lilongwe", flag: "🇲🇼", continent: "Africa", lat: -14.0, lng: 33.8 },
  { code: "ML", name: "Mali", capital: "Bamako", flag: "🇲🇱", continent: "Africa", lat: 12.7, lng: -8.0 },
  { code: "MR", name: "Mauritania", capital: "Nouakchott", flag: "🇲🇷", continent: "Africa", lat: 18.1, lng: -15.9 },
  { code: "MU", name: "Mauritius", capital: "Port Louis", flag: "🇲🇺", continent: "Africa", lat: -20.2, lng: 57.5 },
  { code: "MA", name: "Morocco", capital: "Rabat", flag: "🇲🇦", continent: "Africa", lat: 34.0, lng: -6.8 },
  { code: "MZ", name: "Mozambique", capital: "Maputo", flag: "🇲🇿", continent: "Africa", lat: -25.9, lng: 32.6 },
  { code: "NA", name: "Namibia", capital: "Windhoek", flag: "🇳🇦", continent: "Africa", lat: -22.6, lng: 17.1 },
  { code: "NE", name: "Niger", capital: "Niamey", flag: "🇳🇪", continent: "Africa", lat: 13.5, lng: 2.1 },
  { code: "NG", name: "Nigeria", capital: "Abuja", flag: "🇳🇬", continent: "Africa", lat: 9.1, lng: 7.2 },
  { code: "RW", name: "Rwanda", capital: "Kigali", flag: "🇷🇼", continent: "Africa", lat: -1.9, lng: 30.1 },
  { code: "ST", name: "São Tomé and Príncipe", capital: "São Tomé", flag: "🇸🇹", continent: "Africa", lat: 0.3, lng: 6.7 },
  { code: "SN", name: "Senegal", capital: "Dakar", flag: "🇸🇳", continent: "Africa", lat: 14.7, lng: -17.4 },
  { code: "SC", name: "Seychelles", capital: "Victoria", flag: "🇸🇨", continent: "Africa", lat: -4.6, lng: 55.5 },
  { code: "SL", name: "Sierra Leone", capital: "Freetown", flag: "🇸🇱", continent: "Africa", lat: 8.5, lng: -13.2 },
  { code: "SO", name: "Somalia", capital: "Mogadishu", flag: "🇸🇴", continent: "Africa", lat: 2.1, lng: 45.3 },
  { code: "ZA", name: "South Africa", capital: "Pretoria", flag: "🇿🇦", continent: "Africa", lat: -25.7, lng: 28.2 },
  { code: "SS", name: "South Sudan", capital: "Juba", flag: "🇸🇸", continent: "Africa", lat: 4.9, lng: 31.6 },
  { code: "SD", name: "Sudan", capital: "Khartoum", flag: "🇸🇩", continent: "Africa", lat: 15.6, lng: 32.5 },
  { code: "TZ", name: "Tanzania", capital: "Dodoma", flag: "🇹🇿", continent: "Africa", lat: -6.2, lng: 35.7 },
  { code: "TG", name: "Togo", capital: "Lomé", flag: "🇹🇬", continent: "Africa", lat: 6.1, lng: 1.2 },
  { code: "TN", name: "Tunisia", capital: "Tunis", flag: "🇹🇳", continent: "Africa", lat: 36.8, lng: 10.2 },
  { code: "UG", name: "Uganda", capital: "Kampala", flag: "🇺🇬", continent: "Africa", lat: 0.3, lng: 32.6 },
  { code: "ZM", name: "Zambia", capital: "Lusaka", flag: "🇿🇲", continent: "Africa", lat: -15.4, lng: 28.3 },
  { code: "ZW", name: "Zimbabwe", capital: "Harare", flag: "🇿🇼", continent: "Africa", lat: -17.8, lng: 31.0 },
];

// ---------------------------------------------------------------------------
// ASIA (48 countries + Taiwan, Palestine, Kosovo-adjacent)
// ---------------------------------------------------------------------------
const ASIA: Country[] = [
  { code: "AF", name: "Afghanistan", capital: "Kabul", flag: "🇦🇫", continent: "Asia", lat: 34.5, lng: 69.2 },
  { code: "AM", name: "Armenia", capital: "Yerevan", flag: "🇦🇲", continent: "Asia", lat: 40.2, lng: 44.5 },
  { code: "AZ", name: "Azerbaijan", capital: "Baku", flag: "🇦🇿", continent: "Asia", lat: 40.4, lng: 49.9 },
  { code: "BH", name: "Bahrain", capital: "Manama", flag: "🇧🇭", continent: "Asia", lat: 26.2, lng: 50.6 },
  { code: "BD", name: "Bangladesh", capital: "Dhaka", flag: "🇧🇩", continent: "Asia", lat: 23.7, lng: 90.4 },
  { code: "BT", name: "Bhutan", capital: "Thimphu", flag: "🇧🇹", continent: "Asia", lat: 27.5, lng: 89.6 },
  { code: "BN", name: "Brunei", capital: "Bandar Seri Begawan", flag: "🇧🇳", continent: "Asia", lat: 4.9, lng: 115.0 },
  { code: "KH", name: "Cambodia", capital: "Phnom Penh", flag: "🇰🇭", continent: "Asia", lat: 11.6, lng: 104.9 },
  { code: "CN", name: "China", capital: "Beijing", flag: "🇨🇳", continent: "Asia", lat: 39.9, lng: 116.4 },
  { code: "CY", name: "Cyprus", capital: "Nicosia", flag: "🇨🇾", continent: "Asia", lat: 35.2, lng: 33.4 },
  { code: "GE", name: "Georgia", capital: "Tbilisi", flag: "🇬🇪", continent: "Asia", lat: 41.7, lng: 44.8 },
  { code: "IN", name: "India", capital: "New Delhi", flag: "🇮🇳", continent: "Asia", lat: 28.6, lng: 77.2 },
  { code: "ID", name: "Indonesia", capital: "Jakarta", flag: "🇮🇩", continent: "Asia", lat: -6.2, lng: 106.8 },
  { code: "IR", name: "Iran", capital: "Tehran", flag: "🇮🇷", continent: "Asia", lat: 35.7, lng: 51.4 },
  { code: "IQ", name: "Iraq", capital: "Baghdad", flag: "🇮🇶", continent: "Asia", lat: 33.3, lng: 44.4 },
  { code: "IL", name: "Israel", capital: "Jerusalem", flag: "🇮🇱", continent: "Asia", lat: 31.8, lng: 35.2 },
  { code: "JP", name: "Japan", capital: "Tokyo", flag: "🇯🇵", continent: "Asia", lat: 35.7, lng: 139.7 },
  { code: "JO", name: "Jordan", capital: "Amman", flag: "🇯🇴", continent: "Asia", lat: 31.9, lng: 35.9 },
  { code: "KZ", name: "Kazakhstan", capital: "Astana", flag: "🇰🇿", continent: "Asia", lat: 51.2, lng: 71.5 },
  { code: "KW", name: "Kuwait", capital: "Kuwait City", flag: "🇰🇼", continent: "Asia", lat: 29.4, lng: 47.9 },
  { code: "KG", name: "Kyrgyzstan", capital: "Bishkek", flag: "🇰🇬", continent: "Asia", lat: 42.9, lng: 74.6 },
  { code: "LA", name: "Laos", capital: "Vientiane", flag: "🇱🇦", continent: "Asia", lat: 17.9, lng: 102.6 },
  { code: "LB", name: "Lebanon", capital: "Beirut", flag: "🇱🇧", continent: "Asia", lat: 33.9, lng: 35.5 },
  { code: "MY", name: "Malaysia", capital: "Kuala Lumpur", flag: "🇲🇾", continent: "Asia", lat: 3.1, lng: 101.7 },
  { code: "MV", name: "Maldives", capital: "Malé", flag: "🇲🇻", continent: "Asia", lat: 4.2, lng: 73.5 },
  { code: "MN", name: "Mongolia", capital: "Ulaanbaatar", flag: "🇲🇳", continent: "Asia", lat: 47.9, lng: 106.9 },
  { code: "MM", name: "Myanmar", capital: "Naypyidaw", flag: "🇲🇲", continent: "Asia", lat: 19.8, lng: 96.2 },
  { code: "NP", name: "Nepal", capital: "Kathmandu", flag: "🇳🇵", continent: "Asia", lat: 27.7, lng: 85.3 },
  { code: "KP", name: "North Korea", capital: "Pyongyang", flag: "🇰🇵", continent: "Asia", lat: 39.0, lng: 125.8 },
  { code: "OM", name: "Oman", capital: "Muscat", flag: "🇴🇲", continent: "Asia", lat: 23.6, lng: 58.6 },
  { code: "PK", name: "Pakistan", capital: "Islamabad", flag: "🇵🇰", continent: "Asia", lat: 33.7, lng: 73.1 },
  { code: "PH", name: "Philippines", capital: "Manila", flag: "🇵🇭", continent: "Asia", lat: 14.6, lng: 121.0 },
  { code: "QA", name: "Qatar", capital: "Doha", flag: "🇶🇦", continent: "Asia", lat: 25.3, lng: 51.5 },
  { code: "SA", name: "Saudi Arabia", capital: "Riyadh", flag: "🇸🇦", continent: "Asia", lat: 24.7, lng: 46.7 },
  { code: "SG", name: "Singapore", capital: "Singapore", flag: "🇸🇬", continent: "Asia", lat: 1.3, lng: 103.8 },
  { code: "KR", name: "South Korea", capital: "Seoul", flag: "🇰🇷", continent: "Asia", lat: 37.6, lng: 127.0 },
  { code: "LK", name: "Sri Lanka", capital: "Sri Jayawardenepura Kotte", flag: "🇱🇰", continent: "Asia", lat: 6.9, lng: 79.9 },
  { code: "SY", name: "Syria", capital: "Damascus", flag: "🇸🇾", continent: "Asia", lat: 33.5, lng: 36.3 },
  { code: "TW", name: "Taiwan", capital: "Taipei", flag: "🇹🇼", continent: "Asia", lat: 25.0, lng: 121.5 },
  { code: "TJ", name: "Tajikistan", capital: "Dushanbe", flag: "🇹🇯", continent: "Asia", lat: 38.6, lng: 68.8 },
  { code: "TH", name: "Thailand", capital: "Bangkok", flag: "🇹🇭", continent: "Asia", lat: 13.8, lng: 100.5 },
  { code: "TL", name: "Timor-Leste", capital: "Dili", flag: "🇹🇱", continent: "Asia", lat: -8.6, lng: 125.6 },
  { code: "TR", name: "Turkey", capital: "Ankara", flag: "🇹🇷", continent: "Asia", lat: 39.9, lng: 32.9 },
  { code: "TM", name: "Turkmenistan", capital: "Ashgabat", flag: "🇹🇲", continent: "Asia", lat: 37.9, lng: 58.4 },
  { code: "AE", name: "United Arab Emirates", capital: "Abu Dhabi", flag: "🇦🇪", continent: "Asia", lat: 24.5, lng: 54.4 },
  { code: "UZ", name: "Uzbekistan", capital: "Tashkent", flag: "🇺🇿", continent: "Asia", lat: 41.3, lng: 69.3 },
  { code: "VN", name: "Vietnam", capital: "Hanoi", flag: "🇻🇳", continent: "Asia", lat: 21.0, lng: 105.8 },
  { code: "YE", name: "Yemen", capital: "Sana'a", flag: "🇾🇪", continent: "Asia", lat: 15.4, lng: 44.2 },
  // Palestinian territory (observer state)
  { code: "PS", name: "Palestine", capital: "Ramallah", flag: "🇵🇸", continent: "Asia", lat: 31.9, lng: 35.2 },
];

// ---------------------------------------------------------------------------
// EUROPE (44 countries + Kosovo + Vatican City)
// ---------------------------------------------------------------------------
const EUROPE: Country[] = [
  { code: "AL", name: "Albania", capital: "Tirana", flag: "🇦🇱", continent: "Europe", lat: 41.3, lng: 19.8 },
  { code: "AD", name: "Andorra", capital: "Andorra la Vella", flag: "🇦🇩", continent: "Europe", lat: 42.5, lng: 1.5 },
  { code: "AT", name: "Austria", capital: "Vienna", flag: "🇦🇹", continent: "Europe", lat: 48.2, lng: 16.4 },
  { code: "BY", name: "Belarus", capital: "Minsk", flag: "🇧🇾", continent: "Europe", lat: 53.9, lng: 27.6 },
  { code: "BE", name: "Belgium", capital: "Brussels", flag: "🇧🇪", continent: "Europe", lat: 50.8, lng: 4.3 },
  { code: "BA", name: "Bosnia and Herzegovina", capital: "Sarajevo", flag: "🇧🇦", continent: "Europe", lat: 43.9, lng: 18.4 },
  { code: "BG", name: "Bulgaria", capital: "Sofia", flag: "🇧🇬", continent: "Europe", lat: 42.7, lng: 23.3 },
  { code: "HR", name: "Croatia", capital: "Zagreb", flag: "🇭🇷", continent: "Europe", lat: 45.8, lng: 16.0 },
  { code: "CZ", name: "Czech Republic", capital: "Prague", flag: "🇨🇿", continent: "Europe", lat: 50.1, lng: 14.4 },
  { code: "DK", name: "Denmark", capital: "Copenhagen", flag: "🇩🇰", continent: "Europe", lat: 55.7, lng: 12.6 },
  { code: "EE", name: "Estonia", capital: "Tallinn", flag: "🇪🇪", continent: "Europe", lat: 59.4, lng: 24.7 },
  { code: "FI", name: "Finland", capital: "Helsinki", flag: "🇫🇮", continent: "Europe", lat: 60.2, lng: 24.9 },
  { code: "FR", name: "France", capital: "Paris", flag: "🇫🇷", continent: "Europe", lat: 48.9, lng: 2.3 },
  { code: "DE", name: "Germany", capital: "Berlin", flag: "🇩🇪", continent: "Europe", lat: 52.5, lng: 13.4 },
  { code: "GR", name: "Greece", capital: "Athens", flag: "🇬🇷", continent: "Europe", lat: 37.9, lng: 23.7 },
  { code: "HU", name: "Hungary", capital: "Budapest", flag: "🇭🇺", continent: "Europe", lat: 47.5, lng: 19.0 },
  { code: "IS", name: "Iceland", capital: "Reykjavik", flag: "🇮🇸", continent: "Europe", lat: 64.1, lng: -21.9 },
  { code: "IE", name: "Ireland", capital: "Dublin", flag: "🇮🇪", continent: "Europe", lat: 53.3, lng: -6.3 },
  { code: "IT", name: "Italy", capital: "Rome", flag: "🇮🇹", continent: "Europe", lat: 41.9, lng: 12.5 },
  { code: "XK", name: "Kosovo", capital: "Pristina", flag: "🇽🇰", continent: "Europe", lat: 42.7, lng: 21.2 },
  { code: "LV", name: "Latvia", capital: "Riga", flag: "🇱🇻", continent: "Europe", lat: 57.0, lng: 24.1 },
  { code: "LI", name: "Liechtenstein", capital: "Vaduz", flag: "🇱🇮", continent: "Europe", lat: 47.1, lng: 9.5 },
  { code: "LT", name: "Lithuania", capital: "Vilnius", flag: "🇱🇹", continent: "Europe", lat: 54.7, lng: 25.3 },
  { code: "LU", name: "Luxembourg", capital: "Luxembourg City", flag: "🇱🇺", continent: "Europe", lat: 49.6, lng: 6.1 },
  { code: "MT", name: "Malta", capital: "Valletta", flag: "🇲🇹", continent: "Europe", lat: 35.9, lng: 14.5 },
  { code: "MD", name: "Moldova", capital: "Chișinău", flag: "🇲🇩", continent: "Europe", lat: 47.0, lng: 28.8 },
  { code: "MC", name: "Monaco", capital: "Monaco", flag: "🇲🇨", continent: "Europe", lat: 43.7, lng: 7.4 },
  { code: "ME", name: "Montenegro", capital: "Podgorica", flag: "🇲🇪", continent: "Europe", lat: 42.4, lng: 19.3 },
  { code: "NL", name: "Netherlands", capital: "Amsterdam", flag: "🇳🇱", continent: "Europe", lat: 52.4, lng: 4.9 },
  { code: "MK", name: "North Macedonia", capital: "Skopje", flag: "🇲🇰", continent: "Europe", lat: 42.0, lng: 21.4 },
  { code: "NO", name: "Norway", capital: "Oslo", flag: "🇳🇴", continent: "Europe", lat: 59.9, lng: 10.7 },
  { code: "PL", name: "Poland", capital: "Warsaw", flag: "🇵🇱", continent: "Europe", lat: 52.2, lng: 21.0 },
  { code: "PT", name: "Portugal", capital: "Lisbon", flag: "🇵🇹", continent: "Europe", lat: 38.7, lng: -9.1 },
  { code: "RO", name: "Romania", capital: "Bucharest", flag: "🇷🇴", continent: "Europe", lat: 44.4, lng: 26.1 },
  { code: "RU", name: "Russia", capital: "Moscow", flag: "🇷🇺", continent: "Europe", lat: 55.8, lng: 37.6 },
  { code: "SM", name: "San Marino", capital: "San Marino", flag: "🇸🇲", continent: "Europe", lat: 43.9, lng: 12.4 },
  { code: "RS", name: "Serbia", capital: "Belgrade", flag: "🇷🇸", continent: "Europe", lat: 44.8, lng: 20.5 },
  { code: "SK", name: "Slovakia", capital: "Bratislava", flag: "🇸🇰", continent: "Europe", lat: 48.1, lng: 17.1 },
  { code: "SI", name: "Slovenia", capital: "Ljubljana", flag: "🇸🇮", continent: "Europe", lat: 46.1, lng: 14.5 },
  { code: "ES", name: "Spain", capital: "Madrid", flag: "🇪🇸", continent: "Europe", lat: 40.4, lng: -3.7 },
  { code: "SE", name: "Sweden", capital: "Stockholm", flag: "🇸🇪", continent: "Europe", lat: 59.3, lng: 18.1 },
  { code: "CH", name: "Switzerland", capital: "Bern", flag: "🇨🇭", continent: "Europe", lat: 46.9, lng: 7.4 },
  { code: "UA", name: "Ukraine", capital: "Kyiv", flag: "🇺🇦", continent: "Europe", lat: 50.4, lng: 30.5 },
  { code: "GB", name: "United Kingdom", capital: "London", flag: "🇬🇧", continent: "Europe", lat: 51.5, lng: -0.1 },
  { code: "VA", name: "Vatican City", capital: "Vatican City", flag: "🇻🇦", continent: "Europe", lat: 41.9, lng: 12.5 },
];

// ---------------------------------------------------------------------------
// NORTH AMERICA (23 countries)
// ---------------------------------------------------------------------------
const NORTH_AMERICA: Country[] = [
  { code: "AG", name: "Antigua and Barbuda", capital: "Saint John's", flag: "🇦🇬", continent: "North America", lat: 17.1, lng: -61.8 },
  { code: "BS", name: "Bahamas", capital: "Nassau", flag: "🇧🇸", continent: "North America", lat: 25.1, lng: -77.4 },
  { code: "BB", name: "Barbados", capital: "Bridgetown", flag: "🇧🇧", continent: "North America", lat: 13.1, lng: -59.6 },
  { code: "BZ", name: "Belize", capital: "Belmopan", flag: "🇧🇿", continent: "North America", lat: 17.3, lng: -88.8 },
  { code: "CA", name: "Canada", capital: "Ottawa", flag: "🇨🇦", continent: "North America", lat: 45.4, lng: -75.7 },
  { code: "CR", name: "Costa Rica", capital: "San José", flag: "🇨🇷", continent: "North America", lat: 9.9, lng: -84.1 },
  { code: "CU", name: "Cuba", capital: "Havana", flag: "🇨🇺", continent: "North America", lat: 23.1, lng: -82.4 },
  { code: "DM", name: "Dominica", capital: "Roseau", flag: "🇩🇲", continent: "North America", lat: 15.3, lng: -61.4 },
  { code: "DO", name: "Dominican Republic", capital: "Santo Domingo", flag: "🇩🇴", continent: "North America", lat: 18.5, lng: -69.9 },
  { code: "SV", name: "El Salvador", capital: "San Salvador", flag: "🇸🇻", continent: "North America", lat: 13.7, lng: -89.2 },
  { code: "GD", name: "Grenada", capital: "Saint George's", flag: "🇬🇩", continent: "North America", lat: 12.1, lng: -61.7 },
  { code: "GT", name: "Guatemala", capital: "Guatemala City", flag: "🇬🇹", continent: "North America", lat: 14.6, lng: -90.5 },
  { code: "HT", name: "Haiti", capital: "Port-au-Prince", flag: "🇭🇹", continent: "North America", lat: 18.5, lng: -72.3 },
  { code: "HN", name: "Honduras", capital: "Tegucigalpa", flag: "🇭🇳", continent: "North America", lat: 14.1, lng: -87.2 },
  { code: "JM", name: "Jamaica", capital: "Kingston", flag: "🇯🇲", continent: "North America", lat: 18.0, lng: -76.8 },
  { code: "MX", name: "Mexico", capital: "Mexico City", flag: "🇲🇽", continent: "North America", lat: 19.4, lng: -99.1 },
  { code: "NI", name: "Nicaragua", capital: "Managua", flag: "🇳🇮", continent: "North America", lat: 12.1, lng: -86.3 },
  { code: "PA", name: "Panama", capital: "Panama City", flag: "🇵🇦", continent: "North America", lat: 8.9, lng: -79.5 },
  { code: "KN", name: "Saint Kitts and Nevis", capital: "Basseterre", flag: "🇰🇳", continent: "North America", lat: 17.3, lng: -62.7 },
  { code: "LC", name: "Saint Lucia", capital: "Castries", flag: "🇱🇨", continent: "North America", lat: 14.0, lng: -61.0 },
  { code: "VC", name: "Saint Vincent and the Grenadines", capital: "Kingstown", flag: "🇻🇨", continent: "North America", lat: 13.2, lng: -61.2 },
  { code: "TT", name: "Trinidad and Tobago", capital: "Port of Spain", flag: "🇹🇹", continent: "North America", lat: 10.7, lng: -61.5 },
  { code: "US", name: "United States", capital: "Washington, D.C.", flag: "🇺🇸", continent: "North America", lat: 38.9, lng: -77.0 },
];

// ---------------------------------------------------------------------------
// SOUTH AMERICA (12 countries)
// ---------------------------------------------------------------------------
const SOUTH_AMERICA: Country[] = [
  { code: "AR", name: "Argentina", capital: "Buenos Aires", flag: "🇦🇷", continent: "South America", lat: -34.6, lng: -58.4 },
  { code: "BO", name: "Bolivia", capital: "Sucre", flag: "🇧🇴", continent: "South America", lat: -19.0, lng: -65.3 },
  { code: "BR", name: "Brazil", capital: "Brasília", flag: "🇧🇷", continent: "South America", lat: -15.8, lng: -47.9 },
  { code: "CL", name: "Chile", capital: "Santiago", flag: "🇨🇱", continent: "South America", lat: -33.5, lng: -70.7 },
  { code: "CO", name: "Colombia", capital: "Bogotá", flag: "🇨🇴", continent: "South America", lat: 4.7, lng: -74.1 },
  { code: "EC", name: "Ecuador", capital: "Quito", flag: "🇪🇨", continent: "South America", lat: -0.2, lng: -78.5 },
  { code: "GY", name: "Guyana", capital: "Georgetown", flag: "🇬🇾", continent: "South America", lat: 6.8, lng: -58.2 },
  { code: "PY", name: "Paraguay", capital: "Asunción", flag: "🇵🇾", continent: "South America", lat: -25.3, lng: -57.6 },
  { code: "PE", name: "Peru", capital: "Lima", flag: "🇵🇪", continent: "South America", lat: -12.1, lng: -77.0 },
  { code: "SR", name: "Suriname", capital: "Paramaribo", flag: "🇸🇷", continent: "South America", lat: 5.8, lng: -55.2 },
  { code: "UY", name: "Uruguay", capital: "Montevideo", flag: "🇺🇾", continent: "South America", lat: -34.9, lng: -56.2 },
  { code: "VE", name: "Venezuela", capital: "Caracas", flag: "🇻🇪", continent: "South America", lat: 10.5, lng: -66.9 },
];

// ---------------------------------------------------------------------------
// OCEANIA (14 countries)
// ---------------------------------------------------------------------------
const OCEANIA: Country[] = [
  { code: "AU", name: "Australia", capital: "Canberra", flag: "🇦🇺", continent: "Oceania", lat: -35.3, lng: 149.1 },
  { code: "FJ", name: "Fiji", capital: "Suva", flag: "🇫🇯", continent: "Oceania", lat: -18.1, lng: 178.4 },
  { code: "KI", name: "Kiribati", capital: "South Tarawa", flag: "🇰🇮", continent: "Oceania", lat: 1.3, lng: 173.0 },
  { code: "MH", name: "Marshall Islands", capital: "Majuro", flag: "🇲🇭", continent: "Oceania", lat: 7.1, lng: 171.4 },
  { code: "FM", name: "Micronesia", capital: "Palikir", flag: "🇫🇲", continent: "Oceania", lat: 6.9, lng: 158.2 },
  { code: "NR", name: "Nauru", capital: "Yaren", flag: "🇳🇷", continent: "Oceania", lat: -0.5, lng: 166.9 },
  { code: "NZ", name: "New Zealand", capital: "Wellington", flag: "🇳🇿", continent: "Oceania", lat: -41.3, lng: 174.8 },
  { code: "PW", name: "Palau", capital: "Ngerulmud", flag: "🇵🇼", continent: "Oceania", lat: 7.5, lng: 134.6 },
  { code: "PG", name: "Papua New Guinea", capital: "Port Moresby", flag: "🇵🇬", continent: "Oceania", lat: -9.4, lng: 147.2 },
  { code: "WS", name: "Samoa", capital: "Apia", flag: "🇼🇸", continent: "Oceania", lat: -13.8, lng: -171.8 },
  { code: "SB", name: "Solomon Islands", capital: "Honiara", flag: "🇸🇧", continent: "Oceania", lat: -9.4, lng: 160.0 },
  { code: "TO", name: "Tonga", capital: "Nukuʻalofa", flag: "🇹🇴", continent: "Oceania", lat: -21.1, lng: -175.2 },
  { code: "TV", name: "Tuvalu", capital: "Funafuti", flag: "🇹🇻", continent: "Oceania", lat: -8.5, lng: 179.2 },
  { code: "VU", name: "Vanuatu", capital: "Port Vila", flag: "🇻🇺", continent: "Oceania", lat: -17.7, lng: 168.3 },
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
