export default function Section({ id, title, subtitle, children }) {
    return (
      <section id={id} className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-black">{title}</h2>
          {subtitle ? <p className="mt-2 text-black/60">{subtitle}</p> : null}
        </div>
        {children}
      </section>
    );
  }
  