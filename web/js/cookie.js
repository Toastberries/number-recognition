document.addEventListener("DOMContentLoaded", (event) => {
    function checkForValue() {
        const predictionElement = document.querySelector('.prediction-text');
        
        if (predictionElement && predictionElement.textContent.trim() !== "") {
            document.cookie = `lastPrediction=${encodeURIComponent(predictionElement.textContent)}; path=/`;
        } else {
            setTimeout(checkForValue, 1000);
        }
    }

    const predictButton = document.getElementById('predict-button');
    if (predictButton) {
        predictButton.addEventListener('click', () => {
            checkForValue();
        });
    }
});
