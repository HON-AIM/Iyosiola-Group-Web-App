import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-50">
      {/* Header */}
      <section className="bg-primary-900 text-white py-20 px-4 md:px-8 text-center border-b-8 border-accent-500">
         <h1 className="text-4xl md:text-6xl font-extrabold mb-4">About Iyosiola Group</h1>
         <p className="text-xl text-primary-100 max-w-2xl mx-auto font-light">
           A legacy of excellence. Driving value across Agriculture, Logistics, and Manufacturing.
         </p>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-16 flex flex-col md:flex-row gap-12 items-center">
         <div className="md:w-1/2 flex justify-center">
             <Image src="/logo.jpg" alt="Iyosiola Group" width={400} height={400} className="w-full max-w-md object-contain" />
         </div>
         <div className="md:w-1/2 text-surface-700 space-y-6 text-lg leading-relaxed">
             <h2 className="text-3xl font-bold text-primary-900">Our Corporate Heritage</h2>
             <p>
               At <strong>Iyosiola Group</strong>, we are driven by a singular vision: to be the cornerstone of Africa's economic development through diversified and sustainable business practices. From our humble beginnings in agricultural trade, we have expanded into a formidable conglomerate.
             </p>
             <p>
               Our portfolio spans across essential sectors of the economy including state-of-the-art <strong>Flour Milling</strong>, integrated <strong>Logistics & Supply Chain</strong> networks, and expansive <strong>Agro-Allied</strong> investments. We are committed to delivering uncompromised quality to our consumers and unparalleled value to our investors.
             </p>
             <div className="pt-4 border-t border-surface-200">
                <Link href="/contact" className="text-primary-600 font-bold hover:text-primary-700 tracking-wide uppercase text-sm">
                   Partner With The Group &rarr;
                </Link>
             </div>
         </div>
      </section>
    </div>
  );
}
