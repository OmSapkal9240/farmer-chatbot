import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Loader, Bot, Mic, Square } from 'lucide-react';
import useOpenRouter from '../hooks/useOpenRouter';
import useGroqSTT from '../hooks/useGroqSTT';
import useElevenLabsTTS from '../hooks/useElevenLabsTTS';
import useVAD from '../hooks/useVAD';

const AIGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const [messages, setMessages] = useState([]);
  const [conversationActive, setConversationActive] = useState(false);

  const { response, isLoading: isTTLLoading, error: openRouterError, fetchResponse } = useOpenRouter();
  const { isRecording, transcript, error: sttError, startRecording, stopRecording } = useGroqSTT();
  const { isSpeaking, speak, cancel, unlockAudio } = useElevenLabsTTS();

  const vad = useVAD({
    onVoiceStart: () => {
      startRecording();
    },
    onVoiceStop: () => {
      stopRecording();
    },
  });

  useEffect(() => {
    if (transcript) {
      const newMessages = [...messages, { role: 'user', content: transcript }];
      setMessages(newMessages);
      fetchResponse(newMessages, currentLang);
    }
  }, [transcript]);

  useEffect(() => {
    if (response && !isTTLLoading) {
      const newMessages = [...messages, { role: 'assistant', content: response }];
      setMessages(newMessages);
      speak(response, 'female', () => {
        if (conversationActive) {
          vad.start();
        }
      });
    }
  }, [response, isTTLLoading]);

  const handleMicClick = () => {
    if (conversationActive) {
      vad.stop();
      stopRecording();
      cancel();
      setConversationActive(false);
    } else {
      unlockAudio();
      vad.start();
      setConversationActive(true);
      if (messages.length === 0) {
        const initialMessages = [{ role: 'user', content: 'Hello' }];
        setMessages(initialMessages);
        fetchResponse(initialMessages, currentLang);
      }
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-cyan-600 text-white p-4 rounded-full shadow-lg hover:bg-cyan-500 transition-transform transform hover:scale-110 z-50"
        aria-label="Open AI Mitra"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Bot size={32} />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-8 right-8 w-full max-w-sm z-50 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl flex flex-col h-[500px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className={`relative w-10 h-10 rounded-full flex items-center justify-center bg-slate-700`}>
            <Bot size={24} className="text-cyan-400" />
          </div>
          <h3 className="font-bold text-lg text-cyan-400">AI Mitra</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
          <p>X</p>
        </button>
      </div>

      {/* Message List */}
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <p className={`max-w-xs inline-block p-3 rounded-2xl ${msg.role === 'user' ? 'bg-cyan-700 text-white rounded-br-none' : 'bg-slate-600 text-slate-200 rounded-bl-none'}`}>
              {msg.content}
            </p>
          </div>
        ))}
        {(isTTLLoading || isRecording || isSpeaking) && (
          <div className="flex justify-center items-center space-x-2 mt-2">
            {isTTLLoading && <Loader className="animate-spin text-cyan-400" size={22} />}
            {isRecording && <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>}
            {isSpeaking && <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>}
          </div>
        )}
        {openRouterError && <p className='text-red-400 text-center'>Sorry, I am unable to respond.</p>}
        {sttError && <p className='text-red-400 text-center'>{sttError}</p>}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 flex items-center justify-center p-4 border-t border-slate-700">
        <button
          onClick={handleMicClick}
          className={`p-4 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${conversationActive ? 'bg-red-600 hover:bg-red-500' : 'bg-cyan-600 hover:bg-cyan-500'}`}>
          {conversationActive ? <Square size={24} className="text-white" /> : <Mic size={24} className="text-white" />}
        </button>
      </div>
    </motion.div>
  );
};

export default AIGuide;
