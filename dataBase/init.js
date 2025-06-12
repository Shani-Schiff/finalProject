const sequelize = require('../dataBase/dataBase');
const User = require('../server/models/User');
const UserPassword = require('../server/models/UserPassword');
const Role = require('../server/models/Role');
const Lesson = require('../server/models/Lesson');
const LessonStudent = require('../server/models/LessonStudent');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

User.hasOne(UserPassword, { foreignKey: 'userId' });
User.hasMany(Lesson, { foreignKey: 'teacher_id', as: 'teachingLessons' });
User.belongsToMany(Lesson, { through: LessonStudent, foreignKey: 'user_id', as: 'studentLessons' });

Lesson.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });
Lesson.belongsToMany(User, { through: LessonStudent, foreignKey: 'lesson_id', as: 'students' });

async function init() {
    try {
        await sequelize.sync({ force: true });
        console.log('All tables created!');

        const roles = ['student', 'teacher', 'admin'];
        for (const name of roles) {
            await Role.create({ name });
        }

        const adminEmail = 'admin@system.com';
        const adminPassword = 'Admin123!';
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const admin = await User.create({ userName: 'System Admin', email: adminEmail, role: 'admin' });
        await UserPassword.create({ userId: admin.userId, password: hashedPassword });
        console.log(`Admin created: ${adminEmail} / ${adminPassword}`);

        const studentIds = [];
        const teacherIds = [];

        for (let i = 0; i < 50; i++) {
            const user = await User.create({
                userName: faker.person.fullName(),
                email: faker.internet.email(),
                role: 'student'
            });
            studentIds.push(user.userId);
        }

        for (let i = 0; i < 10; i++) {
            const user = await User.create({
                userName: faker.person.fullName(),
                email: faker.internet.email(),
                role: 'teacher'
            });
            teacherIds.push(user.userId);

            const password = faker.internet.password();
            const hashed = await bcrypt.hash(password, 10);
            await UserPassword.create({ userId: user.userId, password: hashed });
            console.log(`Teacher password for ${user.userId}: ${password}`);
        }

        const subjects = ['Math', 'English', 'Science', 'History', 'Art'];
        for (const teacherId of teacherIds) {
            for (const subject of subjects) {
                const isPrivate = Math.random() < 0.5;
                const maxParticipants = isPrivate ? 1 : faker.number.int({ min: 3, max: 8 });

                const lesson = await Lesson.create({
                    title: `${subject} Lesson`,
                    subject,
                    level: 'Beginner',
                    teacher_id: teacherId,
                    start_date: new Date(),
                    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    schedule: 'Once a week',
                    max_participants: maxParticipants,
                    price: faker.finance.amount(50, 200, 2),
                    location: 'Online',
                    status: 'open'
                });


                const selectedStudents = faker.helpers.arrayElements(studentIds, maxParticipants);
                for (const studentId of selectedStudents) {
                    await LessonStudent.create({ user_id: studentId, lesson_id: lesson.id, status: 'enrolled' });
                }
            }
        }

        console.log("Database seeded successfully!");
        await sequelize.close();
    } catch (err) {
        console.error('Seeding error:', err);
    }
}

init();