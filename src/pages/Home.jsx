import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home(){
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const startChat = () => {
    const id = Date.now().toString(); // simple id
    // create a minimal chat object in localStorage (mock store)
    const chats = JSON.parse(localStorage.getItem("chats") || "[]");
    chats.unshift({ 
      id, title: input || "New query", 
      messages: [{role:"assistant", text:"Namaskar! How can I help?"}]
    });
    localStorage.setItem("chats", JSON.stringify(chats));
    // navigate to thread page with animation
    navigate(`/chat/${id}`);
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero - already in your UI; simplified here */}
      <section className="mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold mb-4">Helping Indian Farmers with Smart, Simple, Multilingual Advisory.</h1>
          <div className="mt-6">
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              placeholder="Type quick topic (e.g. tomato leaves) ..."
              className="px-4 py-3 rounded-full bg-[#0b1220] border border-slate-700 w-1/2 max-w-xl"
            />
            <button onClick={startChat} className="ml-4 px-5 py-3 rounded-full bg-gradient-to-r from-blue-500 to-green-400">
              Start Chat
            </button>
          </div>
        </div>
      </section>

      {/* Recent chats list */}
      <section>
        <h2 className="text-xl mb-4">Recent chats</h2>
        <ChatList />
      </section>
    </main>
  );
}

function ChatList(){
  const navigate = useNavigate();
  const chats = JSON.parse(localStorage.getItem("chats") || "[]");

  if(!chats.length) return <div className="text-slate-400">No chats yet — start one above.</div>;

  return (
    <div className="grid gap-4">
      {chats.map(c => (
        <div key={c.id} 
             className="p-4 bg-slate-800 rounded-2xl hover:scale-[1.01] transition cursor-pointer flex justify-between items-center"
             onClick={()=> navigate(`/chat/${c.id}`)}>
          <div>
            <div className="font-semibold">{c.title}</div>
            <div className="text-sm text-slate-400 mt-1">{(c.messages?.[c.messages.length-1]?.text || "").slice(0,80)}</div>
          </div>
          <div className="text-slate-400 text-sm">{ /* timestamp or badge */ }</div>
        </div>
      ))}
    </div>
  );
}
