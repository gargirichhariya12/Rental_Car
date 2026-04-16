class EmailService {
  constructor() {
    this.sendGridUrl = "https://api.sendgrid.com/v3/mail/send";
  }

  isConfigured() {
    return Boolean(process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM);
  }

  formatDate(value) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(new Date(value));
  }

  formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(Number(value || 0));
  }

  async sendBookingConfirmation(booking) {
    const userEmail = booking?.user?.email;

    if (!this.isConfigured()) {
      console.info("EmailService: SENDGRID_API_KEY or EMAIL_FROM is missing. Skipping booking confirmation email.");
      return { sent: false, skipped: true };
    }

    if (!userEmail) {
      console.info("EmailService: booking user email not found. Skipping booking confirmation email.");
      return { sent: false, skipped: true };
    }

    const carName = `${booking?.car?.brand || "Car"} ${booking?.car?.model || ""}`.trim();
    const pickupDate = this.formatDate(booking.pickupDate);
    const returnDate = this.formatDate(booking.returnDate);
    const totalPrice = this.formatCurrency(booking.price);

    const subject = `Booking Confirmed - ${carName}`;
    const text = [
      `Hi ${booking?.user?.name || "there"},`,
      "",
      "Your booking has been confirmed successfully.",
      `Booking ID: ${booking?._id}`,
      `Car: ${carName}`,
      `Pickup date: ${pickupDate}`,
      `Return date: ${returnDate}`,
      `Total amount paid: ${totalPrice}`,
      "",
      "Thank you for choosing our platform."
    ].join("\n");

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="margin-bottom: 12px;">Booking Confirmed</h2>
        <p>Hi ${booking?.user?.name || "there"},</p>
        <p>Your booking has been confirmed successfully.</p>
        <p><strong>Booking ID:</strong> ${booking?._id}</p>
        <p><strong>Car:</strong> ${carName}</p>
        <p><strong>Pickup date:</strong> ${pickupDate}</p>
        <p><strong>Return date:</strong> ${returnDate}</p>
        <p><strong>Total amount paid:</strong> ${totalPrice}</p>
        <p>Thank you for choosing our platform.</p>
      </div>
    `;

    const body = {
      personalizations: [
        {
          to: [{ email: userEmail }],
          subject
        }
      ],
      from: { email: process.env.EMAIL_FROM },
      reply_to: process.env.EMAIL_REPLY_TO ? { email: process.env.EMAIL_REPLY_TO } : undefined,
      content: [
        { type: "text/plain", value: text },
        { type: "text/html", value: html }
      ]
    };

    const response = await fetch(this.sendGridUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`SendGrid email API failed with ${response.status}: ${responseText.slice(0, 200)}`);
    }

    return { sent: true };
  }
}

export default new EmailService();
