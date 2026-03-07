export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-50">
      <section className="bg-primary-900 text-white py-20 px-4 md:px-8 text-center border-b-8 border-accent-500">
         <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Corporate Contact</h1>
         <p className="text-xl text-primary-100 max-w-2xl mx-auto font-light">
           Reach out to our corporate headquarters for business inquiries, investment opportunities, and general support.
         </p>
      </section>

      <section className="container mx-auto px-4 py-16">
         <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-surface-200 overflow-hidden flex flex-col md:flex-row">
            {/* Contact Info */}
            <div className="bg-primary-800 text-white p-8 md:w-1/3 flex flex-col justify-center">
               <h3 className="text-2xl font-bold text-accent-500 mb-6">Get In Touch</h3>
               <div className="space-y-4">
                  <div>
                      <h4 className="text-primary-300 text-sm font-semibold uppercase tracking-wider mb-1">Corporate Headquarters</h4>
                      <p className="leading-relaxed">Iyosiola Group Towers,<br/>Central Business District,<br/>Lagos, Nigeria.</p>
                  </div>
                  <div>
                      <h4 className="text-primary-300 text-sm font-semibold uppercase tracking-wider mb-1">Phone</h4>
                      <p className="leading-relaxed">+234 800 IYOSIOLA<br/>+234 801 234 5678</p>
                  </div>
                  <div>
                      <h4 className="text-primary-300 text-sm font-semibold uppercase tracking-wider mb-1">Email</h4>
                      <p className="leading-relaxed">contact@iyosiolagroup.com</p>
                  </div>
               </div>
            </div>

            {/* Contact Form */}
            <div className="p-8 md:w-2/3">
               <h3 className="text-2xl font-bold text-primary-900 mb-6">Send us a Message</h3>
               <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-semibold text-surface-700 mb-1">First Name</label>
                        <input type="text" className="w-full px-4 py-2 bg-surface-100 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="John" />
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-surface-700 mb-1">Last Name</label>
                        <input type="text" className="w-full px-4 py-2 bg-surface-100 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Doe" />
                     </div>
                  </div>
                  <div>
                      <label className="block text-sm font-semibold text-surface-700 mb-1">Email Address</label>
                      <input type="email" className="w-full px-4 py-2 bg-surface-100 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="john@example.com" />
                  </div>
                  <div>
                      <label className="block text-sm font-semibold text-surface-700 mb-1">Your Message</label>
                      <textarea rows={4} className="w-full px-4 py-2 bg-surface-100 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="How can we help you today?"></textarea>
                  </div>
                  <button type="button" className="w-full bg-accent-600 hover:bg-accent-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md">
                      Send Message
                  </button>
               </form>
            </div>
         </div>
      </section>
    </div>
  );
}
