import { AlertTriangle } from "lucide-react";

type ErrorSummaryItem = {
  id: string;
  message: string;
};

export function ErrorSummary({ errors }: { errors: ErrorSummaryItem[] }) {
  if (!errors.length) return null;

  return (
    <div className="rounded-2xl border border-[#F4B5A1] bg-[#FFF2EC] p-5 shadow-brand-soft">
      <div className="mb-3 flex items-center gap-3 text-[#C2483C]">
        <AlertTriangle className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Please fix the following</h2>
      </div>
      <ul className="list-disc pl-5 text-sm text-[#C2483C]">
        {errors.map((error) => (
          <li key={error.id}>
            <a
              href={`#${error.id}`}
              className="underline-offset-4 hover:underline"
            >
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

