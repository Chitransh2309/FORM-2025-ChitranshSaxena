'use client'
import { useState } from "react";
import Navbar from "./Navbar";
import Formsorter from "./Formsorter";
import Drafts from "./Drafts";
import Published from "./Published";
import Newuser from "./Newuser";

interface Form {
    id: string;
    title: string;
    publishedAt: Date | null;
    
}

export default function Workspace(){

    {/* const [forms, setForms] = useState<Form[]>([]); */} 
    
    const [forms, setForms] = useState<Form[]>([
  { id: '1', title: 'Draft Form', publishedAt: null },
  { id: '2', title: 'Published Form', publishedAt: new Date() },
 ]); 
 
    const drafts = forms.filter((f) => f.publishedAt === null);
    const published = forms.filter((f) => f.publishedAt !== null);
    
    return (
        <div className="h-screen flex flex-col overflow-hidden">
             <Navbar />
            <Formsorter />
            
            {drafts.length === 0 && published.length === 0 ? (
                <Newuser />
            ) : (
                <div className="flex flex-1 overflow-hidden">
                    <Drafts forms={drafts} />
                    <Published forms={published} />
                </div>
            )}
        </div>
    );
}



  




