
const express = require("express");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

let pdfContent = ""; 

const pdfFilePath = path.join(__dirname, "upload", "bloc.pdf");

const extractPdfText = async () => {
    try {
        console.log("🔍 Extracting PDF text...");
        const data = fs.readFileSync(pdfFilePath);
        const parsedData = await pdfParse(data);
        pdfContent = parsedData.text;
        console.log(" PDF text extracted successfully!");
    } catch (error) {
        console.error(" Error extracting PDF:", error.message);
    }
};


extractPdfText();

app.get("/get-pdf-text", (req, res) => {
    if (!pdfContent) {
        return res.status(404).json({ error: "No PDF text found" });
    }
    res.json({ text: pdfContent });
});

app.post("/ask-pdf", async (req, res) => {
    const { question } = req.body;
    if (!question) {
        return res.status(400).json({ error: "Question is required" });
    }

    if (!pdfContent) {
        return res.status(500).json({ error: "PDF content not loaded yet" });
    }

    try {
       
        const MAX_TOKENS = 7000;
        const truncatedContent = pdfContent.split(" ").slice(0, MAX_TOKENS).join(" ");


        const groqResponse = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.2-90b-vision-preview",
                messages: [
                    { role: "system", content: "You are an AI assistant. Answer based on the given document." },
                    { role: "user", content: `Document: ${truncatedContent}\n\nQuestion: ${question}` }
                ],
                temperature: 0.7,
                max_tokens: 512,
            },
             
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer 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`,
                }
            },
           
        );

        const answer = groqResponse.data.choices[0].message.content;
        res.json({ answer });
    } catch (error) {
        console.error(" Error calling Groq API:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to get response from Groq API" });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
