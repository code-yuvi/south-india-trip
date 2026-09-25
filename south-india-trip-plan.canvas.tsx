import {
  BarChart,
  Button,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Stack,
  Stat,
  Table,
  Text,
  useCanvasState,
  useHostTheme,
} from "cursor/canvas";

type PlanId = "12" | "10";
type TabId = "map" | "plan" | "places" | "logistics";

type DayPlan = {
  day: number;
  title: string;
  stay: string;
  km: number;
  hours: string;
  pace: "Drive-heavy" | "Balanced" | "Visit-heavy";
  morning: string;
  afternoon: string;
  evening: string;
  visits: string[];
  food: string;
  stayHint: string;
  notes: string[];
};

type Place = {
  id: string;
  name: string;
  why: string;
  hours: string;
  visit: string[];
  food: string;
  stay: string;
  timeNeeded: string;
  tips: string[];
};

const DAYS_12: DayPlan[] = [
  {
    day: 1,
    title: "Pune to Srisailam",
    stay: "Srisailam",
    km: 780,
    hours: "14–16 h",
    pace: "Drive-heavy",
    morning: "Leave Pune by 4:00 AM. Breakfast at Satara / Karad. Cross Kolhapur–Belagavi–Ballari corridor.",
    afternoon: "Lunch at Kurnool or Atmakur. Enter Nallamala forest ghats with daylight left.",
    evening: "Reach Srisailam before 8:30 PM. Ghat road closes 9:00 PM–6:00 AM. Check in, light dinner, sleep.",
    visits: ["No sightseeing today — this is a pure transfer day"],
    food: "Highway Andhra / North Karnataka meals. Carry dry snacks and water in the Crysta.",
    stayHint: "Book Srisaila Devasthanam rooms or Haritha hotel. 3 rooms with parking. Confirm hot water.",
    notes: [
      "Two drivers recommended. Swap every 3 hours.",
      "If you miss the 9 PM ghat cutoff, halt Atmakur / Dornala and enter at 6 AM.",
    ],
  },
  {
    day: 2,
    title: "Srisailam darshan, then Tirupati",
    stay: "Tirupati town",
    km: 400,
    hours: "8 h",
    pace: "Balanced",
    morning: "4:30–8:30 AM Mallikarjuna + Bhramaramba darshan. Prefer Seeghra / VIP tickets for a group of 7.",
    afternoon: "Sakshi Ganapathi and a short Krishna viewpoint if energy remains. Leave by 11:00 AM.",
    evening: "Drive via Markapur–Ongole–Nellore to Tirupati. Check in town (not the hill) for easier Innova parking.",
    visits: [
      "Sri Bhramaramba Mallikarjuna Swamy Temple (Jyotirlinga + Shakti Peetha)",
      "Sakshi Ganapathi (if time)",
      "Pathala Ganga / dam viewpoint only if you started very early",
    ],
    food: "Temple Annapurna meals at Srisailam. Evening: Andhra thali in Tirupati (Minerva Coffee Shop or similar).",
    stayHint: "Private hotel in Tirupati with 3 rooms + parking. Hill cottages are tight for 7 + a big car.",
    notes: [
      "Dress code: men dhoti/kurta, women saree/salwar. Carry original Aadhaar used in booking.",
      "Book srisailadevasthanam.org 2–3 weeks ahead.",
    ],
  },
  {
    day: 3,
    title: "Tirumala darshan day",
    stay: "Tirupati town",
    km: 40,
    hours: "1–2 h local",
    pace: "Visit-heavy",
    morning: "Pre-booked ₹300/₹500 SSD slot. TTD bus or authorised taxi to Tirumala. Report 1 hour early.",
    afternoon: "Laddu, annadanam, short rest. Optional: Sri Padmavathi Ammavari Temple at Tiruchanur.",
    evening: "Kapila Theertham if the group still has legs. Pack for a 6 AM start tomorrow.",
    visits: [
      "Sri Venkateswara Temple, Tirumala",
      "Padmavathi Temple, Tiruchanur",
      "Kapila Theertham (optional)",
    ],
    food: "TTD annadanam on the hill. Tirupati laddu is the prasadam to carry. Dinner in town.",
    stayHint: "Same hotel. Do not change rooms mid-stay with this much luggage.",
    notes: [
      "Do not join free Sarva Darshan with 7 people — waits can be 12–24 hours.",
      "Innova usually cannot sit on the hill all day. Park in town, use TTD transport.",
      "Book ttdevasthanams.ap.gov.in as soon as the monthly quota opens.",
    ],
  },
  {
    day: 4,
    title: "Tirupati to Madurai",
    stay: "Madurai (East Masi / KK Nagar)",
    km: 480,
    hours: "9–10 h",
    pace: "Drive-heavy",
    morning: "Leave 6:00 AM via NH38 / Tiruttani–Vellore–Tiruchirappalli.",
    afternoon: "Lunch at Trichy. Optional 45-min stop at Rockfort or Srirangam only if you are ahead of time.",
    evening: "Reach Madurai by 6:00–7:00 PM. Evening darshan at Meenakshi Temple (opens 4:00 PM). Stay for 9:00 PM Palliyarai if possible.",
    visits: ["Meenakshi Sundareswarar Temple — evening circuit and gopurams"],
    food: "Trichy highway meals midday. Night: Murugan Idli Shop + Famous Jigarthanda on West Masi.",
    stayHint: "Hotel with parking within 1–2 km of the temple. 3 rooms. Avoid the innermost streets for a Crysta.",
    notes: ["This is the second-longest day. Do not add extra temples on the way."],
  },
  {
    day: 5,
    title: "Madurai morning, Rameswaram night",
    stay: "Rameswaram",
    km: 175,
    hours: "3.5–4 h",
    pace: "Balanced",
    morning: "5:30–8:30 AM Meenakshi + Sundareswarar again (calmer than night). Thousand Pillar Hall + Golden Lotus Tank.",
    afternoon: "Thirumalai Nayakkar Palace (1.5 km). Lunch, then drive via Ramanathapuram. Cross Pamban Bridge in daylight.",
    evening: "Check in Rameswaram. Sunset at Agni Theertham. Early sleep — temple opens ~5 AM.",
    visits: [
      "Meenakshi Temple (morning repeat is worth it)",
      "Thirumalai Nayakkar Palace",
      "Pamban Bridge",
      "Agni Theertham",
    ],
    food: "Breakfast idli/dosa. Lunch Chettinad or meals. Rameswaram: simple South Indian; seafood if the group eats non-veg.",
    stayHint: "Stay near East Car Street / temple tank for a 5 AM walk. Confirm parking — streets are narrow.",
    notes: ["Buy a cheap spare dhoti set tonight. You will get wet in the 22 wells tomorrow."],
  },
  {
    day: 6,
    title: "Rameswaram, Dhanushkodi, Kanyakumari",
    stay: "Kanyakumari",
    km: 330,
    hours: "7 h plus local",
    pace: "Balanced",
    morning: "5:00 AM Ramanathaswamy. Do 22 Theerthams first (5:30 AM–12:30 PM window), change to dry clothes, then garbha griha darshan.",
    afternoon: "Dhanushkodi 18 km — ghost town, Ram Setu viewpoint, Bay of Bengal meets Indian Ocean. Last entry ~5–6 PM; go by 1:00 PM.",
    evening: "Drive to Kanyakumari (about 6.5 h). Night halt. Do not attempt Vivekananda Rock today.",
    visits: [
      "Ramanathaswamy Temple (Jyotirlinga + Char Dham)",
      "22 holy wells",
      "Gandhamadhana Parvatham (only if running early)",
      "Dhanushkodi ruins and land’s end",
    ],
    food: "Temple prasadam / local meals. Carry water and hats for Dhanushkodi — almost no shade.",
    stayHint: "Kanyakumari hotel facing the sea if possible. 3 rooms. Parking is easier than Rameswaram.",
    notes: [
      "Dhanushkodi is a day visit only — no stay, strong wind, no ATMs.",
      "APJ Abdul Kalam Memorial is on the way out of Rameswaram if you have 40 extra minutes.",
    ],
  },
  {
    day: 7,
    title: "Kanyakumari sunrise to Thiruvananthapuram",
    stay: "Thiruvananthapuram",
    km: 90,
    hours: "2 h",
    pace: "Visit-heavy",
    morning: "5:30 AM sunrise at the confluence. 8:00 AM first ferry to Vivekananda Rock + Thiruvalluvar Statue. Kumari Amman Temple after.",
    afternoon: "Gandhi Mandapam / Triveni Sangam viewpoint. Lunch. Drive via Suchindram (optional 30 min) to TVM.",
    evening: "Padmanabhaswamy Temple evening darshan 5:00–7:20 PM. Strict Kerala dress code.",
    visits: [
      "Sunrise point, Kanyakumari",
      "Vivekananda Rock Memorial + Thiruvalluvar Statue",
      "Kumari Amman Temple",
      "Sree Padmanabhaswamy Temple",
    ],
    food: "Kanyakumari: banana chips, coconut water, fish curry meals. TVM: Kerala sadya, appam + stew.",
    stayHint: "Stay Fort / East Fort / Palayam side for the temple. Keep mundu/saree ready in the car.",
    notes: [
      "Ferry 8 AM–4 PM, weather dependent. Special tickets skip some queue.",
      "Men: mundu only, no shirt inside Padmanabhaswamy. Rent dhotis at the gate if needed.",
    ],
  },
  {
    day: 8,
    title: "Jatayu, then Adiyogi",
    stay: "Coimbatore / Isha foothills",
    km: 330,
    hours: "7–8 h",
    pace: "Balanced",
    morning: "Drive TVM → Chadayamangalam (50 km, 1.5 h). Jatayu Earth’s Center 9:30 AM–1:00 PM. Take the ropeway, not only the walkway.",
    afternoon: "Leave by 1:30 PM. Skip Kolli Hills on this loop. Route: NH towards Palakkad → Coimbatore → Isha.",
    evening: "Adiyogi by 6:30 PM for the 7:00 PM light-and-sound. Dhyanalinga if still open.",
    visits: [
      "Jatayu sculpture (Ramayana — Jatayu vs Ravana)",
      "Adiyogi 112 ft face",
      "Adiyogi Divya Darshanam show",
    ],
    food: "Kerala meals near Jatayu. Evening sattvic / simple food at Isha or Coimbatore hotel.",
    stayHint: "Isha cottages if booked; otherwise a Coimbatore hotel with parking is easier for 7 people.",
    notes: [
      "Kolli Hills is a 400 km east detour from here, then 220 km back west to Adiyogi. Drop it.",
      "Jatayu ticket counter effectively closes ~5 PM; morning is mandatory on this day.",
    ],
  },
  {
    day: 9,
    title: "Isha morning, Ooty ghats",
    stay: "Ooty",
    km: 95,
    hours: "3–3.5 h ghat",
    pace: "Visit-heavy",
    morning: "Dhyanalinga + Linga Bhairavi 6:00–9:00 AM. Quiet time. No phones inside Dhyanalinga.",
    afternoon: "Drive Coimbatore → Mettupalayam → Coonoor → Ooty. Slow ghat, do not rush the Crysta.",
    evening: "Ooty Lake or a tea estate viewpoint. Early dinner — it gets cold.",
    visits: ["Dhyanalinga", "Linga Bhairavi", "Coonoor tea views on the climb", "Ooty Lake"],
    food: "Isha canteen breakfast. Ooty: South Indian + homemade chocolate. Carry jackets in the car.",
    stayHint: "Ooty hotel with parking off the main bazaar. 3 rooms. Night temperature can drop to 8–12°C.",
    notes: ["If anyone is prone to motion sickness, take a tablet before the ghat."],
  },
  {
    day: 10,
    title: "Ooty to Mysore",
    stay: "Mysore",
    km: 125,
    hours: "3.5 h",
    pace: "Visit-heavy",
    morning: "Botanical Garden + Doddabetta Peak. Skip the toy train unless tickets are already in hand.",
    afternoon: "Drive Ooty–Gundlupet–Mysore after lunch.",
    evening: "Mysore Palace. If Sunday/holiday: illumination 7:00–8:00 PM. Else sound-and-light around 7:00 PM.",
    visits: ["Government Botanical Garden", "Doddabetta", "Mysore Palace"],
    food: "Ooty lunch. Mysore: Mylari / Vinayaka Mylari dosa, Guru Sweets Mysore pak, filter coffee.",
    stayHint: "Stay near palace / Chamundi foothills with parking. 3 rooms.",
    notes: ["Nilgiri Mountain Railway is a lottery — do not build the day around it."],
  },
  {
    day: 11,
    title: "Mysore to Kolhapur",
    stay: "Kolhapur",
    km: 550,
    hours: "10 h",
    pace: "Drive-heavy",
    morning: "Chamundi Hill temple at 6:30 AM (quick darshan + city view). Leave Mysore by 8:30 AM.",
    afternoon: "NH48 via Hunsur–Hassan–Chikkamagaluru belt or the faster Mysore–Hubballi–Kolhapur line depending on traffic. Lunch at Hubballi / Belagavi.",
    evening: "Reach Kolhapur. Rankala Lake walk if you arrive before 8 PM.",
    visits: ["Chamundeshwari Temple", "Rankala Lake (evening)"],
    food: "Highway meals. Kolhapur dinner: misal or thali. Non-veg group: tambda / pandhra rassa.",
    stayHint: "Hotel near Mahalaxmi Temple or Rankala with parking.",
    notes: ["This is a long inland transfer. Audiobooks, two drivers, no extra stops."],
  },
  {
    day: 12,
    title: "Kolhapur Mahalaxmi, home to Pune",
    stay: "Pune",
    km: 230,
    hours: "5 h",
    pace: "Balanced",
    morning: "5:00–8:00 AM Mahalaxmi Temple (Shakti Peetha). Optional New Palace museum if the group wants 45 min.",
    afternoon: "Lunch in Kolhapur. Drive NH48 to Pune. Tea at Satara.",
    evening: "Reach Pune by 6:00–7:00 PM.",
    visits: ["Kolhapur Mahalaxmi Temple", "New Palace (optional)"],
    food: "Kolhapuri thali before leaving. No need to eat again until Pune unless you want Satara vada pav / misal.",
    stayHint: "Home.",
    notes: ["Friday and Navratri queues at Mahalaxmi are long — go at opening if those dates hit."],
  },
];

const DAYS_10: DayPlan[] = [
  {
    day: 1,
    title: "Pune to Srisailam",
    stay: "Srisailam",
    km: 780,
    hours: "14–16 h",
    pace: "Drive-heavy",
    morning: "Leave Pune 3:30–4:00 AM. Same corridor as the 12-day plan.",
    afternoon: "No stops beyond fuel and food. Target Atmakur by 4:30 PM.",
    evening: "Must be on the ghat before 9:00 PM closure.",
    visits: ["None"],
    food: "Packed breakfast + highway meals.",
    stayHint: "Devasthanam / Haritha. 3 rooms.",
    notes: ["This day does not shrink. It is the price of starting from Pune."],
  },
  {
    day: 2,
    title: "Srisailam to Tirupati",
    stay: "Tirupati",
    km: 400,
    hours: "8 h",
    pace: "Balanced",
    morning: "Darshan 4:30–8:00 AM only. Skip extra Srisailam viewpoints.",
    afternoon: "Drive out by 9:30 AM.",
    evening: "Tirupati town hotel.",
    visits: ["Mallikarjuna + Bhramaramba only"],
    food: "Temple meal, then road food.",
    stayHint: "Town hotel with parking.",
    notes: ["SSD tickets for tomorrow must already be in hand."],
  },
  {
    day: 3,
    title: "Tirupati darshan, drive to Madurai",
    stay: "Madurai",
    km: 480,
    hours: "9–10 h after darshan",
    pace: "Drive-heavy",
    morning: "Earliest possible SSD slot (aim 6–8 AM). No Padmavathi, no extra shrines.",
    afternoon: "Leave Tirupati by 12:00 noon. Lunch in the car / Trichy.",
    evening: "Madurai 9:00–10:00 PM. Meenakshi only if you arrive before 9:00 PM; else sleep.",
    visits: ["Tirumala only"],
    food: "Packed laddu + highway meals.",
    stayHint: "Madurai hotel with parking.",
    notes: ["This is the day most 10-day plans break. If darshan slips, halt Trichy and accept a shorter Madurai."],
  },
  {
    day: 4,
    title: "Madurai to Rameswaram",
    stay: "Rameswaram",
    km: 175,
    hours: "3.5 h",
    pace: "Balanced",
    morning: "Meenakshi 5:30–9:00 AM including Thousand Pillar Hall.",
    afternoon: "Skip palace if late. Drive to Rameswaram.",
    evening: "Agni Theertham sunset.",
    visits: ["Meenakshi Temple", "Pamban Bridge"],
    food: "Jigarthanda before leaving Madurai.",
    stayHint: "Near the temple tank.",
    notes: ["Palace is the sacrifice on the 10-day plan."],
  },
  {
    day: 5,
    title: "Rameswaram + Dhanushkodi to Kanyakumari",
    stay: "Kanyakumari",
    km: 330,
    hours: "7 h plus local",
    pace: "Balanced",
    morning: "5 AM temple + 22 wells. Leave island by 12:30 PM after Dhanushkodi.",
    afternoon: "Drive the east coast / Ramanathapuram–Nagercoil line.",
    evening: "Kanyakumari night. No rock memorial today.",
    visits: ["Ramanathaswamy", "Dhanushkodi"],
    food: "Carry water for Dhanushkodi.",
    stayHint: "Sea-facing if possible.",
    notes: ["Same as 12-day Day 6 — this stretch cannot be cut."],
  },
  {
    day: 6,
    title: "Kanyakumari, TVM, Jatayu",
    stay: "Kollam / Chadayamangalam / TVM north",
    km: 140,
    hours: "4 h spread",
    pace: "Visit-heavy",
    morning: "Sunrise + 8 AM ferry. Leave Kanyakumari by 11:30 AM.",
    afternoon: "Padmanabhaswamy if you hit the 5 PM window; otherwise skip and go to Jatayu first.",
    evening: "Jatayu needs a 3:00 PM arrival at latest. Stay north of TVM to shorten tomorrow.",
    visits: ["Kanyakumari sunrise + Rock", "Padmanabhaswamy OR Jatayu — picking both is tight"],
    food: "Kerala meals.",
    stayHint: "Hotel on MC Road / Kollam side with parking.",
    notes: ["If Padmanabhaswamy is non-negotiable, do evening darshan and Jatayu at 9:30 AM on Day 7, then a later Adiyogi arrival."],
  },
  {
    day: 7,
    title: "Jatayu leftover to Adiyogi",
    stay: "Coimbatore",
    km: 300,
    hours: "6.5–7.5 h",
    pace: "Drive-heavy",
    morning: "Jatayu if missed yesterday. Else start toward Palakkad by 8 AM.",
    afternoon: "Skip Kolli Hills completely.",
    evening: "Adiyogi show at 7 PM if you arrive in time; else morning-only tomorrow.",
    visits: ["Jatayu", "Adiyogi (evening if possible)"],
    food: "Road meals.",
    stayHint: "Coimbatore hotel, not Isha, unless already booked.",
    notes: ["Kolli Hills is the first thing to delete on a 10-day clock."],
  },
  {
    day: 8,
    title: "Adiyogi + Ooty",
    stay: "Ooty",
    km: 95,
    hours: "3 h ghat",
    pace: "Balanced",
    morning: "Dhyanalinga 6–8 AM.",
    afternoon: "Drive to Ooty.",
    evening: "Lake + bazaar chocolates.",
    visits: ["Dhyanalinga", "Ooty Lake"],
    food: "Isha breakfast, Ooty dinner.",
    stayHint: "Hotel with parking.",
    notes: ["No Coonoor side quests."],
  },
  {
    day: 9,
    title: "Ooty to Mysore",
    stay: "Mysore",
    km: 125,
    hours: "3.5 h",
    pace: "Visit-heavy",
    morning: "Doddabetta or Botanical Garden — pick one.",
    afternoon: "Drive to Mysore.",
    evening: "Palace + illumination if Sunday.",
    visits: ["One Ooty highlight", "Mysore Palace"],
    food: "Mysore dosa night.",
    stayHint: "Near palace.",
    notes: ["Chamundi moves to a 6 AM dash on Day 10."],
  },
  {
    day: 10,
    title: "Mysore → Kolhapur → Pune",
    stay: "Pune",
    km: 780,
    hours: "14–15 h",
    pace: "Drive-heavy",
    morning: "Chamundi 6:00 AM. Leave Mysore 7:30 AM.",
    afternoon: "Kolhapur Mahalaxmi 2:00–3:30 PM only. No Rankala, no museum.",
    evening: "Drive to Pune, arrive 9:30–11:00 PM.",
    visits: ["Chamundi (quick)", "Mahalaxmi (quick)"],
    food: "Kolhapur thali as the only sit-down meal.",
    stayHint: "Home. This day is survival, not tourism.",
    notes: [
      "This last day is why 10 days is the wrong length for this route.",
      "If anyone is elderly, halt Kolhapur and reach Pune on a 11th morning instead.",
    ],
  },
];

const PLACES: Place[] = [
  {
    id: "srisailam",
    name: "Srisailam",
    why: "Rare place that is both a Jyotirlinga (Mallikarjuna) and a Shakti Peetha (Bhramaramba). Set in Nallamala forest above the Krishna.",
    hours: "Temple 4:30 AM–1:00 PM and 6:00–9:00 PM. Ghat closed 9:00 PM–6:00 AM.",
    visit: [
      "Mallikarjuna Sparsha/Seeghra darshan",
      "Bhramaramba Devi",
      "Sakshi Ganapathi on the approach road",
      "Srisailam Dam / Pathala Ganga if you have a spare hour",
    ],
    food: "Annapurna Mandiram free meals from late morning. Otherwise simple Andhra rice plates, gongura, pulihora.",
    stay: "Official cottages via srisailadevasthanam.org, or AP Tourism Haritha. Book 15+ days ahead for 3 rooms.",
    timeNeeded: "One night. Morning darshan + leave.",
    tips: [
      "VIP / Seeghra is worth it for 7 people.",
      "Traditional dress only.",
      "Do not plan a night arrival after 9 PM.",
    ],
  },
  {
    id: "tirupati",
    name: "Tirupati / Tirumala",
    why: "Sri Venkateswara on the seven hills is the busiest Vishnu temple in the world. For many families this is the spiritual centre of the whole trip.",
    hours: "Temple runs almost round the clock; your SSD slot is what matters. Report 1 hour early.",
    visit: [
      "Tirumala main darshan",
      "Laddu prasadam",
      "Padmavathi Temple at Tiruchanur",
      "Kapila Theertham waterfall temple",
    ],
    food: "TTD annadanam. In town: Andhra meals, tiffins, filter coffee. Carry extra laddus in a tin.",
    stay: "Tirupati town is better for an Innova group. Hill rooms fill fast and car access is restricted.",
    timeNeeded: "One full day on the 12-day plan; a morning slot only on the 10-day squeeze.",
    tips: [
      "Book ₹300 special entry at ttdevasthanams.ap.gov.in the moment the month opens.",
      "Never gamble on free Sarva Darshan with a fixed road itinerary.",
      "Park in town; use TTD buses.",
    ],
  },
  {
    id: "madurai",
    name: "Madurai",
    why: "Meenakshi Sundareswarar Temple is a living Dravidian city-temple: 14 gopurams, a goddess who is the city’s queen, and a nightly ritual where Shiva is carried to her chamber.",
    hours: "5:00 AM–12:30 PM and 4:00 PM–9:30/10:00 PM.",
    visit: [
      "Meenakshi and Sundareswarar shrines",
      "Thousand Pillar Hall",
      "Golden Lotus Tank",
      "9:00 PM Palliyarai procession",
      "Thirumalai Nayakkar Palace",
    ],
    food: "Murugan Idli (podi idli, kal dosa), Famous Jigarthanda, Madurai bun parotta, kari dosa, filter coffee.",
    stay: "East / West Masi periphery or KK Nagar. Crysta cannot sit in the innermost temple streets.",
    timeNeeded: "Evening + next morning is the right dose.",
    tips: [
      "Go twice: night for drama, morning for darshan.",
      "Inner shrines are for Hindus; outer corridors are open to all.",
      "Shoes off — floors get hot by 10 AM.",
    ],
  },
  {
    id: "rameswaram",
    name: "Rameswaram",
    why: "Jyotirlinga where Rama worshipped Shiva after Lanka. Also a Char Dham site. The 22 wells are a physical pilgrimage, not just a viewing.",
    hours: "Temple ~5:00 AM–1:00 PM and 3:00–8:00/9:00 PM. Wells 5:30 AM–12:30 PM and 3:00–7:00 PM.",
    visit: [
      "22 Theertham bath (hire the temple guide with the brass pots)",
      "Ramanathaswamy sanctum after changing to dry clothes",
      "Agni Theertham sea bath",
      "Pamban Bridge",
      "Kalam Memorial (optional)",
    ],
    food: "Simple vegetarian near the temple. Non-veg seafood in hotels away from the sanctum streets.",
    stay: "One night near East Car Street. Confirm a parking slot when you book.",
    timeNeeded: "Morning temple + afternoon Dhanushkodi.",
    tips: [
      "Carry two sets of clothes and a plastic bag.",
      "Wet clothes are not allowed in the main shrine.",
      "Start at opening or you will queue through the wells.",
    ],
  },
  {
    id: "dhanushkodi",
    name: "Dhanushkodi",
    why: "Town wiped out by the 1964 cyclone. The road ends at the tip of India looking toward Sri Lanka, believed to be the start of Ram Setu.",
    hours: "About 6:00 AM–6:00 PM.",
    visit: [
      "Ruined church and water tank",
      "Land’s-end beach",
      "Bay of Bengal / Indian Ocean meeting waters",
    ],
    food: "Almost nothing reliable. Carry snacks and 2 litres of water per person.",
    stay: "Do not stay. Return to Rameswaram or continue to Kanyakumari.",
    timeNeeded: "2–2.5 hours including the 18 km drive.",
    tips: [
      "The Crysta can do the tar road that now goes all the way.",
      "Wind is fierce — hold children and phones.",
      "No shade, no toilets worth using. Go after lunch, leave by 4 PM.",
    ],
  },
  {
    id: "kanyakumari",
    name: "Kanyakumari",
    why: "Southern tip where three seas meet. Sunrise over the Bay of Bengal is the reason you halt a night here, not the bazaar.",
    hours: "Sunrise ~6:00 AM. Vivekananda ferry 8:00 AM–4:00 PM (sea permitting).",
    visit: [
      "Sunrise point",
      "Vivekananda Rock Memorial",
      "Thiruvalluvar Statue (same ferry complex)",
      "Kumari Amman Temple",
      "Gandhi Mandapam",
    ],
    food: "Banana chips, coconut water, fish meals, Tamil tiffins. Average hotel food — eat for fuel.",
    stay: "One night, sea-view if the budget allows. 3 rooms.",
    timeNeeded: "Night + sunrise + 8 AM ferry. Leave by late morning.",
    tips: [
      "Book the first ferry. Later boats mean heat and queues.",
      "Sunset is famous but clashes with the TVM drive — skip it on this itinerary.",
      "Suchindram Thanumalayan Temple is a high-value 30-min stop on the TVM road.",
    ],
  },
  {
    id: "tvm",
    name: "Thiruvananthapuram",
    why: "Padmanabhaswamy is Vishnu in Anantha Shayana. One of the most important and strictly run temples in India.",
    hours: "Roughly 3:30 AM–12:00 PM and 5:00 PM–7:20 PM, in short darshan windows.",
    visit: [
      "Padmanabhaswamy Temple",
      "Kuthiramalika Palace Museum if you have a spare hour",
      "Shanghumugham Beach only if the group is tired of temples",
    ],
    food: "Kerala sadya, appam + vegetable stew, puttu kadala, banana chips, fish moilee for non-veg.",
    stay: "Fort / Palayam. Easy for evening darshan.",
    timeNeeded: "One evening darshan, or morning if you overnight.",
    tips: [
      "Men: mundu, bare chest. Women: saree or set mundu. No western wear.",
      "Mobile phones often not allowed inside.",
      "Do not combine a late Padmanabhaswamy visit with a late Jatayu visit on the same afternoon.",
    ],
  },
  {
    id: "jatayu",
    name: "Jatayu Earth’s Center",
    why: "Chadayamangalam, Kollam. World’s largest bird sculpture, on the hill where Jatayu is said to have fallen after fighting Ravana to save Sita.",
    hours: "About 9:30 AM–5:30 PM. Ticket window effectively closes ~5:00 PM.",
    visit: [
      "Cable car to the sculpture",
      "View from Jatayu’s wing and talon",
      "Short adventure bits only if you have extra time",
    ],
    food: "On-site cafeteria is average. Eat a proper Kerala meal before or after in Chadayamangalam / Kollam.",
    stay: "Do not overnight here on this trip. Use TVM or Coimbatore as anchors.",
    timeNeeded: "2.5–3 hours including ropeway queues.",
    tips: [
      "Take the ropeway package, not only the walkway, with elders in the group.",
      "It sits north of TVM — visit after Kanyakumari → TVM, never before TVM.",
      "Morning light photographs better than harsh noon.",
    ],
  },
  {
    id: "kolli",
    name: "Kolli Hills",
    why: "Eastern Ghats hill of the Kollipavai goddess, 70 hairpin bends, Agaya Gangai falls, and Arapaleeswarar Temple. Beautiful — and in the wrong place on this loop.",
    hours: "Viewpoints daylight only. Falls sometimes close after heavy rain or dry up in summer.",
    visit: [
      "70 hairpins from Karavalli",
      "Agaya Gangai (steep steps)",
      "Seekuparai viewpoint",
      "Arapaleeswarar Temple",
    ],
    food: "Homestay meals, millets, local honey. Limited restaurants for 7 people at once.",
    stay: "Homestays. Three rooms are harder to find than in Coimbatore / Ooty.",
    timeNeeded: "One full night minimum. Not a drive-through.",
    tips: [
      "From Jatayu it is ~400 km east, then ~220 km west to Adiyogi. That is a 10-hour penalty.",
      "Drop it unless you add a 13th day.",
      "If you insist: after Jatayu, night in Kolli, next day Adiyogi — and drop a Mysore morning.",
    ],
  },
  {
    id: "adiyogi",
    name: "Adiyogi (Isha, Coimbatore)",
    why: "112-foot face of Shiva at the Velliangiri foothills. Built as a yogic consecrated space, not a classical temple town.",
    hours: "Campus about 6:00 AM–8:00 PM. Light show ~7:00 PM.",
    visit: [
      "Adiyogi statue and lawn",
      "Divya Darshanam evening show",
      "Dhyanalinga (silence, no phones)",
      "Linga Bhairavi",
    ],
    food: "Sattvic Isha kitchen. For a group that wants variety, eat in Coimbatore city.",
    stay: "Isha cottages if you book early; otherwise Coimbatore (better parking, dinner options, fuel).",
    timeNeeded: "Evening show + next morning Dhyanalinga is the ideal split.",
    tips: [
      "Modest clothing. Dhyanalinga has a quiet, shoe-free, phone-free discipline.",
      "The Crysta is fine; follow Isha parking directions.",
      "Do not climb to Ooty the same night as the 7 PM show — stay and move at 9:30 AM.",
    ],
  },
  {
    id: "ooty",
    name: "Ooty",
    why: "Nilgiri hill station after days of plains temples. This is the trip’s weather reset: tea, cold air, and a slow ghat.",
    hours: "Lake, garden, Doddabetta are daytime (roughly 8:00 AM–5:30/6:00 PM).",
    visit: [
      "Government Botanical Garden",
      "Doddabetta Peak",
      "Ooty Lake (boat only if queues are short)",
      "A tea estate viewpoint on the Coonoor road",
    ],
    food: "South Indian tiffins, homemade chocolate, tea. Food is tourist-priced and average — eat one good meal, not three.",
    stay: "One night off the bazaar, with parking. Carry warm layers.",
    timeNeeded: "One afternoon + next morning, then drop to Mysore.",
    tips: [
      "Toy train tickets sell out — treat it as bonus, not a plan.",
      "Crysta on the ghat: low gear, no night driving, no overtaking buses on blind bends.",
      "Pick two sights, not five.",
    ],
  },
  {
    id: "mysore",
    name: "Mysore",
    why: "Wodeyar palace city. The palace is the visual climax of the Karnataka leg; Chamundi Hill is the spiritual one.",
    hours: "Palace 10:00 AM–5:30 PM. Illumination Sundays and holidays 7:00–8:00 PM.",
    visit: [
      "Mysore Palace interiors",
      "Evening illumination or sound-and-light",
      "Chamundeshwari Temple",
      "Devaraja Market (quick)",
    ],
    food: "Mysore masala dosa (Mylari), Mysore pak, filter coffee, palace-area thalis.",
    stay: "One night near the palace with parking.",
    timeNeeded: "Evening palace + morning Chamundi on the 12-day plan.",
    tips: [
      "Time the overnight so Sunday hits the palace lights if you can choose dates.",
      "Chamundi before 8 AM beats both heat and school buses.",
    ],
  },
  {
    id: "kolhapur",
    name: "Kolhapur",
    why: "Mahalaxmi is a major Shakti Peetha and the natural last temple before Pune. It also breaks the Mysore–Pune drive.",
    hours: "About 4:00/5:00 AM–10:00 PM with a short midday pause. Kakad aarti ~4:30 AM.",
    visit: [
      "Mahalaxmi Temple",
      "Rankala Lake",
      "New Palace museum if you overnight",
    ],
    food: "Misal, thali, jhunka bhakri. Non-veg: Kolhapuri rassa. This will be the group’s favourite sit-down meal of the return.",
    stay: "One night on the 12-day plan. Skip the night only if you accept a 15-hour last day.",
    timeNeeded: "Morning darshan + lunch, then Pune.",
    tips: [
      "Fridays are heavy. Go at opening.",
      "Park a little away from the temple core; streets are tight.",
    ],
  },
];

type LabelSide = "left" | "right" | "below" | "above";

type Stop = {
  seq: number;
  name: string;
  label?: string;
  lon: number;
  lat: number;
  when: string;
  nights: number;
  placeId?: string;
  side: LabelSide;
  headline: string;
};

const STOPS: Stop[] = [
  {
    seq: 1,
    name: "Pune",
    label: "Pune (start & end)",
    lon: 73.86,
    lat: 18.52,
    when: "Day 1 start, Day 12 return",
    nights: 0,
    side: "right",
    headline:
      "Leave at 4:00 AM on Day 1 with fuel full, soft bags loaded and two drivers ready. You come back to this same point on Day 12 evening.",
  },
  {
    seq: 2,
    name: "Srisailam",
    lon: 78.87,
    lat: 16.07,
    when: "Day 1 night, Day 2 darshan",
    nights: 1,
    placeId: "srisailam",
    side: "right",
    headline: "Jyotirlinga + Shakti Peetha in Nallamala forest. Ghat shuts 9 PM.",
  },
  {
    seq: 3,
    name: "Tirupati",
    lon: 79.42,
    lat: 13.63,
    when: "Day 2 night, Day 3 full day",
    nights: 2,
    placeId: "tirupati",
    side: "right",
    headline: "Tirumala darshan on a booked slot. Stay in town, bus up the hill.",
  },
  {
    seq: 4,
    name: "Madurai",
    lon: 78.12,
    lat: 9.93,
    when: "Day 4 night, Day 5 morning",
    nights: 1,
    placeId: "madurai",
    side: "left",
    headline: "Meenakshi Temple twice: 9 PM procession and a calm 5:30 AM darshan.",
  },
  {
    seq: 5,
    name: "Rameswaram",
    lon: 79.31,
    lat: 9.29,
    when: "Day 5 night, Day 6 morning",
    nights: 1,
    placeId: "rameswaram",
    side: "right",
    headline: "22 wells from 5:30 AM, then the sanctum in dry clothes.",
  },
  {
    seq: 6,
    name: "Dhanushkodi",
    lon: 79.44,
    lat: 9.15,
    when: "Day 6 afternoon",
    nights: 0,
    placeId: "dhanushkodi",
    side: "below",
    headline: "Cyclone ruins at land's end. Two hours, no shade, carry water.",
  },
  {
    seq: 7,
    name: "Kanyakumari",
    lon: 77.55,
    lat: 8.08,
    when: "Day 6 night, Day 7 sunrise",
    nights: 1,
    placeId: "kanyakumari",
    side: "below",
    headline: "Sunrise at the three seas, then the 8 AM ferry to Vivekananda Rock.",
  },
  {
    seq: 8,
    name: "Thiruvananthapuram",
    lon: 76.94,
    lat: 8.52,
    when: "Day 7 evening",
    nights: 1,
    placeId: "tvm",
    side: "left",
    headline: "Padmanabhaswamy 5:00–7:20 PM. Mundu and saree only.",
  },
  {
    seq: 9,
    name: "Jatayu",
    lon: 76.86,
    lat: 8.87,
    when: "Day 8, 9:30 AM–1:00 PM",
    nights: 0,
    placeId: "jatayu",
    side: "left",
    headline: "World's largest bird sculpture. Take the ropeway, not the steps.",
  },
  {
    seq: 10,
    name: "Adiyogi / Coimbatore",
    lon: 76.74,
    lat: 10.97,
    when: "Day 8 night, Day 9 morning",
    nights: 1,
    placeId: "adiyogi",
    side: "left",
    headline: "7 PM light show, then Dhyanalinga at 6 AM in silence.",
  },
  {
    seq: 11,
    name: "Ooty",
    lon: 76.7,
    lat: 11.41,
    when: "Day 9 night, Day 10 morning",
    nights: 1,
    placeId: "ooty",
    side: "left",
    headline: "Cold air reset after the plains. Slow ghat, jackets out.",
  },
  {
    seq: 12,
    name: "Mysore",
    lon: 76.64,
    lat: 12.3,
    when: "Day 10 night, Day 11 morning",
    nights: 1,
    placeId: "mysore",
    side: "left",
    headline: "Palace in the evening, Chamundi Hill at 6:30 AM.",
  },
  {
    seq: 13,
    name: "Kolhapur",
    lon: 74.24,
    lat: 16.7,
    when: "Day 11 night, Day 12 morning",
    nights: 1,
    placeId: "kolhapur",
    side: "left",
    headline: "Mahalaxmi Shakti Peetha at opening, then a Kolhapuri thali.",
  },
  {
    seq: 14,
    name: "Pune",
    lon: 73.86,
    lat: 18.52,
    when: "Day 12 evening",
    nights: 0,
    side: "above",
    headline: "Home by 6–7 PM on NH48.",
  },
];

const KOLLI = { name: "Kolli Hills", lon: 78.34, lat: 11.25 };

type Leg = {
  from: string;
  to: string;
  km: number;
  hours: string;
  road: string;
};

const LEGS: Leg[] = [
  { from: "Pune", to: "Srisailam", km: 780, hours: "14–16 h", road: "Satara–Belagavi–Ballari–Kurnool, then forest ghat" },
  { from: "Srisailam", to: "Tirupati", km: 400, hours: "8 h", road: "Markapur–Ongole–Nellore" },
  { from: "Tirupati", to: "Madurai", km: 480, hours: "9–10 h", road: "Vellore–Trichy on NH38/NH44" },
  { from: "Madurai", to: "Rameswaram", km: 175, hours: "3.5 h", road: "Ramanathapuram, then Pamban Bridge" },
  { from: "Rameswaram", to: "Dhanushkodi", km: 36, hours: "1 h return", road: "Tar road to the tip and back" },
  { from: "Rameswaram", to: "Kanyakumari", km: 310, hours: "6.5 h", road: "Ramanathapuram–Tuticorin–Nagercoil" },
  { from: "Kanyakumari", to: "Thiruvananthapuram", km: 90, hours: "2 h", road: "Via Suchindram if you have 30 min" },
  { from: "Thiruvananthapuram", to: "Jatayu", km: 50, hours: "1.5 h", road: "MC Road to Chadayamangalam" },
  { from: "Jatayu", to: "Adiyogi", km: 280, hours: "6.5 h", road: "Kollam–Punalur–Palakkad–Coimbatore" },
  { from: "Adiyogi", to: "Ooty", km: 95, hours: "3–3.5 h", road: "Mettupalayam–Coonoor ghat, daylight only" },
  { from: "Ooty", to: "Mysore", km: 125, hours: "3.5 h", road: "Gudalur–Gundlupet" },
  { from: "Mysore", to: "Kolhapur", km: 550, hours: "10 h", road: "Hubballi–Belagavi on NH48" },
  { from: "Kolhapur", to: "Pune", km: 230, hours: "5 h", road: "NH48 with tea at Satara" },
];

const MAP_W = 520;
const MAP_H = 760;
const LON_MIN = 72.5;
const LON_SPAN = 9.7;
const LAT_MAX = 20;
const LAT_SPAN = 14.2;

function px(lon: number, lat: number) {
  return {
    x: ((lon - LON_MIN) / LON_SPAN) * MAP_W,
    y: ((LAT_MAX - lat) / LAT_SPAN) * MAP_H,
  };
}

function pathFrom(points: Array<[number, number]>, close: boolean) {
  const d = points
    .map(([lon, lat], i) => {
      const p = px(lon, lat);
      return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");
  return close ? `${d} Z` : d;
}

const PENINSULA: Array<[number, number]> = [
  [72.85, 19.6], [73.05, 18.6], [73.3, 17.6], [73.5, 16.6], [74.0, 15.6],
  [74.4, 14.6], [74.7, 13.6], [74.9, 12.8], [75.2, 12.1], [75.6, 11.4],
  [75.9, 10.8], [76.2, 10.0], [76.4, 9.5], [76.6, 9.0], [76.9, 8.6],
  [77.2, 8.3], [77.55, 8.08], [78.0, 8.5], [78.25, 8.95], [78.55, 9.2],
  [79.05, 9.3], [79.5, 9.18], [79.35, 9.62], [79.0, 9.92], [79.35, 10.3],
  [79.85, 10.4], [79.8, 11.0], [79.95, 11.9], [80.15, 12.6], [80.3, 13.2],
  [80.2, 14.0], [80.15, 14.6], [80.5, 15.4], [80.9, 15.9], [81.2, 16.4],
  [80.9, 17.4], [80.2, 18.4], [79.0, 19.2], [77.5, 19.7], [76.0, 19.8],
  [74.5, 19.7],
];

const LANKA: Array<[number, number]> = [
  [79.9, 9.8], [80.5, 9.6], [81.0, 8.8], [81.5, 8.0], [81.9, 7.2],
  [81.6, 6.5], [80.9, 5.95], [80.2, 6.2], [79.85, 7.2], [79.75, 8.2],
];

function labelPos(stop: Stop) {
  const p = px(stop.lon, stop.lat);
  if (stop.side === "left") return { x: p.x - 11, y: p.y + 4, anchor: "end" as const };
  if (stop.side === "right") return { x: p.x + 12, y: p.y + 4, anchor: "start" as const };
  if (stop.side === "below") return { x: p.x + 2, y: p.y + 20, anchor: "start" as const };
  return { x: p.x, y: p.y - 14, anchor: "middle" as const };
}

function RouteMap({
  selectedSeq,
  onSelect,
  showKolli,
}: {
  selectedSeq: number;
  onSelect: (seq: number) => void;
  showKolli: boolean;
}) {
  const theme = useHostTheme();
  const routePath = pathFrom(STOPS.map((s) => [s.lon, s.lat] as [number, number]), false);
  const jatayu = STOPS.find((s) => s.name === "Jatayu")!;
  const adiyogi = STOPS.find((s) => s.name.startsWith("Adiyogi"))!;
  const kolliDetour = pathFrom(
    [
      [jatayu.lon, jatayu.lat],
      [KOLLI.lon, KOLLI.lat],
      [adiyogi.lon, adiyogi.lat],
    ],
    false,
  );
  const kolliPt = px(KOLLI.lon, KOLLI.lat);

  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      style={{ width: "100%", maxWidth: MAP_W, height: "auto", display: "block" }}
      role="img"
      aria-label="Schematic route map of the South India loop from Pune"
    >
      <rect x={0} y={0} width={MAP_W} height={MAP_H} fill={theme.bg.editor} />
      <path d={pathFrom(PENINSULA, true)} fill={theme.fill.tertiary} stroke={theme.stroke.secondary} strokeWidth={1} />
      <path d={pathFrom(LANKA, true)} fill={theme.fill.quaternary} stroke={theme.stroke.tertiary} strokeWidth={1} />

      <text x={px(73.4, 11.5).x} y={px(73.4, 11.5).y} fill={theme.text.quaternary} fontSize={11} transform={`rotate(-90 ${px(73.4, 11.5).x} ${px(73.4, 11.5).y})`} textAnchor="middle">
        ARABIAN SEA
      </text>
      <text x={px(80.9, 12.6).x} y={px(80.9, 12.6).y} fill={theme.text.quaternary} fontSize={11} textAnchor="middle" transform={`rotate(-90 ${px(80.9, 12.6).x} ${px(80.9, 12.6).y})`}>
        BAY OF BENGAL
      </text>
      <text x={px(77.6, 6.6).x} y={px(77.6, 6.6).y} fill={theme.text.quaternary} fontSize={11} textAnchor="middle">
        INDIAN OCEAN
      </text>
      <text x={px(80.75, 7.6).x} y={px(80.75, 7.6).y} fill={theme.text.tertiary} fontSize={10} textAnchor="middle">
        SRI LANKA
      </text>

      {showKolli ? (
        <>
          <path d={kolliDetour} fill="none" stroke={theme.text.quaternary} strokeWidth={1.5} strokeDasharray="5 5" />
          <circle cx={kolliPt.x} cy={kolliPt.y} r={4} fill={theme.bg.editor} stroke={theme.text.tertiary} strokeWidth={1.5} />
          <text x={kolliPt.x + 9} y={kolliPt.y + 4} fill={theme.text.tertiary} fontSize={10.5}>
            Kolli Hills — dropped, +10 h
          </text>
        </>
      ) : null}

      <path d={routePath} fill="none" stroke={theme.accent.primary} strokeWidth={2.2} strokeLinejoin="round" />

      {STOPS.filter((s) => s.seq !== 14).map((stop) => {
        const p = px(stop.lon, stop.lat);
        const active = stop.seq === selectedSeq;
        const lab = labelPos(stop);
        const r = stop.nights > 0 ? 9 : 6.5;
        return (
          <g key={stop.seq} onClick={() => onSelect(stop.seq)} style={{ cursor: "pointer" }}>
            {active ? (
              <circle cx={p.x} cy={p.y} r={r + 6} fill="none" stroke={theme.accent.primary} strokeWidth={1.5} />
            ) : null}
            <circle
              cx={p.x}
              cy={p.y}
              r={r}
              fill={active ? theme.accent.primary : theme.bg.elevated}
              stroke={theme.accent.primary}
              strokeWidth={1.8}
            />
            <text
              x={p.x}
              y={p.y + 3.4}
              fill={active ? theme.text.onAccent : theme.text.primary}
              fontSize={stop.nights > 0 ? 10 : 8.5}
              textAnchor="middle"
              fontWeight={600}
            >
              {stop.seq}
            </text>
            <text
              x={lab.x}
              y={lab.y}
              fill={active ? theme.text.primary : theme.text.secondary}
              fontSize={11.5}
              textAnchor={lab.anchor}
              fontWeight={active ? 600 : 400}
            >
              {stop.label ?? stop.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function totalKm(days: DayPlan[]) {
  return days.reduce((sum, d) => sum + d.km, 0);
}

function paceTone(pace: DayPlan["pace"]) {
  if (pace === "Drive-heavy") return "warning" as const;
  if (pace === "Visit-heavy") return "success" as const;
  return "info" as const;
}

export default function SouthIndiaTripPlan() {
  const [plan, setPlan] = useCanvasState<PlanId>("plan", "12");
  const [tab, setTab] = useCanvasState<TabId>("tab", "map");
  const [day, setDay] = useCanvasState<number>("day", 1);
  const [placeId, setPlaceId] = useCanvasState<string>("place", "srisailam");
  const [stopSeq, setStopSeq] = useCanvasState<number>("stop", 2);
  const [showKolli, setShowKolli] = useCanvasState<boolean>("kolli", true);

  const days = plan === "12" ? DAYS_12 : DAYS_10;
  const selected = days.find((d) => d.day === day) ?? days[0];
  const place = PLACES.find((p) => p.id === placeId) ?? PLACES[0];
  const km = totalKm(days);
  const stop = STOPS.find((s) => s.seq === stopSeq) ?? STOPS[1];
  const stopPlace = stop.placeId ? PLACES.find((p) => p.id === stop.placeId) : undefined;
  const legIn = LEGS.find((l) => l.to === stop.name);
  const legOut = LEGS.find((l) => l.from === stop.name);

  return (
    <Stack gap={22}>
      <Stack gap={8}>
        <H1>South India loop — 7 people, Innova Crysta</H1>
        <Text tone="secondary">
          Pune → Srisailam → Tirupati → Madurai → Rameswaram → Dhanushkodi →
          Kanyakumari → Thiruvananthapuram → Jatayu → Adiyogi → Ooty → Mysore →
          Kolhapur → Pune. Kolli Hills is on your list but sits off this line.
        </Text>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat value={plan === "12" ? "12 days" : "10 days"} label="Chosen length" />
        <Stat value={`${km} km`} label="Distance in this plan" />
        <Stat value="11–15 h" label="Longest single drive" tone="warning" />
        <Stat value="3 rooms" label="Stay pattern for 7 adults" />
      </Grid>

      <Callout tone="warning" title="10 days is too short for this list">
        The loop is about 4,000 km of temple towns and two ghat climbs. In 10
        days you will spend more hours in the Crysta than at the places. Use 12
        days, drop Kolli Hills, and keep Tirupati as a full day. The 10-day
        version is included only as a squeeze.
      </Callout>

      <Row gap={8} wrap>
        <Pill active={plan === "12"} onClick={() => { setPlan("12"); setDay(1); }}>
          12-day recommended
        </Pill>
        <Pill active={plan === "10"} onClick={() => { setPlan("10"); setDay(1); }}>
          10-day squeeze
        </Pill>
      </Row>

      <Row gap={8} wrap>
        <Button variant={tab === "map" ? "primary" : "secondary"} onClick={() => setTab("map")}>
          Route map
        </Button>
        <Button variant={tab === "plan" ? "primary" : "secondary"} onClick={() => setTab("plan")}>
          Day by day
        </Button>
        <Button variant={tab === "places" ? "primary" : "secondary"} onClick={() => setTab("places")}>
          Place guide
        </Button>
        <Button variant={tab === "logistics" ? "primary" : "secondary"} onClick={() => setTab("logistics")}>
          Car, stay, money
        </Button>
      </Row>

      {tab === "map" ? (
        <Stack gap={16}>
          <H2>The loop on a map</H2>
          <Text tone="secondary">
            Click any numbered stop. Big circles are overnight halts, small ones
            are day visits. The dashed line is the Kolli Hills detour you asked
            about — it doubles back across Tamil Nadu.
          </Text>

          <Grid columns="minmax(0, 520px) minmax(0, 1fr)" gap={20} align="start">
            <Stack gap={8}>
              <RouteMap selectedSeq={stopSeq} onSelect={setStopSeq} showKolli={showKolli} />
              <Row gap={8} wrap>
                <Pill active={showKolli} onClick={() => setShowKolli(!showKolli)}>
                  {showKolli ? "Hide Kolli detour" : "Show Kolli detour"}
                </Pill>
              </Row>
              <Text size="small" tone="tertiary">
                Schematic map: stops plotted from real coordinates, coastline and
                route lines simplified. Not for navigation.
              </Text>
            </Stack>

            <Stack gap={14}>
              <Stack gap={6}>
                <H3>
                  {stop.seq}. {stop.label ?? stop.name}
                </H3>
                <Row gap={8} wrap>
                  <Pill active>{stop.when}</Pill>
                  <Pill>
                    {stop.nights > 0
                      ? `${stop.nights} night${stop.nights > 1 ? "s" : ""}`
                      : stop.seq === 1
                        ? "Start and finish"
                        : "Day visit"}
                  </Pill>
                </Row>
                <Text>{stop.headline}</Text>
              </Stack>

              {legIn || legOut ? (
                <Table
                  headers={["Leg", "Km", "Drive"]}
                  rows={[
                    ...(legIn ? [[`In: ${legIn.from} → ${legIn.to}`, String(legIn.km), legIn.hours]] : []),
                    ...(legOut ? [[`Out: ${legOut.from} → ${legOut.to}`, String(legOut.km), legOut.hours]] : []),
                  ]}
                  columnAlign={["left", "right", "left"]}
                />
              ) : null}

              {stopPlace ? (
                <Stack gap={10}>
                  <Card>
                    <CardHeader trailing={<Pill size="sm">{stopPlace.timeNeeded}</Pill>}>
                      Why it matters
                    </CardHeader>
                    <CardBody>
                      <Text size="small">{stopPlace.why}</Text>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader>Hours</CardHeader>
                    <CardBody>
                      <Text size="small">{stopPlace.hours}</Text>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader>Food</CardHeader>
                    <CardBody>
                      <Text size="small">{stopPlace.food}</Text>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader>Stay</CardHeader>
                    <CardBody>
                      <Text size="small">{stopPlace.stay}</Text>
                    </CardBody>
                  </Card>
                  <Callout tone="neutral" title="On the ground">
                    {stopPlace.tips.join(" ")}
                  </Callout>
                  <Row gap={8} wrap>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setPlaceId(stopPlace.id);
                        setTab("places");
                      }}
                    >
                      Full place guide
                    </Button>
                  </Row>
                </Stack>
              ) : null}
            </Stack>
          </Grid>

          <Divider />

          <H2>Every leg, in order</H2>
          <Text size="small" tone="tertiary">
            Road distance and realistic Crysta drive time. Total driving legs:{" "}
            {LEGS.reduce((s, l) => s + l.km, 0)} km, before local running about.
          </Text>
          <Table
            headers={["#", "From", "To", "Km", "Drive", "Road"]}
            rows={LEGS.map((l, i) => [
              String(i + 1),
              l.from,
              l.to,
              String(l.km),
              l.hours,
              l.road,
            ])}
            columnAlign={["right", "left", "left", "right", "left", "left"]}
            rowTone={LEGS.map((l) => (l.km >= 450 ? "warning" : l.km >= 250 ? "info" : undefined))}
            striped
            stickyHeader
          />

          <H2>Where the nights go</H2>
          <Grid columns={4} gap={10}>
            {STOPS.filter((s) => s.nights > 0).map((s) => (
              <div key={s.seq}>
                <Card>
                  <CardHeader trailing={<Pill size="sm">{s.nights}N</Pill>}>{s.name}</CardHeader>
                  <CardBody>
                    <Text size="small" tone="secondary">
                      {s.when}
                    </Text>
                  </CardBody>
                </Card>
              </div>
            ))}
          </Grid>
        </Stack>
      ) : null}

      {tab === "plan" ? (
        <Stack gap={16}>
          <H2>{plan === "12" ? "12-day itinerary" : "10-day squeeze"}</H2>
          <Text tone="secondary">
            Select a day. Drive-heavy days are for covering ground. Visit-heavy
            days are why you came.
          </Text>

          <Row gap={6} wrap>
            {days.map((d) => (
              <span key={d.day}>
                <Pill active={d.day === selected.day} onClick={() => setDay(d.day)}>
                  D{d.day}
                </Pill>
              </span>
            ))}
          </Row>

          <Stack gap={6}>
            <H3>
              Day {selected.day}: {selected.title}
            </H3>
            <Row gap={8} wrap>
              <Pill active>{selected.stay}</Pill>
              <Pill>{selected.km} km</Pill>
              <Pill>{selected.hours}</Pill>
              <Pill>{selected.pace}</Pill>
            </Row>
          </Stack>

          <Grid columns={3} gap={12}>
            <Card>
              <CardHeader>Morning</CardHeader>
              <CardBody>
                <Text size="small">{selected.morning}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>Afternoon</CardHeader>
              <CardBody>
                <Text size="small">{selected.afternoon}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>Evening</CardHeader>
              <CardBody>
                <Text size="small">{selected.evening}</Text>
              </CardBody>
            </Card>
          </Grid>

          <H3>Visit this day</H3>
          <Table
            headers={["Stop"]}
            rows={selected.visits.map((v) => [v])}
            striped
          />

          <Grid columns={2} gap={16}>
            <Stack gap={6}>
              <H3>Food</H3>
              <Text>{selected.food}</Text>
            </Stack>
            <Stack gap={6}>
              <H3>Stay</H3>
              <Text>{selected.stayHint}</Text>
            </Stack>
          </Grid>

          {selected.notes.length > 0 ? (
            <Callout tone="info" title="Day notes">
              {selected.notes.join(" ")}
            </Callout>
          ) : null}

          <H2>Driving load</H2>
          <Text size="small" tone="tertiary">
            Estimated road distance per day. Source: typical NH timings for an
            Innova Crysta, not Google’s best-case.
          </Text>
          <BarChart
            categories={days.map((d) => `D${d.day}`)}
            series={[{ name: "Drive distance (km)", data: days.map((d) => d.km), tone: "info" }]}
            valueSuffix=" km"
            height={220}
            referenceLines={[{ value: 400, label: "Hard day", tone: "warning" }]}
          />

          <H2>Full calendar</H2>
          <Table
            headers={["Day", "Route", "Stay", "Km", "Hours", "Pace"]}
            rows={days.map((d) => [
              String(d.day),
              d.title,
              d.stay,
              String(d.km),
              d.hours,
              d.pace,
            ])}
            columnAlign={["right", "left", "left", "right", "left", "left"]}
            rowTone={days.map((d) => paceTone(d.pace))}
            striped
            stickyHeader
          />
        </Stack>
      ) : null}

      {tab === "places" ? (
        <Stack gap={16}>
          <H2>Where to go, and why it matters</H2>
          <Text tone="secondary">
            Geographic order on the road is Kanyakumari → Thiruvananthapuram →
            Jatayu, then north to Coimbatore. Do not reverse TVM and Jatayu.
          </Text>
          <Row gap={6} wrap>
            {PLACES.map((p) => (
              <span key={p.id}>
                <Pill active={p.id === place.id} onClick={() => setPlaceId(p.id)}>
                  {p.name}
                </Pill>
              </span>
            ))}
          </Row>

          <Stack gap={8}>
            <H3>{place.name}</H3>
            <Text>{place.why}</Text>
          </Stack>

          <Grid columns={3} gap={12}>
            <Stat value={place.timeNeeded} label="Time to give it" />
            <Card>
              <CardHeader>Hours</CardHeader>
              <CardBody>
                <Text size="small">{place.hours}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>Stay</CardHeader>
              <CardBody>
                <Text size="small">{place.stay}</Text>
              </CardBody>
            </Card>
          </Grid>

          <H3>What to see</H3>
          <Table headers={["Stop"]} rows={place.visit.map((v) => [v])} striped />

          <H3>Food</H3>
          <Text>{place.food}</Text>

          <Callout tone="neutral" title="Practical">
            {place.tips.join(" ")}
          </Callout>
        </Stack>
      ) : null}

      {tab === "logistics" ? (
        <Stack gap={16}>
          <H2>Vehicle, group, money</H2>

          <Callout tone="info" title="Innova Crysta with 7 people">
            Seven adults plus 10 days of bags will fill the boot. Use soft
            duffels, not hard suitcases. A roof carrier helps. If you also have
            a driver, that is 8 bodies — the Crysta is then over capacity. Either
            the driver is one of the 7, or one traveller sits with bags and you
            keep luggage brutal.
          </Callout>

          <Grid columns={2} gap={16}>
            <Stack gap={8}>
              <H3>Driving rules for this loop</H3>
              <Text>
                Two drivers. Maximum 8–9 hours on visit days, 14 hours only on
                Day 1 and (if you choose 10 days) the last day. No night ghats:
                Srisailam, Tirumala approach, Kolli hairpins, Ooty. Fuel at every
                big town before a forest or hill stretch.
              </Text>
              <Text>
                Tolls roughly ₹10,000–14,000. Diesel roughly 3,800–4,200 km at
                10–12 km/l, about ₹32,000–40,000. Parking + driver bata extra.
              </Text>
            </Stack>
            <Stack gap={8}>
              <H3>Stay pattern</H3>
              <Text>
                Book 3 rooms everywhere (two triples, or one triple + two
                doubles). Always ask for parking for a long MPV. Prefer hotels
                over temple cottages except Srisailam, where Devasthanam rooms
                are the practical choice.
              </Text>
              <Text>
                Do not stay on Tirumala hill with this car. Do not stay in
                Dhanushkodi. Isha cottages are optional; Coimbatore is simpler.
              </Text>
            </Stack>
          </Grid>

          <H3>Book before you leave</H3>
          <Table
            headers={["Item", "Where", "When"]}
            rows={[
              ["Srisailam rooms + Seeghra/VIP", "srisailadevasthanam.org", "2–3 weeks ahead"],
              ["Tirupati ₹300/₹500 SSD × 7", "ttdevasthanams.ap.gov.in", "The minute the month opens"],
              ["Hotels with 3 rooms + parking", "Any major booking site", "All 11 nights on the 12-day plan"],
              ["Jatayu ropeway tickets", "Official Jatayu site / counter", "Weekend mornings sell out"],
              ["Isha cottage (optional)", "Isha booking", "If you want the 7 PM show + 6 AM Dhyanalinga"],
            ]}
            striped
          />

          <H3>Indicative budget for 7 people, 12 days</H3>
          <Text size="small" tone="tertiary">
            Mid-range hotels, mixed veg meals, paid darshan. Not luxury, not
            dharamshala. Fuel assumed self-driven Crysta.
          </Text>
          <Table
            headers={["Head", "Estimate"]}
            rows={[
              ["Diesel", "₹32,000–40,000"],
              ["Tolls + parking", "₹12,000–16,000"],
              ["Stay, 11 nights × 3 rooms", "₹90,000–1,40,000"],
              ["Food", "₹60,000–80,000"],
              ["Darshan, ferries, Jatayu, palace", "₹15,000–25,000"],
              ["Total (self-drive)", "₹2.1–3.0 lakh"],
              ["If the Crysta is hired with driver", "Add ₹45,000–70,000 + driver room"],
            ]}
            columnAlign={["left", "right"]}
            striped
          />

          <H3>What to drop, in order</H3>
          <Table
            headers={["Cut", "Why"]}
            rows={[
              ["Kolli Hills", "400 km out, 220 km back. Wrong side of Kerala–Coimbatore."],
              ["Tirupati extras (Kapila, museum)", "Keep the main darshan intact first."],
              ["Madurai palace", "Meenakshi is the reason you stopped."],
              ["Ooty toy train + lake boating", "Time sinks with poor payoff on a road trip."],
              ["Mysore market / KRS dam", "Palace + Chamundi are enough."],
              ["Padmanabhaswamy if the ferry runs late", "Kanyakumari sunrise is once. TVM can be morning instead."],
            ]}
            striped
          />

          <Divider />

          <H3>Correct road order</H3>
          <Text>
            Pune — Srisailam — Tirupati — Madurai — Rameswaram — Dhanushkodi —
            Kanyakumari — Thiruvananthapuram — Jatayu — (skip Kolli) — Adiyogi —
            Ooty — Mysore — Kolhapur — Pune.
          </Text>
          <Text tone="secondary">
            If you add Kolli Hills, insert it only by adding a 13th day between
            Jatayu and Adiyogi, and accept 70 hairpins in a fully loaded Crysta.
          </Text>
        </Stack>
      ) : null}

      <Text size="small" tone="tertiary">
        Temple hours shift on festivals. Recheck Srisailam, TTD, Meenakshi,
        Rameswaram, Padmanabhaswamy, and Isha a week before you roll.
      </Text>
    </Stack>
  );
}
