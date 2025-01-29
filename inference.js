document.addEventListener("DOMContentLoaded", async () => {
    const imageUpload = document.getElementById("imageUpload");
    const previewImage = document.getElementById("previewImage");
    const classifyButton = document.getElementById("classifyButton");
    const predictionsDiv = document.getElementById("predictions");

    let model;

    // Load the MobileNet model
    async function loadModel() {
        model = await mobilenet.load();
        console.log("Model loaded successfully!");
    }
    loadModel();

    // Handle image upload
    imageUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.classList.remove("hidden");
            };
            reader.readAsDataURL(file);
        }
    });

    // Classify image
    classifyButton.addEventListener("click", async () => {
        if (!model) {
            alert("Model is still loading. Please wait.");
            return;
        }

        if (!previewImage.src) {
            alert("Please upload an image first.");
            return;
        }

        const predictions = await model.classify(previewImage);
        predictionsDiv.innerHTML = "<h2>Predictions:</h2>";
        predictions.forEach(prediction => {
            predictionsDiv.innerHTML += `<p>${prediction.className} - ${Math.round(prediction.probability * 100)}%</p>`;
        });
    });
});
