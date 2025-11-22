#!/usr/bin/env python3
"""
Distant Reading Analysis of Synoptic Gospels
Analyzes Matthew, Mark, and Luke from Weymouth New Testament
"""

import re
import json
from collections import Counter
from pathlib import Path
from textblob import TextBlob
from nltk.corpus import stopwords
import nltk

# Download required NLTK data
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)


class GospelAnalyzer:
    """Analyzes Gospel texts for distant reading"""

    def __init__(self, base_path="."):
        self.base_path = Path(base_path)
        self.gospels = {
            'Matthew': 'pg8828.txt',
            'Mark': 'pg8829.txt',
            'Luke': 'pg8830.txt'
        }
        self.stop_words = set(stopwords.words('english'))
        self.results = {}

    def load_gospel(self, filename):
        """Load and clean a Gospel text file"""
        filepath = self.base_path / filename
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            text = f.read()

        # Extract content between START and END markers
        start_marker = '*** START OF'
        end_marker = '*** END OF'

        start_idx = text.find(start_marker)
        end_idx = text.find(end_marker)

        if start_idx != -1:
            text = text[start_idx:]
        if end_idx != -1:
            text = text[:end_idx]

        # Remove the START marker line itself
        lines = text.split('\n')
        clean_lines = []
        skip_header = True

        for line in lines:
            if skip_header and re.match(r'^\d{3}:\d{3}', line):
                skip_header = False
            if not skip_header:
                clean_lines.append(line)

        return '\n'.join(clean_lines)

    def tokenize_and_clean(self, text):
        """Tokenize text and remove stopwords"""
        # Convert to lowercase and extract words
        words = re.findall(r'\b[a-z]+\b', text.lower())

        # Remove stopwords and very short words
        filtered_words = [w for w in words if w not in self.stop_words and len(w) > 2]

        return filtered_words

    def analyze_sentiment(self, text):
        """Analyze sentiment using TextBlob"""
        blob = TextBlob(text)
        return {
            'polarity': round(blob.sentiment.polarity, 4),
            'subjectivity': round(blob.sentiment.subjectivity, 4)
        }

    def calculate_style_metrics(self, text, filtered_words):
        """Calculate stylistic metrics"""
        all_words = re.findall(r'\b[a-z]+\b', text.lower())

        # Count verses (lines starting with verse numbers like "001:001")
        verses = len(re.findall(r'^\d{3}:\d{3}', text, re.MULTILINE))

        # Calculate metrics
        total_words = len(all_words)
        unique_words = len(set(all_words))

        return {
            'total_words': total_words,
            'unique_words': unique_words,
            'lexical_diversity': round(unique_words / total_words, 4) if total_words > 0 else 0,
            'vocabulary_size': unique_words,
            'verse_count': verses,
            'avg_words_per_verse': round(total_words / verses, 2) if verses > 0 else 0
        }

    def get_top_words(self, words, n=20):
        """Get top N most frequent words"""
        counter = Counter(words)
        return [{'word': word, 'count': count} for word, count in counter.most_common(n)]

    def analyze_gospel(self, name, filename):
        """Perform complete analysis on a single Gospel"""
        print(f"Analyzing {name}...")

        # Load text
        text = self.load_gospel(filename)

        # Tokenize and clean
        filtered_words = self.tokenize_and_clean(text)

        # Analyze sentiment
        sentiment = self.analyze_sentiment(text)

        # Calculate style metrics
        style_metrics = self.calculate_style_metrics(text, filtered_words)

        # Get top words
        top_words = self.get_top_words(filtered_words, 20)

        # Get word cloud data (top 50)
        word_cloud_data = self.get_top_words(filtered_words, 50)

        return {
            'name': name,
            'sentiment': sentiment,
            'style_metrics': style_metrics,
            'top_words': top_words,
            'word_cloud': word_cloud_data,
            'all_words': filtered_words  # Keep for overlap analysis
        }

    def find_overlapping_words(self):
        """Find words that appear in all three Gospels"""
        # Get word sets for each Gospel
        matthew_words = set(self.results['Matthew']['all_words'])
        mark_words = set(self.results['Mark']['all_words'])
        luke_words = set(self.results['Luke']['all_words'])

        # Find intersection
        common_words = matthew_words & mark_words & luke_words

        # Get frequencies for each common word
        overlap_data = []
        for word in common_words:
            matthew_count = self.results['Matthew']['all_words'].count(word)
            mark_count = self.results['Mark']['all_words'].count(word)
            luke_count = self.results['Luke']['all_words'].count(word)

            overlap_data.append({
                'word': word,
                'matthew': matthew_count,
                'mark': mark_count,
                'luke': luke_count,
                'total': matthew_count + mark_count + luke_count
            })

        # Sort by total frequency
        overlap_data.sort(key=lambda x: x['total'], reverse=True)

        return overlap_data

    def run_analysis(self):
        """Run complete analysis on all Gospels"""
        # Analyze each Gospel
        for name, filename in self.gospels.items():
            self.results[name] = self.analyze_gospel(name, filename)

        # Find overlapping words
        overlapping_words = self.find_overlapping_words()

        # Remove 'all_words' from individual results (not needed in JSON output)
        for name in self.results:
            del self.results[name]['all_words']

        # Prepare final output
        output = {
            'gospels': self.results,
            'overlapping_words': overlapping_words,
            'metadata': {
                'total_overlapping_words': len(overlapping_words),
                'analysis_type': 'whole_gospel_level',
                'sentiment_tool': 'TextBlob',
                'source': 'Weymouth New Testament in Modern Speech (1913)'
            }
        }

        return output

    def save_results(self, output_path='data/analysis_results.json'):
        """Save analysis results to JSON"""
        output_file = self.base_path / output_path
        output_file.parent.mkdir(parents=True, exist_ok=True)

        # Run analysis
        results = self.run_analysis()

        # Save to JSON
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)

        print(f"\nAnalysis complete! Results saved to {output_file}")
        print(f"Total overlapping words: {results['metadata']['total_overlapping_words']}")

        return results


def main():
    """Main entry point"""
    # Initialize analyzer
    analyzer = GospelAnalyzer(base_path="/home/user/distant-reading-practice-")

    # Run analysis and save results
    results = analyzer.save_results()

    # Print summary
    print("\n=== Analysis Summary ===")
    for name in ['Matthew', 'Mark', 'Luke']:
        gospel = results['gospels'][name]
        print(f"\n{name}:")
        print(f"  Total words: {gospel['style_metrics']['total_words']:,}")
        print(f"  Unique words: {gospel['style_metrics']['unique_words']:,}")
        print(f"  Lexical diversity: {gospel['style_metrics']['lexical_diversity']}")
        print(f"  Sentiment polarity: {gospel['sentiment']['polarity']}")
        print(f"  Verses: {gospel['style_metrics']['verse_count']}")


if __name__ == '__main__':
    main()
