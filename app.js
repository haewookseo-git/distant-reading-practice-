// Global data storage
let analysisData = null;

// Load JSON data when page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/analysis_results.json');
        analysisData = await response.json();
        initializeApp();
    } catch (error) {
        console.error('Error loading analysis data:', error);
        document.querySelector('.container').innerHTML =
            '<p style="color: red; text-align: center;">Error loading analysis data. Please ensure the analysis has been run.</p>';
    }
});

// Initialize the application
function initializeApp() {
    setupTabs();
    populateOverview();
    populateGospelDetails('Matthew');
    populateGospelDetails('Mark');
    populateGospelDetails('Luke');
    populateComparison();
    populateOverlappingWords();
}

// Tab navigation
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Populate overview cards
function populateOverview() {
    const gospels = ['Matthew', 'Mark', 'Luke'];

    gospels.forEach(gospel => {
        const data = analysisData.gospels[gospel];
        const prefix = gospel.toLowerCase();

        // Update overview metrics
        document.getElementById(`${prefix}-total-words`).textContent =
            data.style_metrics.total_words.toLocaleString();
        document.getElementById(`${prefix}-unique-words`).textContent =
            data.style_metrics.unique_words.toLocaleString();
        document.getElementById(`${prefix}-diversity`).textContent =
            data.style_metrics.lexical_diversity;
        document.getElementById(`${prefix}-sentiment`).textContent =
            data.sentiment.polarity > 0 ? `+${data.sentiment.polarity}` : data.sentiment.polarity;
    });
}

// Populate individual Gospel details
function populateGospelDetails(gospel) {
    const data = analysisData.gospels[gospel];
    const prefix = gospel.toLowerCase();

    // Populate style metrics
    const metricsContainer = document.getElementById(`${prefix}-metrics`);
    const metrics = data.style_metrics;

    metricsContainer.innerHTML = `
        <div class="metric">
            <span class="metric-label">Total Words:</span>
            <span class="metric-value">${metrics.total_words.toLocaleString()}</span>
        </div>
        <div class="metric">
            <span class="metric-label">Unique Words:</span>
            <span class="metric-value">${metrics.unique_words.toLocaleString()}</span>
        </div>
        <div class="metric">
            <span class="metric-label">Lexical Diversity:</span>
            <span class="metric-value">${metrics.lexical_diversity}</span>
        </div>
        <div class="metric">
            <span class="metric-label">Vocabulary Size:</span>
            <span class="metric-value">${metrics.vocabulary_size.toLocaleString()}</span>
        </div>
        <div class="metric">
            <span class="metric-label">Verse Count:</span>
            <span class="metric-value">${metrics.verse_count.toLocaleString()}</span>
        </div>
        <div class="metric">
            <span class="metric-label">Avg Words/Verse:</span>
            <span class="metric-value">${metrics.avg_words_per_verse}</span>
        </div>
        <div class="metric">
            <span class="metric-label">Sentiment Polarity:</span>
            <span class="metric-value">${data.sentiment.polarity}</span>
        </div>
        <div class="metric">
            <span class="metric-label">Sentiment Subjectivity:</span>
            <span class="metric-value">${data.sentiment.subjectivity}</span>
        </div>
    `;

    // Populate top 20 words
    const topWordsContainer = document.getElementById(`${prefix}-top-words`);
    topWordsContainer.innerHTML = data.top_words.map((item, index) => `
        <div class="word-item">
            <span class="word-text">${index + 1}. ${item.word}</span>
            <span class="word-count">${item.count}</span>
        </div>
    `).join('');

    // Populate word cloud (top 50)
    const wordCloudContainer = document.getElementById(`${prefix}-word-cloud`);
    const maxCount = data.word_cloud[0].count;
    const minCount = data.word_cloud[data.word_cloud.length - 1].count;

    wordCloudContainer.innerHTML = data.word_cloud.map(item => {
        // Calculate font size based on frequency (12px to 36px)
        const fontSize = 12 + ((item.count - minCount) / (maxCount - minCount)) * 24;
        return `<span class="cloud-word" style="font-size: ${fontSize}px">${item.word}</span>`;
    }).join('');
}

// Populate comparison table
function populateComparison() {
    // Style metrics comparison
    const metricsBody = document.getElementById('comparison-metrics');
    const matthew = analysisData.gospels.Matthew.style_metrics;
    const mark = analysisData.gospels.Mark.style_metrics;
    const luke = analysisData.gospels.Luke.style_metrics;

    const metricsToCompare = [
        { label: 'Total Words', key: 'total_words', format: 'number' },
        { label: 'Unique Words', key: 'unique_words', format: 'number' },
        { label: 'Lexical Diversity', key: 'lexical_diversity', format: 'decimal' },
        { label: 'Vocabulary Size', key: 'vocabulary_size', format: 'number' },
        { label: 'Verse Count', key: 'verse_count', format: 'number' },
        { label: 'Avg Words/Verse', key: 'avg_words_per_verse', format: 'decimal' }
    ];

    metricsBody.innerHTML = metricsToCompare.map(metric => {
        const matthewVal = metric.format === 'number' ?
            matthew[metric.key].toLocaleString() : matthew[metric.key];
        const markVal = metric.format === 'number' ?
            mark[metric.key].toLocaleString() : mark[metric.key];
        const lukeVal = metric.format === 'number' ?
            luke[metric.key].toLocaleString() : luke[metric.key];

        return `
            <tr>
                <td><strong>${metric.label}</strong></td>
                <td>${matthewVal}</td>
                <td>${markVal}</td>
                <td>${lukeVal}</td>
            </tr>
        `;
    }).join('');

    // Sentiment comparison
    const sentimentBody = document.getElementById('comparison-sentiment');
    const gospelNames = ['Matthew', 'Mark', 'Luke'];

    sentimentBody.innerHTML = gospelNames.map(gospel => {
        const sentiment = analysisData.gospels[gospel].sentiment;
        const interpretation = interpretSentiment(sentiment.polarity, sentiment.subjectivity);

        return `
            <tr>
                <td><strong>${gospel}</strong></td>
                <td>${sentiment.polarity}</td>
                <td>${sentiment.subjectivity}</td>
                <td>${interpretation}</td>
            </tr>
        `;
    }).join('');

    // Render charts
    renderComparisonCharts();
}

// Render comparison charts
function renderComparisonCharts() {
    const matthew = analysisData.gospels.Matthew;
    const mark = analysisData.gospels.Mark;
    const luke = analysisData.gospels.Luke;

    const gospelColors = {
        matthew: 'rgba(102, 126, 234, 0.8)',
        mark: 'rgba(118, 75, 162, 0.8)',
        luke: 'rgba(237, 100, 166, 0.8)'
    };

    // Word Count Chart (Bar)
    new Chart(document.getElementById('wordCountChart'), {
        type: 'bar',
        data: {
            labels: ['Matthew', 'Mark', 'Luke'],
            datasets: [{
                label: 'Total Words',
                data: [
                    matthew.style_metrics.total_words,
                    mark.style_metrics.total_words,
                    luke.style_metrics.total_words
                ],
                backgroundColor: [
                    gospelColors.matthew,
                    gospelColors.mark,
                    gospelColors.luke
                ],
                borderWidth: 0
            }, {
                label: 'Unique Words',
                data: [
                    matthew.style_metrics.unique_words,
                    mark.style_metrics.unique_words,
                    luke.style_metrics.unique_words
                ],
                backgroundColor: [
                    'rgba(102, 126, 234, 0.5)',
                    'rgba(118, 75, 162, 0.5)',
                    'rgba(237, 100, 166, 0.5)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Lexical Diversity Chart (Horizontal Bar)
    new Chart(document.getElementById('diversityChart'), {
        type: 'bar',
        data: {
            labels: ['Matthew', 'Mark', 'Luke'],
            datasets: [{
                label: 'Lexical Diversity',
                data: [
                    matthew.style_metrics.lexical_diversity,
                    mark.style_metrics.lexical_diversity,
                    luke.style_metrics.lexical_diversity
                ],
                backgroundColor: [
                    gospelColors.matthew,
                    gospelColors.mark,
                    gospelColors.luke
                ],
                borderWidth: 0
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 0.2
                }
            }
        }
    });

    // Sentiment Chart (Grouped Bar)
    new Chart(document.getElementById('sentimentChart'), {
        type: 'bar',
        data: {
            labels: ['Matthew', 'Mark', 'Luke'],
            datasets: [{
                label: 'Polarity',
                data: [
                    matthew.sentiment.polarity,
                    mark.sentiment.polarity,
                    luke.sentiment.polarity
                ],
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderWidth: 0
            }, {
                label: 'Subjectivity',
                data: [
                    matthew.sentiment.subjectivity,
                    mark.sentiment.subjectivity,
                    luke.sentiment.subjectivity
                ],
                backgroundColor: 'rgba(255, 159, 64, 0.8)',
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    });

    // Radar Chart (Overall Metrics)
    new Chart(document.getElementById('radarChart'), {
        type: 'radar',
        data: {
            labels: [
                'Lexical Diversity (×10)',
                'Avg Words/Verse (÷10)',
                'Sentiment Polarity (×10)',
                'Sentiment Subjectivity'
            ],
            datasets: [{
                label: 'Matthew',
                data: [
                    matthew.style_metrics.lexical_diversity * 10,
                    matthew.style_metrics.avg_words_per_verse / 10,
                    matthew.sentiment.polarity * 10,
                    matthew.sentiment.subjectivity
                ],
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderColor: gospelColors.matthew,
                borderWidth: 2
            }, {
                label: 'Mark',
                data: [
                    mark.style_metrics.lexical_diversity * 10,
                    mark.style_metrics.avg_words_per_verse / 10,
                    mark.sentiment.polarity * 10,
                    mark.sentiment.subjectivity
                ],
                backgroundColor: 'rgba(118, 75, 162, 0.2)',
                borderColor: gospelColors.mark,
                borderWidth: 2
            }, {
                label: 'Luke',
                data: [
                    luke.style_metrics.lexical_diversity * 10,
                    luke.style_metrics.avg_words_per_verse / 10,
                    luke.sentiment.polarity * 10,
                    luke.sentiment.subjectivity
                ],
                backgroundColor: 'rgba(237, 100, 166, 0.2)',
                borderColor: gospelColors.luke,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 3
                }
            }
        }
    });
}

// Interpret sentiment values
function interpretSentiment(polarity, subjectivity) {
    let polarityText = '';
    if (polarity > 0.1) polarityText = 'Positive';
    else if (polarity < -0.1) polarityText = 'Negative';
    else polarityText = 'Neutral';

    let subjectivityText = '';
    if (subjectivity > 0.5) subjectivityText = 'Subjective';
    else subjectivityText = 'Objective';

    return `${polarityText}, ${subjectivityText}`;
}

// Populate overlapping words table
function populateOverlappingWords() {
    const overlappingWords = analysisData.overlapping_words;
    const tableBody = document.getElementById('overlap-table-body');
    const countBadge = document.getElementById('overlap-count');
    const filterInput = document.getElementById('word-filter');

    // Update count badge
    countBadge.textContent = `${overlappingWords.length} words`;

    // Render table
    function renderTable(filteredWords) {
        tableBody.innerHTML = filteredWords.map(item => `
            <tr>
                <td class="word-cell">${item.word}</td>
                <td class="count-cell">${item.matthew}</td>
                <td class="count-cell">${item.mark}</td>
                <td class="count-cell">${item.luke}</td>
                <td class="count-cell"><strong>${item.total}</strong></td>
            </tr>
        `).join('');

        // Update count
        countBadge.textContent = `${filteredWords.length} words`;
    }

    // Initial render
    renderTable(overlappingWords);

    // Filter functionality
    filterInput.addEventListener('input', (e) => {
        const filterText = e.target.value.toLowerCase();
        const filtered = overlappingWords.filter(item =>
            item.word.toLowerCase().includes(filterText)
        );
        renderTable(filtered);
    });
}

// Utility function to format numbers
function formatNumber(num) {
    return num.toLocaleString();
}
