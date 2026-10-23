import { contactMessages } from "./mockData";
import { delay } from "./delay";

export const contactApi = {
  getAll: () => delay(contactMessages),
  create: ({ name, email, message }) => {
    const newMessage = {
      id: `m${Date.now()}`,
      name,
      email,
      message,
      date: new Date().toISOString().split("T")[0],
    };
    contactMessages.push(newMessage);
    return delay(newMessage);
  },
};
