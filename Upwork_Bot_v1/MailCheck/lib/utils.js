import crypto from "crypto";

export function getHash(str) {
  const hash = crypto.createHash('md5'); // you can choose other hash algorithms like 'sha1', 'sha256', etc.
  hash.update(str);
  return hash.digest('hex');
}
export function generateText(feed) {
  const prefix = feed;
  let maxLength = 25 - prefix.length;

  // Generate random suffix
  let suffix = crypto
    .randomBytes(maxLength)
    .toString("hex")
    .substring(0, maxLength);

  // Combine prefix and suffix
  let text = prefix + suffix;

  return text.toLowerCase();
}
export function getRandomElement(array) {
  var randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
export function getTimeDiff(time) {

    
  let givenTime = `${time.split(' ')[0]}T${time.split(' ')[1]}Z`; // replace this with your timestamp. The 'T' and 'Z' are required for this format.

  let date1 = new Date(givenTime);
  let date2 = new Date(); // current date and time

  let diffInSeconds = Math.abs(date2 - date1) / 1000;
  let minutes = Math.floor(diffInSeconds / 60);
  let hours = Math.floor(minutes / 60);
  minutes -= hours * 60;
  let seconds = Math.floor(diffInSeconds % 60);

  return (hours?`${hours} hours `:'')+  minutes + ' minutes and ' + seconds + ' seconds.';
}
