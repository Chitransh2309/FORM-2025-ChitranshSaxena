// components/FormCard.tsx
type FormCardProps = {
  editLabel: string;
  secondLabel: string;
  secondColor?: string;
};

export default function FormCard({
  editLabel,
  secondLabel,
  secondColor = "bg-black",
}: FormCardProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Placeholder for form preview */}
      <div className="bg-gray-300 w-full h-32 rounded" />

      {/* Buttons below the form */}
      <div className="flex gap-2 w-full">
        <button className="bg-[#61A986] text-white px-2 py-1 rounded w-full">
          {editLabel}
        </button>
        <button
          className={`${secondColor} text-white px-2 py-1 rounded w-full`}
        >
          {secondLabel}
        </button>
      </div>
    </div>
  );
}
