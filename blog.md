---
layout: default
title: "部落格"
permalink: /blog/
---

<link rel="stylesheet" href="{{ '/assets/css/ali-style.css' | relative_url }}">

<!-- 頁面標題 -->
<section class="page-header">
  <div class="container">
    <h1 class="page-title">部落格</h1>
    <p class="page-subtitle">
      分享創業、個人成長、科技趨勢和生活見解的深度文章
    </p>
  </div>
</section>

<!-- 文章分類 -->
<section class="section" style="padding-top: 2rem;">
  <div class="container">
    <div style="text-align: center; margin-bottom: 2rem;">
      <div style="display: inline-flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
        <button class="btn btn-secondary" onclick="filterPosts('all')" id="filter-all">所有文章</button>
        <button class="btn btn-outline" onclick="filterPosts('startup')" id="filter-startup">🚀 創業心得</button>
        <button class="btn btn-outline" onclick="filterPosts('growth')" id="filter-growth">📈 個人成長</button>
        <button class="btn btn-outline" onclick="filterPosts('tech')" id="filter-tech">💻 科技趨勢</button>
        <button class="btn btn-outline" onclick="filterPosts('productivity')" id="filter-productivity">🎯 生產力</button>
        <button class="btn btn-outline" onclick="filterPosts('life')" id="filter-life">🌟 生活感悟</button>
      </div>
    </div>
  </div>
</section>

<!-- 文章列表 -->
<section class="section" style="padding-top: 1rem;">
  <div class="container">
    <div class="grid grid-cols-3" id="posts-container">
      {% for post in site.posts %}
      <article class="article-card post-item" data-category="all startup">
        <div class="article-image">
          {% if post.category == 'startup' %}
            🚀
          {% elsif post.category == 'growth' %}
            📈
          {% elsif post.category == 'tech' %}
            💻
          {% elsif post.category == 'productivity' %}
            🎯
          {% elsif post.category == 'life' %}
            🌟
          {% else %}
            📝
          {% endif %}
        </div>
        <div class="article-content">
          <div class="article-date">{{ post.date | date: "%Y年%m月%d日" }}</div>
          <h3 class="article-title">{{ post.title }}</h3>
          <p class="article-excerpt">{{ post.excerpt | strip_html | truncatewords: 25 }}</p>
          
          <!-- 標籤 -->
          <div style="margin-bottom: 1rem;">
            {% if post.category == 'startup' %}
              <span style="background: #fef3c7; color: #92400e; padding: 0.25rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.75rem;">創業心得</span>
            {% elsif post.category == 'growth' %}
              <span style="background: #d1fae5; color: #065f46; padding: 0.25rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.75rem;">個人成長</span>
            {% elsif post.category == 'tech' %}
              <span style="background: #dbeafe; color: #1e40af; padding: 0.25rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.75rem;">科技趨勢</span>
            {% elsif post.category == 'productivity' %}
              <span style="background: #fce7f3; color: #be185d; padding: 0.25rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.75rem;">生產力</span>
            {% elsif post.category == 'life' %}
              <span style="background: #e0e7ff; color: #5b21b6; padding: 0.25rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.75rem;">生活感悟</span>
            {% endif %}
          </div>
          
          <a href="{{ post.url }}" class="article-link">閱讀更多 →</a>
        </div>
      </article>
      {% endfor %}
      
      {% comment %}
      如果沒有足夠的文章，添加一些示例文章
      {% endcomment %}
      
      <article class="article-card post-item" data-category="all growth">
        <div class="article-image">📈</div>
        <div class="article-content">
          <div class="article-date">2024年7月22日</div>
          <h3 class="article-title">建立高效晨間例行公事的7個步驟</h3>
          <p class="article-excerpt">
            一個好的晨間例行公事能為整天奠定積極的基調。在這篇文章中，我將分享如何建立
            一個適合自己的晨間例行公事，包含具體的步驟和實用建議...
          </p>
          <div style="margin-bottom: 1rem;">
            <span style="background: #d1fae5; color: #065f46; padding: 0.25rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.75rem;">個人成長</span>
          </div>
          <a href="#" class="article-link">閱讀更多 →</a>
        </div>
      </article>
      
      <article class="article-card post-item" data-category="all startup">
        <div class="article-image">🚀</div>
        <div class="article-content">
          <div class="article-date">2024年7月21日</div>
          <h3 class="article-title">創業第一年學到的10個重要教訓</h3>
          <p class="article-excerpt">
            創業的第一年充滿了挑戰和學習。從產品開發到市場策略，從團隊建設到資金管理，
            每一個環節都有寶貴的經驗可以分享...
          </p>
          <div style="margin-bottom: 1rem;">
            <span style="background: #fef3c7; color: #92400e; padding: 0.25rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.75rem;">創業心得</span>
          </div>
          <a href="#" class="article-link">閱讀更多 →</a>
        </div>
      </article>
      
      <article class="article-card post-item" data-category="all tech">
        <div class="article-image">💻</div>
        <div class="article-content">
          <div class="article-date">2024年7月20日</div>
          <h3 class="article-title">AI工具如何改變內容創作工作流程</h3>
          <p class="article-excerpt">
            人工智能正在革命性地改變內容創作的方式。從文字生成到圖像設計，
            AI工具為創作者提供了前所未有的可能性...
          </p>
          <div style="margin-bottom: 1rem;">
            <span style="background: #dbeafe; color: #1e40af; padding: 0.25rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.75rem;">科技趨勢</span>
          </div>
          <a href="#" class="article-link">閱讀更多 →</a>
        </div>
      </article>
      
      <article class="article-card post-item" data-category="all productivity">
        <div class="article-image">🎯</div>
        <div class="article-content">
          <div class="article-date">2024年7月19日</div>
          <h3 class="article-title">深度工作：在分心時代保持專注的策略</h3>
          <p class="article-excerpt">
            在充滿干擾的數位時代，能夠深度專注已經成為一種稀有且珍貴的能力。
            本文分享實用的策略來培養深度工作的能力...
          </p>
          <div style="margin-bottom: 1rem;">
            <span style="background: #fce7f3; color: #be185d; padding: 0.25rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.75rem;">生產力</span>
          </div>
          <a href="#" class="article-link">閱讀更多 →</a>
        </div>
      </article>
      
      <article class="article-card post-item" data-category="all life">
        <div class="article-image">🌟</div>
        <div class="article-content">
          <div class="article-date">2024年7月18日</div>
          <h3 class="article-title">平衡工作與生活：創業者的實用指南</h3>
          <p class="article-excerpt">
            創業者往往面臨工作與生活平衡的挑戰。如何在追求事業成功的同時，
            維持健康的生活方式和人際關係？...
          </p>
          <div style="margin-bottom: 1rem;">
            <span style="background: #e0e7ff; color: #5b21b6; padding: 0.25rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.75rem;">生活感悟</span>
          </div>
          <a href="#" class="article-link">閱讀更多 →</a>
        </div>
      </article>
      
      <article class="article-card post-item" data-category="all growth">
        <div class="article-image">📈</div>
        <div class="article-content">
          <div class="article-date">2024年7月17日</div>
          <h3 class="article-title">成長型思維：從固定思維到成長思維的轉變</h3>
          <p class="article-excerpt">
            成長型思維是個人發展的關鍵。了解如何從固定思維模式轉變為成長思維，
            將幫助你在面對挑戰時更有韌性...
          </p>
          <div style="margin-bottom: 1rem;">
            <span style="background: #d1fae5; color: #065f46; padding: 0.25rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.75rem;">個人成長</span>
          </div>
          <a href="#" class="article-link">閱讀更多 →</a>
        </div>
      </article>
    </div>
    
    <!-- 載入更多按鈕 -->
    <div class="text-center" style="margin-top: 3rem;">
      <button class="btn btn-outline" onclick="loadMorePosts()">載入更多文章</button>
    </div>
  </div>
</section>

<!-- 訂閱電子報 -->
<section class="newsletter-section">
  <div class="container">
    <div class="newsletter-content">
      <h2>不要錯過任何新文章</h2>
      <p>訂閱我的電子報，每週收到最新的深度文章和見解</p>
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

<script>
// 文章篩選功能
function filterPosts(category) {
  const posts = document.querySelectorAll('.post-item');
  const buttons = document.querySelectorAll('[id^="filter-"]');
  
  // 重置所有按鈕樣式
  buttons.forEach(btn => {
    btn.className = 'btn btn-outline';
  });
  
  // 設定當前按鈕樣式
  document.getElementById(`filter-${category}`).className = 'btn btn-secondary';
  
  // 顯示/隱藏文章
  posts.forEach(post => {
    if (category === 'all' || post.dataset.category.includes(category)) {
      post.style.display = 'block';
      post.style.animation = 'fadeInUp 0.5s ease-out';
    } else {
      post.style.display = 'none';
    }
  });
}

// 載入更多文章功能
function loadMorePosts() {
  // 這裡可以實現 AJAX 載入更多文章的功能
  alert('載入更多文章功能可以通過 AJAX 實現');
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  // 預設顯示所有文章
  filterPosts('all');
  
  // 添加滾動動畫
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
      }
    });
  });
  
  document.querySelectorAll('.article-card').forEach(card => {
    observer.observe(card);
  });
});
</script>