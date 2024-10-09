import React, { useState } from 'react';
import { HiPlus, HiMinus } from 'react-icons/hi';
import '../App.css'; // Importing app.css here
const FAQ = () => {
  const faqs = [
    {
      _id: 1,
      question: "What is a Land Registry System on the Blockchain?",
      answer: "A Land Registry System on the Blockchain is a decentralized digital ledger that records land ownership, transactions, and related information securely and transparently."
    },
    {
      _id: 2,
      question: "How does blockchain ensure the security of land records?",
      answer: "Blockchain uses cryptographic techniques to secure data. Once a record is added to the blockchain, it cannot be altered or deleted without consensus from the network, ensuring the integrity of land records."
    },
    {
      _id: 3,
      question: "What are the benefits of using blockchain for land registration?",
      answer: "Benefits include increased transparency, reduced fraud, lower costs, faster transactions, and improved access to information for all stakeholders."
    },
    {
      _id: 4,
      question: "Can I buy or sell land using a blockchain-based system?",
      answer: "Yes, blockchain allows for the buying and selling of land through smart contracts, which automate the transaction process, making it faster and more efficient."
    },
    {
      _id: 5,
      question: "How do I access my land records?",
      answer: "Land records can be accessed through a secure digital platform that integrates with the blockchain, allowing landowners and authorized parties to view and verify their information."
    },
    {
      _id: 6,
      question: "Is it possible to integrate existing land registries with blockchain?",
      answer: "Yes, existing land registries can be integrated with blockchain technology through a phased approach, ensuring a smooth transition while maintaining the integrity of historical data."
    },
    {
      _id: 7,
      question: "What is a smart contract in the context of land registration?",
      answer: "A smart contract is a self-executing contract with the terms of the agreement directly written into code. In land registration, it automates processes like ownership transfers and payment settlements."
    },
    {
      _id: 8,
      question: "How does blockchain improve trust in land transactions?",
      answer: "Blockchain provides a single source of truth that all parties can trust, as it is immutable and transparent. This reduces disputes and enhances confidence in the transaction process."
    }
  ];

  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (id) => {
    setActiveQuestion(prevActiveQuestion => (prevActiveQuestion === id ? null : id));
  };

  return (
    <div className="w-[70%] 800px:w-[80%] m-auto text-black">
          <div className="flex flex-col items-center mt-20 ">
      <h1 className="text-2xl font-bold text-center mb-6">
        Frequently <span className="text-gradient">Asked</span> Questions
        <div className="h-1 w-10 bg-green-400 mt-4 "></div> 
      </h1>
      </div>
      <div className="mt-12">
        <dl className="space-y-8">
          {faqs.map((q) => (
            <div key={q._id} className={`${q._id !== faqs[0]?._id && 'border-t'} border-gray-200 pt-6`}>
              <dt className="text-lg">
                <button
                  className="flex items-start justify-between w-full text-left focus:outline-none"
                  onClick={() => toggleQuestion(q._id)}
                >
                  <span className="font-medium text-black ">{q.question}</span>
                  <span className="ml-6 flex-shrink-0">
                    {activeQuestion === q._id ? (
                      <HiMinus className="h-6 w-6 text-black " />
                    ) : (
                      <HiPlus className="h-6 w-6 text-black " />
                    )}
                  </span>
                </button>
              </dt>
              {activeQuestion === q._id && (
                <dd className="mt-2 pr-12">
                  <p className="text-base font-Poppins text-black ">{q.answer}</p>
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default FAQ;
