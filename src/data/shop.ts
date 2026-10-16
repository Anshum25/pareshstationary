export const shop = {
  name: "Paresh Stationery Mart",
  tagline: "Dealing in all types of stationery",
  address: "74, Happy Home Shopping Center, Ankur Ranna Park Road, Naranpura, Ahmedabad - 380013, Gujarat",
  owners: [
    { name: "Paresh Shah", phone: "+91 94270 50409", tel: "+919427050409" },
    { name: "Sanjay Shah", phone: "+91 94267 58202", tel: "+919426758202" },
  ],
  whatsapp: "+919427071723",
  email: "pareshstationery@yahoo.co.in",
  categories: [
    { number: "01", title: "School supplies", note: "The little things that make a big day.", icon: "✳", tone: "yellow", wide: true },
    { number: "02", title: "Office essentials", note: "Ready when your next idea is.", icon: "↗", tone: "paper" },
    { number: "03", title: "Art & craft", note: "Make room for a little more colour.", icon: "◉", tone: "orange", photo: true },
    { number: "04", title: "Pens & pencils", note: "Your next favourite, right here.", icon: "✎", tone: "blue" },
    { number: "05", title: "Files & folders", note: "A place for all the good ideas.", icon: "▤", tone: "paper" },
    { number: "06", title: "Ink & cartridges", note: "Printer running low? We can help.", icon: "▰", tone: "yellow" },
    { number: "07", title: "Gifting & journals", note: "Thoughtful things to give or keep.", icon: "✿", tone: "orange" },
    { number: "08", title: "Projects & exams", note: "All set for the important stuff.", icon: "✦", tone: "blue" },
  ],
  faqs: [
    { q: "Can I refill my printer cartridge here?", a: "Yes. Cartridge refilling is available at Paresh Stationery Mart. Call or message us first about your cartridge and we'll help you with the next step." },
    { q: "Do you take bulk orders for schools and offices?", a: "Please get in touch with Paresh Shah or Sanjay Shah to discuss your stationery requirements and bulk order." },
    { q: "Where can I find the shop?", a: "Find us at 74, Happy Home Shopping Center, Ankur Ranna Park Road, Naranpura, Ahmedabad - 380013, Gujarat." },
    { q: "What are your opening hours?", a: "Opening hours haven't been provided yet. Please call either shop contact to check before visiting." },
  ],
};

export const whatsappLink = (message: string) =>
  `https://wa.me/919427071723?text=${encodeURIComponent(message)}`;
