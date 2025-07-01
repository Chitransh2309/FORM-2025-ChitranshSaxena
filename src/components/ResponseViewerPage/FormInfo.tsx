interface Props {
  title: string;
  description: string;
}

export default function FormInfoCard({ title, description }: Props) {
  return (
    <div className="bg-white dark:bg-[#5A5959] rounded-lg shadow p-6 mb-6">
      <h3 className="text-2xl font-bold mb-2">{title || "Untitled Form"}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-200">{description || "No description provided"}</p>
      <p className="text-sm text-red-500 mt-2">* implies compulsory</p>
    </div>
  );
}