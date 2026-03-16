import {
  INVALID_EMAIL_SUFFIX,
  TECHNICAL_SPECIALIST_EMAIL_SUFFIX,
} from '../constants/AppConstants';

export const filterInvalidUsersEmail = users => {
  if (users?.length > 0) {
    const filteredUsers = users?.filter(user => {
      if (
        user.includes(INVALID_EMAIL_SUFFIX) ||
        user.includes(TECHNICAL_SPECIALIST_EMAIL_SUFFIX)
      ) {
        return;
      }

      return user;
    });

    return filteredUsers;
  }

  return users;
};
