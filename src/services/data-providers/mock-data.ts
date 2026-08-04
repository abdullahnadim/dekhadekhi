// Mock Data Provider for CineHub BD
// Provides rich, realistic Bangladeshi cinema data for development

import type {
  Movie,
  Branch,
  Schedule,
  FoodItem,
  City,
  Seat,
  SeatRow,
  SeatMapData,
} from "@/types";

// ─── Mock Movies ──────────────────────────────────────────

export const MOCK_MOVIES: Movie[] = [
  {
    id: "movie-1",
    title: "Toofan",
    titleBn: "তুফান",
    slug: "toofan-2024",
    synopsis:
      "A gripping tale of a young man from Dhaka's streets who rises against all odds to become a boxing champion, only to discover that his toughest fight is the battle within himself.",
    synopsisBn:
      "ঢাকার পথ থেকে উঠে আসা এক তরুণের অসাধারণ যাত্রার গল্প যে বক্সিং চ্যাম্পিয়ন হওয়ার স্বপ্ন দেখে।",
    runtime: 148,
    language: "Bangla",
    subtitle: ["English"],
    genre: ["Drama", "Sports", "Action"],
    posterUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    rating: 8.4,
    imdbRating: 7.9,
    imdbId: "tt1234567",
    releaseDate: new Date("2024-08-15"),
    status: "NOW_SHOWING",
    isActive: true,
    isFeatured: true,
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-08-01"),
  },
  {
    id: "movie-2",
    title: "Mujib: The Making of a Nation",
    titleBn: "মুজিব: একটি জাতির রূপকার",
    slug: "mujib-making-nation",
    synopsis:
      "The extraordinary life story of Sheikh Mujibur Rahman, the founding father of Bangladesh, from his childhood in rural Bengal to becoming the Bangabandhu — Friend of Bengal.",
    synopsisBn:
      "বাংলাদেশের জনক শেখ মুজিবুর রহমানের অসাধারণ জীবনকাহিনী।",
    runtime: 175,
    language: "Bangla",
    subtitle: ["English"],
    genre: ["Biography", "Drama", "History"],
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=1280&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    rating: 8.9,
    imdbRating: 8.2,
    imdbId: "tt1234568",
    releaseDate: new Date("2023-10-13"),
    status: "NOW_SHOWING",
    isActive: true,
    isFeatured: true,
    createdAt: new Date("2023-09-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "movie-3",
    title: "Oppenheimer",
    titleBn: null,
    slug: "oppenheimer-2023",
    synopsis:
      "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II. A masterpiece of cinema exploring science, war, and moral responsibility.",
    synopsisBn: null,
    runtime: 180,
    language: "English",
    subtitle: ["Bangla", "English"],
    genre: ["Biography", "Drama", "History"],
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1280&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    rating: 9.1,
    imdbRating: 8.3,
    imdbId: "tt15398776",
    releaseDate: new Date("2023-07-21"),
    status: "NOW_SHOWING",
    isActive: true,
    isFeatured: false,
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2023-07-01"),
  },
  {
    id: "movie-4",
    title: "Pathaan",
    titleBn: null,
    slug: "pathaan-2023",
    synopsis:
      "An exiled spy races against time to stop a sinister organization from unleashing a biological weapon of mass destruction on India.",
    synopsisBn: null,
    runtime: 146,
    language: "Hindi",
    subtitle: ["Bangla", "English"],
    genre: ["Action", "Thriller", "Spy"],
    posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1280&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    rating: 7.8,
    imdbRating: 5.8,
    imdbId: "tt12540710",
    releaseDate: new Date("2023-01-25"),
    status: "NOW_SHOWING",
    isActive: true,
    isFeatured: false,
    createdAt: new Date("2022-12-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "movie-5",
    title: "Interstellar: The IMAX Experience",
    titleBn: null,
    slug: "interstellar-imax-2024",
    synopsis:
      "Nolan's epic odyssey through space and time returns in stunning IMAX. A crew of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    synopsisBn: null,
    runtime: 169,
    language: "English",
    subtitle: ["Bangla"],
    genre: ["Sci-Fi", "Adventure", "Drama"],
    posterUrl: "https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?w=400&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1280&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    rating: 9.3,
    imdbRating: 8.7,
    imdbId: "tt0816692",
    releaseDate: new Date("2024-09-01"),
    status: "UPCOMING",
    isActive: true,
    isFeatured: true,
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-07-15"),
  },
  {
    id: "movie-6",
    title: "Deadpool & Wolverine",
    titleBn: null,
    slug: "deadpool-wolverine-2024",
    synopsis:
      "Deadpool and Wolverine team up in the Marvel Cinematic Universe for the first time in an adventure that will change the fate of everything.",
    synopsisBn: null,
    runtime: 128,
    language: "English",
    subtitle: ["Bangla", "English"],
    genre: ["Action", "Comedy", "Superhero"],
    posterUrl: "https://images.unsplash.com/photo-1580130775562-0ef92da028de?w=400&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1280&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    rating: 8.6,
    imdbRating: 7.9,
    imdbId: "tt6263850",
    releaseDate: new Date("2024-07-26"),
    status: "NOW_SHOWING",
    isActive: true,
    isFeatured: true,
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2024-07-01"),
  },
  {
    id: "movie-7",
    title: "Hawa",
    titleBn: "হাওয়া",
    slug: "hawa-bd",
    synopsis:
      "A fishing trawler crew picks up a mysterious woman from the sea. What follows is a haunting, beautiful, and deeply unsettling tale that captures the soul of Bangladesh.",
    synopsisBn:
      "একটি মাছ ধরার ট্রলারের নাবিকরা সমুদ্র থেকে একজন রহস্যময় মহিলাকে উদ্ধার করে।",
    runtime: 131,
    language: "Bangla",
    subtitle: ["English"],
    genre: ["Thriller", "Mystery", "Drama"],
    posterUrl: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1280&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    rating: 9.0,
    imdbRating: 8.1,
    imdbId: "tt17078116",
    releaseDate: new Date("2022-07-29"),
    status: "NOW_SHOWING",
    isActive: true,
    isFeatured: false,
    createdAt: new Date("2022-06-01"),
    updatedAt: new Date("2022-07-01"),
  },
  {
    id: "movie-8",
    title: "Avengers: Secret Wars",
    titleBn: null,
    slug: "avengers-secret-wars-2025",
    synopsis:
      "The multiverse collides. Heroes and villains from across realities must unite — or destroy everything. The most ambitious Marvel film ever made.",
    synopsisBn: null,
    runtime: 0, // Not announced yet
    language: "English",
    subtitle: ["Bangla", "English"],
    genre: ["Action", "Superhero", "Sci-Fi"],
    posterUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=1280&q=80",
    trailerUrl: null,
    rating: null,
    imdbRating: null,
    imdbId: null,
    releaseDate: new Date("2025-05-01"),
    status: "UPCOMING",
    isActive: true,
    isFeatured: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// ─── Mock Cities ──────────────────────────────────────────

export const MOCK_CITIES: City[] = [
  { id: "city-1", name: "Dhaka", nameBn: "ঢাকা" },
  { id: "city-2", name: "Chittagong", nameBn: "চট্টগ্রাম" },
  { id: "city-3", name: "Sylhet", nameBn: "সিলেট" },
  { id: "city-4", name: "Rajshahi", nameBn: "রাজশাহী" },
  { id: "city-5", name: "Khulna", nameBn: "খুলনা" },
  { id: "city-6", name: "Cumilla", nameBn: "কুমিল্লা" },
];

// ─── Mock Branches ────────────────────────────────────────

export const MOCK_BRANCHES: Branch[] = [
  {
    id: "branch-1",
    name: "Star Cineplex, Bashundhara City",
    slug: "star-cineplex-bashundhara",
    address: "Level 6, Bashundhara City, Panthapath, Dhaka 1205",
    cityId: "city-1",
    lat: 23.7512,
    lng: 90.3937,
    phone: "+880-1700-000001",
    email: "bashundhara@starcimeplex.com",
    imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80",
    description:
      "The largest multiplex in Bangladesh with 8 screens including IMAX and 4DX. Located in the heart of Dhaka's premier shopping destination.",
    facilities: ["IMAX", "4DX", "VIP Lounge", "Parking", "Food Court", "Dolby Atmos"],
    parking: true,
    isActive: true,
    city: { id: "city-1", name: "Dhaka", nameBn: "ঢাকা" },
  },
  {
    id: "branch-2",
    name: "Star Cineplex, Sony Square",
    slug: "star-cineplex-sony-square",
    address: "Level 3, Sony Square, Tejgaon, Dhaka 1208",
    cityId: "city-1",
    lat: 23.7634,
    lng: 90.4028,
    phone: "+880-1700-000002",
    email: "sonysquare@starcimeplex.com",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    description:
      "Premium cinema experience in Tejgaon with 4 screens and VIP seating options.",
    facilities: ["VIP Lounge", "Parking", "Food Court", "Dolby Digital"],
    parking: true,
    isActive: true,
    city: { id: "city-1", name: "Dhaka", nameBn: "ঢাকা" },
  },
  {
    id: "branch-3",
    name: "Blockbuster Cinemas, Gulshan",
    slug: "blockbuster-gulshan",
    address: "Gulshan Avenue, Gulshan 2, Dhaka 1212",
    cityId: "city-1",
    lat: 23.7972,
    lng: 90.4144,
    phone: "+880-1700-000003",
    email: "gulshan@blockbustercinemas.com.bd",
    imageUrl: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=800&q=80",
    description:
      "Premium boutique cinema in Dhaka's diplomatic zone. Known for exclusive screenings and superior comfort.",
    facilities: ["VIP Lounge", "Valet Parking", "Fine Dining", "Private Screening"],
    parking: true,
    isActive: true,
    city: { id: "city-1", name: "Dhaka", nameBn: "ঢাকা" },
  },
  {
    id: "branch-4",
    name: "Otobi Cineplex, Chittagong",
    slug: "otobi-cineplex-chittagong",
    address: "GEC Circle, Chittagong 4000",
    cityId: "city-2",
    lat: 22.3569,
    lng: 91.7832,
    phone: "+880-1700-000004",
    email: "chittagong@otobicineplex.com",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
    description:
      "The premier cinema destination in Chittagong with modern facilities and regular blockbuster screenings.",
    facilities: ["Parking", "Food Court", "Dolby Digital"],
    parking: true,
    isActive: true,
    city: { id: "city-2", name: "Chittagong", nameBn: "চট্টগ্রাম" },
  },
  {
    id: "branch-5",
    name: "Cinedrome, Sylhet",
    slug: "cinedrome-sylhet",
    address: "Zindabazar, Sylhet 3100",
    cityId: "city-3",
    lat: 24.8949,
    lng: 91.8687,
    phone: "+880-1700-000005",
    email: "sylhet@cinedrome.com.bd",
    imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80",
    description:
      "Modern 3-screen cinema in Sylhet city center serving the greater Sylhet region.",
    facilities: ["Parking", "Food Court"],
    parking: false,
    isActive: true,
    city: { id: "city-3", name: "Sylhet", nameBn: "সিলেট" },
  },
];

// ─── Mock Schedules ───────────────────────────────────────

const now = new Date();
const today = new Date(now);
today.setHours(0, 0, 0, 0);

function createSchedule(
  id: string,
  movieId: string,
  hallId: string,
  dateOffset: number, // days from today
  hour: number,
  language: string = "English"
): Schedule {
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + dateOffset);
  startDate.setHours(hour, 0, 0, 0);

  const movie = MOCK_MOVIES.find((m) => m.id === movieId);
  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + (movie?.runtime || 120) + 20); // +20min for ads

  return {
    id,
    movieId,
    hallId,
    startTime: startDate,
    endTime: endDate,
    language,
    subtitle: language === "English" ? "Bangla" : null,
    status: "AVAILABLE",
    priceStandard: 200,
    pricePremium: 350,
    priceVip: 500,
    priceCouple: 900,
  };
}

export const MOCK_SCHEDULES: Schedule[] = [
  // Movie 1 (Toofan) - Bashundhara
  createSchedule("sch-1", "movie-1", "hall-1", 0, 10, "Bangla"),
  createSchedule("sch-2", "movie-1", "hall-1", 0, 14, "Bangla"),
  createSchedule("sch-3", "movie-1", "hall-1", 0, 18, "Bangla"),
  createSchedule("sch-4", "movie-1", "hall-1", 1, 11, "Bangla"),
  createSchedule("sch-5", "movie-1", "hall-1", 1, 15, "Bangla"),
  // Movie 2 (Mujib) - Multiple locations
  createSchedule("sch-6", "movie-2", "hall-2", 0, 11, "Bangla"),
  createSchedule("sch-7", "movie-2", "hall-2", 0, 16, "Bangla"),
  // Movie 3 (Oppenheimer) - English
  createSchedule("sch-8", "movie-3", "hall-3", 0, 12, "English"),
  createSchedule("sch-9", "movie-3", "hall-3", 0, 17, "English"),
  createSchedule("sch-10", "movie-3", "hall-3", 1, 12, "English"),
  // Movie 6 (Deadpool) - Sony Square
  createSchedule("sch-11", "movie-6", "hall-4", 0, 13, "English"),
  createSchedule("sch-12", "movie-6", "hall-4", 0, 16, "English"),
  createSchedule("sch-13", "movie-6", "hall-4", 0, 20, "English"),
];

// ─── Mock Food Items ──────────────────────────────────────

export const MOCK_FOOD_ITEMS: FoodItem[] = [
  {
    id: "food-1",
    name: "Classic Popcorn (Large)",
    nameBn: "পপকর্ন (লার্জ)",
    description: "Freshly popped, buttery movie-theater popcorn",
    price: 200,
    imageUrl: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=300&q=80",
    category: "Popcorn",
    isAvailable: true,
    isVeg: true,
  },
  {
    id: "food-2",
    name: "Caramel Popcorn",
    nameBn: "ক্যারামেল পপকর্ন",
    description: "Sweet caramel glazed popcorn",
    price: 250,
    imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=300&q=80",
    category: "Popcorn",
    isAvailable: true,
    isVeg: true,
  },
  {
    id: "food-3",
    name: "Combo Pack — Popcorn + 2 Drinks",
    nameBn: "কম্বো প্যাক",
    description: "Large popcorn with 2 regular soft drinks",
    price: 450,
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&q=80",
    category: "Combo",
    isAvailable: true,
    isVeg: true,
  },
  {
    id: "food-4",
    name: "Pepsi (Large)",
    nameBn: "পেপসি (লার্জ)",
    description: "Chilled Pepsi 500ml",
    price: 120,
    imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&q=80",
    category: "Drinks",
    isAvailable: true,
    isVeg: true,
  },
  {
    id: "food-5",
    name: "Nachos with Salsa",
    nameBn: "নাচোস",
    description: "Crispy tortilla chips with spicy salsa dip",
    price: 180,
    imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&q=80",
    category: "Snacks",
    isAvailable: true,
    isVeg: true,
  },
  {
    id: "food-6",
    name: "Chicken Burger",
    nameBn: "চিকেন বার্গার",
    description: "Crispy chicken burger with lettuce and mayo",
    price: 280,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
    category: "Snacks",
    isAvailable: true,
    isVeg: false,
  },
  {
    id: "food-7",
    name: "Premium Date Night Combo",
    nameBn: "ডেট নাইট কম্বো",
    description: "Large popcorn + nachos + 2 premium drinks + chocolate",
    price: 750,
    imageUrl: "https://images.unsplash.com/photo-1560275619-4cc5fa59d3ae?w=300&q=80",
    category: "Combo",
    isAvailable: true,
    isVeg: true,
  },
];

// ─── Seat Map Generator ───────────────────────────────────

export function generateMockSeatMap(
  hallId: string,
  scheduleId: string,
  occupancyRate: number = 0.35
): SeatMapData {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const seatsPerRow = 12;

  const prices = {
    STANDARD: 200,
    PREMIUM: 350,
    VIP: 500,
    COUPLE: 900,
    ACCESSIBLE: 200,
  };

  const seatRows: SeatRow[] = rows.map((row, rowIndex) => {
    const seatType =
      rowIndex <= 1
        ? "VIP"
        : rowIndex <= 4
        ? "PREMIUM"
        : rowIndex === rows.length - 1
        ? "ACCESSIBLE"
        : "STANDARD";

    const seats = Array.from({ length: seatsPerRow }, (_, i) => {
      const isOccupied = Math.random() < occupancyRate;
      const isCouple = seatType === "PREMIUM" && (i === 5 || i === 6);

      return {
        id: `seat-${hallId}-${row}-${i + 1}`,
        hallId,
        row,
        number: i + 1,
        type: (isCouple ? "COUPLE" : seatType) as Seat["type"],
        isActive: true,
        status: (isOccupied ? "OCCUPIED" : "AVAILABLE") as
          | "OCCUPIED"
          | "AVAILABLE",
        isSelected: false,
      };
    });

    return { row, seats };
  });

  return {
    hallId,
    scheduleId,
    rows: seatRows,
    legend: [
      { type: "STANDARD", label: "Standard", color: "#4B5563" },
      { type: "PREMIUM", label: "Premium", color: "#7C3AED" },
      { type: "VIP", label: "VIP", color: "#D6A84D" },
      { type: "COUPLE", label: "Couple", color: "#EC4899" },
      { type: "ACCESSIBLE", label: "Accessible", color: "#10B981" },
      { type: "OCCUPIED", label: "Occupied", color: "#1F2937" },
      { type: "SELECTED", label: "Selected", color: "#FF3B30" },
    ],
    prices,
  };
}

// ─── Helper Functions ─────────────────────────────────────

export function getMovieBySlug(slug: string): Movie | undefined {
  return MOCK_MOVIES.find((m) => m.slug === slug);
}

export function getSchedulesForMovie(movieId: string): Schedule[] {
  return MOCK_SCHEDULES.filter((s) => s.movieId === movieId);
}

export function getSchedulesForDate(date: Date): Schedule[] {
  return MOCK_SCHEDULES.filter((s) => {
    const schedDate = new Date(s.startTime);
    return (
      schedDate.getFullYear() === date.getFullYear() &&
      schedDate.getMonth() === date.getMonth() &&
      schedDate.getDate() === date.getDate()
    );
  });
}

export function getBranchBySlug(slug: string): Branch | undefined {
  return MOCK_BRANCHES.find((b) => b.slug === slug);
}

export function getNowShowingMovies(): Movie[] {
  return MOCK_MOVIES.filter((m) => m.status === "NOW_SHOWING");
}

export function getUpcomingMovies(): Movie[] {
  return MOCK_MOVIES.filter((m) => m.status === "UPCOMING");
}

export function getFeaturedMovies(): Movie[] {
  return MOCK_MOVIES.filter((m) => m.isFeatured && m.isActive);
}

export function searchMovies(query: string): Movie[] {
  const q = query.toLowerCase();
  return MOCK_MOVIES.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      (m.titleBn && m.titleBn.includes(q)) ||
      m.genre.some((g) => g.toLowerCase().includes(q)) ||
      m.language.toLowerCase().includes(q)
  );
}
