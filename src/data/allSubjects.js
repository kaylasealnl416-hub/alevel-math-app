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

const PEARSON_IAL_PHYSICS_PAST_PAPER_BASE_URL = "https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html?Qualification-Family=International-Advanced-Level&Qualification-Subject=Physics+%282018%29&Specification-Code=Pearson-UK%3ASpecification-Code%2Fial18-physics&Status=Pearson-UK%3AStatus%2FLive";

const PHYSICS_PAPER_UNITS = [
  { paper: "Unit1", code: "WPH11/01", duration: 90, questions: 10, marks: 80, desc: "Mechanics and Materials" },
  { paper: "Unit2", code: "WPH12/01", duration: 90, questions: 10, marks: 80, desc: "Waves and Electricity" },
  { paper: "Unit3", code: "WPH13/01", duration: 80, questions: 8, marks: 50, desc: "Practical Skills in Physics I" },
  { paper: "Unit4", code: "WPH14/01", duration: 105, questions: 10, marks: 90, desc: "Further Mechanics, Fields and Particles" },
  { paper: "Unit5", code: "WPH15/01", duration: 105, questions: 10, marks: 90, desc: "Thermodynamics, Radiation, Oscillations and Cosmology" },
  { paper: "Unit6", code: "WPH16/01", duration: 80, questions: 8, marks: 50, desc: "Practical Skills in Physics II" },
];

const PHYSICS_PAST_PAPER_SERIES = [
  { year: 2024, session: "Jan", examSeries: "January-2024" },
  { year: 2024, session: "May/Jun", examSeries: "June-2024" },
  { year: 2024, session: "Oct", examSeries: "October-2024" },
];

export const PHYSICS_PAST_PAPERS = PHYSICS_PAST_PAPER_SERIES.flatMap(series =>
  PHYSICS_PAPER_UNITS.map(unit => ({
    ...series,
    ...unit,
    subject: "physics",
    source: "Pearson",
    sourceUrl: `${PEARSON_IAL_PHYSICS_PAST_PAPER_BASE_URL}&Exam-Series=${series.examSeries}`,
    availabilityNote: "Official Pearson past paper search. Recent locked papers must remain linked, not mirrored.",
  }))
);

const PEARSON_IAL_ECONOMICS_PAST_PAPER_BASE_URL = "https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html?Qualification-Family=International-Advanced-Level&Qualification-Subject=Economics+%282018%29&Specification-Code=Pearson-UK%3ASpecification-Code%2Fial18-economics&Status=Pearson-UK%3AStatus%2FLive";

const ECONOMICS_PAPER_UNITS = [
  { paper: "Unit1", code: "WEC11/01", duration: 105, questions: 13, marks: 80, desc: "Markets in action" },
  { paper: "Unit2", code: "WEC12/01", duration: 105, questions: 13, marks: 80, desc: "Macroeconomic performance and policy" },
  { paper: "Unit3", code: "WEC13/01", duration: 120, questions: 9, marks: 80, desc: "Business behaviour" },
  { paper: "Unit4", code: "WEC14/01", duration: 120, questions: 9, marks: 80, desc: "Developments in the global economy" },
];

const ECONOMICS_PAST_PAPER_SERIES = [
  { year: 2024, session: "Jan", examSeries: "January-2024" },
  { year: 2024, session: "May/Jun", examSeries: "June-2024" },
  { year: 2024, session: "Oct", examSeries: "October-2024" },
];

export const ECONOMICS_PAST_PAPERS = ECONOMICS_PAST_PAPER_SERIES.flatMap(series =>
  ECONOMICS_PAPER_UNITS.map(unit => ({
    ...series,
    ...unit,
    subject: "economics",
    source: "Pearson",
    sourceUrl: `${PEARSON_IAL_ECONOMICS_PAST_PAPER_BASE_URL}&Exam-Series=${series.examSeries}`,
    availabilityNote: "Official Pearson past paper search. Recent locked papers must remain linked, not mirrored.",
  }))
);

export const PAST_PAPERS_BY_SUBJECT = {
  mathematics: PAST_PAPERS,
  physics: PHYSICS_PAST_PAPERS,
  economics: ECONOMICS_PAST_PAPERS,
};

// Subject name mapping (shared by MockExamView and WrongQuestionsPage)
export const SUBJECT_NAMES = {
  mathematics: "Mathematics",
  economics: "Economics",
  history: "History",
  politics: "Politics",
  psychology: "Psychology",
  further_math: "Further Mathematics",
  physics: "Physics"
};
