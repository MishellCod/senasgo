import { auth } from "@clerk/nextjs"

const adminIds = [
  "user_3LYqtoz2BCjaOD62AGbEVZplxbm",
];

export const isAdmin = () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  return adminIds.indexOf(userId) !== -1;
};
