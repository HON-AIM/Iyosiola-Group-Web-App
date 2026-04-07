export function contactConfirmationTemplate(data: {
  firstName: string;
  ticketId: string;
  subject: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a202c; color: white; padding: 20px; border-radius: 8px; }
        .ticket { background: #f7fafc; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
        .footer { color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Contacting Us</h1>
        </div>
        
        <p>Hi ${data.firstName},</p>
        
        <p>We've received your message about "<strong>${data.subject}</strong>" and will review it shortly. Our team typically responds within 24 business hours.</p>
        
        <div class="ticket">
          <strong>Ticket ID:</strong> ${data.ticketId}<br>
          <small>Please reference this ID if you follow up with us</small>
        </div>
        
        <p>If you have any urgent matters, please call us at +234 800 IYOSIOLA.</p>
        
        <p>Best regards,<br><strong>IYOSIOLA GROUP Team</strong></p>
        
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}