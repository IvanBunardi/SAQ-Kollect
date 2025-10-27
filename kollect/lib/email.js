// lib/email.js (Mock implementation - ganti dengan service email real)
export const sendResetPasswordEmail = async (email, resetToken) => {
  // Implementasi kirim email
  // Gunakan service seperti Nodemailer, SendGrid, atau AWS SES
  console.log(`Reset password link: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`);
  
  // Mock implementation
  return {
    success: true,
    message: 'Email sent successfully'
  };
};