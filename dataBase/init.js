const models = require('../server/models');
const {
  User, UserPassword, UserRole, Role, Subject,
  Lesson, LessonStudent, Media
} = models;

async function init() {
    await sequelize.sync({ force: true });
    console.log('✅ All tables created');

    // Roles
    const roleNames = ['student', 'teacher', 'admin'];
    const roles = {};
    for (const name of roleNames) {
        roles[name] = await Role.create({ name });
    }

    // Default admin
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    const admin = await User.create({ user_name: 'System Admin', email: 'admin@system.com', role: 'admin' });
    await UserPassword.create({ user_id: admin.user_id, hashed_password: hashedPassword });
    await UserRole.create({ user_id: admin.user_id, role_id: roles.admin.id });
    console.log('👤 Admin user created');

    // Subjects
    const subjectNames = ['אנגלית', 'מתמטיקה', 'אזרחות', 'היסטוריה', 'הבעה ולשון', 'תנ"ך', 'ספרות', 'אמנות', 'גיאוגרפיה', 'מדעי החברה', 'ביולוגיה', 'כימיה', 'פיזיקה'];
    const subjects = [];
    for (const name of subjectNames) subjects.push(await Subject.create({ subject_name: name }));

    // Students
    const studentIds = [];
    for (let i = 0; i < 50; i++) {
        const u = await User.create({ user_name: faker.person.fullName(), email: faker.internet.email(), role: 'student' });
        await UserRole.create({ user_id: u.user_id, role_id: roles.student.id });
        studentIds.push(u.user_id);
    }

    // Teachers
    const teacherIds = [];
    for (let i = 0; i < 10; i++) {
        const u = await User.create({ user_name: faker.person.fullName(), email: faker.internet.email(), role: 'teacher' });
        await UserPassword.create({ user_id: u.user_id, hashed_password: await bcrypt.hash(faker.internet.password(), 10) });
        await UserRole.create({ user_id: u.user_id, role_id: roles.teacher.id });
        teacherIds.push(u.user_id);
    }

    // Lessons
    for (const tId of teacherIds) {
        for (let k = 0; k < 3; k++) {
            const subj = faker.helpers.arrayElement(subjects);
            const level = faker.number.int({ min: 2, max: 5 });
            const lesson = await Lesson.create({
                title: `שיעור ב${subj.subject_name}`,
                subject_id: subj.id,
                level,
                teacher_id: tId,
                start_date: new Date(),
                end_date: new Date(Date.now() + 7 * 86400000),
                max_participants: faker.number.int({ min: 1, max: 8 }),
                price: faker.finance.amount(50, 200, 2),
                location: 'online',
                status: 'open'
            });
            const studs = faker.helpers.arrayElements(studentIds, faker.number.int({ min: 1, max: 6 }));
            for (const s of studs) await LessonStudent.create({ student_id: s, lesson_id: lesson.id, status: 'enrolled' });
        }
    }

    console.log('✅ DB seeded!');
    process.exit();
}

init();
