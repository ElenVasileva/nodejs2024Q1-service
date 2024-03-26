export class User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update

  public static getSafeUser(user: User): { id: string; login: string; version: number; createdAt: number; updatedAt: number } {
    const copyUser = { ...user };
    delete copyUser['password'];
    return copyUser;
  }

  public static userFromDB(user: { id: string; login: string; password: string; version: number; createdAt: Date; updatedAt: Date }): User {
    return { ...user, createdAt: user.createdAt.getTime(), updatedAt: user.updatedAt.getTime() } as User;
  }
}
