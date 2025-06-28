import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import Typed from 'typed.js';
import axios from 'axios';

const MedicalQuery = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const typedRef = useRef(null);
  const [showTyping, setShowTyping] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState('');




useEffect(() => {
  if (showTyping && response && typedRef.current) {
    const typed = new Typed(typedRef.current, {
      strings: [response],
      typeSpeed: 20,
      showCursor: true,
      cursorChar: '|',
      onComplete: () => {
        setShowTyping(false);
        setDisplayedResponse(response);
      }
    });

    return () => {
      typed.destroy();
    };
  }
}, [response, showTyping]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse('');
    setShowTyping(false);

    try {

        const res = await axios.post(
            "https://api.mistral.ai/v1/chat/completions",
            {
                model: "mistral-tiny", 
                messages: [
                    { role: "system", content: "You are a medical AI assistant. Only answer in one short para of medical-related questions. If a query is not related to medicine, refuse to answer. " },
                    { role: "user", content: query }
                ],
                max_tokens: 500
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.REACT_APP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
    
      console.log(res)
      const answer = res.data.choices[0].message.content || "I'm sorry, I couldn't process your request.";
      setResponse(answer);
      setShowTyping(true);
    } catch (error) {
        console.log(error); 
      setResponse("I apologize, but I'm having trouble processing your request. Please try again later. , " );
      setShowTyping(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mb-20">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
          <Bot className="w-8 h-8 text-emerald-400" />
          <h2 className="text-3xl font-bold text-emerald-400">Ask Medical Questions</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask any medical question..."
              className="flex-1 bg-slate-900/50 text-slate-300 placeholder-slate-500 rounded-lg px-4 py-3 border border-slate-700/50 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-colors duration-300"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span>Ask</span>
            </button>
          </div>
        </form>

        {(response || isLoading) && (
          <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-start gap-4">
              <Bot className="w-6 h-6 text-emerald-400 mt-1" />
              <div className="flex-1">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Thinking...
                  </div>
                ) : (
                  <div className="text-slate-300 leading-relaxed">
                    {showTyping ? (
                      <span ref={typedRef}></span>
                    ) : (
                      <p className="whitespace-pre-wrap">{displayedResponse}</p>
                    )}

                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MedicalQuery;
