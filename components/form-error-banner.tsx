export function FormErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <p className="rounded-2xl border border-[#F4B5A1] bg-[#FFF2EC] p-4 text-[#C2483C] shadow-brand-soft">
      {message}
    </p>
  );
}

