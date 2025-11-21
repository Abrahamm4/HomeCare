export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  //legge til mer senere: firstName, lastName, osv.
}
