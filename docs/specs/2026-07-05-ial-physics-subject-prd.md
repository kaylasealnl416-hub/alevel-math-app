# A-Level Physics Subject Preparation PRD

- Project: alevel-math-app
- Date: 2026-07-05
- Target subject: Pearson Edexcel International Advanced Level Physics (2018)
- Target users: international students preparing for Pearson Edexcel IAS/IAL Physics
- Status: approved and implemented for full Units 1-6 data rollout

## 1. Product Decision

Add `physics` as a first-class subject, aligned to Pearson Edexcel International Advanced Subsidiary/Advanced Level in Physics (2018), not UK domestic GCE A Level Physics.

Working identifiers:

- Subject id: `physics`
- Qualification: Pearson Edexcel IAS/IAL Physics
- IAS cash-in: `XPH11`
- IAL cash-in: `YPH11`
- Unit codes: `WPH11`, `WPH12`, `WPH13`, `WPH14`, `WPH15`, `WPH16`
- Official source priority: Pearson qualification page, official specification PDF, Pearson past paper search

## 2. Official Source Rules

Use Pearson official material as source of truth.

- Qualification page: https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/physics-2018.html
- Specification PDF: https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Physics/2018/Specification%20and%20Sample%20Assessment/9781446957783_IAL_Physics_Iss3.pdf
- Past paper search: https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html?Qualification-Family=International-Advanced-Level&Qualification-Subject=Physics+%282018%29&Specification-Code=Pearson-UK%3ASpecification-Code%2Fial18-physics&Status=Pearson-UK%3AStatus%2FLive

Copyright handling:

- Do not copy full Pearson textbook or full paper text into project data.
- Store metadata, official links, syllabus-derived summaries, original bilingual learning notes, and our own exam strategy text.
- For past papers, show official Pearson source links and exam metadata. Recent locked papers must remain linked, not mirrored.

## 3. Existing Project Fit

Current subject data is stored in:

- `src/data/subjects.js`: frontend subject catalog for Economics, Further Math and other non-math subjects.
- `backend/data-import/subjects.js`: database import source used by `backend/src/db/seed.js` and update scripts.
- `src/data/allSubjects.js`: subject metadata, `SUBJECT_NAMES`, and current shared `PAST_PAPERS`.
- `src/data/subjectResources.js`: resource links shown in subject/chapter views.
- `src/components/UserProfilePage.jsx`: currently has a hardcoded subject selector list.

Physics should follow the same `books -> chapters` shape used by Economics and Further Math. The implementation should avoid creating a separate data model unless past-paper metadata becomes too large.

## 4. Course Structure

### Unit 1: Mechanics and Materials

- Unit code: `WPH11/01`
- Level: IAS
- Exam: 1 hour 30 minutes, 80 marks
- Availability: January, June, October
- App book id: `Unit1`
- Proposed title: `{ zh: "力学与材料", en: "Mechanics and Materials" }`

Proposed chapters:

- `phy1c1`: Motion, SUVAT and kinematics graphs
- `phy1c2`: Vectors, projectiles and free-body diagrams
- `phy1c3`: Newton's laws, momentum, moments and equilibrium
- `phy1c4`: Work, energy, power and efficiency
- `phy1c5`: Density, fluids, upthrust, viscosity and Stokes' law
- `phy1c6`: Elasticity, Hooke's law, stress, strain and Young modulus

Core practical focus:

- Acceleration of free fall
- Viscosity using falling-ball method
- Young modulus of a material

### Unit 2: Waves and Electricity

- Unit code: `WPH12/01`
- Level: IAS
- Exam: 1 hour 30 minutes, 80 marks
- Availability: January, June, October
- App book id: `Unit2`
- Proposed title: `{ zh: "波与电学", en: "Waves and Electricity" }`

Proposed chapters:

- `phy2c1`: Wave properties and wave graphs
- `phy2c2`: Stationary waves, superposition and interference
- `phy2c3`: Diffraction, polarisation and refraction
- `phy2c4`: Particle nature of light and quantum evidence
- `phy2c5`: Current, potential difference, resistance and power
- `phy2c6`: Resistivity, I-V characteristics, circuits and potential dividers

Core practical focus:

- Speed of sound
- Vibrating string or wire
- Diffraction grating wavelength
- Resistivity of a wire
- I-V characteristics

### Unit 3: Practical Skills in Physics I

- Unit code: `WPH13/01`
- Level: IAS
- Exam: 1 hour 20 minutes, 50 marks
- Availability: January, June, October
- App book id: `Unit3`
- Proposed title: `{ zh: "物理实验技能 I", en: "Practical Skills in Physics I" }`

Proposed chapters:

- `phy3c1`: Variables, controls and practical planning
- `phy3c2`: Measurements, apparatus choice and safety
- `phy3c3`: Uncertainties, significant figures and error analysis
- `phy3c4`: Graphs, gradients, intercepts and linearisation
- `phy3c5`: Evaluating methods and improving experiments
- `phy3c6`: Unit 1-2 core practical review

### Unit 4: Further Mechanics, Fields and Particles

- Unit code: `WPH14/01`
- Level: IA2
- Exam: 1 hour 45 minutes, 90 marks
- Availability: January, June, October
- App book id: `Unit4`
- Proposed title: `{ zh: "进阶力学、场与粒子", en: "Further Mechanics, Fields and Particles" }`

Proposed chapters:

- `phy4c1`: Impulse and momentum in two dimensions
- `phy4c2`: Circular motion and centripetal force
- `phy4c3`: Electric fields, Coulomb's law and electric potential
- `phy4c4`: Capacitance and capacitor discharge
- `phy4c5`: Magnetic fields and electromagnetic induction
- `phy4c6`: Nuclear and particle physics

Core practical focus:

- Magnetic flux density using a current balance
- Capacitor discharge
- Electromagnetic induction

### Unit 5: Thermodynamics, Radiation, Oscillations and Cosmology

- Unit code: `WPH15/01`
- Level: IA2
- Exam: 1 hour 45 minutes, 90 marks
- Availability: January, June, October
- App book id: `Unit5`
- Proposed title: `{ zh: "热学、辐射、振动与宇宙学", en: "Thermodynamics, Radiation, Oscillations and Cosmology" }`

Proposed chapters:

- `phy5c1`: Thermal energy, specific heat capacity and latent heat
- `phy5c2`: Internal energy, ideal gases and kinetic theory
- `phy5c3`: Nuclear decay, activity and half-life
- `phy5c4`: Simple harmonic motion
- `phy5c5`: Damping, resonance and oscillation energy
- `phy5c6`: Gravitational fields and orbits
- `phy5c7`: Astrophysics and cosmology

Core practical focus:

- Thermistor calibration
- Specific latent heat
- Pressure-volume relationship of a gas
- Gamma absorption by lead
- Simple harmonic oscillator

### Unit 6: Practical Skills in Physics II

- Unit code: `WPH16/01`
- Level: IA2
- Exam: 1 hour 20 minutes, 50 marks
- Availability: January, June, October
- App book id: `Unit6`
- Proposed title: `{ zh: "物理实验技能 II", en: "Practical Skills in Physics II" }`

Proposed chapters:

- `phy6c1`: Advanced practical planning and risk management
- `phy6c2`: Advanced uncertainties and percentage uncertainty
- `phy6c3`: Data processing, gradients and log-linear relationships
- `phy6c4`: Evaluating systematic and random errors
- `phy6c5`: Unit 4-5 core practical review
- `phy6c6`: Practical exam response structure

## 5. Exam Preparation Points

General exam rules:

- All six units are externally assessed written papers.
- IAS Physics consists of Units 1, 2 and 3.
- IAL Physics consists of Units 1-6.
- Papers are available in January, June and October exam series.
- Calculators are allowed.
- At least 40% of marks across the papers target mathematics at Level 2 or above.
- Practical skills are assessed directly in Units 3 and 6 and indirectly through practical contexts in Units 1, 2, 4 and 5.

Unit-level emphasis:

- Unit 1: mechanics modelling, graphs, forces, momentum, energy, material properties.
- Unit 2: wave behaviour, optics, quantum evidence, electric circuit analysis.
- Unit 3: practical method, uncertainty, graph analysis, evaluation.
- Unit 4: synoptic use of Units 1 and 2, fields, capacitance, magnetic effects, particles.
- Unit 5: synoptic use of Units 1, 2 and 4, thermal physics, decay, SHM, astrophysics.
- Unit 6: advanced experimental reasoning from Units 4 and 5.

## 6. Past Paper Strategy

Past paper metadata should be stored as official-source records, not copied documents.

Proposed record shape:

- `subject`: `physics`
- `year`: numeric
- `session`: `Jan`, `May/Jun`, `Oct/Nov`
- `unit`: `Unit1` to `Unit6`
- `paper`: `WPH11/01` to `WPH16/01`
- `desc`: official unit title
- `duration`: minutes
- `marks`: raw marks
- `source`: `Pearson`
- `url`: official Pearson past-paper search URL, optionally filtered by series
- `availabilityNote`: recent papers may be locked for registered centres

Initial UI behavior:

- On Physics mock exam page, show six paper cards from official unit metadata.
- Add a Pearson official "Past papers and mark schemes" resource link.
- Avoid pretending a paper is available if Pearson marks it locked.

## 7. Implementation Plan After Approval

1. Add `physics` object to `src/data/subjects.js` with six `books` and chapter metadata.
2. Mirror the same `physics` object into `backend/data-import/subjects.js` or extract shared subject data to reduce duplication.
3. Add Physics to `src/data/allSubjects.js` `SUBJECT_NAMES`.
4. Add Physics official resources to `src/data/subjectResources.js`.
5. Add Physics to `src/components/UserProfilePage.jsx` subject selector.
6. Add/adjust tests in `src/data/subjects.test.js` to require `physics` and validate `phy*` chapter id uniqueness.
7. Run frontend tests and production build.
8. Run backend data import validation against a test database before production seeding.

## 8. Acceptance Criteria

- Physics appears as a selectable subject on the site.
- Physics curriculum shows six Pearson IAL units with bilingual titles.
- Each unit has official-aligned chapters, key points, formulas, hard points, exam tips and practical focus.
- Physics resources include Pearson official qualification page, specification PDF and past paper search.
- Existing Mathematics, Economics and Further Mathematics content remains unchanged.
- Data validation tests pass.
- Production build passes.

## 9. Implementation Record

- Implemented shared Physics subject data in `src/data/physicsSubject.js`.
- Wired Physics into frontend `SUBJECTS` and backend data-import `SUBJECTS`.
- Added Pearson official resources for Physics.
- Added Physics to subject names, profile subject selection and progress mapping.
- Updated mock exam metadata generation to use unit-level `exam` metadata when available.
- Added data validation tests for Pearson IAL Physics unit coverage.

Verification:

- `npm test -- --run src/data/subjects.test.js`: passed.
- Backend data-import module load check: passed.
- `npm run build`: passed.
- `npm test`: passed.
- `npm run lint`: passed.
- Browser validation: passed. Homepage shows Physics, and Unit1-Unit6 render with `WPH11/01` through `WPH16/01`.
- Validation fix: `CurriculumView` now reads `book.exam.code` before falling back to legacy hardcoded book codes.

## 10. Product Question Before Coding

Should Physics launch as a full six-unit IAS/IAL subject at once, or should the first release expose only IAS Units 1-3 first?

Recommendation: launch all six units in the data structure, but mark Units 4-6 as IA2. This avoids a second migration and matches the Pearson qualification structure.

Decision: launch full Units 1-6 and label IAS/IA2 in the unit metadata.
