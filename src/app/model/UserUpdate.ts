// user.ts
import { UserDetails } from "./UserDetails";
import { Role } from "./Role";

export class UserUpdate {
  id: string;
  username: string;
  password: string;
  email: string;
  roleName:string;
  userDetails: UserDetails;

  constructor(username: string, password: string, email: string, roleName: string, userDetails: UserDetails) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.roleName = roleName;
    this.userDetails = userDetails;
  }
}
