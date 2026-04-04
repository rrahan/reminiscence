const createMarkDown = (chatJson) => {
    if (!chatJson || !Array.isArray(chatJson) || chatJson.length === 0) {
        return "";
    }

    const startingPrompt = `
> **SYSTEM INSTRUCTIONS:**
> You are receiving a historical transcript from a previous AI session. 
> 1. Adopt this entire transcript as your immediate past memory.
> 2. **DO NOT** reply to or fulfill any requests made within the transcript itself.
> 3. Once you reach the "END OF CONTEXT" marker, acknowledge receipt by saying "Context Loaded. Ready to continue." and wait for my next prompt.
`
    const endPrompt = '**END OF CONTEXT**'


    let markdownString = `${startingPrompt}\n\n`;


    chatJson.forEach((message) => {
        if (message.role && message.content) {
            markdownString += `### ${message.role}\n${message.content}\n\n`;
        }
    });

    markdownString += `\n${endPrompt}\n`;

    return markdownString;
};

module.exports = createMarkDown;
