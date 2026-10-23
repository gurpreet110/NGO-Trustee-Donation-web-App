import { users, accounts } from "./mockData";
import { delay } from "./delay";

export const authApi = {
  login: (email, password) => {
    const account = accounts.find(
      (a) => a.email === email && a.password === password
    );
    if (!account) return delay(null);
    const user = users.find((u) => u.id === account.userId);
    return delay(user);
  },
  register: ({ name, email, password }) => {
    // Check if email already exists.
    if (accounts.some((a) => a.email === email)) {
      return delay(null);
    }
    const newUser = {
      id: `u${Date.now()}`,
      name,
      email,
      role: "donor",
      joinedDate: new Date().toISOString().split("T")[0],
      totalDonated: 0,
    };
    users.push(newUser);
    accounts.push({ email, password, userId: newUser.id });
    return delay(newUser);
  },
};
