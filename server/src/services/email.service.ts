import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use STARTTLS instead of implicit SSL (port 465)
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // Debug logging (no passwords)
    console.log('SMTP CONFIG:', {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        user: process.env.EMAIL_USER,
    });

    return transporter;
};

// Send Welcome Email
export const sendWelcomeEmail = async (to: string, userName?: string) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"Balance Board" <${process.env.EMAIL_USER}>`,
        to,
        subject: '🎉 Welcome to Balance Board!',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%); padding: 40px 20px; text-align: center; }
                    .header h1 { color: white; margin: 0; font-size: 32px; font-weight: 700; }
                    .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px; }
                    .content { padding: 40px 30px; }
                    .content h2 { color: #333; font-size: 24px; margin-bottom: 20px; }
                    .content p { color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 15px; }
                    .features { background: #f9fafb; border-radius: 12px; padding: 25px; margin: 30px 0; }
                    .feature { display: flex; align-items: start; margin-bottom: 15px; }
                    .feature-icon { font-size: 24px; margin-right: 12px; }
                    .feature-text { color: #333; font-size: 15px; }
                    .cta { text-align: center; margin: 30px 0; }
                    .cta-button { display: inline-block; background: linear-gradient(135deg, #1976d2, #42a5f5); color: white; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; }
                    .footer { background: #f9fafb; padding: 25px; text-align: center; color: #666; font-size: 14px; }
                    .footer a { color: #1976d2; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>💰 Balance Board</h1>
                        <p>Your Personal Finance Companion</p>
                    </div>
                    <div class="content">
                        <h2>Welcome${userName ? `, ${userName}` : ''}! 🎉</h2>
                        <p>Thank you for joining Balance Board! We're thrilled to have you on board.</p>
                        <p>Balance Board is your all-in-one financial tracking platform designed to help you take control of your finances, visualize your spending patterns, and achieve your financial goals.</p>
                        
                        <div class="features">
                            <div class="feature">
                                <span class="feature-icon">📊</span>
                                <span class="feature-text"><strong>Track Expenses:</strong> Monitor all your transactions in one place</span>
                            </div>
                            <div class="feature">
                                <span class="feature-icon">📈</span>
                                <span class="feature-text"><strong>Visual Analytics:</strong> Beautiful charts and graphs for insights</span>
                            </div>
                            <div class="feature">
                                <span class="feature-icon">💡</span>
                                <span class="feature-text"><strong>Smart Categories:</strong> Organize expenses by type and category</span>
                            </div>
                            <div class="feature">
                                <span class="feature-icon">🎯</span>
                                <span class="feature-text"><strong>Savings Goals:</strong> Track your savings rate and net income</span>
                            </div>
                        </div>

                        <div class="cta">
                            <a href="${process.env.FRONTEND_URL || 'https://frontend-production-80c5.up.railway.app'}" class="cta-button">Start Tracking Now</a>
                        </div>

                        <p>If you have any questions or need assistance, feel free to reach out to us.</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Balance Board. All rights reserved.</p>
                        <p><a href="${process.env.FRONTEND_URL || 'https://frontend-production-80c5.up.railway.app'}">Visit Dashboard</a></p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent to:', to);
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw new Error('Failed to send welcome email. Please check email configuration.');
    }
};

// Send OTP Email for Password Reset
export const sendPasswordResetOTP = async (to: string, otp: string) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"Balance Board" <${process.env.EMAIL_USER}>`,
        to,
        subject: '🔐 Password Reset OTP - Balance Board',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%); padding: 40px 20px; text-align: center; }
                    .header h1 { color: white; margin: 0; font-size: 32px; font-weight: 700; }
                    .content { padding: 40px 30px; text-align: center; }
                    .content h2 { color: #333; font-size: 24px; margin-bottom: 20px; }
                    .content p { color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 20px; }
                    .otp-box { background: linear-gradient(135deg, #f0f7ff 0%, #e3f2fd 100%); border: 2px solid #1976d2; border-radius: 12px; padding: 25px; margin: 30px 0; }
                    .otp-code { font-size: 42px; font-weight: 700; color: #1976d2; letter-spacing: 8px; margin: 10px 0; }
                    .warning { background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; text-align: left; border-radius: 4px; }
                    .warning p { margin: 0; color: #e65100; font-size: 14px; }
                    .footer { background: #f9fafb; padding: 25px; text-align: center; color: #666; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Password Reset</h1>
                    </div>
                    <div class="content">
                        <h2>Reset Your Password</h2>
                        <p>You requested to reset your password. Use the OTP code below to proceed:</p>
                        
                        <div class="otp-box">
                            <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
                            <div class="otp-code">${otp}</div>
                            <p style="margin: 0; color: #666; font-size: 14px;">Valid for 10 minutes</p>
                        </div>

                        <p>Enter this code on the password reset page to create a new password.</p>

                        <div class="warning">
                            <p><strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account is secure.</p>
                        </div>
                    </div>
                    <div class="footer">
                        <p>© 2025 Balance Board. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent to:', to);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email. Please check email configuration.');
    }
};

// Send Account Deletion Confirmation Email
export const sendAccountDeletionEmail = async (to: string, userName?: string) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"Balance Board" <${process.env.EMAIL_USER}>`,
        to,
        subject: '👋 Account Deletion Confirmation - Balance Board',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #ef5350 0%, #e53935 100%); padding: 40px 20px; text-align: center; }
                    .header h1 { color: white; margin: 0; font-size: 32px; font-weight: 700; }
                    .content { padding: 40px 30px; text-align: center; }
                    .content h2 { color: #333; font-size: 24px; margin-bottom: 20px; }
                    .content p { color: #555; line-height: 1.8; font-size: 16px; margin-bottom: 20px; }
                    .icon { font-size: 64px; margin: 20px 0; }
                    .message-box { background: #fff3e0; border-left: 4px solid #ff9800; padding: 20px; margin: 25px 0; text-align: left; border-radius: 4px; }
                    .message-box p { margin: 0; color: #e65100; font-size: 14px; line-height: 1.6; }
                    .feedback-section { background: #f9fafb; border-radius: 12px; padding: 25px; margin: 25px 0; }
                    .feedback-section p { color: #666; font-size: 14px; margin-bottom: 15px; }
                    .feedback-button { display: inline-block; background: linear-gradient(135deg, #1976d2, #42a5f5); color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 600; font-size: 14px; }
                    .footer { background: #f9fafb; padding: 25px; text-align: center; color: #666; font-size: 14px; }
                    .footer p { margin: 5px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>👋 Goodbye${userName ? `, ${userName}` : ''}</h1>
                    </div>
                    <div class="content">
                        <div class="icon">😢</div>
                        <h2>Your Account Has Been Deleted</h2>
                        <p>We're sorry to see you go! Your Balance Board account and all associated data have been permanently deleted as requested.</p>
                        
                        <div class="message-box">
                            <p><strong>⚠️ What's Been Deleted:</strong></p>
                            <p>• Your user profile and login credentials</p>
                            <p>• All your expense transactions and records</p>
                            <p>• Financial analytics and reports</p>
                            <p>• Custom categories and preferences</p>
                        </div>

                        <p><strong>This action is permanent and cannot be undone.</strong></p>

                        <p style="margin-top: 30px;">If you change your mind, you're always welcome back! Simply create a new account to start fresh.</p>
                        
                        <p style="font-size: 18px; margin-top: 30px;">✨ Take care and goodbye! ✨</p>
                        
                        <p style="margin-top: 30px; color: #999; font-size: 14px;">Thank you for being part of the Balance Board community.</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Balance Board. All rights reserved.</p>
                        <p>This is an automated confirmation email.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Account deletion email sent to:', to);
    } catch (error) {
        console.error('Error sending account deletion email:', error);
        throw new Error('Failed to send account deletion email. Please check email configuration.');
    }
};
