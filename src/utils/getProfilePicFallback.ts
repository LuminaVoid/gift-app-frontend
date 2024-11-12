import { User } from "../types";

const colors = [
  "#3B1E54",
  "#605678",
  "#37AFE1",
  "#F09319",
  "#3D5300",
  "#F87A53",
  "#387478",
  "#1E3E62",
  "#B17457",
  "#664343",
  "#6439FF",
  "#A64D79",
];

export const getProfilePicFallback = ({ firstName, lastName }: User) => {
  const nameLength = firstName.length + (lastName?.length ?? 0);
  return {
    color: colors[nameLength % colors.length],
    letter: firstName[0],
  };
};
