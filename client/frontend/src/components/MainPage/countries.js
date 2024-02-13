const countries = {
    English: 'GB', // Great Britain flag for English
    Spanish: 'ES', // Spain flag for Spanish
    French: 'FR',  // France flag for French
    German: 'DE',  // Germany flag for German
    Italian: 'IT', // Italy flag for Italian
    Portuguese: 'PT', // Portugal flag for Portuguese
    Russian: 'RU', // Russia flag for Russian
    Chinese: 'CN', // China flag for Chinese
    Japanese: 'JP', // Japan flag for Japanese
    Korean: 'KR', // South Korea flag for Korean
    Dutch: 'NL', // Netherlands flag for Dutch
    Swedish: 'SE', // Sweden flag for Swedish
    Danish: 'DK', // Denmark flag for Danish
    Finnish: 'FI', // Finland flag for Finnish
    Norwegian: 'NO', // Norway flag for Norwegian
    Polish: 'PL', // Poland flag for Polish
    Turkish: 'TR', // Turkey flag for Turkish
    Arabic: 'SA', // Saudi Arabia flag for Arabic
    Hindi: 'IN', // India flag for Hindi
    Thai: 'TH', // Thailand flag for Thai
    Afar: 'DJ', // Djibouti flag for Afar
    Abkhazian: 'GE', // Georgia flag for Abkhazian
    Afrikaans: 'ZA', // South Africa flag for Afrikaans
    Akan: 'GH', // Ghana flag for Akan
    Amharic: 'ET', // Ethiopia flag for Amharic
    Aragonese: 'ES', // Spain flag for Aragonese
    Assamese: 'IN', // India flag for Assamese
    Avaric: 'RU', // Russia flag for Avaric
    Aymara: 'BO', // Bolivia flag for Aymara
    Azerbaijani: 'AZ', // Azerbaijan flag for Azerbaijani
    Bashkir: 'RU', // Russia flag for Bashkir
    Bambara: 'ML', // Mali flag for Bambara
    Belarusian: 'BY', // Belarus flag for Belarusian
    Bengali: 'BD', // Bangladesh flag for Bengali
    Bislama: 'VU', // Vanuatu flag for Bislama
    Tibetan: 'CN', // China flag for Tibetan
    Bosnian: 'BA', // Bosnia and Herzegovina flag for Bosnian
    Guarani: 'PY', // Paraguay for Guarani
    Gujarati: 'IN', // India for Gujarati
    Haitian: 'HT', // Haiti for Haitian
    Hausa: 'NG', // Nigeria for Hausa
    Hebrew: 'IL', // Israel for Hebrew
    Herero: 'NA', // Namibia for Herero
    HiriMotu: 'PG', // Papua New Guinea for Hiri Motu
    Croatian: 'HR', // Croatia for Croatian
    Hungarian: 'HU', // Hungary for Hungarian
    Armenian: 'AM', // Armenia for Armenian
    Igbo: 'NG', // Nigeria for Igbo
    Ido: '---', // Ido is a constructed language, no country
    SichuanYi: 'CN', // China for Sichuan Yi
    Inuktitut: 'CA', // Canada for Inuktitut
    Interlingue: '---', // Interlingue is a constructed language, no country
    Indonesian: 'ID', // Indonesia for Indonesian
    Inupiaq: 'US', // United States for Inupiaq (Alaska)
    Icelandic: 'IS', // Iceland for Icelandic
    Javanese: 'ID', // Indonesia for Javanese
    Kalaallisut: 'GL', // Greenland for Kalaallisut
    Kannada: 'IN', // India for Kannada
    Kashmiri: 'IN', // India for Kashmiri
    Georgian: 'GE', // Georgia for Georgian
    Kanuri: 'NE', // Niger for Kanuri
    Kazakh: 'KZ', // Kazakhstan for Kazakh
    CentralKhmer: 'KH', // Cambodia for Central Khmer
    Kikuyu: 'KE', // Kenya for Kikuyu
    Kinyarwanda: 'RW', // Rwanda for Kinyarwanda
    Kirghiz: 'KG', // Kyrgyzstan for Kirghiz
    Komi: 'RU', // Russia for Komi
    Kongo: 'CG', // Republic of the Congo for Kongo
    Kuanyama: 'AO', // Angola for Kuanyama
    Kurdish: 'TR', // Turkey for Kurdish
    Lao: 'LA', // Laos for Lao
    Latin: 'VA', // Vatican City for Latin
    Latvian: 'LV', // Latvia for Latvian
    Limburgan: 'NL', // Netherlands for Limburgan
    Lingala: 'CD', // Democratic Republic of the Congo for Lingala
    Lithuanian: 'LT', // Lithuania for Lithuanian
    Luxembourgish: 'LU', // Luxembourg for Luxembourgish
    LubaKatanga: 'CD', // Democratic Republic of the Congo for Luba-Katanga
    Ganda: 'UG', // Uganda for Ganda
    Marshallese: 'MH', // Marshall Islands for Marshallese
    Malayalam: 'IN', // India for Malayalam
    Marathi: 'IN', // India for Marathi
    Macedonian: 'MK', // North Macedonia for Macedonian
    Malagasy: 'MG', // Madagascar for Malagasy
    Maltese: 'MT', // Malta for Maltese
    Mongolian: 'MN', // Mongolia for Mongolian
    Maori: 'NZ', // New Zealand for Maori
    Malay: 'MY', // Malaysia for Malay
    Burmese: 'MM', // Myanmar for Burmese
    Nauru: 'NR', // Nauru for Nauru
    Navajo: 'US', // United States for Navajo
    SouthNdebele: 'ZA', // South Africa for South Ndebele
    NorthNdebele: 'ZW', // Zimbabwe for North Ndebele
    Ndonga: 'NA', // Namibia for Ndonga
    Nepali: 'NP', // Nepal for
    Nepali: 'NP',
    NorwegianNynorsk: 'NO',
    NorwegianBokmål: 'NO',
    Norwegian: 'NO',
    Nyanja: 'MW',
    Occitan: 'FR',
    Ojibwa: 'CA',
    Oriya: 'IN',
    Oromo: 'ET',
    Ossetian: 'RU',
    Panjabi: 'PK',
    Pali: 'IN',
    Polish: 'PL',
    Portuguese: 'PT',
    Pushto: 'AF',
    Quechua: 'PE',
    Romansh: 'CH',
    Romanian: 'RO',
    Rundi: 'BI',
    Russian: 'RU',
    Sango: 'CF',
    Sanskrit: 'IN',
    Sinhala: 'LK',
    Slovak: 'SK',
    Slovenian: 'SI',
    NorthernSami: 'NO',
    Samoan: 'WS',
    Shona: 'ZW',
    Sindhi: 'PK',
    Somali: 'SO',
    SouthernSotho: 'LS',
    Albanian: 'AL',
    Sardinian: 'IT',
    Serbian: 'RS',
    Swati: 'SZ',
    Sundanese: 'ID',
    Swahili: 'TZ',
    Swedish: 'SE',
    Tahitian: 'PF',
    Tamil: 'LK',
    Tatar: 'RU',
    Telugu: 'IN',
    Tajik: 'TJ',
    Tagalog: 'PH',
    Thai: 'TH',
    Tigrinya: 'ER',
    Tonga: 'TO',
    Tswana: 'BW',
    Tsonga: 'ZA',
    Turkmen: 'TM',
    Turkish: 'TR',
    Twi: 'GH',
    Uighur: 'CN',
    Ukrainian: 'UA',
    Urdu: 'PK',
    Uzbek: 'UZ',
    Venda: 'ZA',
    Vietnamese: 'VN',
    Volapük: '---',
    Walloon: 'BE',
    Wolof: 'SN',
    Xhosa: 'ZA',
    Yiddish: 'IL',
    Yoruba: 'NG',
    Zhuang: 'CN',
    Chinese: 'CN',
    Zulu: 'ZA'
  }



export default countries;