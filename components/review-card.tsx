type ReviewItem = {
  label: string;
  value?: string | null;
};

type ReviewCardProps = {
  title: string;
  items: ReviewItem[];
  changeHref?: string;
};

export function ReviewCard({ title, items, changeHref }: ReviewCardProps) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white shadow-brand-soft">
      <header className="flex items-center justify-between gap-3 border-b border-gray-100 bg-white px-6 py-4">
        <h3 className="text-xl font-semibold text-brand-charcoal">{title}</h3>
        {changeHref ? (
          <a
            href={changeHref}
            className="text-sm font-semibold text-brand-tangerine underline underline-offset-4"
          >
            Change
          </a>
        ) : null}
      </header>
      <dl className="divide-y divide-gray-100">
        {items.map((item) => {
          const value =
            typeof item.value === "string"
              ? item.value.trim()
              : item.value ?? "";

          return (
            <div key={item.label} className="grid gap-2 px-6 py-4 md:grid-cols-2">
              <dt className="text-sm font-semibold uppercase tracking-wide text-brand-charcoal/60">
                {item.label}
              </dt>
              <dd className="text-lg font-medium text-brand-charcoal">
                {value ? value : "Not provided"}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}

