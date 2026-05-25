# Blossom Glyph: Design and Evaluation of a Glyph for Paired Multivariate Data

This repository contains the source code, study materials, raw data, statistical analysis scripts, and results for the **Blossom** user study evaluating Blossom Glyph.

## Repository Contents

| File | Description |
| --- | --- |
| `FlowerVisPage.tsx` | React/TypeScript component implementing the flower visualization page used as the experimental stimulus in the study. |
| `study-pages-export.pdf` | Exported PDF of the study pages (instructions, tasks, and questionnaires) shown to participants. |
| `blossom_correctness_time.csv` | Raw per-trial data: task correctness (accuracy) and response time per participant per condition. |
| `blossom_subjective_ratings.csv` | Raw subjective ratings data (e.g., Likert-scale responses) collected from participants. |
| `blossom_analyses.sas` | SAS script that loads the CSV files and runs the Generalized Linear Mixed Model (GLMM) analyses. |
| `GLMM_correctness_time_results.xlsx` | Output of the GLMM analyses for correctness and response time, formatted as an Excel workbook. |
| `blossom_combined_report.pdf` | Combined report summarizing the study, methodology, and results. |

## Study Overview

- **Independent variables:** *e.g., visualization type, task type*
- **Dependent variables:** correctness, completion time, subjective ratings
- **Design:** *e.g., within-subjects, 3 × 9 factorial*
- **Participants:** *N = 27*

## Raw Study Data

### `study-pages-export.pdf`

PDF export of screenshots showing the full set of study pages each participant will experience.

### `blossom_correctness_time.csv`

| Column | Type | Description |
| --- | --- | --- |
| `participant_id` | string | Anonymized participant identifier |
| `vis` | string | Short key of visualization type |
| `task_order` | string | Task identifier |
| `correctness` | 0/1 | Whether the response was correct |
| `duration_ms` | numeric | Response time in milliseconds |

### `blossom_subjective_ratings.csv`

| Column | Type | Description |
| --- | --- | --- |
| `participant_number` | string | Simplified Anonymized participant identifier |
| `participant_id` | string | Anonymized participant identifier |
| `vis` | string | Full name of visualization type |
| `vis_key` | string | Short key of visualization type |
| `rating` | numeric | Averaging rating of 4 columns `ease_of_reading`, `learnability`, `confidence`, `aesthetics` |
| `ease_of_reading` | 1–5 | Likert-scale response |
| `learnability` | 1–5 | Likert-scale response |
| `confidence` | 1–5 | Likert-scale response |
| `aesthetics` | 1–5 | Likert-scale response |
| `age` | numeric | Age |
| `gender` | string | Gender |
| `highest_degree` | string | Highest degree obtained |
| `attention_check` | numeric | Attention check question |
| `platform` | string | Computing platform used by participant |
| `browser` | string | Broser used by participant |
| `input_device` | string | Input device that participant used to take the experiment |
| `input_device_skill` | 1–5 | Skill level in using the input device |

### `blossom_combined_report.pdf`

Combined PDF report containing raw participant response data for easy review and readability.

## SAS Analysis

- **SAS** (tested with version *9.4*) with the `GLIMMIX` procedure available.
- The raw data CSV `blossom_correctness_time.csv` in the same directory as `blossom_analyses.sas`, or update the file paths inside the script.
- The GLMM pair-wise comparison results for correctness (p-value, odds ratio) and completion time (p-value) are included in `GLMM_correctness_time_results.xlsx`.

## Code of the Visualization Component

`FlowerVisPage.tsx` is a React component intended to be used inside a TypeScript/React project.
