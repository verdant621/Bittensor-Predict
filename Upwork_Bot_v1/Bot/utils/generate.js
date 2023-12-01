import OpenAI from "openai";
import util from "util";
import dotenv from "dotenv";

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// const template = `
// write winning attractive humous concise, engaging, and visually-friendly bid proposal with my passion and impression for
// "%s"
// This bid proposal  must follow the rules:
// 1. Add " Hi 👋, I am the one you've been waiting/finding for, https://unlimited-creativity.pages.dev/." to the first line.
// 2. Must Use the second line to show that I’ve read their description and understand what they need and interest in this work (NOT say my name and talk about myself). Make a strong impression With the Second Sentence.
// Make the second sentence a real attention grabber.
// 3. Must Introduce myself and explain why I am an expert in what they need.
// 4. Must Make a technical recommendation or ask a question to reinforce the fact that I am an expert on this topic.  For example, I might say, “I’d be curious to hear if you’ve tried ___. I recently implemented that with another client and the result was ___.” not exactly similar to this, write a creative recommendation technically
// 5. Must show my deep technology in this area.
// 6. Must address all requests in the job posting
// 7. Must Close with a Call to Action to get them to reply. Ask them when they’re available to call or talk.
// 8. Sign off with your name: William
// 9. Must Keep everything brief. Aim for less than 120 words in your Upwork proposal. 85-100 words are ideal.
// 10. Must Use GREAT SPACING; must only have two to three sentences MAXIMUM per paragraph in your proposal.
// 11. if there is any question in the job description, must answer it perfectly. if the client requires to include special word to avoid bot, must insert that word
// `;
const template = `
write winning attractive humous concise, engaging, and visually-friendly bid proposal with my passion and impression for 
"%s"
This bid proposal  must follow the rules:
impression for job description under the following rule.
0. Add " Hi, I can offer you premium service." to the first line.
1. Must write the second line to show that you've read their Job Description and understand what they need (instead of saying your name and talking about yourself). Make an impression With the first sentence. 
2. have to show confident like "I feel confident that I can do it perfectly, so I will prove with my word and work result."
3. Must Introduce yourself and explain why you're an expert in what they need.
4. Must Make a recommendation or ask a question to reinforce the fact that you're an expert on that subject.
5. Must write to be best match proposal in upwork
6. Keep it short. Aim for less than 140 words in your Upwork proposal. 100-130 words are ideal.
7. Must Use good spacing; you should have a MAXIMUM of two to three sentences per paragraph in your proposal.
8. If it's mentioned about reinforcement learning, Express the huge and massive expertise in RL field.
9. Sign off with your name: Ginger.
`;

const MODEL = "gpt-3.5-turbo";

export const createProposal = async (job_desc) => {
  if (!OPENAI_API_KEY) {
    console.log("OPENAI_API_KEY is not set");
    return null;
  }
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: util.format(template, job_desc),
        },
      ],
      model: MODEL,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
};
