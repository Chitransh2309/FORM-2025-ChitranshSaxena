import { redirect } from "next/navigation";
import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import CenterNav from "@/components/FormPage/CenterNav";
import { auth } from "../../../../auth";

export default async function FormPage({ params }: { params: { id: string } }) {
  const formId = params.id;
  console.log(formId)

  const session = await auth();
  if (!session?.user?.email) {
    redirect("/")
  }

  const { dbClient, db } = await connectToDB();

  const user = await db
    .collection("user")
    .findOne({ email: session.user.email });
  const userID = user?.user_ID;

  const form = await db.collection("forms").findOne({ form_ID: formId });

  await disconnectFromDB(dbClient);

  if (!form) {
    return (
      <div className="text-center mt-20 text-xl text-red-600 font-bold">
        🚫 Access Denied: You don't own this form.
      </div>
    );
  }

  if(form.createdBy !== userID)
  {
    redirect(`/form/${formId}/response`)
  }

  return (
    <div className="bg-neutral-100 text-black w-screen h-[92vh] flex font-[Outfit]">
      <SectionSidebar
        sections={form?.sections || []}
        selectedSectionId={selectedSectionId}
        setSelectedSectionId={setSelectedSectionId}
        onAddSection={addSection}
        onDeleteSection={deleteSection}
      />

      <div className="w-full h-full overflow-auto">
        <div className="flex bg-[#e8ede8] h-screen overflow-hidden">
          <div className="w-full h-full overflow-auto">
            <CenterNav
              showQues={() => {
                setShowQuestions(true);
              }}
              hideQues={() => {
                setShowQuestions(false);
              }}
            />
            {showQuestions && (
              <div>
                <div className="flex flex-row justify-between items-center">
                  <div className="text-2xl font-bold ml-[5%] mb-3 mt-9 p-4">
                    {selectedSection?.title || "No Section Selected"}
                  </div>
                  <div className="mr-5 mt-9 mb-3 p-4">
                    <SaveButton onClick={handleSave} />
                  </div>
                </div>

                {selectedSection && (
                  <QuestionParent
                    ques={selectedSection.questions}
                    onUpdate={(id, updates) => updateQuestion(id, updates)}
                    onDelete={(id) => deleteQuestion(id)}
                    onAdd={() => addQuestion()}
                  />
                )}
              </div>
            )}
          </div>

          <div className="w-[34vw] h-[92vh] bg-white border-l-2 border-black-200">
            <RightNav />
          </div>
        </div>
      </div>
    </div>
  );
}
