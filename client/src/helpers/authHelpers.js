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

export function canViewLessonDetails(user) {
  // תלמיד, מורה ומנהל יכולים לצפות בפרטי שיעור
  return isStudent(user) || isTeacher(user) || isAdmin(user);
}

export function canViewTeacherDetails(user) {
  // תלמיד ומנהל יכולים לצפות בפרטי מורה
  return isStudent(user) || isAdmin(user);
}

export function canRegisterToLesson(user) {
  // רק תלמיד יכול להירשם לשיעור
  return isStudent(user);
}

export function canCreateLesson(user) {
  // רק מורה יכול ליצור שיעור
  return isTeacher(user);
}

export function canAccessMessages(user) {
  // כל משתמש מחובר יכול לגשת להודעות
  return isLoggedIn(user);
}

export function canManageTeachers(user) {
  // רק מנהל יכול לנהל מורים
  return isAdmin(user);
}

export function canManageLessons(user) {
  // רק מנהל יכול לנהל שיעורים
  return isAdmin(user);
}

export function canRespondToContact(user) {
  // רק מנהל יכול לטפל בפניות צור קשר
  return isAdmin(user);
}
