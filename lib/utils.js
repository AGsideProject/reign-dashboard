import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const handleName = (username) => {
  const capitalizeName = (username && username.toUpperCase()) || "";
  const temp = capitalizeName.split(" ");
  if (temp.length > 1) return temp[0][0] + temp[1][0];
  return capitalizeName[0] + capitalizeName[1];
};
