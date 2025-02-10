// user.ts
import { UserDetails } from "./UserDetails";
import { Role } from "./Role";

export class User {
  id: string;
  username: string;
  password: string;
  email: string;
  role:Role;
  userDetails: UserDetails;

  constructor(username: string, password: string, email: string, role: Role, userDetails: UserDetails) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.role = role;
    this.userDetails = userDetails;
  }
}
