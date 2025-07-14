"use client"; // if using Next.js

import { FaSearch } from "react-icons/fa";
import { RiExpandUpDownLine } from "react-icons/ri";

const Searchbar = () => {
<<<<<<< HEAD:src/components/NewUserPage/SearchBar.tsx
    return (
        <div className="flex items-center gap-3 text-gray-600">
            <FaSearch size={16}/>
            <input 
                placeholder="Search" 
                type="text" 
                className="flex-1 bg-transparent outline-none text-black placeholder-gray-500 dark:placeholder-white dark:text-white"
            />
            <RiExpandUpDownLine size={16}/>
        </div>
    )
}
export default Searchbar 
=======
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <div className="flex items-center gap-3 text-gray-600">
      <FaSearch size={16} />
      <input
        placeholder="Search"
        type="text"
        className="flex-1 bg-transparent outline-none text-black dark:text-white placeholder-gray-500"
      />
      <RiExpandUpDownLine size={16} />
    </div>
  );
};

export default Searchbar;
>>>>>>> 902ba78 (mitigated hydration error):src/components/New_user_page/Searchbar.tsx
