export interface User {
  sub?: string;      // Username (from ClaimTypes.Name)
  nameid?: string;   // userId in the db (from ClaimTypes.NameIdentifier)
  jti?: string;      // uniq id for token
  iat?: number;      // issued at (seconds since epoch)
  exp?: number;      // expires at (seconds since epoch)
  iss?: string;      // issuer
  aud?: string;      // audience
  role?: string | string[];  // Role claim(s) from JWT
  
  // Map full URIs from ASP.NET Identity claims
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
}
