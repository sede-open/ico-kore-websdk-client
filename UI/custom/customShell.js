// <!-- Added 29 May 2024 - Make the translated search clear button label available for use in JS -->
// <!-- See buildClearSearchButton() in script.js -->
window.searchClearButtonLabelLocalized = "{{t 'search_clear'}}";

document.addEventListener("DOMContentLoaded", function (event) {
    // KoreSDK.show(KoreSDK.chatConfig);
    setTimeout(() => {
        document.querySelector(".chat-box-controls .close-btn").title = "Close Chat";
        addTabIndex(".kore-chat-window .reload-btn")
        addTabIndex(".kore-chat-window .minimize-btn")
        addTabIndex(".kore-chat-window .expand-btn")
        addTabIndex(".kore-chat-window .close-btn")
        addTabIndex(".kore-chat-window .chatInputBox")
        addTabIndex(".kore-chat-window .ttspeaker")
        addTabIndex(".kore-chat-window .notRecordingMicrophone")
        addTabIndex(".kore-chat-window .recordingMicrophone")
        addTabIndex(".kore-chat-window .attachmentBtn")
        addTabIndex(".kore-chat-window .minimized")
        addTabIndex(".kore-chat-window .ttsSpeakerDisable")
        addTabIndex(".kore-chat-window .ttsSpeakerEnable")
        addClickEvent(".kore-chat-window .minimized")
        document.querySelector(".kore-chat-window .minimized").addEventListener('click', function () {
            document.querySelector(".kore-chat-header").focus()
        });
        // Select the target node
        const targetNode = document.body;

        // Options for the observer (which mutations to observe)
        const config = { attributes: false, childList: true, subtree: true };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);

    }, "200");



});

function addTabIndex(selector) {
    if (document.querySelector(selector) != null) {
        document.querySelector(selector).tabIndex = 0
    }
    else {
        console.log("unable to find element " + selector)
    }
}

function addClickEvent(querySelector) {
    document.querySelector(querySelector).addEventListener("keypress", function (event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.querySelector(querySelector).click();
        }
    });
}
// Function to run on new elements with class "quickReply"
function processQuickReply(element) {
    element.tabIndex = 0;
    element.addEventListener("keypress", function (event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            element.click();
        }
    })
}

// Callback function to execute when mutations are observed
const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                // Traverse through the newly added node's descendants
                traverseAndProcess(node);
            });
        }
    }
};

// Recursive function to traverse through the DOM tree
function traverseAndProcess(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList && node.classList.contains('quickReply') && !node.classList.contains('buttonTmplContentHeading')) {
            processQuickReply(node);
        }
        else if (node.classList && node.classList.contains('emoji-rating') && !node.classList.contains('buttonTmplContentHeading')) {
            processQuickReply(node);
        }
        // Traverse through child nodes
        node.childNodes.forEach(child => traverseAndProcess(child));
    }
}

(function () {
    setTimeout(function () {
        if (location.pathname.indexOf('Test-Bulk-Upload') > -1 || location.pathname.indexOf('taking-photos') > -1) {
            document.getElementsByClassName('kore-chat-window')[0].style.visibility = 'hidden';
        }
    }, 1000);

})();