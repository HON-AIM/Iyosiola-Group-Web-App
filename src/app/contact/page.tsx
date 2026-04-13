import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Iyosi Foods",
  description:
    "Get in touch with Iyosi Foods. Contact us for product inquiries, wholesale orders, support, or feedback. We're here to help.",
  keywords: [
    "contact Iyosi Foods",
    "Iyosi Foods support",
    "flour wholesale Nigeria",
    "product inquiry",
    "flour company contact",
  ],
  openGraph: {
    title: "Contact Us | Iyosi Foods",
    description: "Get in touch with Iyosi Foods for product inquiries, wholesale orders, or support.",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
