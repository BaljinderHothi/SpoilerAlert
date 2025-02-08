import Link from 'next/link';

export default function Home() {
  return (
    <>
      <main className="container mx-auto px-4 py-8">
        {/* Title */}
        <section className="mb-8">
          <h1 className="text-4xl font-bold mb-4">SpoilerAlert 🔍🥕</h1>
        </section>

        {/* What is SpoilerAlert */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">What is SpoilerAlert?</h2>
          <p className="text-lg mb-4">
            SpoilerAlert is a smart tool designed to help you avoid hidden food recalls. It uses computer vision along with real-time FDA recall data to instantly check if a food product is safe to buy or consume.
          </p>
          <p className="text-lg mb-4">
            The key benefits include peace of mind when shopping and the assurance that you’re avoiding recalled products. This not only keeps you safe but also helps reduce food waste by preventing the purchase of items that should be avoided.
          </p>
          <p className="text-lg">
            The idea for SpoilerAlert came from a personal shopping trip where I was surprised to discover that many items on the shelves were on recall—hidden in plain sight. This experience inspired me to create a tool that makes food safety simple and accessible for everyone.
          </p>
        </section>

        {/* Core Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Core Features</h2>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>
              <strong>Smart Scan:</strong> Quickly check products using your camera and the FDA recall database.
            </li>
            <li>
              <strong>Real-time Updates:</strong> Get the latest recall information as it happens.
            </li>
            <li>
              <strong>Community Insights:</strong> See how many others have flagged recalled items in your area.
            </li>
          </ul>
        </section>

        {/* Getting Started */}
        <section>
          <h2 className="text-3xl font-semibold mb-4">Getting Started 🚀</h2>
          <p className="text-lg mb-4">
            Click on the Recall Check button below:
          </p>
          <Link
            href="/safety"
            className="text-[#415a77] hover:bg-[#FF5A5F] hover:text-[#fefae0] rounded-xl p-2 text-lg inline-block"
          >
            Recall Check
          </Link>
        </section>
      </main>
    </>
  );
}
