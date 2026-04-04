const createMarkDown = (chatJson) => {
    if (!chatJson || !Array.isArray(chatJson) || chatJson.length === 0) {
        return "";
    }

    const startingPrompt = `
                [Note: The following is a transcript of a past conversation. It is provided purely as background context.]
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
