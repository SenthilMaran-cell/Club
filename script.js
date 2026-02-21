document.addEventListener("DOMContentLoaded", () => {
  const promptInput = document.getElementById("promptInput");
  const generateBtn = document.getElementById("generateBtn");
  const resultContainer = document.getElementById("resultContainer");
  const historySection = document.getElementById("historySection");
  const historyGrid = document.getElementById("historyGrid");

  let history = JSON.parse(localStorage.getItem("vision_history") || "[]");

  const renderHistory = () => {
    if (history.length > 0) {
      historySection.style.display = "block";
      historyGrid.innerHTML = history
        .map(
          (imgUrl, index) => `
                <div class="history-item" onclick="window.open('${imgUrl}', '_blank')">
                    <img src="${imgUrl}" alt="Generation ${index}">
                </div>
            `,
        )
        .reverse()
        .join("");
    }
  };

  const generateImage = async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    // Reset UI
    resultContainer.innerHTML = "";
    resultContainer.classList.add("active");

    // Show Skeleton
    const card = document.createElement("div");
    card.className = "image-card";
    card.innerHTML = '<div class="skeleton"></div>';
    resultContainer.appendChild(card);

    // API Endpoint (Pollinations AI)
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}&nologo=true`;

    // Preload image
    const img = new Image();
    img.src = imageUrl;

    buttonState(true);

    img.onload = () => {
      card.innerHTML = `<img src="${imageUrl}" alt="${prompt}" class="loaded">`;
      saveToHistory(imageUrl);
      buttonState(false);

      // Add click to expand
      card.onclick = () => window.open(imageUrl, "_blank");
    };

    img.onerror = () => {
      card.innerHTML =
        '<div style="padding: 2rem; text-align: center; color: #ff4444;">Failed to generate image. Please try again.</div>';
      buttonState(false);
    };
  };

  const buttonState = (loading) => {
    generateBtn.disabled = loading;
    generateBtn.innerHTML = loading
      ? "<span>Inscribing reality...</span>"
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg> Generate`;
  };

  const saveToHistory = (url) => {
    history.push(url);
    if (history.length > 12) history.shift(); // Keep last 12
    localStorage.setItem("vision_history", JSON.stringify(history));
    renderHistory();
  };

  generateBtn.addEventListener("click", generateImage);
  promptInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") generateImage();
  });

  renderHistory();
});
