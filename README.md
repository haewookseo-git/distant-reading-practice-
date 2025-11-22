# Distant Reading Analysis: Synoptic Gospels

A computational text analysis project examining the Gospels of Matthew, Mark, and Luke from the Weymouth New Testament in Modern Speech (1913).

## Overview

This project performs distant reading analysis on three Gospel texts to identify patterns, compare stylistic features, analyze sentiment, and explore vocabulary overlap across the Synoptic Gospels.

## Features

- **Bag of Words Analysis**: Tokenization and word frequency analysis with stopword removal
- **Sentiment Analysis**: TextBlob-based sentiment scoring (polarity and subjectivity)
- **Style Metrics**: Lexical diversity, vocabulary size, verse counts, and word frequency
- **Comparative Analysis**: Side-by-side comparison of all three Gospels
- **Overlapping Words**: Identification of 1,207 words appearing in all three texts
- **Interactive Visualization**: Web-based interface with word clouds and filterable tables

## Project Structure

```
distant-reading-practice-/
├── pg8828.txt              # Gospel of Matthew
├── pg8829.txt              # Gospel of Mark
├── pg8830.txt              # Gospel of Luke
├── scripts/
│   └── analyze_gospels.py  # Main analysis script
├── data/
│   └── analysis_results.json  # Generated analysis data
├── visualization/
│   ├── index.html          # Interactive web interface
│   ├── styles.css          # Styling
│   └── app.js              # Visualization logic
├── requirements.txt        # Python dependencies
├── CLAUDE.md              # Development guidance
└── README.md              # This file
```

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Run the Analysis

Execute the analysis script to process the three Gospel texts:

```bash
python3 scripts/analyze_gospels.py
```

This will:
- Load and preprocess the three Gospel texts
- Remove Project Gutenberg headers/footers
- Perform sentiment analysis using TextBlob
- Calculate style metrics
- Identify overlapping words across all three texts
- Export results to `data/analysis_results.json`

### View the Visualization

Open the visualization in a web browser:

```bash
# Navigate to the visualization directory
cd visualization

# Open with a simple HTTP server (Python 3)
python3 -m http.server 8000

# Or open index.html directly in your browser
```

Then visit `http://localhost:8000` in your browser.

## Analysis Results Summary

**Matthew:**
- Total words: 24,139
- Unique words: 2,743
- Lexical diversity: 0.1136
- Sentiment polarity: +0.0933

**Mark:**
- Total words: 15,378
- Unique words: 2,165
- Lexical diversity: 0.1408
- Sentiment polarity: +0.0785

**Luke:**
- Total words: 26,367
- Unique words: 3,028
- Lexical diversity: 0.1148
- Sentiment polarity: +0.1158

**Overlapping Words:** 1,207 words appear in all three Gospels

## Visualization Features

The interactive web interface includes:

1. **Overview Tab**: Summary cards for each Gospel with key metrics
2. **Individual Gospel Tabs**: Detailed metrics, top 20 words, and word clouds (top 50 words)
3. **Comparison Tab**: Side-by-side comparison of style metrics and sentiment
4. **Overlapping Words Tab**: Filterable table showing all 1,207 shared words with frequencies

## Technologies Used

- **Python 3**: Text processing and analysis
- **TextBlob**: Sentiment analysis
- **NLTK**: Natural language processing (tokenization, stopwords)
- **HTML/CSS/JavaScript**: Interactive visualization
- **JSON**: Data interchange format

## Text Source

All texts are from Project Gutenberg (Public Domain):
- Weymouth New Testament in Modern Speech, Third Edition (1913)
- Translated by Richard Francis Weymouth

## License

The Gospel texts are in the public domain. The analysis code and visualization are available for educational use.
