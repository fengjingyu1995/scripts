// https://github.com/lydiahallie/javascript-questions

import fs from 'fs';
import path from 'path';

interface QuestionOption {
  value: string;
  text: string;
}

interface Question {
  questionNumber: string;
  questionTitle: string;
  questionCode: string;
  options: QuestionOption[];
  answer: string;
  explanation: string;
}

const data = fs.readFileSync(path.join(__dirname, 'data.md')).toString();

function markdownToJSON(mdContent: string): Question[] {
  const questions: Question[] = [];
  const questionRegex =
    /######\s*(\d+)\.\s*([\s\S]+?)```javascript([\s\S]+?)```([\s\S]+?)<details><summary><b>Answer<\/b><\/summary>[\s\S]+?#### Answer:\s*(\w)([\s\S]+?)<\/p>/gm;

  let match: RegExpExecArray | null;
  while ((match = questionRegex.exec(mdContent)) !== null) {
    const questionNumber = match[1];
    const questionTitle = match[2].trim();
    const questionCode = match[3].trim();
    const options = match[4]
      ? match[4]
          .trim()
          .split('- ')
          .map((opt) => opt.trim())
          .filter((opt) => opt !== '')
          .map((opt) => {
            const [value, text] = opt.split(': ');
            return {
              value,
              text,
            };
          })
      : [];
    const answer = match[5];
    const explanation = match[6]?.trim();

    const question: Question = {
      questionNumber,
      questionTitle,
      questionCode,
      options,
      answer,
      explanation,
    };

    questions.push(question);
  }

  return questions;
}
function writeToJSONFile(data: any, filename: string): void {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

const questionsData = markdownToJSON(data);
writeToJSONFile(questionsData, 'questions.json');
console.log(questionsData);
