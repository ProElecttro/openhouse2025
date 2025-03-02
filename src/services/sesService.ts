import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// SES configuration
const sesConfig = {
  region: import.meta.env.VITE_AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || "",
  },
};

const sourceEmail = import.meta.env.VITE_AWS_SES_SOURCE_EMAIL || "ee22b073@smail.iitm.ac.in";
const sesClient = new SESClient(sesConfig);

/**
 * Sends a confirmation email to the user after successful registration
 * @param recipientEmail Email address of the recipient
 * @param name Name of the recipient
 * @param registrationId Unique registration ID
 * @returns Promise that resolves with the send result
 */
export const sendConfirmationEmail = async (
  recipientEmail: string,
  name: string,
  registrationId: string
) => {
  if (!sesConfig.credentials.accessKeyId || !sesConfig.credentials.secretAccessKey) {
    throw new Error("🚨 AWS credentials are missing! Check .env file.");
  }

  try {
    const emailParams = {
      Destination: {
        ToAddresses: [recipientEmail],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
              <html>
                <head>
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                      line-height: 1.6;
                      color: #333;
                    }
                    .container {
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                      border: 1px solid #e0e0e0;
                      border-radius: 5px;
                    }
                    .header {
                      background: linear-gradient(to right, #8B5CF6, #3B82F6);
                      padding: 20px;
                      color: white;
                      border-radius: 5px 5px 0 0;
                      text-align: center;
                    }
                    .content {
                      padding: 20px;
                    }
                    .footer {
                      text-align: center;
                      padding: 20px;
                      font-size: 12px;
                      color: #666;
                      border-top: 1px solid #e0e0e0;
                    }
                    .button {
                      display: inline-block;
                      background: linear-gradient(to right, #8B5CF6, #3B82F6);
                      color: white;
                      padding: 12px 24px;
                      text-decoration: none;
                      border-radius: 5px;
                      margin: 20px 0;
                    }
                    .details {
                      background-color: #f9f9f9;
                      padding: 15px;
                      border-radius: 5px;
                      margin: 20px 0;
                    }
                    .highlight {
                      font-weight: bold;
                      color: red;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>Registration Confirmed!</h1>
                    </div>
                    <div class="content">
                      <p>Dear ${name},</p>
                      <p>Thank you for registering for the CFI Open House 2025 at IIT Madras. Your registration has been successfully processed.</p>
                      
                      <div class="details">
                        <p><strong>Registration ID:</strong> ${registrationId}</p>
                        <p><strong>Event Date:</strong> March 16, 2025</p>
                        <p><strong>Venue:</strong> Centre for Innovation, IIT Madras, Chennai, Tamil Nadu 600036</p>
                      </div>
                      
                      <p>We're excited to have you join us for this showcase of innovation and technology. You'll have the opportunity to explore cutting-edge projects, interact with student innovators, and experience the future of technology.</p>
                      
                      <p>Please save this email for your records. We'll send you additional information and updates as the event approaches.</p>
                      
                      <a href="https://example.com/event-details" class="button">View Event Details</a>
                      
                      <p>If you have any questions or need assistance, please contact us at <a href="mailto:cfi@iitm.ac.in">cfi@iitm.ac.in</a>.</p>
                      
                      <p>We look forward to seeing you at the Open House!</p>
                      
                      <p>Best regards,<br>CFI Open House Team<br>IIT Madras</p>
                    </div>
                    <div class="footer">
                      <p class="highlight">⚠️ This is an automated message. Please do not reply to this email.</p>
                      <p>&copy; ${new Date().getFullYear()} Centre for Innovation, IIT Madras. All rights reserved.</p>
                    </div>
                  </div>
                </body>
              </html>
            `,
          },
          Text: {
            Charset: "UTF-8",
            Data: `
              Dear ${name},
              
              Thank you for registering for the CFI Open House 2025 at IIT Madras. Your registration has been successfully processed.
              
              Registration ID: ${registrationId}
              Event Date: March 16, 2025
              Venue: Centre for Innovation, IIT Madras, Chennai, Tamil Nadu 600036
              
              We're excited to have you join us for this showcase of innovation and technology. You'll have the opportunity to explore cutting-edge projects, interact with student innovators, and experience the future of technology.
              
              Please save this email for your records. We'll send you additional information and updates as the event approaches.
              
              If you have any questions or need assistance, please contact us at cfi@iitm.ac.in.
              
              We look forward to seeing you at the Open House!
              
              Best regards,
              CFI Open House Team
              IIT Madras
              
              ⚠️ **This is an automated message. Please do not reply to this email.**
              
              © ${new Date().getFullYear()} Centre for Innovation, IIT Madras. All rights reserved.
            `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "CFI Open House 2025 - Registration Confirmation",
        },
      },
      Source: sourceEmail,
    };

    const result = await sesClient.send(new SendEmailCommand(emailParams));
    console.log("✅ Confirmation email sent successfully:", result);
    return result;
  } catch (error: any) {
    console.error("❌ AWS SES Error:", error);
    console.error("🛠 Error Code:", error.name || "UNKNOWN");
    console.error("🔹 AWS Message:", error.message || "No message provided");

    if (error.$metadata) {
      console.error("📡 AWS Response Metadata:", error.$metadata);
    }

    throw new Error(error.message || "Failed to send confirmation email.");
  }
};
