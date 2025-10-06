$(document).ready(function() {
    // Array of random English sentences
    const englishSentences = [
        "In the middle of difficulty lies opportunity.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "The only way to do great work is to love what you do.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "Life is what happens when you're busy making other plans."
    ];
    
    // Array of Amharic sentences
    const amharicSentences = [
        "የአፍሪካ ታላቅ ሀብት ሰው ነው።",
        "ትምህርት በህይወት ውስጥ ያለውን ሁሉ ለመቀየር ኃይል አለው።",
        "እውቀት ኃይል ነው።",
        "ማንኛውም ሰው ሊሳካ ይችላል በጣም ብዙ ሊሰራ ይገባዋል።",
        "የተሳካ ሰው ለማደር ያልፈለገ ሰው ነው።"
    ];
    
    // DOM elements
    const $typingInput = $('#typing-input');
    const $sentence = $('#sentence');
    const $timer = $('#timer');
    const $restartBtn = $('#restart-btn');
    const $viewResultBtn = $('#view-result-btn');
    const $englishBtn = $('#english-btn');
    const $amharicBtn = $('#amharic-btn');
    const $resultsModal = $('#results-modal');
    const $performanceLevel = $('#performance-level');
    const $performanceMessage = $('#performance-message');
    const $resultTime = $('#result-time');
    const $resultLetters = $('#result-letters');
    const $resultTotal = $('#result-total');
    const $closeModal = $('#close-modal');
    const $newTestBtn = $('#new-test-btn');
    
    // Test state variables
    let currentLanguage = 'english';
    let currentSentence = '';
    let startTime = null;
    let timerInterval = null;
    let elapsedTime = 0;
    let isTestActive = false;
    let correctChars = 0;
    let totalChars = 0;
    
    // Initialize the test
    function initTest() {
        resetTest();
        $resultsModal.addClass('hidden');
        const sentences = currentLanguage === 'english' ? englishSentences : amharicSentences;
        currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
        $sentence.text(currentSentence);
        $timer.text('0.0s');
        $typingInput.focus();
        console.log('New test started with sentence:', currentSentence);
    }
    
    // Reset test state
    function resetTest() {
        clearInterval(timerInterval);
        $typingInput.val('');
        $typingInput.prop('disabled', false);
        startTime = null;
        elapsedTime = 0;
        isTestActive = false;
        correctChars = 0;
        totalChars = 0;
        $viewResultBtn.prop('disabled', false);
    }
    
    // Update the sentence display with color coding
    function updateSentenceDisplay(typedText) {
        let displayText = '';
        for (let i = 0; i < currentSentence.length; i++) {
            if (i < typedText.length) {
                if (typedText[i] === currentSentence[i]) {
                    displayText += `<span style="color: green;">${currentSentence[i]}</span>`;
                } else {
                    displayText += `<span style="color: red;">${currentSentence[i]}</span>`;
                }
            } else {
                displayText += currentSentence[i];
            }
        }
        $sentence.html(displayText);
    }
    
    // Start the timer
    function startTimer() {
        startTime = new Date();
        timerInterval = setInterval(updateTimer, 100);
    }
    
    // Update the timer display
    function updateTimer() {
        if (isTestActive) {
            const currentTime = new Date();
            elapsedTime = (currentTime - startTime) / 1000;
            $timer.text(elapsedTime.toFixed(1) + 's');
        }
    }
    
    // Calculate correct characters
    function calculateCorrectChars(typedText) {
        let correct = 0;
        for (let i = 0; i < typedText.length && i < currentSentence.length; i++) {
            if (typedText[i] === currentSentence[i]) {
                correct++;
            }
        }
        return correct;
    }
    
    // Show results modal
    function showResultsModal() {
        const typedText = $typingInput.val();
        correctChars = calculateCorrectChars(typedText);
        totalChars = typedText.length;
        
        let performanceLevel, message;
        
        if (correctChars === currentSentence.length && totalChars === currentSentence.length) {
            performanceLevel = "Excellent! 🎉";
            message = `Perfect! You typed all ${correctChars} letters correctly in ${elapsedTime.toFixed(1)} seconds. Outstanding performance!`;
        } else if (correctChars >= currentSentence.length * 0.8) {
            performanceLevel = "Very Good! 👍";
            message = `Great job! You typed ${correctChars} out of ${currentSentence.length} letters correctly. You're doing well!`;
        } else if (correctChars >= currentSentence.length * 0.6) {
            performanceLevel = "Good! 👏";
            message = `Good effort! You typed ${correctChars} out of ${currentSentence.length} letters correctly. Keep practicing!`;
        } else if (correctChars >= currentSentence.length * 0.4) {
            performanceLevel = "Not Bad 💪";
            message = `You typed ${correctChars} out of ${currentSentence.length} letters correctly. With more practice, you'll improve!`;
        } else {
            performanceLevel = "Keep Practicing! 📚";
            message = `You typed ${correctChars} out of ${currentSentence.length} letters correctly. Don't give up - practice makes perfect!`;
        }
        
        $performanceLevel.text(performanceLevel);
        $performanceMessage.text(message);
        $resultTime.text(elapsedTime.toFixed(1) + 's');
        $resultLetters.text(correctChars);
        $resultTotal.text(currentSentence.length);
        $resultsModal.removeClass('hidden');
        
        console.log('Results displayed:', { 
            correctChars, 
            totalChars: currentSentence.length, 
            elapsedTime,
            performanceLevel 
        });
    }
    
    // MAIN INPUT HANDLER
    $typingInput.on('input', function() {
        const typedText = $(this).val();
        
        // Prevent typing beyond the sentence length
        if (typedText.length > currentSentence.length) {
            $typingInput.val(typedText.slice(0, currentSentence.length));
            return;
        }
        
        updateSentenceDisplay(typedText);
        
        // Start timer on first keystroke
        if (!isTestActive && typedText.length > 0) {
            console.log('⏱️ Timer started - first keystroke detected');
            isTestActive = true;
            startTimer();
        }
        
        if (isTestActive) {
            correctChars = calculateCorrectChars(typedText);
            totalChars = typedText.length;
        }
    });
    
    $typingInput.on('keydown', function(e) {
        const typedText = $typingInput.val();
        
        // Prevent typing beyond the sentence length
        if (typedText.length >= currentSentence.length && e.key.length === 1) {
            e.preventDefault();
            return false;
        }
    });
    
    // View Result button handler
    $viewResultBtn.on('click', function() {
        if (isTestActive) {
            showResultsModal();
        } else {
            alert('Please start typing to see your results!');
        }
    });
    
    $englishBtn.on('click', function() {
        if (currentLanguage !== 'english') {
            currentLanguage = 'english';
            $englishBtn.addClass('active');
            $amharicBtn.removeClass('active');
            initTest();
        }
    });
    
    $amharicBtn.on('click', function() {
        if (currentLanguage !== 'amharic') {
            currentLanguage = 'amharic';
            $amharicBtn.addClass('active');
            $englishBtn.removeClass('active');
            initTest();
        }
    });
    
    $restartBtn.on('click', function() {
        initTest();
    });
    
    $closeModal.on('click', function() {
        $resultsModal.addClass('hidden');
    });
    
    $newTestBtn.on('click', function() {
        $resultsModal.addClass('hidden');
        initTest();
    });
    
    $(window).on('click', function(e) {
        if (e.target === $resultsModal[0]) {
            $resultsModal.addClass('hidden');
        }
    });
    
    initTest();
});