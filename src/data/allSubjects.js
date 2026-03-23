import { SUBJECTS } from "./subjects.js";

// All subjects including Mathematics (from CURRICULUM) and others (from SUBJECTS)
export const ALL_SUBJECTS = {
  mathematics: {
    id: "mathematics",
    name: { zh: "数学", en: "Mathematics" },
    nameFull: { zh: "爱德思IAL数学", en: "Pearson Edexcel IAL Mathematics" },
    icon: "📐",
    color: "#1a73e8",
    level: "IAL (International A-Level)"
  },
  ...SUBJECTS
};

// Past exam papers — Edexcel IAL WMA11 / WMA12 / WMA13 / WMA14 / WST01 / WME01
export const PAST_PAPERS = [
  { year: 2024, session: "May/Jun", paper: "P1", code:"WMA11", duration: 90, questions: 11, desc: "Pure Mathematics 1" },
  { year: 2024, session: "May/Jun", paper: "P2", code:"WMA12", duration: 90, questions: 10, desc: "Pure Mathematics 2" },
  { year: 2024, session: "May/Jun", paper: "P3", code:"WMA13", duration: 90, questions: 10, desc: "Pure Mathematics 3" },
  { year: 2024, session: "May/Jun", paper: "P4", code:"WMA14", duration: 90, questions: 9,  desc: "Pure Mathematics 4" },
  { year: 2024, session: "May/Jun", paper: "M1", code:"WME01", duration: 90, questions: 8,  desc: "Mechanics 1" },
  { year: 2024, session: "Jan",     paper: "P3", code:"WMA13", duration: 90, questions: 10, desc: "Pure Mathematics 3" },
  { year: 2024, session: "Jan",     paper: "P4", code:"WMA14", duration: 90, questions: 9,  desc: "Pure Mathematics 4" },
  { year: 2024, session: "Jan",     paper: "M1", code:"WME01", duration: 90, questions: 8,  desc: "Mechanics 1" },
  { year: 2023, session: "May/Jun", paper: "P3", code:"WMA13", duration: 90, questions: 10, desc: "Pure Mathematics 3" },
  { year: 2023, session: "May/Jun", paper: "P4", code:"WMA14", duration: 90, questions: 9,  desc: "Pure Mathematics 4" },
  { year: 2023, session: "May/Jun", paper: "M1", code:"WME01", duration: 90, questions: 8,  desc: "Mechanics 1" },
  { year: 2023, session: "Jan",     paper: "P3", code:"WMA13", duration: 90, questions: 10, desc: "Pure Mathematics 3" },
  { year: 2023, session: "Jan",     paper: "P4", code:"WMA14", duration: 90, questions: 9,  desc: "Pure Mathematics 4" },
  { year: 2023, session: "Jan",     paper: "M1", code:"WME01", duration: 90, questions: 8,  desc: "Mechanics 1" },
  { year: 2024, session: "Jan",     paper: "P1", code:"WMA11", duration: 90, questions: 11, desc: "Pure Mathematics 1" },
  { year: 2024, session: "Jan",     paper: "P2", code:"WMA12", duration: 90, questions: 10, desc: "Pure Mathematics 2" },
  { year: 2023, session: "May/Jun", paper: "P1", code:"WMA11", duration: 90, questions: 11, desc: "Pure Mathematics 1" },
  { year: 2023, session: "May/Jun", paper: "P2", code:"WMA12", duration: 90, questions: 10, desc: "Pure Mathematics 2" },
  { year: 2023, session: "May/Jun", paper: "S1", code:"WST01", duration: 90, questions: 8,  desc: "Statistics 1" },
  { year: 2023, session: "Jan",     paper: "S1", code:"WST01", duration: 90, questions: 8,  desc: "Statistics 1" },
  { year: 2022, session: "May/Jun", paper: "P1", code:"WMA11", duration: 90, questions: 11, desc: "Pure Mathematics 1" },
  { year: 2022, session: "May/Jun", paper: "P2", code:"WMA12", duration: 90, questions: 10, desc: "Pure Mathematics 2" },
  { year: 2022, session: "Oct/Nov", paper: "S1", code:"WST01", duration: 90, questions: 8,  desc: "Statistics 1" },
  { year: 2021, session: "May/Jun", paper: "P1", code:"WMA11", duration: 90, questions: 11, desc: "Pure Mathematics 1" },
];

// Subject name mapping (shared by MockExamView and ErrorBookView)
export const SUBJECT_NAMES = {
  mathematics: "Mathematics",
  economics: "Economics",
  history: "History",
  politics: "Politics",
  psychology: "Psychology",
  further_math: "Further Mathematics"
};
