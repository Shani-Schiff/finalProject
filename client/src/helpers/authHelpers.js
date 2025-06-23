export function isLoggedIn(user) {
  return !!user?.token;
}

export function hasRole(user, role) {
  return user?.role === role;
}

export function isAdmin(user) {
  return hasRole(user, 'admin');
}

export function isTeacher(user) {
  return hasRole(user, 'teacher');
}

export function isStudent(user) {
  return hasRole(user, 'student');
}

export function canViewDetails(user) {
  return isLoggedIn(user);
}

export function canCreateLesson(user) {
  return isTeacher(user) || isAdmin(user);
}

export function canAccessMessages(user) {
  return isLoggedIn(user);
}

export function canManageTeachers(user) {
  return isAdmin(user);
}

export function canManageLessons(user) {
  return isAdmin(user);
}

export function canRespondToContact(user) {
  return isAdmin(user);
}
