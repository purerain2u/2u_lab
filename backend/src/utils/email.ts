import nodemailer from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  // 1) 트랜스포터 생성
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // 2) 이메일 옵션 정의
  const mailOptions = {
    from: '2U TubeLab <noreply@2utubelab.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html // HTML 버전의 이메일을 보내고 싶다면 이 옵션을 사용하세요
  };

  // 3) 이메일 전송
  await transporter.sendMail(mailOptions);
};
