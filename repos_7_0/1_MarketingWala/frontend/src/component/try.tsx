import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Trypage() {
  const navigate = useNavigate();
  
  const handleOnClick=()=>{
    
    navigate('/dashboard');
  }
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-white p-8">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0  animate-gradient-background"></div>
        <div className="absolute inset-0  animate-gradient-foreground opacity-50"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-2">New freedoms</h1>
        <h2 className="text-4xl italic mb-8">of imagination</h2>
        
        <div className="max-w-2xl text-center">
          <h3 className="text-2xl font-semibold mb-4">
            Dream Machine is an AI model that makes high quality, realistic videos fast from text and images.
          </h3>
          
          <p className="mb-8 text-lg">
            It is a highly scalable and efficient transformer model trained directly on 
            videos making it capable of generating physically accurate, consistent 
            and eventful shots. Dream Machine is our first step towards building a 
            universal imagination engine and it is available to everyone now!
          </p>
          <div>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold py-3 px-8 rounded-full transition duration-300 flex items-center" onClick={handleOnClick}>
                TRY NOW
                <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

