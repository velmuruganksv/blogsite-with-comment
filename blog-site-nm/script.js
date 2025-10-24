const CONTENT_AREA = document.getElementById('main-content');
const UPLOAD_MODAL = document.getElementById('upload-modal');
const BLOG_UPLOAD_FORM = document.getElementById('blog-upload-form');
const CURRENT_YEAR = document.getElementById('current-year');
if (CURRENT_YEAR) {
    CURRENT_YEAR.textContent = new Date().getFullYear();
}
let currentState = {
    page: 'home',
    selectedBlogId: null
};
const BLOGS_KEY = 'evPulseBlogs';
const COMMENTS_KEY_PREFIX = 'evPulseComments_';
const initialBlogs = [
    { 
        id: 1, 
        title: "The Future is Silent: Why EVs Are Taking Over", 
        summary: "A deep dive into the environmental and economic benefits of switching to electric vehicles. Understand the charging infrastructure and long-term cost savings.",
        content: "Electric vehicles (EVs) represent one of the most significant shifts in transportation technology in a century. Beyond the immediate benefit of reducing tailpipe emissions, EVs offer a significantly lower running cost due to cheaper 'fuel' (electricity) and reduced maintenance requirements. The quiet, smooth ride of an EV, powered by instantly available torque, redefines the driving experience. We explore the rapid advancements in battery technology, which are now providing ranges competitive with internal combustion engine (ICE) cars, alleviating range anxiety for most daily drivers. Furthermore, the global infrastructure for charging is expanding at an exponential rate, making long-distance travel increasingly viable.",
        imageUrl: "https://placehold.co/600x400/1e40af/ffffff?text=Charging+Station",
        author: "EV Analyst"
    },
    { 
        id: 2, 
        title: "Battery Breakthroughs: What's Next for EV Range?", 
        summary: "Exploring solid-state batteries, improved energy density, and the quest for 500+ mile range on a single charge. The evolution of EV power.",
        content: "Battery technology is the heart of the EV revolution. The current standard, Lithium-ion, is continuously improving, but researchers are actively pursuing next-generation solutions like solid-state batteries. Solid-state technology promises higher energy density, faster charging times, and crucially, enhanced safety due to the non-flammable nature of the solid electrolyte. If successful, these breakthroughs could push the typical EV range well beyond 500 miles, completely eliminating range anxiety and accelerating mass adoption globally. Thermal management systems are also becoming more sophisticated, ensuring optimal battery health and longevity in varied climates.",
        imageUrl: "https://placehold.co/600x400/059669/ffffff?text=Solid+State+Battery",
        author: "Tech Insider"
    },
    { 
        id: 3, 
        title: "EV Maintenance Myths Debunked", 
        summary: "Fewer moving parts means less hassle. We break down what true EV maintenance looks like compared to traditional cars.",
        content: "One of the most appealing aspects of owning an EV is the drastically reduced maintenance schedule. Forget oil changes, transmission flushes, and complex exhaust systems. EV maintenance primarily focuses on tires, brakes (which last longer due to regenerative braking), and cabin air filters. This simplicity translates to significant savings over the vehicle's lifetime. However, it's still crucial to monitor battery health and cooling systems, though these are typically managed automatically by the vehicle's sophisticated electronics.",
        imageUrl: "https://placehold.co/600x400/c2410c/ffffff?text=EV+Maintenance",
        author: "Mechanic Mike"
    }
];

function loadBlogs() {
    try {
        const storedBlogs = localStorage.getItem(BLOGS_KEY);
        if (storedBlogs) {
            return JSON.parse(storedBlogs);
        }
        saveBlogs(initialBlogs);
        return initialBlogs;
    } catch (e) {
        console.error("Error loading blogs from localStorage:", e);
        return initialBlogs; // Fallback to initial if localStorage fails
    }
}

function saveBlogs(blogs) {
    try {
        localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
    } catch (e) {
        console.error("Error saving blogs to localStorage:", e);
    }
}

function loadComments(blogId) {
    try {
        const commentsKey = COMMENTS_KEY_PREFIX + blogId;
        const storedComments = localStorage.getItem(commentsKey);
        return storedComments ? JSON.parse(storedComments) : [];
    } catch (e) {
        console.error("Error loading comments from localStorage:", e);
        return [];
    }
}

function saveComments(blogId, comments) {
    try {
        const commentsKey = COMMENTS_KEY_PREFIX + blogId;
        localStorage.setItem(commentsKey, JSON.stringify(comments));
    } catch (e) {
        console.error("Error saving comments to localStorage:", e);
    }
}

function renderHome() {
    const blogs = loadBlogs();
    let html = `
        <h2 class="text-4xl font-extrabold text-gray-800 mb-8 text-center sm:text-left">Latest EV Insights</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    `;
    if (blogs.length === 0) {
        html += `<p class="col-span-3 text-center text-gray-500 text-lg py-12">No blogs posted yet. Be the first!</p>`;
    } else {
        blogs.slice().reverse().forEach(blog => {
            html += `
                <div class="bg-white rounded-xl overflow-hidden card-shadow flex flex-col">
                    <img src="${blog.imageUrl}" alt="${blog.title}" 
                        class="w-full h-48 object-cover object-center" 
                        onerror="this.onerror=null; this.src='https://placehold.co/600x400/94a3b8/ffffff?text=Image+Unavailable';"
                    >
                    <div class="p-6 flex-grow flex flex-col">
                        <h3 class="text-xl font-bold text-gray-900 mb-2">${blog.title}</h3>
                        <p class="text-gray-600 text-sm mb-4 flex-grow">${blog.summary}</p>
                        <button onclick="navigate('detail', ${blog.id})"
                            class="mt-4 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md">
                            Read More
                        </button>
                    </div>
                </div>
            `;
        });
    }
    html += `</div>`;
    CONTENT_AREA.innerHTML = html;
}

function renderDetail(blogId) {
    const blogs = loadBlogs();
    const blog = blogs.find(b => b.id === blogId);
    if (!blog) {
        CONTENT_AREA.innerHTML = `<p class="text-center text-red-500 py-12">Error: Blog not found!</p>`;
        return;
    }
    const comments = loadComments(blogId);
    const escapeHTML = (str) => str.replace(/[&<>"']/g, (m) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[m]));
    const safeContent = escapeHTML(blog.content).replace(/\n/g, '<br>');
    let html = `
        <article class="bg-white p-6 sm:p-10 rounded-xl shadow-xl">
            <button onclick="navigate('home')" class="text-blue-600 hover:text-blue-800 font-semibold mb-4 flex items-center transition duration-300">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Home
            </button>
            <img src="${blog.imageUrl}" alt="${blog.title}" 
                class="w-full h-auto max-h-96 object-cover rounded-lg mb-6 shadow-md"
                onerror="this.onerror=null; this.src='https://placehold.co/800x400/94a3b8/ffffff?text=Image+Unavailable';">
            <h2 class="text-4xl font-extrabold text-gray-900 mb-3">${blog.title}</h2>
            <p class="text-sm text-gray-500 mb-8 border-b pb-4">By: ${blog.author || 'Anonymous Contributor'}</p>
            <div class="prose max-w-none text-lg text-gray-700 leading-relaxed">
                ${safeContent}
            </div>
        </article>
        <!-- Comment Section -->
        <section class="mt-12 bg-white p-6 sm:p-10 rounded-xl shadow-xl">
            <h3 class="text-3xl font-bold text-gray-800 mb-6">Comments (${comments.length})</h3>
            <!-- Comment Input Form -->
            <form id="comment-form" class="mb-8 p-4 border border-gray-200 rounded-lg">
                <input type="hidden" name="blogId" value="${blogId}">
                <div class="mb-4">
                    <label for="comment-author" class="block text-sm font-medium text-gray-700">Your Name</label>
                    <input type="text" id="comment-author" name="author" placeholder="Anonymous"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div class="mb-4">
                    <label for="comment-text" class="block text-sm font-medium text-gray-700">Your Comment</label>
                    <textarea id="comment-text" name="text" rows="4" required placeholder="Share your thoughts..."
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>
                <button type="submit" class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                    Post Comment
                </button>
            </form>
            <!-- Existing Comments List -->
            <div id="comments-list" class="space-y-6">
    `;
    if (comments.length === 0) {
        html += `<p class="text-gray-500 italic text-center">No comments yet. Be the first to start a discussion!</p>`;
    } else {
        comments.slice().reverse().forEach(comment => {
            const safeCommentText = escapeHTML(comment.text).replace(/\n/g, '<br>');
            const safeAuthor = escapeHTML(comment.author);
            html += `
                <div class="border-t border-gray-100 pt-4">
                    <p class="text-gray-800 mb-2">${safeCommentText}</p>
                    <p class="text-xs text-gray-500">
                        — <strong>${safeAuthor}</strong> on ${new Date(comment.timestamp).toLocaleDateString()}
                    </p>
                </div>
            `;
        });
    }
    html += `
            </div>
        </section>
    `;
    CONTENT_AREA.innerHTML = html;
    document.getElementById('comment-form')?.addEventListener('submit', handleCommentSubmission);
}

window.navigate = function(page, id = null) {
    currentState.page = page;
    currentState.selectedBlogId = id;
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on navigation
    renderPage();
}
function renderPage() {
    if (currentState.page === 'home') {
        renderHome();
    } else if (currentState.page === 'detail' && currentState.selectedBlogId !== null) {
        renderDetail(currentState.selectedBlogId);
    }
}
function showUploadModal() {
    UPLOAD_MODAL?.classList.remove('hidden');
}

function hideUploadModal() {
    UPLOAD_MODAL?.classList.add('hidden');
    BLOG_UPLOAD_FORM?.reset(); // Clear form on close
}

function handleBlogSubmission(event) {
    event.preventDefault();
    const form = event.target;
    const title = form.elements['blog-title'].value.trim();
    const summary = form.elements['blog-summary'].value.trim();
    const content = form.elements['blog-content'].value.trim();
    let imageUrl = form.elements['blog-image-url'].value.trim() || `https://placehold.co/600x400/4f46e5/ffffff?text=${title.substring(0, 15).replace(/\s/g, '+')}`;
    if (!title || !summary || !content) {
        return; 
    }
    const blogs = loadBlogs();
    const newId = blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1;
    const newBlog = {
        id: newId,
        title: title,
        summary: summary,
        content: content,
        imageUrl: imageUrl,
        author: "Community Contributor"
    };
    blogs.push(newBlog);
    saveBlogs(blogs);
    hideUploadModal();
    navigate('home'); // Go to home page to see the new blog
}

function handleCommentSubmission(event) {
    event.preventDefault();
    const form = event.target;
    const blogId = parseInt(form.elements['blogId'].value);
    const author = form.elements['author'].value.trim() || 'Anonymous';
    const text = form.elements['text'].value.trim();
    if (!text) return;
    const comments = loadComments(blogId);
    const newComment = {
        author: author,
        text: text,
        timestamp: Date.now()
    };
    comments.push(newComment);
    saveComments(blogId, comments);
    form.reset(); // Clear form
    renderDetail(blogId);
}
document.addEventListener('DOMContentLoaded', () => {
    renderPage();
    document.getElementById('uploadButton')?.addEventListener('click', showUploadModal);
    document.getElementById('close-modal-btn')?.addEventListener('click', hideUploadModal);
    UPLOAD_MODAL?.addEventListener('click', (e) => {
        if (e.target === UPLOAD_MODAL) {
            hideUploadModal();
        }
    });
    BLOG_UPLOAD_FORM?.addEventListener('submit', handleBlogSubmission);
});
const API_KEY = "API - KEY"; 
const NEWS_API_URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=electric%20vehicle&language=en&country=in`;

fetch(NEWS_API_URL)
  .then(response => response.json())
  .then(data => {
    const evScroll = document.getElementById("ev-news-scroll");
    if (evScroll && data.results) {
      const evNews = data.results
        .filter(item => item.title && item.link)
        .map(item => {
          return `<a href="${item.link}" target="_blank" 
                    class="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg mx-2 hover:bg-blue-200 transition">
                    ⚡ ${item.title}
                  </a>`;
        })
        .join('');

      evScroll.innerHTML = evNews;
    }
  })
  .catch(error => console.error("Error loading EV news:", error));

