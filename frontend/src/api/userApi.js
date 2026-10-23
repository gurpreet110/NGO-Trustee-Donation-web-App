import { users } from "./mockData";
import { delay } from "./delay";

export const userApi = {
  getAll: () => delay(users),
  getById: (id) => delay(users.find((u) => u.id === id)),
  updateRole: (userId, newRole) => {
    const user = users.find((u) => u.id === userId);
    if (user) user.role = newRole;
    return delay(user);
  },
};
