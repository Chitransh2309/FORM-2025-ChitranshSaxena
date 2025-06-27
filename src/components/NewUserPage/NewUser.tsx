import Link from 'next/link'

<<<<<<< HEAD:src/components/New_user_page/Newuser.tsx
function Newuser(){
    return(      
        <div className="flex-1 border-2 border-dashed border-gray-300 flex flex-col justify-center items-center gap-6 m-10 px-8 py-7">
            <h4 className="text-xl text-gray-600">You have not created any forms yet.</h4>
            <h2 className="text-3xl font-semibold text-gray-800">Create Your First Form Today!</h2>
            <button className="bg-[#61A986] px-6 py-3 text-white text-lg rounded-lg cursor-pointer hover:bg-[#4d8a6b] transition-colors">
                <Link href="/form">Create Now</Link>
            </button>
        </div>
    )
=======
import { createNewForm } from "@/app/action/CreateNewForm";
// import { useRouter } from "next/navigation";

function Newuser() {
  // const router = useRouter();

  // const handleCreateNow = async () => {
  //   const res = await createNewForm();
  //   if (res.success) {
  //     router.push(`/form/${res.form_ID}`);
  //   } else {
  //     alert("❌ Failed to create form");
  //   }
  // };

  return (
    <div className="flex-1 border-2 border-dashed border-gray-300 flex flex-col justify-center items-center gap-6 m-10 px-8 py-7">
      <h4 className="text-xl text-gray-600">
        You have not created any forms yet.
      </h4>
      <h2 className="text-3xl font-semibold text-gray-800">
        Create Your First Form Today!
      </h2>
      <button
        className="bg-[#61A986] px-6 py-3 text-white text-lg rounded-lg cursor-pointer hover:bg-[#4d8a6b] transition-colors"
        onClick={createNewForm}
      >
        Create Now
      </button>
    </div>
  );
>>>>>>> 46f7001 (Made the casing everywhere as PascalCasing, made the publish and back to workspace button redirect back to dashboard):src/components/NewUserPage/NewUser.tsx
}

export default Newuser 