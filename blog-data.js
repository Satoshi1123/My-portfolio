const blogPosts = [
    {
        date: '2026-09-11',
        title: '今週のポートフォリオを振り返って',
        summary: '投資信託を中心に、今週の資産配分と損益の変化を記録しました。数字を焦らず眺めながら、来週の方針を考えます。'
    },
    {
        date: '2026-09-04',
        title: '少しずつ分散投資を進めています',
        summary: '国内株式、投資信託、外国株式のバランスを見直しました。無理のない範囲で、長く続けられる投資を目指します。'
    },
    {
        date: '2026-08-29',
        title: '毎週記録することの大切さ',
        summary: '週末に資産状況を記録する習慣が少しずつ定着してきました。小さな変化を見つけるのが楽しみになっています。'
    }
];

const blogList = document.getElementById('blogList');

blogList.innerHTML = blogPosts.map((post) => `
    <article class="blog-post">
        <time datetime="${post.date}">${post.date.replaceAll('-', '.')}</time>
        <h2>${post.title}</h2>
        <p>${post.summary}</p>
    </article>
`).join('');
