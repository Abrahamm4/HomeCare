export interface User {
  sub: string;      // Username
  nameid: string;   // userId in the db 
  jti: string;      // uniq id for tokenet
  iat: number;      // issued at (seconds since epoch)
  exp: number;      // expires at (seconds since epoch)
  iss: string;      // issuer
  aud: string;      // audience
}
