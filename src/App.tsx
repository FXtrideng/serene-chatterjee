import React, { useState } from "react";

const SimpleTextTranslator = () => {
  const [inputText, setInputText] = useState(""); // Text entered by the user
  const [translatedText, setTranslatedText] = useState(""); // Translated text
  const [isListening, setIsListening] = useState(false); // If the app is listening
  const [sourceLang, setSourceLang] = useState("fr"); // Source language (French)
  const [targetLang, setTargetLang] = useState("en"); // Target language (English)

  // Function to handle translation from French to English and vice versa
  const handleTranslation = async (text) => {
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=${sourceLang}|${targetLang}`
      );
      const data = await response.json();
      if (data.responseData && data.responseData.translatedText) {
        setTranslatedText(data.responseData.translatedText); // Set the translation
      } else {
        setTranslatedText(
          "Translation not found. Please try a different phrase."
        );
      }
    } catch (error) {
      setTranslatedText("Error fetching translation. Please try again.");
    }
  };

  // Function for starting voice recognition
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = sourceLang === "fr" ? "fr-FR" : "en-US"; // Set language to French or English
      recognition.continuous = true; // Allow continuous speech
      recognition.interimResults = true; // Provide partial results to handle unclear speech

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript; // Get the text from the speech
        setInputText(transcript); // Display the spoken text
        handleTranslation(transcript); // Translate the spoken text
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error: ", event.error);
        setIsListening(false);
        setTranslatedText("There was an error with speech recognition.");
      };

      recognition.onend = () => {
        setIsListening(false); // Stop listening after speech ends
      };

      recognition.start(); // Start listening
    } else {
      setTranslatedText("Speech recognition is not supported in your browser.");
    }
  };

  // Function for stopping voice recognition
  const stopListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.stop();
      setIsListening(false); // Stop the listening process
    }
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-xl font-bold">
        French to English Translator with Voice Recognition
      </h1>

      {/* Text input for typing */}
      <div className="mt-4">
        <label className="block mb-2">Enter text to translate:</label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)} // Update input text
          className="p-2 border border-gray-300 rounded"
          placeholder="Type text here"
        />
        <button
          onClick={() => handleTranslation(inputText)} // Trigger translation
          className="mt-4 p-2 px-4 rounded-lg bg-blue-500 text-white"
        >
          Translate Text
        </button>
      </div>

      {/* Voice recognition option */}
      <div className="mt-4">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`p-2 px-4 rounded-lg ${
            isListening ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {isListening ? "Stop Listening" : "Start Listening"}
        </button>
      </div>

      {/* Display Translated Text */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Translated Text:</h2>
        <p className="border p-2 bg-yellow-100 min-h-[40px]">
          {translatedText}
        </p>
      </div>
    </div>
  );
};

export default SimpleTextTranslator;
