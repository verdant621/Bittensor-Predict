import fetch from 'node-fetch';

export default async function getBidMessage(job) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const apiKey = process.env.OPENAI_API_KEY || "";

    const prompt = `
        write winning attractive humour concise, engaging, and visually-friendly bid proposal with my passion and impression for 

        "
        ${job}
        "

        This bid proposal  must follow the rules:
        1. Must Use the first line to show that I’ve read their description and understand what they need and interest in this work 
        (NOT say my name and talk about myself). Make a strong impression With the First Sentence, start "Hello! Nice to meet you!!!".
        Make the first sentence a real attention grabber. It is the first chance I have to get the prospective client's attention
        2. Must follow only below rules:
        4. Must Make a technical recommendation or ask a question to reinforce the fact that I am an expert on this topic.
        5. Must show my deep technology in this area.
        6. Must address all requests in the job posting
        7. Must Close with a Call to Action to get them to reply. Ask them when they’re available to call or talk.
        8. Sign off with your name: Alex L.
        9. Must Keep everything brief. Aim for less than 120 words in your Upwork proposal. 85-100 words are ideal.
        10. Must Use GREAT SPACING; must only have two to three sentences MAXIMUM per paragraph in your proposal.
        11. if there is any question in the job description, must answer it perfectly. if the client requires to include special word to avoid bot, must insert that word
        12. Insert funny and lovely emoticons into my proposal.
    `

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [{ "role": "user", "content": prompt }],
                "temperature": 0.7
            })
        });

        if (response.ok) {
            const responseData = await response.json();
            return responseData.choices[0].message.content;
        } else {
            console.error('Request failed:', response.statusText);
        }
    } catch (error) {
        console.error(error);
    }
    return proposal;
}
