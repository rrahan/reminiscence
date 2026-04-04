const createMarkDown = (chatJson) => {
  if (!chatJson || !Array.isArray(chatJson) || chatJson.length === 0) {
    return "";
  }

  // Define the base structure requested
  let markdownString = "<PROMPT>\n";
  markdownString += "<CURRENT_RESPONSE>\n\n";

  // Loop through your JSON array and build the string
  chatJson.forEach((message) => {
    if (message.role && message.content) {
      // Formats as Markdown: 
      // ### User
      // Hello there!
      markdownString += `### ${message.role}\n${message.content}\n\n`;
    }
  });

  markdownString += "</CURRENT_RESPONSE>\n";
  markdownString += "</PROMPT>";

  return markdownString;
};

module.exports = createMarkDown;
