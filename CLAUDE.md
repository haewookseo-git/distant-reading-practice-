# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a distant reading practice repository containing three Gospel texts from the Weymouth New Testament in Modern Speech (Third Edition, 1913):

- **pg8828.txt**: Gospel of Matthew (Book 40)
- **pg8829.txt**: Gospel of Mark (Book 41)
- **pg8830.txt**: Gospel of Luke (Book 42)

All texts are sourced from Project Gutenberg and are in the public domain.

## Text File Structure

Each text file follows the standard Project Gutenberg format:

1. **Header**: Copyright notice, title, author, release date, and credits (~40 lines)
2. **Start marker**: `*** START OF THE PROJECT GUTENBERG EBOOK...`
3. **Main content**: The biblical text, formatted with book/chapter/verse numbers (e.g., `001:001`)
4. **End marker**: `*** END OF THE PROJECT GUTENBERG EBOOK...` (may be present)
5. **Footer**: Additional Project Gutenberg information

When processing these texts for analysis, you'll typically want to:
- Strip the Project Gutenberg headers and footers
- Parse the verse numbering system (Book:Chapter:Verse format like `001:001`)
- Handle the UTF-8 BOM character (﻿) at the start of pg8828.txt and pg8829.txt

## Distant Reading Context

"Distant reading" refers to computational text analysis techniques that identify patterns across texts or large corpora, as opposed to traditional close reading. This practice repository is suitable for:

- Word frequency analysis and vocabulary comparison across the three Gospels
- Computational stylometry and authorship attribution exercises
- Sentiment analysis and tone comparison
- Named entity recognition (people, places)
- Verse-level text segmentation and analysis
- Topic modeling and thematic analysis
- Text reuse and parallel passage detection

## Working with This Corpus

### Text Analysis Setup

When creating analysis scripts, use Python with common text analysis libraries:

```bash
# Typical dependencies for distant reading
pip install nltk pandas matplotlib numpy scikit-learn
```

### Reading the Texts

Account for Project Gutenberg formatting when loading texts:

```python
# Example: Read and clean a single text
def load_gospel(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        text = f.read()
    # Find content between START and END markers
    start = text.find('*** START OF')
    end = text.find('*** END OF')
    if start != -1:
        text = text[start:]
    if end != -1:
        text = text[:end]
    return text
```

### Common Analysis Patterns

When implementing analyses:
- Process all three texts in a corpus for comparative analysis
- Preserve verse-level granularity for alignment and comparison
- Consider the theological and literary relationship between the Synoptic Gospels (Matthew, Mark, Luke share significant content)
- Be aware of the translation's characteristics (Weymouth's "Modern Speech" is an early 20th century English translation)

## Project Architecture

This repository now includes a complete analysis pipeline:

**Data Flow:**
1. **Source Texts** (pg8828.txt, pg8829.txt, pg8830.txt) →
2. **Analysis Script** (scripts/analyze_gospels.py) →
3. **JSON Output** (data/analysis_results.json) →
4. **Web Visualization** (visualization/)

**Key Components:**

- `scripts/analyze_gospels.py`: Main analysis script using TextBlob and NLTK
  - GospelAnalyzer class handles all text processing
  - Performs sentiment analysis, style metrics, word frequency, and overlap detection
  - Exports structured JSON for visualization

- `data/analysis_results.json`: Generated data file containing:
  - Per-Gospel metrics (sentiment, style, top words, word cloud data)
  - Overlapping words across all three texts (1,207 words)
  - Metadata about the analysis

- `visualization/`: Web-based interactive interface
  - index.html: Structure with tabs for overview, individual Gospels, comparison, overlaps
  - app.js: Loads JSON, renders word clouds, populates tables
  - styles.css: Gradient styling with responsive design

## Common Commands

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run Analysis
```bash
python3 scripts/analyze_gospels.py
```
This regenerates `data/analysis_results.json` with fresh analysis results.

### View Visualization

**GitHub Pages (Recommended):**
The visualization files are in the repository root (index.html, app.js, styles.css).
Enable GitHub Pages in repository Settings → Pages, select the branch, and the site will be live.

**Local Development:**
```bash
# From repository root
python3 -m http.server 8000
```
Then open http://localhost:8000 in your browser.

Note: Opening index.html directly won't work due to CORS restrictions on loading local JSON files.
