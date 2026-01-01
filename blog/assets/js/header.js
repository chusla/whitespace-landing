// ==========================================
// Blog Header with Search - Shared Component
// ==========================================

(function() {
    // Check if we're on blog index or an article page
    const isIndexPage = window.location.pathname === '/blog/' || 
                        window.location.pathname === '/blog' || 
                        window.location.pathname === '/blog/index.html' ||
                        window.location.pathname.endsWith('/blog/');

    // Header HTML with search icon and dropdown
    const headerHTML = `
    <header class="blog-header">
        <div class="blog-header-content">
            <a href="/" class="nav-logo">
                <img src="https://c4c7ee2640e335085d93afe0c1a41ae6.cdn.bubble.io/f1766176221836x544526176091019140/whitespace.png" alt="Whitespace">
            </a>
            
            <div class="header-right">
                ${!isIndexPage ? '<a href="/blog" class="nav-link crimson">← Journal</a>' : '<a href="/" class="nav-link crimson">← Home</a>'}
                
                <div class="header-search" id="headerSearch">
                    <button class="search-toggle" id="searchToggle" aria-label="Search articles">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </button>
                    
                    <div class="search-dropdown" id="searchDropdown">
                        <div class="search-dropdown-header">
                            <div class="search-input-wrapper">
                                <svg class="search-input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.35-4.35"></path>
                                </svg>
                                <input type="text" class="search-input" id="searchInput" placeholder="Search articles..." autocomplete="off">
                                <button class="search-clear" id="searchClear">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M18 6L6 18M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div class="search-dropdown-body">
                            <div class="topics-section">
                                <div class="topics-label inter">Filter by topic</div>
                                <div class="topics-grid" id="topicsGrid"></div>
                            </div>
                            
                            <div class="results-section">
                                <div class="results-header">
                                    <span class="results-label inter">Articles</span>
                                    <span class="results-count inter" id="resultsCount">12 articles</span>
                                </div>
                                <div class="results-list" id="resultsList"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>`;

    // Insert header at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // Article database
    const articles = [
        {
            title: "The 5 Best Meditation Apps of 2026: A Comprehensive Review",
            url: "/blog/best-meditation-apps-2026.html",
            date: "January 1, 2026",
            readTime: "10 min",
            topics: ["apps", "comparison", "headspace", "calm", "insight timer", "waking up", "whitespace", "personalization"],
            keywords: ["meditation apps", "app review", "best apps", "comparison", "headspace", "calm", "insight timer", "waking up", "whitespace", "2026", "personalized meditation"]
        },
        {
            title: "Why Your Meditation App Isn't Working",
            url: "/blog/app-not-working.html",
            date: "December 26, 2025",
            readTime: "8 min",
            topics: ["apps", "habits", "motivation", "personalization"],
            keywords: ["meditation apps", "not working", "quit", "dropout", "habits", "motivation", "engagement", "personalization"]
        },
        {
            title: "Meditation for Focus and Productivity",
            url: "/blog/focus-productivity.html",
            date: "December 22, 2025",
            readTime: "7 min",
            topics: ["focus", "productivity", "ADHD", "attention", "workplace"],
            keywords: ["focus", "productivity", "ADHD", "attention", "concentration", "work", "workplace", "distraction", "performance"]
        },
        {
            title: "How Often Should You Meditate?",
            url: "/blog/meditation-frequency.html",
            date: "December 18, 2025",
            readTime: "7 min",
            topics: ["frequency", "habits", "schedule", "research"],
            keywords: ["frequency", "how often", "daily", "schedule", "routine", "consistency", "dose", "practice"]
        },
        {
            title: "Beyond Relaxation: How Meditation Rewires Your Brain",
            url: "/blog/brain-rewiring.html",
            date: "December 13, 2025",
            readTime: "7 min",
            topics: ["neuroscience", "brain", "neuroplasticity", "research"],
            keywords: ["brain", "neuroscience", "neuroplasticity", "rewire", "structure", "gray matter", "amygdala", "prefrontal cortex"]
        },
        {
            title: "Somatic Meditation: Healing Through Body Awareness",
            url: "/blog/somatic-meditation.html",
            date: "December 9, 2025",
            readTime: "8 min",
            topics: ["somatic", "body", "trauma", "healing", "nervous system"],
            keywords: ["somatic", "body awareness", "trauma", "healing", "nervous system", "interoception", "embodiment", "physical"]
        },
        {
            title: "The Meditation App Revolution",
            url: "/blog/app-revolution.html",
            date: "December 6, 2025",
            readTime: "8 min",
            topics: ["apps", "technology", "digital", "research"],
            keywords: ["apps", "technology", "digital", "revolution", "mobile", "smartphone", "effectiveness", "research"]
        },
        {
            title: "Loving-Kindness Meditation: The Science of Compassion",
            url: "/blog/loving-kindness-meditation.html",
            date: "December 1, 2025",
            readTime: "8 min",
            topics: ["loving-kindness", "compassion", "metta", "relationships", "research"],
            keywords: ["loving-kindness", "metta", "compassion", "empathy", "relationships", "self-compassion", "kindness", "altruism"]
        },
        {
            title: "Calming the Storm: Meditation for Anxiety Relief",
            url: "/blog/anxiety-relief.html",
            date: "November 29, 2025",
            readTime: "7 min",
            topics: ["anxiety", "stress", "mental health", "techniques"],
            keywords: ["anxiety", "stress", "relief", "calm", "panic", "worry", "mental health", "techniques", "breathing"]
        },
        {
            title: "Why Elite Athletes Meditate",
            url: "/blog/athletes-meditate.html",
            date: "November 22, 2025",
            readTime: "8 min",
            topics: ["athletes", "performance", "sports", "focus"],
            keywords: ["athletes", "sports", "performance", "elite", "NBA", "NFL", "focus", "mental training", "competition"]
        },
        {
            title: "The Daily Meditation Debate",
            url: "/blog/daily-meditation-debate.html",
            date: "November 18, 2025",
            readTime: "7 min",
            topics: ["frequency", "habits", "flexibility", "schedule"],
            keywords: ["daily", "debate", "frequency", "schedule", "routine", "flexible", "as-needed", "sustainable"]
        },
        {
            title: "The Science of Better Sleep",
            url: "/blog/sleep-science.html",
            date: "November 15, 2025",
            readTime: "7 min",
            topics: ["sleep", "insomnia", "research", "apps"],
            keywords: ["sleep", "insomnia", "rest", "night", "bedtime", "quality", "deep sleep", "relaxation"]
        }
    ];

    // Extract unique topics
    const allTopics = [...new Set(articles.flatMap(a => a.topics))].sort();
    
    // DOM elements
    const headerSearch = document.getElementById('headerSearch');
    const searchToggle = document.getElementById('searchToggle');
    const searchDropdown = document.getElementById('searchDropdown');
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const topicsGrid = document.getElementById('topicsGrid');
    const resultsList = document.getElementById('resultsList');
    const resultsCount = document.getElementById('resultsCount');
    
    let activeTopics = [];
    let isOpen = false;
    
    // Toggle dropdown
    function toggleDropdown() {
        isOpen = !isOpen;
        headerSearch.classList.toggle('open', isOpen);
        if (isOpen) {
            setTimeout(() => searchInput.focus(), 100);
        }
    }
    
    // Close dropdown
    function closeDropdown() {
        isOpen = false;
        headerSearch.classList.remove('open');
    }
    
    // Toggle button click
    searchToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (isOpen && !headerSearch.contains(e.target)) {
            closeDropdown();
        }
    });
    
    // Close dropdown on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
            closeDropdown();
        }
    });
    
    // Prevent dropdown from closing when clicking inside
    searchDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Clear button
    searchClear.addEventListener('click', (e) => {
        e.stopPropagation();
        searchInput.value = '';
        activeTopics = [];
        renderTopics();
        filterAndRenderResults();
        searchInput.focus();
    });
    
    // Render topics
    function renderTopics() {
        topicsGrid.innerHTML = allTopics.map(topic => `
            <button type="button" class="topic-tag ${activeTopics.includes(topic) ? 'active' : ''}" data-topic="${topic}">
                ${topic}
            </button>
        `).join('');
        
        topicsGrid.querySelectorAll('.topic-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const topic = tag.dataset.topic;
                if (activeTopics.includes(topic)) {
                    activeTopics = activeTopics.filter(t => t !== topic);
                } else {
                    activeTopics.push(topic);
                }
                renderTopics();
                filterAndRenderResults();
            });
        });
    }
    
    // Highlight search terms
    function highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }
    
    // Filter and render results
    function filterAndRenderResults() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // Show/hide clear button
        searchClear.style.opacity = (searchTerm || activeTopics.length > 0) ? '1' : '0';
        searchClear.style.pointerEvents = (searchTerm || activeTopics.length > 0) ? 'auto' : 'none';
        
        let filtered = articles;
        
        if (searchTerm) {
            filtered = filtered.filter(article => {
                const titleMatch = article.title.toLowerCase().includes(searchTerm);
                const keywordMatch = article.keywords.some(k => k.toLowerCase().includes(searchTerm));
                const topicMatch = article.topics.some(t => t.toLowerCase().includes(searchTerm));
                return titleMatch || keywordMatch || topicMatch;
            });
        }
        
        if (activeTopics.length > 0) {
            filtered = filtered.filter(article => 
                activeTopics.some(topic => article.topics.includes(topic))
            );
        }
        
        resultsCount.textContent = `${filtered.length} article${filtered.length !== 1 ? 's' : ''}`;
        
        if (filtered.length === 0) {
            resultsList.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <div class="no-results-text">No articles found</div>
                </div>
            `;
        } else {
            resultsList.innerHTML = filtered.map(article => `
                <a href="${article.url}" class="result-item">
                    <div class="result-item-title">${highlightText(article.title, searchTerm)}</div>
                    <div class="result-item-meta">
                        <span>${article.date}</span>
                        <span class="meta-dot">•</span>
                        <span>${article.readTime}</span>
                        ${article.topics.slice(0, 2).map(t => `<span class="result-item-tag">#${t}</span>`).join('')}
                    </div>
                </a>
            `).join('');
        }
    }
    
    // Search input handler
    searchInput.addEventListener('input', filterAndRenderResults);
    
    // Initialize
    renderTopics();
    filterAndRenderResults();
})();
