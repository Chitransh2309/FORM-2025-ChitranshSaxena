import { Form } from "@/lib/interface";

function FormCard(form: Form) {
  return (
    <div
      key={form.form_ID}
      className="bg-gray-200 rounded-lg aspect-square flex flex-col"
    >
      <div className="flex-1 bg-gray-300 rounded-t-lg"></div>
      <div className="p-2 flex gap-2">
        <p>form.form_ID</p>
      </div>
    </div>
  );
}

export default FormCard;
