export interface User {
  sub: string;      // brukernavn
  nameid: string;   // userId i databasen 
  jti: string;      // unik id for tokenet
  iat: number;      // issued at (seconds since epoch)
  exp: number;      // expires at (seconds since epoch)
  iss: string;      // issuer
  aud: string;      // audience
}
