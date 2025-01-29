document.addEventListener("DOMContentLoaded", () => {
    const imageUpload = document.getElementById("imageUpload");
    const previewImage = document.getElementById("previewImage");
    const classifyButton = document.getElementById("classifyButton");
    const predictionsContainer = document.getElementById("predictions");
    
    let model;

    // Load TensorFlow.js MobileNet Model
    async function loadModel() {
        model = await mobilenet.load();
        console.log("Model Loaded Successfully!");
    }

    loadModel();

    imageUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });

    // Classify Image
    classifyButton.addEventListener("click", async () => {
        if (!model) {
            predictionsContainer.innerHTML = "Loading model, please wait...";
            return;
        }

        if (!previewImage.src) {
            predictionsContainer.innerHTML = "Please select an image first!";
            return;
        }

        predictionsContainer.innerHTML = '<div id="loader"></div>';
        document.getElementById("loader").style.display = "block";

        const img = document.getElementById("previewImage");
        const predictions = await model.classify(img);

        document.getElementById("loader").style.display = "none";

        const topPrediction = predictions[0];

        predictionsContainer.innerHTML = `<p><strong>${topPrediction.className}</strong> - ${Math.round(topPrediction.probability * 100)}%</p>`;
    });
});
