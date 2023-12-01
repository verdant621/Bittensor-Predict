import {
  addUser,
  getActiveUser,
  updateStatus,
  deleteUser,
} from "./utils/db_handler.js";
import { createProposal } from "./utils/generate.js";

//////////////////////////////OPENAI TEST//////////////////////////////

const job_desc = `We are urgently seeking an experienced Python developer with a background in graphics programming to improve and extend an existing Python codebase. This project focuses on applying various text enhancements to drug names to minimize visual confusion. It is part of an academic experiment aimed at improving medication safety.

  Tasks
  Review existing Python code that applies text enhancements like bold, italics, highlighting, and mixed case to drug names.
  
  Develop a systematic approach to calculate the size of the rectangle that will encapsulate the enhanced text. Consider the order of textual enhancements and their impact on the rectangular area.
  Implement the ability to output each enhanced drug name as a PNG image or a PostScript file.
  
  Create outputs for two different experiments:
  Superimpose each of these name images, one at a time, on a given bottle image.
  Display enhanced names on a simulated order entry screen.
  Render a set of 600 drug names in 32 different enhancement combinations according to detailed specifications.
  
  Skills Required
  Strong Python programming skills
  Familiarity with main Python graphics libraries for generating images and PostScript files
  Experience in image processing and manipulation
  Familiarity with medical terminologies or healthcare industry is a plus
  Strong problem-solving abilities and attention to detail
  
  Deliverables
  An updated Python codebase that successfully incorporates the new features and improvements.
  A set of PNG or PostScript files for each name and enhancement combination, and their superimposed versions on a bottle image or displayed on a simulated order entry screen. These files should be formatted to be easily input into an online psychological experiment platform.
  
  Timeline
  Starting date: ASAP
  Ideal delivery: Within 4 weeks from the starting date`;

const coverletter = await createProposal(job_desc);
console.log("coverletter: ", coverletter);

//////////////////////////////DB TEST//////////////////////////////
// await addUser("efpyi@example.com", "minuteinbox");

// const user = await getActiveUser();
// console.log("active user: ", user);

// await updateStatus("efpyi@example.com");

// await deleteUser("efpyi@example.com");
