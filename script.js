let articles = [];
let readingTime = [];
let descDate = true;
let descViews = true;
let isDarkMode = false;

function sortByDate() {
    let sorted = [...articles];
    if (descDate) {
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        descDate = false;
    }
    else {
        sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        descDate = true;
    }
    outputArticles(sorted);
}

function sortByViews() {
    let sorted = [...articles];
    if (descViews) {
        sorted.sort((a, b) => b.views - a.views);
        descViews = false;
    }
    else {
        sorted.sort((a, b) => a.views - b.views);
        descViews = true;
    }
    outputArticles(sorted);
}

function outputArticles(articles) {
    const listEl = document.getElementById('article-list');
    listEl.innerHTML = '';
    articles.forEach(article => {
        const articleEl = document.createElement('div');
        articleEl.innerHTML = `
            <h3>${article.title}</h3>
            <p><time datetime="${article.date}">${article.date}</time> | ${article.category}</p>
            <p>${article.content.substring(0, 80)}...</p>
        `;
        articleEl.style.cursor = 'pointer';
        articleEl.addEventListener('click', function() {
            showArticleDetails(article);
        });
        listEl.appendChild(articleEl);
    });
    updatePopularArticle(); 
}

function showArticleDetails(article) {
    article.views += 1;
    const updatedArticles = [];
    for (let i = 0; i < articles.length; i++) {
        if (articles[i].id === article.id) {
            updatedArticles.push({
                id: article.id,
                title: article.title,
                date: article.date,
                category: article.category,
                content: article.content,
                views: article.views,
                wordCount: article.wordCount
            });
        } else {
            updatedArticles.push(articles[i]);
        }
        localStorage.setItem('articles', JSON.stringify(updatedArticles));
    }
    const detailEl = document.getElementById('article-list');
    detailEl.innerHTML = `
        <div class="article-detail">
            <h2>${article.title}</h2>
            <p class="text-muted m-0">Reading time: ~${readingTime[article.id - 1]} minutes</p>
            <p class="article-meta">${article.date} | ${article.category} | ${article.views} views</p>
            <div class="article-content">${article.content}</div>
            <button id="back-btn" class="btn btn-dark mt-3">Back to Articles</button>
        </div>
    `;
    
    document.getElementById('back-btn').addEventListener('click', function() {
        outputArticles(articles);
    });
}

function outputBreakingArticle() {
    const breakingEl = document.getElementById('breaking-article');
    breakingEl.innerHTML = `
        <div>
            <h3>${articles[10].title}</h3>
            <p>${articles[10].content.substring(0, 200)}...</p>
            <p><time datetime="${articles[10].date}">${articles[10].date}</time> | ${articles[10].category}</p>
        </div>
    `;
    breakingEl.querySelector('div').style.cursor = 'pointer';
    breakingEl.querySelector('div').addEventListener('click', function() {
        showArticleDetails(articles[10]);
    });
}

function updatePopularArticle() {
    let popularArticle = articles[0];
    for (let i = 1; i < articles.length; i++) {
        if (articles[i].views > popularArticle.views) {
            popularArticle = articles[i];
        }
    }
    const popularEl = document.getElementById('popular-article');
    popularEl.innerHTML = `
        <div class="card-body">
            <h3>${popularArticle.title}</h3>
            <p><time datetime="${popularArticle.date}">${popularArticle.date}</time> | ${popularArticle.category}</p>
            <p>${popularArticle.content.substring(0, 80)}...</p>
        </div>
    `;
    popularEl.querySelector('div').style.cursor = 'pointer';
    popularEl.querySelector('div').addEventListener('click', function() {
        showArticleDetails(popularArticle);
    });
}

function applyTheme(theme) {
    if (theme === 'dark') {
        isDarkMode = true;
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        document.getElementById('color-btn').textContent = 'Switch to Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        isDarkMode = false;
        document.documentElement.setAttribute('data-bs-theme', 'light');
        document.getElementById('color-btn').textContent = 'Switch to Dark Mode';
        localStorage.setItem('theme', 'light');
    }
}

function changeTheme() {
    if (isDarkMode) {
        applyTheme('light');
    } else {
        applyTheme('dark');
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
}

fetch('Articles.json')
    .then(res => res.json())
    .then(data => {
        const savedArticles = localStorage.getItem('articles');
        if (savedArticles) {
            articles = JSON.parse(savedArticles);
        } else {
            articles = data.articles;
        }
        articles.forEach(article => {
            readingTime[article.id - 1] = Math.round(article.wordCount / 200);
        })
        outputArticles(articles);
        outputBreakingArticle();
    });
 
document.addEventListener('DOMContentLoaded', initializeTheme);    
document.getElementById('unsort-btn').addEventListener('click', () => outputArticles(articles));
document.getElementById('views-sort-btn').addEventListener('click', sortByViews);
document.getElementById('date-sort-btn').addEventListener('click', sortByDate);
document.getElementById('color-btn').addEventListener('click', changeTheme);
document.getElementById('help-btn').addEventListener('click', function() {
  new bootstrap.Modal(document.getElementById('helpModal')).show();
});