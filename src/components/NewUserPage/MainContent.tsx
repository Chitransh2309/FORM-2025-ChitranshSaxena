import { FaChevronDown } from "react-icons/fa";
<<<<<<< HEAD:src/components/New_user_page/MainContent.tsx
import Link from 'next/link';
=======
import { useRouter } from "next/navigation";
import { createNewForm } from "@/app/action/CreateNewForm";
import { getFormsForUser } from "@/app/action/Forms"; // ✅ Import server action

interface Form {
  form_ID: string;
  title: string;
  createdAt: string;
  publishedAt?: string;
}
>>>>>>> 46f7001 (Made the casing everywhere as PascalCasing, made the publish and back to workspace button redirect back to dashboard):src/components/NewUserPage/MainContent.tsx

function MainContent() {
    return (
        <div className="flex-1 flex flex-col bg-white">
            <div className="flex justify-between items-center px-6 py-4 border-b">
                <button className="flex items-center gap-2 bg-[#56A37D] text-white px-4 py-2 rounded-lg hover:bg-[#4a9470]">
                    My Workspace
                    <FaChevronDown size={12} />
                </button>
                
                <Link href="/form">
                    <button className="bg-[#56A37D] text-white px-4 py-2 rounded-lg hover:bg-[#4a9470]">
                        + New Form
                    </button>
                </Link>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-12 max-w-md w-full text-center">
                    <h3 className="text-lg text-gray-600 mb-2">You have not created any forms yet.</h3>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Your First Form Today!</h2>
                    <Link href="/form">
                        <button className="bg-[#56A37D] text-white px-6 py-3 rounded-lg hover:bg-[#4a9470] font-medium">
                            Create Now
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
export default MainContent;