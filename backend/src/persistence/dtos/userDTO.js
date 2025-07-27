export class UserDTO {
  id = null;
  name = null;
  email = null;
  password = null;

  toJSON() {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
}; } }