export enum UserType {
  SuperAdmin = 0,
  Admin = 1,
  User = 2
}

export const getUserTypeString = (userType: UserType): string => {
  switch (userType) {
    case UserType.SuperAdmin:
      return 'SuperAdmin';
    case UserType.Admin:
      return 'Admin';
    case UserType.User:
      return 'User';
    default:
      return 'Unknown';
  }
};
