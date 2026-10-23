import { trustees } from "./mockData";
import { delay } from "./delay";

export const trusteeApi = {
  getAll: () => delay(trustees),
  getById: (id) => delay(trustees.find((t) => t.id === id)),
};
