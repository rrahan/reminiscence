const axios = require('axios');
const cloudscraper = require('cloudscraper');


const performParsing = async (data, res) => {

  let urlString = data.url;
  let url = new URL(urlString);

  if (url.hostname.includes('chatgpt.com')) {
    return await invokeChatGPT(url);
  } else if (url.hostname.includes('claude.ai')) {
    return await invokeClaude(url);
  } else if (url.hostname.includes('gemini.google.com')) {
    return await invokeGemini(url);
  } else if (url.hostname.includes('perplexity.ai') || url.hostname.includes('perplexity.com')) {
    return await invokePerplexity(url);
  } else if (url.hostname.includes('grok.com')) {
    return await invokeGrok(url);
  } else {
    console.error("Invalid URL:", urlString);
    if (typeof res !== 'undefined' && res) {
      res.status(400).json({
        success: false,
        message: "Invalid URL",
      });
    }
  }
};



const invokeChatGPT = async (url) => {
  try {
    const response = await axios.get(url);
    const html = response.data;

    let jsonArray;
    try {
      const match = html.match(/window\.__reactRouterContext\.streamController\.enqueue\(\"(.*?)\"\);/);
      if (!match) throw new Error("Could not find chat context");
      const rawString = JSON.parse('"' + match[1] + '"');
      jsonArray = JSON.parse(rawString);
    } catch (e) {
      throw new Error("Failed to parse ChatGPT hydration data");
    }

    const resolvedCache = new Map();
    function resolve(val) {
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        let result = {};
        for (const key in val) {
          if (key.startsWith('_')) {
            const keyIdx = parseInt(key.slice(1), 10);
            const valIdx = val[key];
            result[resolveItem(keyIdx)] = resolveItem(valIdx);
          } else {
            result[key] = val[key];
          }
        }
        return result;
      } else if (Array.isArray(val)) {
        return val.map(idx => resolveItem(idx));
      }
      return val;
    }

    function resolveItem(index) {
      if (typeof index !== 'number' || index < 0 || index >= jsonArray.length) return index;
      if (resolvedCache.has(index)) return resolvedCache.get(index);
      resolvedCache.set(index, null);
      let resolvedVal = resolve(jsonArray[index]);
      resolvedCache.set(index, resolvedVal);
      return resolvedVal;
    }

    const root = resolveItem(0);
    let messages = [];
    const visited = new Set();

    function traverse(node) {
      if (node && typeof node === 'object') {
        if (visited.has(node)) return;
        visited.add(node);

        if (node.author && node.author.role && node.content && node.content.parts) {
          let role = node.author.role;
          let parts = node.content.parts;
          if (Array.isArray(parts) && parts.length > 0 && typeof parts[0] === 'string') {
            if (role === 'user' || role === 'assistant') {
              messages.push({
                role: role.charAt(0).toUpperCase() + role.slice(1),
                content: parts.join('\n')
              });
            }
          }
        }
        for (let key in node) traverse(node[key]);
      }
    }
    traverse(root);

    const uniqueMessages = [];
    const seen = new Set();
    for (const msg of messages) {
      const key = msg.role + '|' + msg.content;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueMessages.push(msg);
      }
    }
    // console.log(JSON.stringify(uniqueMessages, null, 2));

    if (typeof res !== 'undefined') {
      res.json(uniqueMessages);
    } else {
      return uniqueMessages;
    }

  } catch (error) {
    console.error('Error fetching/parsing data:', error.message);
    if (typeof res !== 'undefined') {
      res.status(500).send('Error fetching data');
    }
  }
}



const invokeClaude = async (url) => {
  try {
    const pathParts = url.pathname.split('/').filter(Boolean);
    const uuid = pathParts[pathParts.length - 1];

    if (!uuid) throw new Error("Invalid Claude URL");

    const apiUrl = `https://claude.ai/api/chat_snapshots/${uuid}?rendering_mode=messages&render_all_tools=true`;

    const responseRaw = await cloudscraper.get(apiUrl);
    const data = JSON.parse(responseRaw);

    const messages = [];
    if (data && Array.isArray(data.chat_messages)) {
      for (const msg of data.chat_messages) {
        if (!msg.sender || !Array.isArray(msg.content)) continue;

        let roleStr = "User";
        if (msg.sender === 'human') roleStr = "User";
        else if (msg.sender === 'assistant') roleStr = "Assistant";
        else roleStr = msg.sender.charAt(0).toUpperCase() + msg.sender.slice(1);

        const textParts = msg.content
          .filter(part => part.type === 'text' && typeof part.text === 'string')
          .map(part => part.text);

        if (textParts.length > 0) {
          messages.push({
            role: roleStr,
            content: textParts.join('\n')
          });
        }
      }
    }

    // console.log(JSON.stringify(messages, null, 2));

    if (typeof res !== 'undefined') {
      res.json(messages);
    } else {
      return messages;
    }

  } catch (error) {
    console.error('Error fetching/parsing Claude data:', error.message);
    if (typeof res !== 'undefined') {
      res.status(500).send('Error fetching data');
    }
  }
}

//gemini not supported yet
const invokeGemini = async (url) => {
  // console.log('gemini')
}

//pplxty hitting cf - cant be bypassed

// const invokePerplexity = async (url) => {
//   try {
//     const pathParts = url.pathname.split('/').filter(Boolean);
//     const uuid = pathParts[pathParts.length - 1];

//     if (!uuid) throw new Error("Invalid Perplexity URL");

//     const apiUrl = `https://www.perplexity.ai/rest/thread/${uuid}?with_schematized_response=true`;

//     const responseRaw = await cloudscraper.get(apiUrl);
//     const data = JSON.parse(responseRaw);

//     const messages = [];
//     if (data && Array.isArray(data.entries)) {
//       for (const entry of data.entries) {
//         if (entry.query_str) {
//           messages.push({
//             role: "User",
//             content: entry.query_str
//           });
//         }

//         if (Array.isArray(entry.blocks)) {
//           const answerBlock = entry.blocks.find(b =>
//             (b.intended_usage === 'ask_text' || b.intended_usage === 'ask_text_0_markdown') &&
//             b.markdown_block &&
//             b.markdown_block.answer
//           );

//           if (answerBlock) {
//             messages.push({
//               role: "Assistant",
//               content: answerBlock.markdown_block.answer
//             });
//           }
//         }
//       }
//     }

//     console.log(JSON.stringify(messages, null, 2));

//     if (typeof res !== 'undefined') {
//       res.json(messages);
//     } else {
//       return messages;
//     }

//   } catch (error) {
//     console.error('Error fetching/parsing Perplexity data:', error.message);
//     if (typeof res !== 'undefined') {
//       res.status(500).send('Error fetching data');
//     }
//   }
// }



const invokeGrok = async (url) => {
  try {
    const pathParts = url.pathname.split('/').filter(Boolean);
    const uuid = pathParts[pathParts.length - 1];

    if (!uuid) throw new Error("Invalid Grok URL");

    const apiUrl = `https://grok.com/rest/app-chat/share_links/${uuid}`;

    const response = await axios.get(apiUrl);
    const data = response.data;

    const messages = [];
    if (data && Array.isArray(data.responses)) {
      for (const msg of data.responses) {
        if (!msg.sender || typeof msg.message !== 'string') continue;

        let roleStr = "User";
        if (msg.sender.toLowerCase() === 'human') roleStr = "User";
        else if (msg.sender.toLowerCase() === 'assistant') roleStr = "Assistant";
        else roleStr = msg.sender.charAt(0).toUpperCase() + msg.sender.slice(1).toLowerCase();

        if (msg.message.trim().length > 0) {
          messages.push({
            role: roleStr,
            content: msg.message.trim()
          });
        }
      }
    }

    // console.log('Parsed Grok conversation:', JSON.stringify(messages, null, 2));

    if (typeof res !== 'undefined') {
      res.json(messages);
    } else {
      return messages;
    }

  } catch (error) {
    console.error('Error fetching/parsing Grok data:', error.message);
    if (typeof res !== 'undefined') {
      res.status(500).send('Error fetching data');
    }
  }
}

module.exports = {
  performParsing,
};

// Test
// performParsing({ title: "My Test Data" });

