const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Task = require('../models/Task');
const Hackathon = require('../models/Hackathon');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Defaults to gmail, can be configured
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendDailyNotifications = async (force = false) => {
    console.log('Running daily notification check...');
    try {
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        // Get tasks due today
        const tasksDueToday = await Task.find({
            dueDate: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            status: 'pending'
        });

        // Get hackathons starting in next 7 days
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const upcomingHackathons = await Hackathon.find({
            startDate: {
                $gte: startOfDay,
                $lte: nextWeek
            }
        });

        // Debug logging
        console.log(`Checking notifications for date: ${today.toDateString()}`);
        console.log(`Email User configured: ${process.env.EMAIL_USER ? 'Yes (' + process.env.EMAIL_USER + ')' : 'No'}`);
        console.log(`Tasks due today: ${tasksDueToday.length}`);
        console.log(`Upcoming hackathons: ${upcomingHackathons.length}`);

        if (!force && tasksDueToday.length === 0 && upcomingHackathons.length === 0) {
            console.log('No notifications to send today (No tasks due today and no upcoming hackathons).');
            return;
        }

        const emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Hackathon Hero Daily Digest</h1>
                <p>Here's what's on your plate for today, ${today.toDateString()}:</p>
                
                ${tasksDueToday.length > 0 ? `
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                        <h2 style="color: #d32f2f; margin-top: 0;">Tasks Due Today (${tasksDueToday.length})</h2>
                        <ul style="padding-left: 20px;">
                            ${tasksDueToday.map(t => `
                                <li style="margin-bottom: 5px;">
                                    <strong>${t.title}</strong> 
                                    <span style="color: #666; font-size: 0.9em;">(${t.priority})</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : '<p style="color: #4caf50;">No tasks due today! 🎉</p>'}

                ${upcomingHackathons.length > 0 ? `
                    <div style="background: #e3f2fd; padding: 15px; border-radius: 5px;">
                        <h2 style="color: #1976d2; margin-top: 0;">Upcoming Hackathons</h2>
                        <ul style="padding-left: 20px;">
                            ${upcomingHackathons.map(h => `
                                <li style="margin-bottom: 5px;">
                                    <strong>${h.name}</strong><br/>
                                    <span style="color: #666; font-size: 0.9em;">Starts: ${new Date(h.startDate).toDateString()}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : '<p>No upcoming hackathons in the next 7 days.</p>'}
                
                <p style="margin-top: 30px; color: #888; font-size: 0.8em;">
                    Sent by Hackathon Hero Notification System
                </p>
            </div>
        `;

        const targetEmail = process.env.USER_EMAIL || process.env.EMAIL_USER;

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS && targetEmail) {
            const mailOptions = {
                from: `"Hackathon Hero" <${process.env.EMAIL_USER}>`,
                to: targetEmail,
                subject: `📅 Daily Digest: ${tasksDueToday.length} Tasks Due Today`,
                html: emailContent
            };

            await transporter.sendMail(mailOptions);
            console.log(`Daily notification email sent to ${targetEmail}`);
        } else {
            console.log('Email credentials not fully configured. Skipping email send.');
            // console.log('Content:', emailContent);
        }

    } catch (error) {
        console.error('❌ Error sending daily notifications:', error.message);
        if (error.code === 'EAUTH' || error.responseCode === 535) {
            console.error('⚠️  AUTHENTICATION FAILED: likely invalid password.');
            console.error('👉 ACTION REQUIRED: Go to https://myaccount.google.com/apppasswords');
            console.error('   Generate a new App Password and put it in backend/.env as EMAIL_PASS.');
            console.error('   Your current password "demo123" (or similar) will NOT work.');
        }
    }
};

const initScheduler = () => {
    // Schedule for 9:00 AM every day
    cron.schedule('0 9 * * *', () => {
        sendDailyNotifications();
    }, {
        scheduled: true
    });

    console.log('Notification scheduler initialized: running daily at 9:00 AM');
};

module.exports = { initScheduler, sendDailyNotifications };
