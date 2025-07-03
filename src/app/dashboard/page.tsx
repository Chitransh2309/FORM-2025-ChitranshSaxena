import { insertUser } from "../action/user";
import ClientHome from "../../components/NewUserPage/ClientHome"; // ✅ adjust path based on your structure

export default async function Home() {
  await insertUser(); // ✅ server-side only

  return <ClientHome />;
}
