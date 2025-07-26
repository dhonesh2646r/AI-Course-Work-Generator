import React, { useState } from 'react';
import { generateFlashCards } from '../api';
import { jsPDF } from 'jspdf';
import '../App.css';
import waitingGif from '../assets/waiting1.gif';

const GenerateFlash = () => {
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [no_of_questions, setNoOfQuestions] = useState(0);
    const [type, setType] = useState('');

    const handleGenerate = async () => {
        try {
            if (!content && !file) {
                alert('Please enter content or upload a file');
                return;
            }

            setIsLoading(true);
            const data = await generateFlashCards(content, file, no_of_questions, type);
            setFlashcards(data);
            setCurrentCardIndex(0);
            setIsFlipped(false);
            setIsLoading(false);
        } catch (error) {
            console.error("Error generating cards:", error);
            alert('Failed to generate study material. Please try again.');
            setIsLoading(false);
        }
    };

    const handleFlipCard = () => setIsFlipped(!isFlipped);

    const handleNextCard = () => {
        if (currentCardIndex < flashcards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(false);
        }
    };

    const handlePrevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setIsFlipped(false);
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Flashcards", 10, 10);
    doc.setFontSize(12);

    let yPosition = 20; // Initial position for text

    flashcards.forEach((card, index) => {
        if (yPosition > 270) { // Prevents text from overflowing, adds a new page
            doc.addPage();
            yPosition = 20; // Reset Y position
        }

        doc.text(`Q${index + 1}: ${card.front}`, 10, yPosition);
        yPosition += 20;
        doc.text(`A${index + 1}: ${card.back}`, 10, yPosition, { maxWidth: 180 });
        yPosition += 50; // Space between flashcards

        doc.line(10, yPosition - 5, 200, yPosition - 5); // Line separator
    });

    doc.save("Flashcards.pdf");
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {isLoading ? (
                <img src={waitingGif} alt="Loading..." style={{ width: '100%', height: '100%' }} />
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px', border: '1px solid #ccc', height: 'auto', borderRadius: '5px', width: '1240px', boxShadow: '0 2px 5px #ccc' }}>
                    {flashcards.length === 0 ? (
                        <div>
                            <h2>Generate Flashcards</h2>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                                <p>OR</p>
                                <input type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files[0])} />
                            </div>
                            <br />
                            <hr />
                            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                <p>Number of Questions per Unit/Section:</p>
                                <input required type="number" value={no_of_questions} onChange={(e) => setNoOfQuestions(e.target.value)} />
                                <p>Choose the type of questions:</p>
                                <select value={type} onChange={(e) => setType(e.target.value)} required>
                                    <option value="">Select a question type</option>
                                    <option value="Very Short Answer Questions">Very Short Answer Questions</option>
                                    <option value="Short Answer Questions">Short Answer Questions</option>
                                    <option value="Long Answer Questions">Long Answer Questions</option>
                                </select>
                            </div>
                            <br />
                            <hr />
                            <br />
                            <button onClick={handleGenerate}>Generate</button>
                        </div>
                    ) : (
                        <div style={{ marginTop: '20px' }}>
                            <h3>Flashcards</h3>
                            <div style={{ position: 'relative', width: '1240px', height: '500px', margin: '0 auto', perspective: '1000px' }} onClick={handleFlipCard}>
                                <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
                                    <div style={{ padding: '20px' }}>
                                        {flashcards[currentCardIndex].front}
                                    </div>
                                    <div style={{ backfaceVisibility: 'hidden', padding: '20px', transformStyle: 'preserve-3d', transition: 'transform 0.6s', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                                        {flashcards[currentCardIndex].back}
                                    </div>
                                </div>
                            </div>

                            <br />
                            <br />
                            <p>{currentCardIndex + 1} / {flashcards.length}</p>
                            <div style={{ position: 'relative', marginTop: '20px' }}>
                                <button onClick={handlePrevCard} style={{ marginRight: '10px' }}>Previous</button>
                                <button onClick={handleNextCard}>Next</button>
                                <button onClick={handleDownloadPDF} style={{ marginLeft: '10px', backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Download PDF</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GenerateFlash;
