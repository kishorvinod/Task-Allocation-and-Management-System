export interface JwtPayload {
  userId: string;
  role: "admin" | "user";
}