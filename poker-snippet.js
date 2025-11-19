document.addEventListener("DOMContentLoaded", function () {

    function waitForSelector(selector) {
        return new Promise(resolve => {
            const existing = document.querySelector(selector);
            if (existing) return resolve(existing);

            const obs = new MutationObserver(() => {
                const found = document.querySelector(selector);
                if (found) {
                    resolve(found);
                    obs.disconnect();
                }
            });

            obs.observe(document.body, { childList: true, subtree: true });
        });
    }

    function applySeatLogic() {
        const events = document.querySelectorAll(".am-ec__info-other");
        if (!events.length) return;

        events.forEach(event => {
            const numberEl = event.querySelector(".am-ec__info-capacity__number");
            const availabilityEl = event.querySelector(".am-ec__info-availability");
            const capacityTextEl = event.querySelector(".am-ec__info-capacity__text");
            if (!numberEl || !availabilityEl || !capacityTextEl) return;

            const seats = parseInt(numberEl.textContent.trim(), 10);
            const applyColor = c => {
                availabilityEl.style.color = c;
                numberEl.style.color = c;
                capacityTextEl.style.color = c;
            };

            if (seats === 0) {
                availabilityEl.textContent = "Sold Out";
                numberEl.textContent = "0";
                capacityTextEl.textContent = " sold out";
                applyColor("#999");
                event.style.opacity = "0.5";
                event.style.pointerEvents = "none";
                return;
            }

            if (seats > 10) return applyColor("#0073ff");
            if (seats <= 10 && seats > 5) {
                applyColor("orange");             
                availabilityEl.style.animation = "flash 1s infinite";
                numberEl.style.animation = "flash 1s infinite";
                capacityTextEl.style.animation = "flash 1s infinite";
                return;
            }
            if (seats <= 5) {
                applyColor("red");
                capacityTextEl.textContent = ` — Only ${seats} left!`;
                availabilityEl.style.animation = "flash 1s infinite";
                numberEl.style.animation = "flash 1s infinite";
                capacityTextEl.style.animation = "flash 1s infinite";
            }
        });
    }

    // Add Flash CSS
    if (!document.getElementById("flash-keyframes")) {
        const style = document.createElement("style");
        style.id = "flash-keyframes";
        style.innerHTML = `
            @keyframes flash {
                0% { opacity: 1; }
                50% { opacity: 0.3; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // **Global observer for dynamically added .am-ec__info-other**
    const globalObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) { // only element nodes
                    if (node.matches(".am-ec__info-other") || node.querySelector(".am-ec__info-other")) {
                        applySeatLogic();
                    }
                }
            }
        }
    });

    globalObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also run immediately for any existing elements
    applySeatLogic();

});
