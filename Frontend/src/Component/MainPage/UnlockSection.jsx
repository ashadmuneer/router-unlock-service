import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UnlockSection.css";
import { Helmet } from "react-helmet-async";
import Select from "react-select";

const brandLogos = {
  HUAWEI: "https://logo.clearbit.com/huawei.com",
  BROVI: "https://i.ibb.co/t9nxNQq/logo.png",
  "BROVI Plus": "https://i.ibb.co/t9nxNQq/logo.png",
  ZTE: "https://logo.clearbit.com/zte.com.cn",
  Oppo: "https://logo.clearbit.com/oppo.com",
  GHTelcom: "https://i.ibb.co/XZHBxKHP/GH.png",
  Soyealink: "https://i.ibb.co/mrfZTNRX/Soyelink-1.png",
  GreenPacket: "https://logo.clearbit.com/greenpacket.com",
  AVXAV: "https://logo.clearbit.com/avxav.com",
  AURORA: "https://logo.clearbit.com/aurora.com",
  "D-Link": "https://logo.clearbit.com/dlink.com",
  FIBOCOM: "https://logo.clearbit.com/fibocom.com",
  "TD TECH": "https://logo.clearbit.com/td-tech.com",
  NOKIA: "https://logo.clearbit.com/nokia.com",
  QUECTEL: "https://logo.clearbit.com/quectel.com",
  MEIGLINK: "https://logo.clearbit.com/meiglink.com",
  ZLT: "https://logo.clearbit.com/zlt.com",
  TELSTRA: "https://logo.clearbit.com/telstra.com.au",
  FLYBOX: "https://logo.clearbit.com/flybox.com",
};
// Country and network data with flags and logos
const countryNetworkData = [
  {
    country: "United States",
    code: "US",
    networks: [
      { name: "AT&T", logo_url: "https://logo.clearbit.com/att.com" },
      { name: "Verizon", logo_url: "https://logo.clearbit.com/verizon.com" },
      { name: "T-Mobile", logo_url: "https://logo.clearbit.com/t-mobile.com" },
      {
        name: "US Cellular",
        logo_url: "https://logo.clearbit.com/uscellular.com",
      },
      {
        name: "Cricket Wireless",
        logo_url: "https://logo.clearbit.com/cricketwireless.com",
      },
      {
        name: "Boost Mobile",
        logo_url: "https://logo.clearbit.com/boostmobile.com",
      },
      {
        name: "Spectrum Mobile",
        logo_url: "https://logo.clearbit.com/spectrum.com",
      },
      {
        name: "Mint Mobile",
        logo_url: "https://logo.clearbit.com/mintmobile.com",
      },
      { name: "Google Fi", logo_url: "https://logo.clearbit.com/google.com" },
    ],
  },
  {
    country: "India",
    code: "IN",
    networks: [
      { name: "Jio", logo_url: "https://logo.clearbit.com/jio.com" },
      { name: "Airtel", logo_url: "https://logo.clearbit.com/airtel.in" },
      {
        name: "Vi (Vodafone Idea)",
        logo_url: "https://logo.clearbit.com/vodafoneidea.com",
      },
      { name: "BSNL", logo_url: "https://logo.clearbit.com/bsnl.co.in" },
      { name: "MTNL", logo_url: "https://logo.clearbit.com/mtnl.net.in" },
    ],
  },
  {
    country: "China",
    code: "CN",
    networks: [
      {
        name: "China Mobile",
        logo_url: "https://logo.clearbit.com/chinamobileltd.com",
      },
      {
        name: "China Unicom",
        logo_url: "https://logo.clearbit.com/chinaunicom.com",
      },
      {
        name: "China Telecom",
        logo_url: "https://logo.clearbit.com/chinatelecom.com.cn",
      },
    ],
  },
  {
    country: "Brazil",
    code: "BR",
    networks: [
      { name: "Vivo", logo_url: "https://logo.clearbit.com/vivo.com.br" },
      { name: "Claro", logo_url: "https://logo.clearbit.com/claro.com.br" },
      { name: "TIM", logo_url: "https://logo.clearbit.com/tim.com.br" },
      { name: "Oi", logo_url: "https://logo.clearbit.com/oi.com.br" },
      {
        name: "Algar Telecom",
        logo_url: "https://logo.clearbit.com/algartelecom.com.br",
      },
      {
        name: "Nextel Brazil",
        logo_url: "https://logo.clearbit.com/nextel.com.br",
      },
    ],
  },
  {
    country: "Russia",
    code: "RU",
    networks: [
      { name: "MTS", logo_url: "https://logo.clearbit.com/mts.ru" },
      { name: "MegaFon", logo_url: "https://logo.clearbit.com/megafon.ru" },
      { name: "Beeline", logo_url: "https://logo.clearbit.com/beeline.ru" },
      { name: "Tele2 Russia", logo_url: "https://logo.clearbit.com/tele2.ru" },
    ],
  },
  {
    country: "Indonesia",
    code: "ID",
    networks: [
      {
        name: "Telkomsel",
        logo_url: "https://logo.clearbit.com/telkomsel.com",
      },
      {
        name: "Indosat Ooredoo Hutchison",
        logo_url: "https://logo.clearbit.com/indosatooredoo.com",
      },
      { name: "XL Axiata", logo_url: "https://logo.clearbit.com/xl.co.id" },
      {
        name: "Smartfren",
        logo_url: "https://logo.clearbit.com/smartfren.com",
      },
      { name: "By.U", logo_url: "https://logo.clearbit.com/byu.id" },
    ],
  },
  {
    "country": "Kazakhstan",
    "code": "KZ",
    "networks": [
      { "name": "Kcell", "logo_url": "https://logo.clearbit.com/kcell.kz" },
      { "name": "Beeline", "logo_url": "https://logo.clearbit.com/beeline.kz" },
      { "name": "Tele2", "logo_url": "https://logo.clearbit.com/tele2.kz" },
      { "name": "Altel", "logo_url": "https://logo.clearbit.com/altel.kz" },
      { "name": "Izi", "logo_url": "https://logo.clearbit.com/izi.kz" }
    ]
  },

  {
    "country": "Israel",
    "code": "IL",
    "networks": [
      { "name": "Pelephone", "logo_url": "https://logo.clearbit.com/pelephone.co.il" },
      { "name": "Cellcom", "logo_url": "https://logo.clearbit.com/cellcom.co.il" },
      { "name": "Partner Mobile", "logo_url": "https://logo.clearbit.com/partner.co.il" },
      { "name": "HOT Mobile", "logo_url": "https://logo.clearbit.com/hotmobile.co.il" },
      { "name": "Golan Telecom", "logo_url": "https://logo.clearbit.com/golantelecom.co.il" },
      { "name": "We4G", "logo_url": "https://logo.clearbit.com/we4g.co.il" },
      { "name": "Rami Levy", "logo_url": "https://logo.clearbit.com/ramilevy.co.il" },
      { "name": "012 Mobile", "logo_url": "https://logo.clearbit.com/012.net.il" },
      { "name": "Home Cellular", "logo_url": "https://logo.clearbit.com/homecellular.co.il" },
      { "name": "Youphone", "logo_url": "https://logo.clearbit.com/youphone.co.il" },
      { "name": "019 Telzar", "logo_url": "https://logo.clearbit.com/019.net.il" }
    ]
  },
  {
    "country": "Malaysia",
    "code": "MY",
    "networks": [
      { "name": "CelcomDigi", "logo_url": "https://logo.clearbit.com/celcomdigi.com.my" },
      { "name": "Maxis", "logo_url": "https://logo.clearbit.com/maxis.com.my" },
      { "name": "U Mobile", "logo_url": "https://logo.clearbit.com/u.com.my" },
      { "name": "Telekom Malaysia (Unifi Mobile)", "logo_url": "https://logo.clearbit.com/unifi.com.my" },
      { "name": "Tune Talk", "logo_url": "https://logo.clearbit.com/tunetalk.com" },
      { "name": "redONE", "logo_url": "https://logo.clearbit.com/redone.com.my" },
      { "name": "XOX Mobile", "logo_url": "https://logo.clearbit.com/xox.com.my" },
      { "name": "Yoodo", "logo_url": "https://logo.clearbit.com/yoodo.com.my" },
      { "name": "Merchantrade Mobile", "logo_url": "https://logo.clearbit.com/merchantrademobile.com" },
      { "name": "SpeakOUT", "logo_url": "https://logo.clearbit.com/speakout.com.my" }
    ]
  },
  {
    country: "Nigeria",
    code: "NG",
    networks: [
      {
        name: "MTN Nigeria",
        logo_url: "https://logo.clearbit.com/mtnonline.com",
      },
      {
        name: "Airtel Nigeria",
        logo_url: "https://logo.clearbit.com/airtelfrance.com",
      },
      { name: "Glo", logo_url: null },
      { name: "9mobile", logo_url: "https://logo.clearbit.com/9mobile.com.ng" },
    ],
  },
  {
    country: "Pakistan",
    code: "PK",
    networks: [
      { name: "Jazz", logo_url: "https://logo.clearbit.com/jazz.com.pk" },
      { name: "Zong", logo_url: "https://logo.clearbit.com/zong.com.pk" },
      { name: "Telenor", logo_url: "https://logo.clearbit.com/telenor.com" },
      { name: "Ufone", logo_url: "https://logo.clearbit.com/ufone.com" },
      { "name": "SCO", "logo_url": "https://logo.clearbit.com/sco.gov.pk" }

    ],
  },
  {
    country: "Bangladesh",
    code: "BD",
    networks: [
      {
        name: "Grameenphone",
        logo_url: "https://logo.clearbit.com/grameenphone.com",
      },
      { name: "Robi", logo_url: "https://logo.clearbit.com/robi.com.bd" },
      {
        name: "Banglalink",
        logo_url: "https://logo.clearbit.com/banglalink.net",
      },
      {
        name: "Teletalk",
        logo_url: "https://logo.clearbit.com/teletalk.com.bd",
      },
    ],
  },
  {
    country: "Mexico",
    code: "MX",
    networks: [
      { name: "Telcel", logo_url: "https://logo.clearbit.com/telcel.com" },
      { name: "AT&T Mexico", logo_url: "https://logo.clearbit.com/mx.att.com" },
      { name: "Movistar", logo_url: "https://logo.clearbit.com/movistar.es" },
      {
        name: "Altán Redes",
        logo_url: "https://logo.clearbit.com/altanredes.mx",
      },
    ],
  },
  {
    "country": "Mauritius",
    "code": "MU",
    "networks": [
      { "name": "my.t", "logo_url": "https://logo.clearbit.com/myt.mu" },
      { "name": "Emtel", "logo_url": "https://logo.clearbit.com/emtel.com" }
    ]
  },
  {
    "country": "Sudan",
    "code": "SD",
    "networks": [
      { "name": "Zain Sudan", "logo_url": "https://logo.clearbit.com/sd.zain.com" },
      { "name": "Sudani", "logo_url": "https://logo.clearbit.com/sudani.sd" },
      { "name": "MTN Sudan", "logo_url": "https://logo.clearbit.com/mtn.sd" }
    ]
  },
  {
    country: "Germany",
    code: "DE",
    networks: [
      {
        name: "Deutsche Telekom",
        logo_url: "https://logo.clearbit.com/telekom.com",
      },
      {
        name: "Vodafone Germany",
        logo_url: "https://logo.clearbit.com/vodafone.de",
      },
      {
        name: "O2 (Telefónica)",
        logo_url: "https://logo.clearbit.com/o2.co.uk",
      },
      { name: "1&1", logo_url: "https://logo.clearbit.com/1und1.de" },
    ],
  },
  {
    "country": "UK",
    "code": "GB",
    "networks": [
      { "name": "EE", "logo_url": "https://logo.clearbit.com/ee.co.uk" },
      { "name": "O2", "logo_url": "https://logo.clearbit.com/o2.co.uk" },
      { "name": "Vodafone", "logo_url": "https://logo.clearbit.com/vodafone.co.uk" },
      { "name": "Three", "logo_url": "https://logo.clearbit.com/three.co.uk" },
      { "name": "Giffgaff", "logo_url": "https://logo.clearbit.com/giffgaff.com" },
      { "name": "Tesco Mobile", "logo_url": "https://logo.clearbit.com/tescomobile.com" },
      { "name": "Sky Mobile", "logo_url": "https://logo.clearbit.com/sky.com" },
      { "name": "iD Mobile", "logo_url": "https://logo.clearbit.com/idmobile.co.uk" },
      { "name": "SMARTY", "logo_url": "https://logo.clearbit.com/smarty.co.uk" },
      { "name": "BT Mobile", "logo_url": "https://logo.clearbit.com/bt.com" },
      { "name": "Lyca Mobile", "logo_url": "https://logo.clearbit.com/lycamobile.co.uk" },
      { "name": "VOXI", "logo_url": "https://logo.clearbit.com/voxi.co.uk" },
      { "name": "Talkmobile", "logo_url": "https://logo.clearbit.com/talkmobile.co.uk" }
    ]
  },
  {
    country: "France",
    code: "FR",
    networks: [
      { name: "Orange", logo_url: "https://logo.clearbit.com/orange.com" },
      { name: "SFR", logo_url: "https://logo.clearbit.com/sfr.fr" },
      {
        name: "Bouygues Telecom",
        logo_url: "https://logo.clearbit.com/bouyguestelecom.fr",
      },
      { name: "Free Mobile", logo_url: "https://logo.clearbit.com/free.fr" },
    ],
  },
  {
    country: "Japan",
    code: "JP",
    networks: [
      {
        name: "NTT Docomo",
        logo_url: "https://logo.clearbit.com/nttdocomo.co.jp",
      },
      { name: "KDDI (au)", logo_url: "https://logo.clearbit.com/kddi.com" },
      { name: "SoftBank", logo_url: "https://logo.clearbit.com/softbank.jp" },
      {
        name: "Rakuten Mobile",
        logo_url: "https://logo.clearbit.com/rakutenmobile.co.jp",
      },
    ],
  },
 {
    "country": "Philippines",
    "code": "PH",
    "networks": [
      { "name": "Globe Telecom", "logo_url": "https://logo.clearbit.com/globe.com.ph" },
      { "name": "Smart Communications", "logo_url": "https://logo.clearbit.com/smart.com.ph" },
      { "name": "DITO Telecommunity", "logo_url": "https://logo.clearbit.com/dito.ph" }
    ]
  },
  {
    "country": "Sri Lanka",
    "code": "LK",
    "networks": [
      { "name": "Dialog Axiata", "logo_url": "https://logo.clearbit.com/dialog.lk" },
      { "name": "SLT-Mobitel", "logo_url": "https://logo.clearbit.com/mobitel.lk" },
      { "name": "Hutch", "logo_url": "https://logo.clearbit.com/hutch.lk" },
      { "name": "Airtel", "logo_url": "https://logo.clearbit.com/airtel.lk" }
    ]
  },
  {
    country: "Vietnam",
    code: "VN",
    networks: [
      { name: "Viettel", logo_url: "https://logo.clearbit.com/viettel.com.vn" },
      {
        name: "Vinaphone",
        logo_url: "https://logo.clearbit.com/vinaphone.com.vn",
      },
      { name: "MobiFone", logo_url: "https://logo.clearbit.com/mobifone.vn" },
      {
        name: "Vietnamobile",
        logo_url: "https://logo.clearbit.com/vietnamobile.com.vn",
      },
    ],
  },
  {
    country: "Turkey",
    code: "TR",
    networks: [
      {
        name: "Turkcell",
        logo_url: "https://logo.clearbit.com/turkcell.com.tr",
      },
      {
        name: "Vodafone Turkey",
        logo_url: "https://logo.clearbit.com/vodafone.com.tr",
      },
      {
        name: "Türk Telekom",
        logo_url: "https://logo.clearbit.com/turktelekom.com.tr",
      },
    ],
  },
  {
    country: "South Korea",
    code: "KR",
    networks: [
      {
        name: "SK Telecom",
        logo_url: "https://logo.clearbit.com/sktelecom.com",
      },
      { name: "KT", logo_url: "https://logo.clearbit.com/kt.com" },
      { name: "LG Uplus", logo_url: "https://logo.clearbit.com/lguplus.co.kr" },
    ],
  },
  {
    country: "Egypt",
    code: "EG",
    networks: [
      {
        name: "Vodafone Egypt",
        logo_url: "https://logo.clearbit.com/vodafone.com.eg",
      },
      { name: "Orange Egypt", logo_url: "https://logo.clearbit.com/orange.eg" },
      {
        name: "Etisalat Misr",
        logo_url: "https://logo.clearbit.com/etisalat.eg",
      },
      { name: "WE", logo_url: "https://logo.clearbit.com/we.com.eg" },
    ],
  },
  {
    country: "Thailand",
    code: "TH",
    networks: [
      { name: "AIS", logo_url: "https://logo.clearbit.com/ais.co.th" },
      {
        name: "TrueMove H",
        logo_url: "https://logo.clearbit.com/truecorp.co.th",
      },
      { name: "DTAC", logo_url: "https://logo.clearbit.com/dtac.co.th" },
    ],
  },
  {
    country: "United Arab Emirates",
    code: "AE",
    networks: [
      { name: "Etisalat", logo_url: "https://logo.clearbit.com/etisalat.ae" },
      { name: "du", logo_url: "https://logo.clearbit.com/du.ae" },
      {
        name: "Virgin Mobile UAE",
        logo_url: "https://logo.clearbit.com/virginmobile.ae",
      },
    ],
  },
  {
    country: "Saudi Arabia",
    code: "SA",
    networks: [
      { name: "STC", logo_url: "https://logo.clearbit.com/stc.com.sa" },
      { name: "MOBILY", logo_url: "https://logo.clearbit.com/mobily.com.sa" },
      { name: "ZAIN", logo_url: "https://logo.clearbit.com/zain.com" },
      {
        name: "GO Telecom",
        logo_url: "https://logo.clearbit.com/go.com.sa",
      },
      { "name": "SALAM", "logo_url": "https://logo.clearbit.com/salam.sa" },
      { "name": "Virgin Mobile Saudi", "logo_url": "https://logo.clearbit.com/virginmobile.sa" },
      { "name": "Lebara Mobile KSA", "logo_url": "https://logo.clearbit.com/lebara.sa" }
    ],
  },
  {
    country: "Qatar",
    code: "QA",
    networks: [
      {
        name: "Ooredoo Qatar",
        logo_url: "https://logo.clearbit.com/ooredoo.com",
      },
      {
        name: "Vodafone Qatar",
        logo_url: "https://logo.clearbit.com/vodafone.com.qa",
      },
    ],
  },
  {
    country: "Kuwait",
    code: "KW",
    networks: [
      {
        name: "Ooredoo Kuwait",
        logo_url: "https://logo.clearbit.com/ooredoo.com.kw",
      },
      {
        name: "Zain Kuwait",
        logo_url: "https://logo.clearbit.com/zain.com.kw",
      },
      { name: "STC Kuwait", logo_url: "https://logo.clearbit.com/stc.com.kw" },
    ],
  },
  {
    country: "Oman",
    code: "OM",
    networks: [
      { name: "Omantel", logo_url: "https://logo.clearbit.com/omantel.om" },
      {
        name: "Ooredoo Oman",
        logo_url: "https://logo.clearbit.com/ooredoo.om",
      },
      {
        name: "Vodafone Oman",
        logo_url: "https://logo.clearbit.com/vodafone.om",
      },
      { "name": "FRiENDi Mobile", "logo_url": "https://logo.clearbit.com/friendimobile.om" },
      { "name": "Renna Mobile", "logo_url": "https://logo.clearbit.com/rennamobile.com" }
    ],
  },
  {
    country: "Bahrain",
    code: "BH",
    networks: [
      { name: "Batelco", logo_url: "https://logo.clearbit.com/batelco.com.bh" },
      {
        name: "Zain Bahrain",
        logo_url: "https://logo.clearbit.com/zain.com.bh",
      },
      { name: "STC Bahrain", logo_url: "https://logo.clearbit.com/stc.com.bh" },
    ],
  },
  {
    country: "Jordan",
    code: "JO",
    networks: [
      {
        name: "Zain Jordan",
        logo_url: "https://logo.clearbit.com/zain.com.jo",
      },
      {
        name: "Orange Jordan",
        logo_url: "https://logo.clearbit.com/orange.jo",
      },
      { name: "Umniah", logo_url: "https://logo.clearbit.com/umniah.com.jo" },
    ],
  },
  {
    country: "Lebanon",
    code: "LB",
    networks: [
      { name: "Alfa", logo_url: "https://logo.clearbit.com/alfa.com.lb" },
      { name: "Touch", logo_url: "https://logo.clearbit.com/touch.com.lb" },
    ],
  },
  {
    country: "Iraq",
    code: "IQ",
    networks: [
      { name: "Zain Iraq", logo_url: "https://logo.clearbit.com/zain.com.iq" },
      { name: "Asiacell", logo_url: "https://logo.clearbit.com/asiacell.iq" },
      {
        name: "Korek Telecom",
        logo_url: "https://logo.clearbit.com/korektelecom.iq",
      },
    ],
  },
  {
    country: "Iran",
    code: "IR",
    networks: [
      {
        name: "IR-MCI (Hamrah-e Aval)",
        logo_url: "https://logo.clearbit.com/irmci.ir",
      },
      { name: "Irancell", logo_url: "https://logo.clearbit.com/irancell.ir" },
      { name: "Rightel", logo_url: "https://logo.clearbit.com/rightel.ir" },
    ],
  },
];

// TAC Router Database
const tacRouterDB = {
  86720604: { brand: "HUAWEI", model: "H112-370" },
  86073004: { brand: "HUAWEI", model: "H112-372" },
  86193505: { brand: "HUAWEI", model: "H122-373A" },
  86688704: { brand: "HUAWEI", model: "H122-373" },
  86406705: { brand: "HUAWEI", model: "N5368X" },
  86597804: { brand: "HUAWEI", model: "E6878-370" },
  86037604: { brand: "HUAWEI", model: "E6878-870" },
  86584007: { brand: "BROVI", model: "H153-381" },
  86124107: { brand: "BROVI", model: "H151-370" },
  86075606: { brand: "BROVI", model: "H155-381" },
  86681507: { brand: "BROVI", model: "H155-381" },
  86688806: { brand: "BROVI", model: "H155-382" },
  86241607: { brand: "BROVI", model: "H155-383" },
  86717306: { brand: "BROVI", model: "H158-381" },
  86120006: { brand: "BROVI", model: "H352-381" },
  86968607: { brand: "BROVI", model: "E6888-982" },
  86119206: { brand: "BROVI Plus", model: "H155-380" },
  86015506: { brand: "ZTE", model: "MU5120" },
  86581106: { brand: "ZTE", model: "MC888" },
  86367104: { brand: "ZTE", model: "MC801A" },
  86556005: { brand: "ZTE", model: "MC801A" },
  86896605: { brand: "ZTE", model: "MC801A" },
  86156906: { brand: "ZTE", model: "MC888A ULTRA" },
  86992605: { brand: "ZTE", model: "MU5001M" },
  86637807: { brand: "ZTE", model: "G5C" },
  86062806: { brand: "ZTE", model: "MC801A1" },
  86160006: { brand: "ZTE", model: "MC801A1" },
  86583105: { brand: "OPPO", model: "T1A (CTC03)" },
  86264406: { brand: "OPPO", model: "T1A (CTC03)" },
  86782206: { brand: "OPPO", model: "T2 (CTD05)" },
  86481205: { brand: "GHTelcom", model: "H138-380" },
  86588106: { brand: "Soyealink", model: "SRT873" },
  86399806: { brand: "Soyealink", model: "SRT875" },
  35840799: { brand: "GreenPacket", model: "D5H-250MK" },
  35162435: { brand: "GreenPacket", model: "D5H-EA20/EA60/EA62" },
  35759615: { brand: "GreenPacket", model: "Y5-210MU" },
  35181075: { brand: "AVXAV", model: "WQRTM-838A" },
  86055606: { brand: "AURORA", model: "C082 PRO" },
  35813213: { brand: "D-Link", model: "DWR-2000M" },
  86886605: { brand: "FIBOCOM", model: "AX3600" },
  86962406: { brand: "TD TECH", model: "IC5989" },
  86204005: { brand: "OPPO", model: "T1A (CTC02)" },
  35418669: { brand: "NOKIA", model: "AOD311NK" },
  86719705: { brand: "QUECTEL", model: "RM500Q-AE" },
  86133507: { brand: "BROVI", model: "H165-383" },
  86490205: { brand: "OPPO", model: "T1A (CTB06)" },
  86172305: { brand: "OPPO", model: "T1A (CTB03)" },
  86851005: { brand: "MEIGLINK", model: "A50E" },
  35705623: { brand: "NOKIA", model: "FASTMILE 5G GATEWAY 3.2" },
  35277834: { brand: "NOKIA", model: "FASTMILE 5G GATEWAY 3.1" },
  86144007: { brand: "QUECTEL", model: "RG50OL-EU" },
  86441004: { brand: "ZLT", model: "X21" },
  86529706: { brand: "ZTE", model: "MU5001A/B/M/U/MU5002" },
  86911905: { brand: "TELSTRA", model: "AW1000" },
  86237606: { brand: "FLYBOX", model: "CP52" },
  86237606: { brand: "FLYBOX", model: "CP52" },
  90909090: { brand: "TestBrand", model: "TestModel" },
  "35041894": { brand: "TP-Link", model: "Archer NX200" },
  "86500606": { brand: "Deco", model: "Deco X50-5G" }, 
  "86920106": { brand: "Soyealink", model: "SRT873HS" },
  "35041746": { brand: "Flybox", model: "5G19-01W-A" },
  "86181505": { brand: "Soyealink", model: "SLT869-A51" },

};


const UnlockSection = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [customNetwork, setCustomNetwork] = useState("");
  const [imei, setImei] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [error, setError] = useState("");
  const [showSecondPart, setShowSecondPart] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: "0.2rem",
      fontSize: "0.95rem",
      border: "none",
      borderRadius: "6px",
      background: "rgba(255, 255, 255, 0.1)",
      color: "#ffffff",
      transition: "all 0.3s ease",
    }),
    input: (provided, state) => ({
      ...provided,
      borderRadius: 0,
      border: "none",
      boxShadow: "none",
      outline: "none",
      backgroundColor: "transparent",
      color: "#ffffff",
      ...(state.isFocused && {
        border: "none",
        boxShadow: "none",
      }),
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      backgroundColor: "#333", // match your theme
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#5a2b7c" : "transparent",
      color: "#fff",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#ffffff",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgba(255, 255, 255, 0.6)",
    }),
  };

  const countryOptions = countryNetworkData.map((country) => ({
    label: (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={`https://flagsapi.com/${country.code}/flat/32.png`}
          alt={country.country}
          style={{ width: "24px", height: "16px" }}
        />
        <span>{country.country}</span>
      </div>
    ),
    value: country.country,
  }));

  const getNetworksForCountry = (country) => {
    const match = countryNetworkData.find((c) => c.country === country);
    return match ? match.networks : [];
  };

  const customNetworkOptions = getNetworksForCountry(selectedCountry).map(
    (network) => ({
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src={network.logo_url}
            alt={network.name}
            style={{ width: "20px", height: "20px" }}
          />
          <span>{network.name}</span>
        </div>
      ),
      value: network.name,
    })
  );

  customNetworkOptions.push({ label: "Other", value: "Other" });

  // Update mobile number when country code or phone number changes
  useEffect(() => {
    if (countryCode && phoneNumber) {
      setMobileNumber(countryCode + phoneNumber);
    } else {
      setMobileNumber("");
    }
  }, [countryCode, phoneNumber]);
  useEffect(() => {
    if (error) {
      setError("");
    }
  }, [selectedCountry, selectedNetwork, imei, email, serialNumber]);

  // Handle IMEI input: allow only numbers, max 15 digits
  const handleImeiChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,15}$/.test(value)) {
      setImei(value);
    }
  };

  // Handle Serial Number input: allow only capital letters and numbers, max 20 characters
  const handleSerialNumberChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-Z0-9]{0,20}$/.test(value)) {
      setSerialNumber(value);
    }
  };

  // Auto-detect brand and model based on IMEI
  useEffect(() => {
    if (imei.length >= 8) {
      const tac = imei.substring(0, 8);
      const routerInfo = tacRouterDB[tac];
      if (routerInfo && /^\d{15}$/.test(imei)) {
        setSelectedBrand(routerInfo.brand);
        setSelectedModel(routerInfo.model);
      } else {
        setSelectedBrand("");
        setSelectedModel("");
      }
    } else {
      setSelectedBrand("");
      setSelectedModel("");
    }
  }, [imei]);

  // Handle "Next" button to show second form
  const handleNext = (e) => {
    e.preventDefault();
    setError("");

    if (!selectedCountry) {
      setError("Please select a country. *");
      return;
    }
    if (!selectedNetwork) {
      setError("Please select a valid network. *");
      return;
    }
    if (!imei) {
      setError("Please enter a valid IMEI Number. *");
      return;
    }

    if (!/^\d{15}$/.test(imei)) {
      setError("IMEI must be exactly 15 digits. *");
      return;
    }

    if (selectedNetwork === "Other" && !customNetwork) {
      setError("Please enter a custom network name. *");
      return;
    }

    if (!selectedBrand || !selectedModel) {
      setError("Could not detect brand and model. Please check IMEI. *");
      return;
    }

    setShowSecondPart(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!serialNumber && !email) {
      setError(
        "Please fill in all fields and agree to the terms and conditions *"
      );
      setLoading(false);
      return;
    } else {
      if (!serialNumber) {
        setError("Please enter a valid Serial Number. *");
        setLoading(false);
        return;
      }
      if (!email) {
        setError("Please enter a valid Email address. *");
        setLoading(false);
        return;
      }
      if (!termsAccepted) {
        setError("Please agree to the Terms and Conditions. *");
        setLoading(false);
        return;
      }
    }

    if (!/^[A-Z0-9]{1,20}$/.test(serialNumber)) {
      setError(
        "Serial number must be alphanumeric (capital letters and numbers) and up to 20 characters *"
      );
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    const networkToSubmit =
      selectedNetwork === "Other" ? customNetwork : selectedNetwork;

    const url = `${import.meta.env.VITE_API_URL}/api/create-order`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: selectedCountry,
          brand: selectedBrand,
          model: selectedModel,
          network: networkToSubmit,
          imei,
          serialNumber,
          mobileNumber,
          email,
          termsAccepted,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }

      const data = await response.json();

      if (data.orderId) {
        navigate(`/order/${data.orderId}`);
      } else {
        setError("Order created, but no orderId received");
        console.error("Missing orderId in response", data);
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Unlock your routers, modems, and MiFi devices instantly for use with any SIM or mobile network worldwide. Whether you're using a Huawei modem, ZTE router, STC 5G device, Zain MiFi, Go Telecom unit, or any other brand, GenuineUnlocker provides fast, secure, and permanent unlock codes delivered online."
        />
        <link rel="canonical" href="https://genuineunlocker.net/#home" />
      </Helmet>
      <section className="unlock-section">
        <div className="unlock-container">
          <div className="unlock-content">
            <h1>
              <span className="highlight">Unlock your Wifi router</span> today
              with <span style={{ color: "#FFD700" }} className="highlight">Genuine Unlocker</span>
            </h1>
            <h2>
              Unlocking <span className="via">via IMEI</span>
            </h2>
            <p>
              Need to unlock your router to use it with different carriers? Our
              professional unlocking service makes the process simple and
              hassle-free. With experience across a wide range of router brands
              and models, we ensure your device is unlocked safely and
              efficiently.
            </p>
          </div>

          <div className="unlock-form-container">
            <div className="unlock-form">
              {error && (
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#ff0000ff",
                    marginTop: "0.5rem",
                    fontWeight: 700,
                  }}
                >
                  {error}
                </p>
              )}
              {!showSecondPart ? (
                <>
                  <label htmlFor="country">Select Country</label>
                  <Select
                    inputId="country"
                    className="dropdown"
                    options={countryOptions}
                    value={countryOptions.find(
                      (opt) => opt.value === selectedCountry
                    )}
                    onChange={(selectedOption) => {
                      setSelectedCountry(selectedOption.value);
                      setSelectedNetwork("");
                      setCustomNetwork("");
                    }}
                    placeholder="Select Country"
                    styles={customStyles}
                  />

                  <>
                    <label htmlFor="network">Select Network</label>
                    <Select
                      id="network"
                      className="dropdown"
                      options={customNetworkOptions}
                      value={customNetworkOptions.find(
                        (opt) => opt.value === selectedNetwork
                      )}
                      onChange={(option) => setSelectedNetwork(option.value)}
                      styles={customStyles}
                      placeholder="Select Network"
                      isDisabled={!selectedCountry}
                    />

                    {selectedNetwork === "Other" && (
                      <>
                        <label htmlFor="customNetwork">
                          Write Network Name
                        </label>
                        <input
                          type="text"
                          id="customNetwork"
                          placeholder="e.g. Custom Network"
                          value={customNetwork}
                          onChange={(e) => setCustomNetwork(e.target.value)}
                          style={{
                            background: "rgba(255, 255, 255, 0.1)",
                            color: "#fff",
                            border: "1px solid #444",
                            padding: "8px",
                            borderRadius: "4px",
                          }}
                          disabled={!selectedCountry}
                        />
                      </>
                    )}
                  </>

                  <div className="imei-input">
                    <label htmlFor="imei">IMEI Number</label>
                    <input
                      type="text"
                      id="imei"
                      placeholder="Enter the 15-digit IMEI number"
                      value={imei}
                      onChange={handleImeiChange}
                      maxLength={15}
                      disabled={!selectedCountry}
                    />
                    {imei.length > 0 && (
                      <p
                        style={{
                          color:
                            /^\d{15}$/.test(imei) &&
                            tacRouterDB[imei.substring(0, 8)]
                              ? "#45ff45"
                              : "red",
                          fontSize: "0.8rem",
                          lineHeight: "1.7",
                          maxWidth: "600px",
                          fontWeight: "700",
                        }}
                      >
                        {/^\d{15}$/.test(imei) &&
                        tacRouterDB[imei.substring(0, 8)]
                          ? "IMEI is verified and brand and model are Found."
                          : imei.length < 15
                          ? "Please enter exactly 15 digits"
                          : "Invalid IMEI or device not supported"}
                      </p>
                    )}
                  </div>

                  {imei.length >= 15 && tacRouterDB[imei.substring(0, 8)] && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        marginTop: "0.1rem",
                        fontSize: "0.05rem",
                        fontWeight: "600",
                      }}
                    >
                      <div
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          padding: "0.5rem",
                          borderRadius: "10px",
                        }}
                      >
                        <img
                          src={
                            brandLogos[selectedBrand] ||
                            "https://iili.io/FPVcUzX.md.png"
                          }
                          alt={`${selectedBrand} logo`}
                          style={{ width: "50px", height: "auto" }}
                        />
                      </div>
                      <div>
                        <p>
                          <strong
                            style={{
                              fontWeight: "700",
                            }}
                          >
                            Brand:
                          </strong>{" "}
                          {selectedBrand}
                        </p>
                        <p>
                          <strong
                            style={{
                              fontWeight: "700",
                            }}
                          >
                            Model:
                          </strong>{" "}
                          {selectedModel}
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    className="unlock-button"
                    onClick={handleNext}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "🔓 Buy Router Unlock Code"}
                  </button>
                </>
              ) : (
                <>
                  <label htmlFor="serialNumber">
                    Enter Serial Number (S/N){" "}
                    <span style={{ color: "#ff0000ff" }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="serialNumber"
                    placeholder="Enter the serial number"
                    value={serialNumber}
                    onChange={handleSerialNumberChange}
                    maxLength={20}
                  />

                  <label htmlFor="email">
                    Enter Email <span style={{ color: "#ff0000ff" }}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="e.g. example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <label htmlFor="mobileNumber">Enter WhatsApp Number</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="country-code-select"
                    >
                    <option value="">Country Code</option>
                    <option value="+966">🇸🇦 +966 (KSA)</option>
                    <option value="+91">🇮🇳 +91 (India)</option>
                    <option value="+971">🇦🇪 +971 (United Arab Emirates)</option>
                    <option value="+44">🇬🇧 +44 (United Kingdom)</option>
                    <option value="+1">🇺🇸 +1 (United States)</option>
                    <option value="+93">🇦🇫 +93 (Afghanistan)</option>
                    <option value="+355">🇦🇱 +355 (Albania)</option>
                    <option value="+213">🇩🇿 +213 (Algeria)</option>
                    <option value="+376">🇦🇩 +376 (Andorra)</option>
                    <option value="+244">🇦🇴 +244 (Angola)</option>
                    <option value="+1264">🇦🇮 +1264 (Anguilla)</option>
                    <option value="+672">🇦🇶 +672 (Antarctica)</option>
                    <option value="+1268">
                      🇦🇬 +1268 (Antigua and Barbuda)
                    </option>
                    <option value="+54">🇦🇷 +54 (Argentina)</option>
                    <option value="+374">🇦🇲 +374 (Armenia)</option>
                    <option value="+297">🇦🇼 +297 (Aruba)</option>
                    <option value="+61">🇦🇺 +61 (Australia)</option>
                    <option value="+43">🇦🇹 +43 (Austria)</option>
                    <option value="+994">🇦🇿 +994 (Azerbaijan)</option>
                    <option value="+1242">🇧🇸 +1242 (Bahamas)</option>
                    <option value="+973">🇧🇭 +973 (Bahrain)</option>
                    <option value="+880">🇧🇩 +880 (Bangladesh)</option>
                    <option value="+1246">🇧🇧 +1246 (Barbados)</option>
                    <option value="+375">🇧🇾 +375 (Belarus)</option>
                    <option value="+32">🇧🇪 +32 (Belgium)</option>
                    <option value="+501">🇧🇿 +501 (Belize)</option>
                    <option value="+229">🇧🇯 +229 (Benin)</option>
                    <option value="+1441">🇧🇲 +1441 (Bermuda)</option>
                    <option value="+975">🇧🇹 +975 (Bhutan)</option>
                    <option value="+591">🇧🇴 +591 (Bolivia)</option>
                    <option value="+387">
                      🇧🇦 +387 (Bosnia and Herzegovina)
                    </option>
                    <option value="+267">🇧🇼 +267 (Botswana)</option>
                    <option value="+55">🇧🇷 +55 (Brazil)</option>
                    <option value="+246">
                      🇮🇴 +246 (British Indian Ocean Territory)
                    </option>
                    <option value="+1284">
                      🇻🇬 +1284 (British Virgin Islands)
                    </option>
                    <option value="+673">🇧🇳 +673 (Brunei)</option>
                    <option value="+359">🇧🇬 +359 (Bulgaria)</option>
                    <option value="+226">🇧🇫 +226 (Burkina Faso)</option>
                    <option value="+257">🇧🇮 +257 (Burundi)</option>
                    <option value="+855">🇰🇭 +855 (Cambodia)</option>
                    <option value="+237">🇨🇲 +237 (Cameroon)</option>
                    <option value="+1">🇨🇦 +1 (Canada)</option>
                    <option value="+238">🇨🇻 +238 (Cape Verde)</option>
                    <option value="+1345">🇰🇾 +1345 (Cayman Islands)</option>
                    <option value="+236">
                      🇨🇫 +236 (Central African Republic)
                    </option>
                    <option value="+235">🇹🇩 +235 (Chad)</option>
                    <option value="+56">🇨🇱 +56 (Chile)</option>
                    <option value="+86">🇨🇳 +86 (China)</option>
                    <option value="+57">🇨🇴 +57 (Colombia)</option>
                    <option value="+269">🇰🇲 +269 (Comoros)</option>
                    <option value="+242">🇨🇬 +242 (Congo)</option>
                    <option value="+243">
                      🇨🇩 +243 (Congo, Democratic Republic)
                    </option>
                    <option value="+682">🇨🇰 +682 (Cook Islands)</option>
                    <option value="+506">🇨🇷 +506 (Costa Rica)</option>
                    <option value="+385">🇭🇷 +385 (Croatia)</option>
                    <option value="+53">🇨🇺 +53 (Cuba)</option>
                    <option value="+599">🇨🇼 +599 (Curaçao)</option>
                    <option value="+357">🇨🇾 +357 (Cyprus)</option>
                    <option value="+420">🇨🇿 +420 (Czech Republic)</option>
                    <option value="+45">🇩🇰 +45 (Denmark)</option>
                    <option value="+253">🇩🇯 +253 (Djibouti)</option>
                    <option value="+1767">🇩🇲 +1767 (Dominica)</option>
                    <option value="+1809">🇩🇴 +1809 (Dominican Republic)</option>
                    <option value="+593">🇪🇨 +593 (Ecuador)</option>
                    <option value="+20">🇪🇬 +20 (Egypt)</option>
                    <option value="+503">🇸🇻 +503 (El Salvador)</option>
                    <option value="+240">🇬🇶 +240 (Equatorial Guinea)</option>
                    <option value="+291">🇪🇷 +291 (Eritrea)</option>
                    <option value="+372">🇪🇪 +372 (Estonia)</option>
                    <option value="+251">🇪🇹 +251 (Ethiopia)</option>
                    <option value="+500">🇫🇰 +500 (Falkland Islands)</option>
                    <option value="+298">🇫🇴 +298 (Faroe Islands)</option>
                    <option value="+679">🇫🇯 +679 (Fiji)</option>
                    <option value="+358">🇫🇮 +358 (Finland)</option>
                    <option value="+33">🇫🇷 +33 (France)</option>
                    <option value="+594">🇬🇫 +594 (French Guiana)</option>
                    <option value="+689">🇵🇫 +689 (French Polynesia)</option>
                    <option value="+241">🇬🇦 +241 (Gabon)</option>
                    <option value="+220">🇬🇲 +220 (Gambia)</option>
                    <option value="+995">🇬🇪 +995 (Georgia)</option>
                    <option value="+49">🇩🇪 +49 (Germany)</option>
                    <option value="+233">🇬🇭 +233 (Ghana)</option>
                    <option value="+350">🇬🇮 +350 (Gibraltar)</option>
                    <option value="+30">🇬🇷 +30 (Greece)</option>
                    <option value="+299">🇬🇱 +299 (Greenland)</option>
                    <option value="+1473">🇬🇩 +1473 (Grenada)</option>
                    <option value="+590">🇬🇵 +590 (Guadeloupe)</option>
                    <option value="+1671">🇬🇺 +1671 (Guam)</option>
                    <option value="+502">🇬🇹 +502 (Guatemala)</option>
                    <option value="+44">🇬🇬 +44 (Guernsey)</option>
                    <option value="+224">🇬🇳 +224 (Guinea)</option>
                    <option value="+245">🇬🇼 +245 (Guinea-Bissau)</option>
                    <option value="+592">🇬🇾 +592 (Guyana)</option>
                    <option value="+509">🇭🇹 +509 (Haiti)</option>
                    <option value="+504">🇭🇳 +504 (Honduras)</option>
                    <option value="+852">🇭🇰 +852 (Hong Kong)</option>
                    <option value="+36">🇭🇺 +36 (Hungary)</option>
                    <option value="+354">🇮🇸 +354 (Iceland)</option>
                    <option value="+62">🇮🇩 +62 (Indonesia)</option>
                    <option value="+98">🇮🇷 +98 (Iran)</option>
                    <option value="+964">🇮🇶 +964 (Iraq)</option>
                    <option value="+353">🇮🇪 +353 (Ireland)</option>
                    <option value="+44">🇮🇲 +44 (Isle of Man)</option>
                    <option value="+972">🇮🇱 +972 (Israel)</option>
                    <option value="+39">🇮🇹 +39 (Italy)</option>
                    <option value="+1876">🇯🇲 +1876 (Jamaica)</option>
                    <option value="+81">🇯🇵 +81 (Japan)</option>
                    <option value="+44">🇯🇪 +44 (Jersey)</option>
                    <option value="+962">🇯🇴 +962 (Jordan)</option>
                    <option value="+7">🇰🇿 +7 (Kazakhstan)</option>
                    <option value="+254">🇰🇪 +254 (Kenya)</option>
                    <option value="+686">🇰🇮 +686 (Kiribati)</option>
                    <option value="+383">🇽🇰 +383 (Kosovo)</option>
                    <option value="+965">🇰🇼 +965 (Kuwait)</option>
                    <option value="+996">🇰🇬 +996 (Kyrgyzstan)</option>
                    <option value="+856">🇱🇦 +856 (Laos)</option>
                    <option value="+371">🇱🇻 +371 (Latvia)</option>
                    <option value="+961">🇱🇧 +961 (Lebanon)</option>
                    <option value="+266">🇱🇸 +266 (Lesotho)</option>
                    <option value="+231">🇱🇷 +231 (Liberia)</option>
                    <option value="+218">🇱🇾 +218 (Libya)</option>
                    <option value="+423">🇱🇮 +423 (Liechtenstein)</option>
                    <option value="+370">🇱🇹 +370 (Lithuania)</option>
                    <option value="+352">🇱🇺 +352 (Luxembourg)</option>
                    <option value="+853">🇲🇴 +853 (Macau)</option>
                    <option value="+389">🇲🇰 +389 (North Macedonia)</option>
                    <option value="+261">🇲🇬 +261 (Madagascar)</option>
                    <option value="+265">🇲🇼 +265 (Malawi)</option>
                    <option value="+60">🇲🇾 +60 (Malaysia)</option>
                    <option value="+960">🇲🇻 +960 (Maldives)</option>
                    <option value="+223">🇲🇱 +223 (Mali)</option>
                    <option value="+356">🇲🇹 +356 (Malta)</option>
                    <option value="+692">🇲🇭 +692 (Marshall Islands)</option>
                    <option value="+596">🇲🇶 +596 (Martinique)</option>
                    <option value="+222">🇲🇷 +222 (Mauritania)</option>
                    <option value="+230">🇲🇺 +230 (Mauritius)</option>
                    <option value="+262">🇾🇹 +262 (Mayotte)</option>
                    <option value="+52">🇲🇽 +52 (Mexico)</option>
                    <option value="+691">🇫🇲 +691 (Micronesia)</option>
                    <option value="+373">🇲🇩 +373 (Moldova)</option>
                    <option value="+377">🇲🇨 +377 (Monaco)</option>
                    <option value="+976">🇲🇳 +976 (Mongolia)</option>
                    <option value="+382">🇲🇪 +382 (Montenegro)</option>
                    <option value="+1664">🇲🇸 +1664 (Montserrat)</option>
                    <option value="+212">🇲🇦 +212 (Morocco)</option>
                    <option value="+258">🇲🇿 +258 (Mozambique)</option>
                    <option value="+95">🇲🇲 +95 (Myanmar)</option>
                    <option value="+264">🇳🇦 +264 (Namibia)</option>
                    <option value="+674">🇳🇷 +674 (Nauru)</option>
                    <option value="+977">🇳🇵 +977 (Nepal)</option>
                    <option value="+31">🇳🇱 +31 (Netherlands)</option>
                    <option value="+687">🇳🇨 +687 (New Caledonia)</option>
                    <option value="+64">🇳🇿 +64 (New Zealand)</option>
                    <option value="+505">🇳🇮 +505 (Nicaragua)</option>
                    <option value="+227">🇳🇪 +227 (Niger)</option>
                    <option value="+234">🇳🇬 +234 (Nigeria)</option>
                    <option value="+683">🇳🇺 +683 (Niue)</option>
                    <option value="+672">🇳🇫 +672 (Norfolk Island)</option>
                    <option value="+850">🇰🇵 +850 (North Korea)</option>
                    <option value="+1670">
                      🇲🇵 +1670 (Northern Mariana Islands)
                    </option>
                    <option value="+47">🇳🇴 +47 (Norway)</option>
                    <option value="+968">🇴🇲 +968 (Oman)</option>
                    <option value="+92">🇵🇰 +92 (Pakistan)</option>
                    <option value="+680">🇵🇼 +680 (Palau)</option>
                    <option value="+970">🇵🇸 +970 (Palestine)</option>
                    <option value="+507">🇵🇦 +507 (Panama)</option>
                    <option value="+675">🇵🇬 +675 (Papua New Guinea)</option>
                    <option value="+595">🇵🇾 +595 (Paraguay)</option>
                    <option value="+51">🇵🇪 +51 (Peru)</option>
                    <option value="+63">🇵🇭 +63 (Philippines)</option>
                    <option value="+48">🇵🇱 +48 (Poland)</option>
                    <option value="+351">🇵🇹 +351 (Portugal)</option>
                    <option value="+1787">🇵🇷 +1787 (Puerto Rico)</option>
                    <option value="+974">🇶🇦 +974 (Qatar)</option>
                    <option value="+262">🇷🇪 +262 (Réunion)</option>
                    <option value="+40">🇷🇴 +40 (Romania)</option>
                    <option value="+7">🇷🇺 +7 (Russia)</option>
                    <option value="+250">🇷🇼 +250 (Rwanda)</option>
                    <option value="+590">🇧🇱 +590 (Saint Barthélemy)</option>
                    <option value="+290">🇸🇭 +290 (Saint Helena)</option>
                    <option value="+1869">
                      🇰🇳 +1869 (Saint Kitts and Nevis)
                    </option>
                    <option value="+1758">🇱🇨 +1758 (Saint Lucia)</option>
                    <option value="+590">🇲🇫 +590 (Saint Martin)</option>
                    <option value="+508">
                      🇵🇲 +508 (Saint Pierre and Miquelon)
                    </option>
                    <option value="+1784">
                      🇻🇨 +1784 (Saint Vincent and the Grenadines)
                    </option>
                    <option value="+685">🇼🇸 +685 (Samoa)</option>
                    <option value="+378">🇸🇲 +378 (San Marino)</option>
                    <option value="+239">
                      🇸🇹 +239 (São Tomé and Príncipe)
                    </option>
                    <option value="+966">🇸🇦 +966 (Saudi Arabia)</option>
                    <option value="+221">🇸🇳 +221 (Senegal)</option>
                    <option value="+381">🇷🇸 +381 (Serbia)</option>
                    <option value="+248">🇸🇨 +248 (Seychelles)</option>
                    <option value="+232">🇸🇱 +232 (Sierra Leone)</option>
                    <option value="+65">🇸🇬 +65 (Singapore)</option>
                    <option value="+421">🇸🇰 +421 (Slovakia)</option>
                    <option value="+386">🇸🇮 +386 (Slovenia)</option>
                    <option value="+677">🇸🇧 +677 (Solomon Islands)</option>
                    <option value="+252">🇸🇴 +252 (Somalia)</option>
                    <option value="+27">🇿🇦 +27 (South Africa)</option>
                    <option value="+82">🇰🇷 +82 (South Korea)</option>
                    <option value="+211">🇸🇸 +211 (South Sudan)</option>
                    <option value="+34">🇪🇸 +34 (Spain)</option>
                    <option value="+94">🇱🇰 +94 (Sri Lanka)</option>
                    <option value="+249">🇸🇩 +249 (Sudan)</option>
                    <option value="+597">🇸🇷 +597 (Suriname)</option>
                    <option value="+268">🇸🇿 +268 (Eswatini)</option>
                    <option value="+46">🇸🇪 +46 (Sweden)</option>
                    <option value="+41">🇨🇭 +41 (Switzerland)</option>
                    <option value="+963">🇸🇾 +963 (Syria)</option>
                    <option value="+886">🇹🇼 +886 (Taiwan)</option>
                    <option value="+992">🇹🇯 +992 (Tajikistan)</option>
                    <option value="+255">🇹🇿 +255 (Tanzania)</option>
                    <option value="+66">🇹🇭 +66 (Thailand)</option>
                    <option value="+670">🇹🇱 +670 (Timor-Leste)</option>
                    <option value="+228">🇹🇬 +228 (Togo)</option>
                    <option value="+690">🇹🇰 +690 (Tokelau)</option>
                    <option value="+676">🇹🇴 +676 (Tonga)</option>
                    <option value="+1868">
                      🇹🇹 +1868 (Trinidad and Tobago)
                    </option>
                    <option value="+216">🇹🇳 +216 (Tunisia)</option>
                    <option value="+90">🇹🇷 +90 (Turkey)</option>
                    <option value="+993">🇹🇲 +993 (Turkmenistan)</option>
                    <option value="+1649">
                      🇹🇨 +1649 (Turks and Caicos Islands)
                    </option>
                    <option value="+688">🇹🇻 +688 (Tuvalu)</option>
                    <option value="+256">🇺🇬 +256 (Uganda)</option>
                    <option value="+380">🇺🇦 +380 (Ukraine)</option>
                    <option value="+1340">
                      🇻🇮 +1340 (U.S. Virgin Islands)
                    </option>
                    <option value="+598">🇺🇾 +598 (Uruguay)</option>
                    <option value="+998">🇺🇿 +998 (Uzbekistan)</option>
                    <option value="+678">🇻🇺 +678 (Vanuatu)</option>
                    <option value="+58">🇻🇪 +58 (Venezuela)</option>
                    <option value="+84">🇻🇳 +84 (Vietnam)</option>
                    <option value="+681">🇼🇫 +681 (Wallis and Futuna)</option>
                    <option value="+967">🇾🇪 +967 (Yemen)</option>
                    <option value="+260">🇿🇲 +260 (Zambia)</option>
                    <option value="+263">🇿🇼 +263 (Zimbabwe)</option>
                    </select>
                    <input
                      type="tel"
                      id="mobileNumber"
                      placeholder="Enter number"
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(e.target.value.replace(/\D/g, ""))
                      }
                      className="phone-number-input"
                    />
                  </div>

                  <div className="terms-checkbox">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <label htmlFor="terms">
                      I agree to the{" "}
                      <span
                        className="terms-link"
                        onClick={() => setShowTermsPopup(true)}
                      >
                        Terms and Conditions
                      </span>
                    </label>
                  </div>

                  {showTermsPopup && (
                    <div className="terms-popup">
                      <div
                        className="terms-popup-content"
                        style={{
                          maxHeight: "80vh",
                          overflowY: "auto",
                          paddingRight: "1rem",
                        }}
                      >
                        <div>
                          <h1>Terms and Conditions</h1>
                          <p>
                            Please read these Terms and Conditions carefully
                            before using{" "}
                            <a href="https://genuineunlocker.net">
                              https://genuineunlocker.net
                            </a>{" "}
                            or any of our services. Your access to and use of the
                            service is conditioned upon your acceptance and
                            compliance with these Terms.
                          </p>
                          <p>
                            By accessing or using the Service, you agree to be
                            bound by these Terms. If you disagree with any part of
                            the Terms, you should not access the Service.
                          </p>
                          <p>
                            Your purchase will appear on your card statements as{" "}
                            <strong>GENUINEUNLOCKER</strong>. Goods are sold in
                            USD.
                          </p>

                          <section>
                            <h2>1. Description of Service</h2>
                            <p>
                              1.1 <strong>GenuineUnlocker.net</strong> provides
                              professional WiFi router unlocking services using a
                              16-digit unlock code to remove network restrictions,
                              allowing your router to work with any compatible SIM
                              card or network provider. The service begins upon
                              receipt of payment.
                            </p>
                            <p>
                              1.2 Delivery times are guidelines provided by
                              network providers and may vary without notice.
                            </p>
                          </section>

                          <section>
                            <h2>2. Cancellation</h2>
                            <p>
                              2.1 Orders cannot be canceled once payment is made,
                              as unlocking costs are incurred immediately. By
                              selecting Credit/Debit Payment, you authorize the
                              order to commence immediately.
                            </p>
                          </section>

                          <section>
                            <h2>3. Legality of Service</h2>
                            <p>
                              3.1 All services are legal in Europe and North
                              America. If ordering from outside these regions, you
                              are responsible for verifying compliance with local
                              laws before placing an order. You are solely
                              responsible for any legal problems arising from the
                              use of our service.
                            </p>
                          </section>

                          <section>
                            <h2>4. Customer Responsibility</h2>
                            <p>4.1 You are responsible for:</p>
                            <ul>
                              <li>
                                Reviewing all information on the website prior to
                                ordering.
                              </li>
                              <li>
                                Verifying your router's compatibility with the
                                intended network post-unlock.
                              </li>
                              <li>
                                Ensuring the router is in good working condition.
                              </li>
                              <li>
                                Providing accurate router details (e.g., IMEI,
                                model, current network).
                              </li>
                            </ul>
                            <p>
                              4.2 For routers requiring an unlock code, you must
                              confirm the device prompts for a code when an
                              incompatible SIM is inserted.
                            </p>
                          </section>

                          <section>
                            <h2>5. Service Delivery Times</h2>
                            <p>
                              5.1 Prices and delivery times are as quoted on the
                              website. Delivery times are subject to change based
                              on network provider processes.
                            </p>
                          </section>

                          <section>
                            <h2>6. 100% Money Back Guarantee / Refund Policy</h2>
                            <p>
                              6.1 All services are covered by our 100% Money Back
                              Guarantee, subject to the following conditions:
                            </p>
                            <ul>
                              <li>
                                No refund is provided if the router is
                                blacklisted, reported lost, stolen, or blocked by
                                the manufacturer or network.
                              </li>
                              <li>
                                Refund is granted only if our unlock attempt
                                returns an 'incorrect code' status.
                              </li>
                              <li>
                                If the router does not prompt for an unlock code
                                (as required), submission costs are
                                non-refundable.
                              </li>
                              <li>
                                If an incorrect unlock code is entered or if the
                                technical team determines a wrong code was used,
                                no refund is given.
                              </li>
                              <li>
                                If the unlock attempt count is zero (not
                                attempted), the order is non-refundable.
                              </li>
                              <li>
                                In cases of modified unlock errors, no refund will
                                be provided.
                              </li>
                              <li>
                                If the unlock succeeds but the router is later
                                blacklisted, no refund is issued.
                              </li>
                              <li>
                                Refunds are only provided to the same account or
                                payment number used during the original
                                transaction.
                              </li>
                            </ul>
                          </section>

                          <section>
                            <h2>7. Customer Error</h2>
                            <p>
                              7.1 No changes or refunds are available for
                              fulfilled orders where incorrect router details
                              (e.g., IMEI, model, network) are provided.
                            </p>
                          </section>

                          <section>
                            <h2>8. Restrictions</h2>
                            <p>
                              By using this website, you agree to the following
                              rules:
                            </p>
                            <ul>
                              <li>
                                You must be at least 18 years old to use this
                                website or place an order.
                              </li>
                              <li>
                                Do not use a fake name or email address when
                                contacting us or placing an order.
                              </li>
                              <li>
                                Do not copy, sell, or share any part of this
                                website for personal or business use.
                              </li>
                              <li>
                                Do not use this website in a way that causes
                                problems for others or breaks the law.
                              </li>
                              <li>
                                Do not try to collect data from the website using
                                bots or software tools.
                              </li>
                              <li>
                                Do not use this website to send spam or
                                unauthorized ads.
                              </li>
                            </ul>
                          </section>

                          <section>
                            <h2>9. Links to External Sites</h2>
                            <p>
                              9.1 Our website may contain links to third-party
                              websites or services not owned or controlled by
                              GenuineUnlocker.
                            </p>
                            <p>
                              9.2 We assume no responsibility for the content,
                              privacy policies, or practices of third-party
                              websites.
                            </p>
                          </section>

                          <section>
                            <h2>10. Limitation of Liability</h2>
                            <p>
                              10.1 GenuineUnlocker provides all information in
                              good faith but does not guarantee its accuracy or
                              completeness.
                            </p>
                            <p>
                              10.2 We are not responsible for any loss or damage
                              resulting from your use of the service, including
                              device or data issues.
                            </p>
                          </section>

                          <section>
                            <h2>11. Indemnification</h2>
                            <p>
                              11.1 You agree to indemnify GenuineUnlocker against
                              any claims or damages resulting from your breach of
                              these Terms.
                            </p>
                          </section>

                          <section>
                            <h2>12. Severability</h2>
                            <p>
                              12.1 If any part of these Terms is found invalid,
                              the rest will remain in full effect.
                            </p>
                          </section>

                          <section>
                            <h2>13. Variation of Terms</h2>
                            <p>
                              13.1 We may update or change these Terms at any
                              time. If there are important changes, we will try to
                              inform you in advance whenever possible.
                            </p>
                          </section>

                          <section>
                            <h2>14. Assignment</h2>
                            <p>
                              14.1 GenuineUnlocker may transfer its rights or
                              obligations without notice. You may not transfer
                              yours without our consent.
                            </p>
                          </section>

                          <section>
                            <h2>
                              15. Barred Routers (Lost, Stolen, Blacklisted)
                            </h2>
                            <p>
                              15.1 If your router is later found blacklisted, no
                              refund will be provided—even if the unlock process
                              has succeeded.
                            </p>
                          </section>

                          <section>
                            <h2>16. Privacy</h2>
                            <p>
                              16.1 We do not store your card details. Your data is
                              kept secure and used only to process your order.
                            </p>
                          </section>

                          <section>
                            <h2>17. Termination of Orders</h2>
                            <p>
                              17.1 We may terminate orders if users are abusive or
                              aggressive. Refunds will not be issued in such
                              cases.
                            </p>
                          </section>

                          <section>
                            <h2>18. Entire Agreement</h2>
                            <p>
                              18.1 These Terms represent the entire agreement
                              between you and GenuineUnlocker.
                            </p>
                          </section>

                          <section>
                            <h2>19. Contact Us</h2>
                            <p>
                              For questions, email us at{" "}
                              <a href="mailto:genuineunlockerinfo@gmail.com">
                                genuineunlockerinfo@gmail.com
                              </a>
                              .
                            </p>
                          </section>
                        </div>
                        <button onClick={() => setShowTermsPopup(false)}>
                          Close
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    className="unlock-button"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "🔓 Submit Order"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="logo-slider">
          <div className="logo-track">
            <img src="https://i.ibb.co/ksvHjjmR/Frame-3.png" alt="Logo 1" />
            <img src="https://i.ibb.co/fdrYXkHh/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-11.png" alt="Logo 2" />
            <img src="https://i.ibb.co/LdRKh34W/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-12.png" alt="Logo 3" />
            <img src="https://i.ibb.co/YBFb8Z95/Frame-2.png" alt="Logo 4" />
            <img src="https://i.ibb.co/Y45T7tXh/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-1.png" alt="Logo 5" />
            <img src="https://i.ibb.co/TMcyKnx4/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-3.png" alt="Logo 6" />
            <img src="https://i.ibb.co/TxGf8DxS/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-4.png" alt="Logo 7" />
            <img src="https://i.ibb.co/CK1Frqpz/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-5.png" alt="Logo 8" />
            <img src="https://i.ibb.co/TMSNscj7/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-6.png" alt="Logo 9" />
            <img src="https://i.ibb.co/9mHfQJSc/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-7.png" alt="Logo 10" />
            <img src="https://i.ibb.co/kVQBkD29/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-9.png" alt="Logo 11" />
            <img src="https://i.ibb.co/TBy1VSPC/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-10.png" alt="Logo 12" />
            <img src="https://i.ibb.co/ksvHjjmR/Frame-3.png" alt="Logo 1" />
            <img src="https://i.ibb.co/fdrYXkHh/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-11.png" alt="Logo 2" />
            <img src="https://i.ibb.co/LdRKh34W/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-12.png" alt="Logo 3" />
            <img src="https://i.ibb.co/YBFb8Z95/Frame-2.png" alt="Logo 4" />
            <img src="https://i.ibb.co/Y45T7tXh/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-1.png" alt="Logo 5" />
            <img src="https://i.ibb.co/TMcyKnx4/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-3.png" alt="Logo 6" />
            <img src="https://i.ibb.co/TxGf8DxS/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-4.png" alt="Logo 7" />
            <img src="https://i.ibb.co/CK1Frqpz/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-5.png" alt="Logo 8" />
            <img src="https://i.ibb.co/TMSNscj7/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-6.png" alt="Logo 9" />
            <img src="https://i.ibb.co/9mHfQJSc/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-7.png" alt="Logo 10" />
            <img src="https://i.ibb.co/kVQBkD29/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-9.png" alt="Logo 11" />
            <img src="https://i.ibb.co/TBy1VSPC/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-10.png" alt="Logo 12" />
            <img src="https://i.ibb.co/ksvHjjmR/Frame-3.png" alt="Logo 1" />
            <img src="https://i.ibb.co/fdrYXkHh/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-11.png" alt="Logo 2" />
            <img src="https://i.ibb.co/LdRKh34W/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-12.png" alt="Logo 3" />
            <img src="https://i.ibb.co/YBFb8Z95/Frame-2.png" alt="Logo 4" />
            <img src="https://i.ibb.co/Y45T7tXh/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-1.png" alt="Logo 5" />
            <img src="https://i.ibb.co/TMcyKnx4/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-3.png" alt="Logo 6" />
            <img src="https://i.ibb.co/TxGf8DxS/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-4.png" alt="Logo 7" />
            <img src="https://i.ibb.co/CK1Frqpz/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-5.png" alt="Logo 8" />
            <img src="https://i.ibb.co/TMSNscj7/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-6.png" alt="Logo 9" />
            <img src="https://i.ibb.co/9mHfQJSc/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-7.png" alt="Logo 10" />
            <img src="https://i.ibb.co/kVQBkD29/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-9.png" alt="Logo 11" />
            <img src="https://i.ibb.co/TBy1VSPC/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-10.png" alt="Logo 12" />
            <img src="https://i.ibb.co/ksvHjjmR/Frame-3.png" alt="Logo 1" />
            <img src="https://i.ibb.co/fdrYXkHh/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-11.png" alt="Logo 2" />
            <img src="https://i.ibb.co/LdRKh34W/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-12.png" alt="Logo 3" />
            <img src="https://i.ibb.co/YBFb8Z95/Frame-2.png" alt="Logo 4" />
            <img src="https://i.ibb.co/Y45T7tXh/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-1.png" alt="Logo 5" />
            <img src="https://i.ibb.co/TMcyKnx4/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-3.png" alt="Logo 6" />
            <img src="https://i.ibb.co/TxGf8DxS/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-4.png" alt="Logo 7" />
            <img src="https://i.ibb.co/CK1Frqpz/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-5.png" alt="Logo 8" />
            <img src="https://i.ibb.co/TMSNscj7/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-6.png" alt="Logo 9" />
            <img src="https://i.ibb.co/9mHfQJSc/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-7.png" alt="Logo 10" />
            <img src="https://i.ibb.co/kVQBkD29/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-9.png" alt="Logo 11" />
            <img src="https://i.ibb.co/TBy1VSPC/Gemini-Generated-Image-c9lzq6c9lzq6c9lz-10.png" alt="Logo 12" />
          </div>
        </div>
      </section>
    </>
  );
};

export default UnlockSection;
