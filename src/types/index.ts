// ─────────────────────────────────────────────────────────
// Global TypeScript Types for CineHub BD
// ─────────────────────────────────────────────────────────

// ─── Enums ────────────────────────────────────────────────

export type UserRole = "GUEST" | "USER" | "ADMIN" | "SUPER_ADMIN";

export type MovieStatus = "UPCOMING" | "NOW_SHOWING" | "ENDED" | "CANCELLED";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "EXPIRED"
  | "REFUNDED";

export type SeatType =
  | "STANDARD"
  | "PREMIUM"
  | "VIP"
  | "COUPLE"
  | "ACCESSIBLE";

export type SeatStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "HELD"
  | "SELECTED"
  | "ACCESSIBLE";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";

export type PaymentGateway =
  | "SSLCOMMERZ"
  | "BKASH"
  | "NAGAD"
  | "ROCKET"
  | "VISA"
  | "MASTERCARD";

export type ScheduleStatus =
  | "AVAILABLE"
  | "SOLD_OUT"
  | "CANCELLED"
  | "COMPLETED";

export type RewardTier =
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "PLATINUM"
  | "DIAMOND";

export type NotificationType =
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "REMINDER"
  | "PROMO"
  | "SYSTEM"
  | "REVIEW_REQUEST"
  | "REWARD_EARNED";

// ─── User Types ───────────────────────────────────────────

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  phone: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  reward: Reward | null;
  _count: {
    bookings: number;
    reviews: number;
    wishlist: number;
  };
}

// ─── Movie Types ──────────────────────────────────────────

export interface Movie {
  id: string;
  title: string;
  titleBn: string | null;
  slug: string;
  synopsis: string;
  synopsisBn: string | null;
  runtime: number; // minutes
  language: string;
  subtitle: string[];
  genre: string[];
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  rating: number | null;
  imdbRating: number | null;
  imdbId: string | null;
  releaseDate: Date;
  status: MovieStatus;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MovieWithDetails extends Movie {
  cast: CastMember[];
  gallery: MovieGallery[];
  reviews: Review[];
  _count: {
    reviews: number;
    schedules: number;
    wishlists: number;
  };
  averageRating?: number;
}

export interface CastMember {
  id: string;
  movieId: string;
  name: string;
  role: string;
  character: string | null;
  imageUrl: string | null;
  order: number;
}

export interface MovieGallery {
  id: string;
  movieId: string;
  imageUrl: string;
  caption: string | null;
  order: number;
}

// ─── Branch / Hall / Seat Types ───────────────────────────

export interface City {
  id: string;
  name: string;
  nameBn: string | null;
}

export interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string;
  cityId: string;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  email: string | null;
  imageUrl: string | null;
  description: string | null;
  facilities: string[];
  parking: boolean;
  isActive: boolean;
  city: City;
}

export interface BranchWithHalls extends Branch {
  halls: Hall[];
}

export interface Hall {
  id: string;
  branchId: string;
  name: string;
  capacity: number;
  facilities: string[];
  imageUrl: string | null;
  isActive: boolean;
}

export interface Seat {
  id: string;
  hallId: string;
  row: string;
  number: number;
  type: SeatType;
  isActive: boolean;
}

export interface SeatWithStatus extends Seat {
  status: SeatStatus;
  isSelected?: boolean;
}

// ─── Schedule / Showtime Types ────────────────────────────

export interface Schedule {
  id: string;
  movieId: string;
  hallId: string;
  startTime: Date;
  endTime: Date;
  language: string;
  subtitle: string | null;
  status: ScheduleStatus;
  priceStandard: number;
  pricePremium: number;
  priceVip: number;
  priceCouple: number;
}

export interface ScheduleWithDetails extends Schedule {
  movie: Movie;
  hall: Hall & { branch: Branch };
  availableSeats: number;
  totalSeats: number;
}

// ─── Booking Types ────────────────────────────────────────

export interface Booking {
  id: string;
  userId: string;
  scheduleId: string;
  status: BookingStatus;
  totalAmount: number;
  qrCode: string | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingWithDetails extends Booking {
  schedule: ScheduleWithDetails;
  tickets: Ticket[];
  payment: Payment | null;
  foodItems: BookingFood[];
}

export interface Ticket {
  id: string;
  bookingId: string;
  seatId: string;
  price: number;
  qrCode: string | null;
  seat: Seat;
}

export interface BookingFood {
  id: string;
  bookingId: string;
  foodItemId: string;
  quantity: number;
  price: number;
  foodItem: FoodItem;
}

// ─── Food Types ───────────────────────────────────────────

export interface FoodItem {
  id: string;
  name: string;
  nameBn: string | null;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string;
  isAvailable: boolean;
  isVeg: boolean;
}

// ─── Payment Types ────────────────────────────────────────

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gateway: PaymentGateway;
  gatewayTranId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Review Types ─────────────────────────────────────────

export interface Review {
  id: string;
  userId: string;
  movieId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  likes: number;
  createdAt: Date;
  user: Pick<User, "id" | "name" | "image">;
}

// ─── Coupon Types ─────────────────────────────────────────

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_ITEM";
  discountValue: number;
  minAmount: number | null;
  maxDiscount: number | null;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
}

// ─── Notification Types ───────────────────────────────────

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  link: string | null;
  createdAt: Date;
}

// ─── Reward Types ─────────────────────────────────────────

export interface Reward {
  id: string;
  userId: string;
  points: number;
  totalEarned: number;
  tier: RewardTier;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  points: number;
  description: string;
  bookingId: string | null;
  createdAt: Date;
}

// ─── API Response Types ───────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ─── Filter & Query Types ─────────────────────────────────

export interface MovieFilters {
  status?: MovieStatus;
  genre?: string;
  language?: string;
  search?: string;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}

export interface ScheduleFilters {
  movieId?: string;
  branchId?: string;
  date?: string; // ISO date string
  language?: string;
}

// ─── Seat Map Types ───────────────────────────────────────

export interface SeatMapData {
  hallId: string;
  scheduleId: string;
  rows: SeatRow[];
  legend: SeatLegend[];
  prices: {
    STANDARD: number;
    PREMIUM: number;
    VIP: number;
    COUPLE: number;
    ACCESSIBLE: number;
  };
}

export interface SeatRow {
  row: string;
  seats: SeatWithStatus[];
}

export interface SeatLegend {
  type: SeatType | "OCCUPIED" | "SELECTED";
  label: string;
  color: string;
}

// ─── Booking Flow Types ───────────────────────────────────

export interface BookingFlowState {
  step:
    | "movie"
    | "branch"
    | "date"
    | "showtime"
    | "seats"
    | "food"
    | "checkout"
    | "confirmation";
  selectedMovie: Movie | null;
  selectedBranch: Branch | null;
  selectedDate: Date | null;
  selectedSchedule: Schedule | null;
  selectedSeats: SelectedSeat[];
  selectedFood: SelectedFood[];
  appliedCoupon: Coupon | null;
  bookingId: string | null;
}

export interface SelectedSeat {
  seatId: string;
  row: string;
  number: number;
  type: SeatType;
  price: number;
}

export interface SelectedFood {
  foodItem: FoodItem;
  quantity: number;
}

// ─── AI / Recommendation Types ────────────────────────────

export interface MovieRecommendation {
  movie: Movie;
  reason: string;
  score: number;
}

export interface SmartSeatSuggestion {
  seats: SeatWithStatus[];
  reason: string;
  totalPrice: number;
}

// ─── Analytics Types (Admin) ──────────────────────────────

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  totalMovies: number;
  bookingsByStatus: Record<BookingStatus, number>;
  revenueByGateway: Record<string, number>;
  topMovies: Array<{ movie: Movie; bookings: number; revenue: number }>;
  recentBookings: BookingWithDetails[];
}
