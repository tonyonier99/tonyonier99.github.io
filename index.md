---
layout: default
title: "創業家、內容創作者與專業領域專家"
---

<link rel="stylesheet" href="{{ '/assets/css/ali-style.css' | relative_url }}">

<!-- Hero Section -->
<section class="hero">
  <div class="container">
    <div class="hero-content">
      <div class="hero-text">
        <h1>哈囉，我是 Tony</h1>
        <p class="tagline">創業家、內容創作者與專業領域專家</p>
        <p class="description">
          我致力於透過創新思維和實際行動，為世界帶來正面的改變。通過分享知識、經驗和洞察，
          幫助更多人實現他們的夢想，建立一個更美好的未來。
        </p>
        <div class="flex gap-4">
          <a href="#newsletter" class="btn btn-primary">訂閱電子報</a>
          <a href="/about/" class="btn btn-secondary">了解更多</a>
        </div>
      </div>
      <div class="hero-image">
        <img src="https://via.placeholder.com/240x240/ff6b35/ffffff?text=TONY" alt="Tony 的照片">
      </div>
    </div>
  </div>
</section>

<!-- 統計數據區塊 -->
<section class="stats-section">
  <div class="container">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">50+</div>
        <div class="stat-label">發表文章</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">10K+</div>
        <div class="stat-label">社群追蹤者</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">5+</div>
        <div class="stat-label">成功專案</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">3+</div>
        <div class="stat-label">年經驗</div>
      </div>
    </div>
  </div>
</section>

<!-- 最新文章區塊 -->
<section class="section featured-content">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">最新文章</h2>
      <p class="section-subtitle">
        探索創業、個人成長、科技趨勢和生活見解的最新想法
      </p>
    </div>
    
    <div class="grid grid-cols-3">
      {% for post in site.posts limit:6 %}
      <article class="article-card">
        <div class="article-image">
          📝
        </div>
        <div class="article-content">
          <div class="article-date">{{ post.date | date: "%Y年%m月%d日" }}</div>
          <h3 class="article-title">{{ post.title }}</h3>
          <p class="article-excerpt">{{ post.excerpt | strip_html | truncatewords: 20 }}</p>
          <a href="{{ post.url }}" class="article-link">閱讀更多 →</a>
        </div>
      </article>
      {% endfor %}
    </div>
    
    <div class="text-center mt-8">
      <a href="/blog/" class="btn btn-outline">查看所有文章</a>
    </div>
  </div>
</section>

<!-- 電子報訂閱區塊 -->
<section class="newsletter-section" id="newsletter">
  <div class="container">
    <div class="newsletter-content">
      <h2>加入我的電子報</h2>
      <p>每週收到關於創業、個人成長和生產力的深度見解</p>
      <form class="newsletter-form" action="#" method="post">
        <input type="email" class="newsletter-input" placeholder="輸入您的電子郵件" required>
        <button type="submit" class="newsletter-button">立即訂閱</button>
      </form>
      <p style="font-size: 0.875rem; opacity: 0.8; margin-top: 1rem;">
        已有 <strong>5,000+</strong> 人訂閱 • 隨時可取消訂閱
      </p>
    </div>
  </div>
</section>

<!-- 課程展示區塊 -->
<section class="section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">精選課程</h2>
      <p class="section-subtitle">
        深度學習課程，幫助您在創業和個人發展路上更進一步
      </p>
    </div>
    
    <div class="grid grid-cols-2">
      <div class="course-card">
        <div class="course-image">
          🚀 創業基礎
        </div>
        <div class="course-body">
          <h3 class="course-title">創業從0到1完整指南</h3>
          <p class="course-description">
            從想法驗證到產品上市，學習完整的創業流程和關鍵策略
          </p>
          <div class="course-meta">
            <span class="course-price">NT$ 2,999</span>
            <span class="course-students">150+ 學員</span>
          </div>
          <a href="/courses/" class="btn btn-primary">了解更多</a>
        </div>
      </div>
      
      <div class="course-card">
        <div class="course-image">
          💡 個人品牌
        </div>
        <div class="course-body">
          <h3 class="course-title">打造個人品牌影響力</h3>
          <p class="course-description">
            學習如何建立強大的個人品牌，在數位時代脫穎而出
          </p>
          <div class="course-meta">
            <span class="course-price">NT$ 1,999</span>
            <span class="course-students">200+ 學員</span>
          </div>
          <a href="/courses/" class="btn btn-primary">了解更多</a>
        </div>
      </div>
    </div>
    
    <div class="text-center mt-8">
      <a href="/courses/" class="btn btn-outline">查看所有課程</a>
    </div>
  </div>
</section>

<!-- YouTube 頻道區塊 -->
<section class="youtube-section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title" style="color: var(--text-primary);">YouTube 頻道</h2>
      <p class="section-subtitle">
        訂閱我的頻道，獲得最新的創業見解和實用建議
      </p>
    </div>
    
    <div class="youtube-embed">
      <iframe 
        src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
        title="YouTube video player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>
    
    <div class="youtube-cta">
      <a href="https://youtube.com/@yourchannel" class="btn btn-primary" target="_blank">
        訂閱 YouTube 頻道
      </a>
    </div>
  </div>
</section>

<script>
// 簡單的滾動動畫
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.article-card, .course-card, .stat-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
      }
    });
  });
  
  cards.forEach(card => {
    observer.observe(card);
  });
});
</script>