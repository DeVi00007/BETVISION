export default function CTABanner() {
  return (
    <section className="py-20 md:py-24 relative overflow-hidden">
      {/* Goal celebration background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/goal-celebration.jpg"
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(11,17,32,0.4) 0%, rgba(11,17,32,0.6) 50%, rgba(11,17,32,0.4) 100%)',
          }}
        />
      </div>

      <div className="content-max-width relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
          Készen állsz az adatvezérelt fogadásra?
        </h2>
        <p className="text-bv-text-secondary text-base md:text-lg max-w-2xl mx-auto mb-8">
          Csatlakozz több ezer sikeres játékoshoz és próbáld ki az AI Tippmix tippjeinket.
        </p>
        <button className="bg-bv-blue text-bv-bg font-bold text-lg px-10 py-4 rounded-lg hover:brightness-110 transition-all hover:scale-[1.02] shadow-glow-blue mb-3">
          INGYENES REGISZTRÁCIÓ
        </button>
        <p className="text-bv-text-muted text-sm">
          Nincs szükség bankkártyára. Ingyenes tippmix tippek minden nap.
        </p>
      </div>
    </section>
  );
}
