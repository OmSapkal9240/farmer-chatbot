import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IconSend } from "../components/icons"; // optional

export default function ChatThread(){
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [input, setInput] = useState("");
  const containerRef = useRef(null);

  useEffect(()=>{
    const chats = JSON.parse(localStorage.getItem("chats") || "[]");
    const found = chats.find(c=>c.id === chatId);
    if(!found) return navigate("/", { replace: true });
    setChat(found);
  }, [chatId, navigate]);

  useEffect(()=>{
    // auto scroll
    if(containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [chat]);

  const sendMessage = () => {
    if(!input.trim()) return;
    const newMsg = { role: "user", text: input };
    const chats = JSON.parse(localStorage.getItem("chats") || "[]");
    const idx = chats.findIndex(c=>c.id === chatId);
    if(idx === -1) return;
    chats[idx].messages.push(newMsg);
    // add mock assistant reply after delay
    localStorage.setItem("chats", JSON.stringify(chats));
    setChat({...chats[idx]});
    setInput("");
    // typing indicator & mock reply
    setTimeout(()=>{
      const reply = { role:"assistant", text: `Here is some advice for "${input.slice(0,50)}"... (mock)` };
      const chats2 = JSON.parse(localStorage.getItem("chats") || "[]");
      chats2[idx].messages.push(reply);
      localStorage.setItem("chats", JSON.stringify(chats2));
      setChat({...chats2[idx]});
    }, 900);
  };

  if(!chat) return null;

  return (
    <div className="min-h-[60vh] flex flex-col items-center px-6 py-8">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <button className="text-sm text-slate-300" onClick={()=> navigate(-1)}>← Back</button>
          <div className="font-bold text-lg">Chat: {chat.title}</div>
          <div></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-slate-900 rounded-2xl p-6 shadow-xl"
        >
          <div ref={containerRef} className="max-h-[60vh] overflow-y-auto space-y-4 pb-4">
            <AnimatePresence initial={false}>
              {chat.messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`max-w-[80%] px-4 py-3 rounded-xl ${m.role === "user" ? "ml-auto bg-blue-600 text-white" : "bg-slate-700 text-slate-100"}`}
                >
                  {m.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input bar */}
          <div className="mt-4 flex gap-3 items-center">
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=> e.key === "Enter" && sendMessage()}
              className="flex-grow rounded-full px-4 py-3 bg-[#0b1220] border border-slate-700"
              placeholder="Type your message..."
            />
            <button onClick={sendMessage} className="rounded-full p-3 bg-gradient-to-r from-blue-500 to-green-400">
              Send
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
