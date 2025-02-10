import { Role } from "./Role";

export class UserSave {
  id?: string;
  username: string;
  name: string;
  cedula: string;
  celular: string;
  password: string;
  email: string;
  roleName: string;

  constructor(
    id: string,
    username: string,
    name: string,
    cedula: string,
    celular: string,
    password: string,
    email: string,
    roleName: string
  ) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.cedula = cedula;
    this.celular = celular;
    this.password = password;
    this.email = email;
    this.roleName = roleName;
  }
}
