const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    /* GET SEARCH VALUE */
    const searchTerm = searchInput.value;
    /* GET SORT VALUE */
    const sortBy = document.querySelector('input[name="sortby"]:checked').value;
    /* GET LIMIT VALUE */
    const searchLimit = document.getElementById('limit').value;

    /* VALIDATE INPUT */
    if (searchTerm === '') {
        showMessage('Please add a search term.', 'alert-danger');
    }
    /* CLEAR TEXT INPUT */
    searchInput.value = '';

    /* SEARCH REDDIT */
    search(searchTerm, searchLimit, sortBy)
        .then(res => {
            let output = '<div class="card-columns">';
            res.forEach(post => {
                const image = post.preview ? post.preview.images[0].source.url : 'https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg';

                output += `
                <div class="card">
                    <img class="card-img-top" src="${image}">
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${truncateText(post.selftext, 100)}</p>
                        <a href="${post.url}" target="_blank" class="btn btn-primary">Read More</a>
                        <hr>
                        <span class="badge badge-dark">Subreddit: ${post.subreddit}</span>
                        <span class="badge badge-dark">Score: ${post.score}</span>
                    </div>
                </div>
                `;
            });
            output += '</div>';
            document.getElementById('results').innerHTML = output;
        });
});

function showMessage(message, className) {

    /* CREATE ALERT ELEMENT */
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));

    /* DISPLAY ALERT ELEMENT */
    const searchContainer = document.getElementById('search-container');
    const search = document.getElementById('search');
    searchContainer.insertBefore(div, search);

    /* REMOVE ALERT ELEMENT */
    setTimeout(() => document.querySelector('.alert').remove(), 2000);
}

/* TRUNCATE TEXT */
function truncateText(text, limit) {
    const shortened = text.indexOf(' ', limit);
    if (shortened == -1) return text;
    return text.substring(0, shortened);
}

function search(searchTerm, searchLimit, sortBy) {
    return fetch(`https://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`)
        .then(res => res.json())
        .then(data => data.data.children.map(data => data.data))
        .catch(err => console.log(err));
}