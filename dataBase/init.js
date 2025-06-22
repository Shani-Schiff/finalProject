const sequelize = require('../dataBase/dataBase');
const User = require('../server/models/User');
const UserPassword = require('../server/models/UserPassword');
const Role = require('../server/models/Role');
const Lesson = require('../server/models/Lesson');
const LessonStudent = require('../server/models/LessonStudent');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

User.hasOne(UserPassword, { foreignKey: 'user_id' });
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
        const hashed_password = await bcrypt.hash(adminPassword, 10);
        const admin = await User.create({ user_name: 'System Admin', email: adminEmail, role: 'admin' });
        await UserPassword.create({ user_id: admin.user_id, hashed_password: hashed_password });
        console.log("Admin created: ${adminEmail} / ${adminPassword}");

        const student_ids = [];
        const teacher_ids = [];

        for (let i = 0; i < 50; i++) {
            const user = await User.create({
                user_name: faker.person.full_name(),
                email: faker.internet.email(),
                role: 'student'
            });
            student_ids.push(user.user_id);
        }

        for (let i = 0; i < 10; i++) {
            const user = await User.create({
                user_name: faker.person.full_name(),
                email: faker.internet.email(),
                role: 'teacher'
            });
            teacher_ids.push(user.user_id);

            const password = faker.internet.password();
            const hashed = await bcrypt.hash(password, 10);
            await UserPassword.create({ user_id: user.user_id, hashed_password: hashed });
            console.log("Teacher password for ${user.user_id}: ${password}");
        }

        const subjects = ['Math', 'English', 'Science', 'History', 'Art'];
        for (const teacher_id of teacher_ids) {
            for (const subject of subjects) {
                const isPrivate = Math.random() < 0.5;
                const max_participants = isPrivate ? 1 : faker.number.int({ min: 3, max: 8 });

                const lesson = await Lesson.create({
                    title: `${subject} Lesson`,
                    subject,
                    level: 'Beginner',
                    teacher_id: teacher_id,
                    start_date: new Date(),
                    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    schedule: 'Once a week',
                    max_participants: max_participants,
                    price: faker.finance.amount(50, 200, 2),
                    location: 'Online',
                    status: 'open'
                });


                const selectedStudents = faker.helpers.arrayElements(student_ids, max_participants);
                for (const student_id of selectedStudents) {
                    await LessonStudent.create({ user_id: student_id, lesson_id: lesson.id, status: 'enrolled' });
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