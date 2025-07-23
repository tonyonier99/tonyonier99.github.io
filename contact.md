---
layout: default
title: "聯絡我"
permalink: /contact/
---

<link rel="stylesheet" href="{{ '/assets/css/ali-style.css' | relative_url }}">

<!-- 頁面標題 -->
<section class="page-header">
  <div class="container">
    <h1 class="page-title">聯絡我</h1>
    <p class="page-subtitle">
      有任何問題、合作機會或想法分享？我很樂意與您交流
    </p>
  </div>
</section>

<!-- 聯絡方式和表單 -->
<section class="section">
  <div class="container">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start;">
      <!-- 聯絡資訊 -->
      <div>
        <h2 style="font-size: 1.75rem; margin-bottom: 1.5rem; color: var(--text-primary);">讓我們開始對話</h2>
        <p style="font-size: 1.125rem; color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">
          無論您是想要合作、諮詢，或只是想聊聊創業和個人成長的話題，
          我都很樂意與您交流。請選擇最適合的聯絡方式。
        </p>
        
        <!-- 聯絡選項 -->
        <div class="space-y-4" style="margin-bottom: 2rem;">
          <div class="card">
            <div class="card-body">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="width: 48px; height: 48px; background: var(--primary-orange); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.25rem;">
                  📧
                </div>
                <div>
                  <h3 style="margin-bottom: 0.25rem; font-size: 1.125rem;">電子郵件</h3>
                  <p style="color: var(--text-secondary); margin: 0;">your.email@example.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-body">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="width: 48px; height: 48px; background: #0077b5; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.25rem;">
                  💼
                </div>
                <div>
                  <h3 style="margin-bottom: 0.25rem; font-size: 1.125rem;">LinkedIn</h3>
                  <p style="color: var(--text-secondary); margin: 0;">專業網絡和商業合作</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-body">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="width: 48px; height: 48px; background: #1da1f2; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.25rem;">
                  🐦
                </div>
                <div>
                  <h3 style="margin-bottom: 0.25rem; font-size: 1.125rem;">Twitter</h3>
                  <p style="color: var(--text-secondary); margin: 0;">即時交流和想法分享</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 回應時間 -->
        <div class="card" style="background-color: var(--light-background);">
          <div class="card-body">
            <h4 style="margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
              ⏰ 回應時間
            </h4>
            <ul style="color: var(--text-secondary); margin: 0; padding-left: 1.25rem;">
              <li>電子郵件：24-48 小時內</li>
              <li>社群媒體：當天回覆</li>
              <li>聯絡表單：2-3 個工作天</li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- 聯絡表單 -->
      <div>
        <div class="card">
          <div class="card-header">
            <h3 style="margin: 0; font-size: 1.25rem;">發送訊息</h3>
          </div>
          <div class="card-body">
            <form action="#" method="post" style="space-y: 1.5rem;">
              <div style="margin-bottom: 1.5rem;">
                <label for="name" style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-primary);">
                  姓名 *
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required
                  style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-md); font-size: 1rem;"
                  placeholder="請輸入您的姓名"
                >
              </div>
              
              <div style="margin-bottom: 1.5rem;">
                <label for="email" style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-primary);">
                  電子郵件 *
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required
                  style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-md); font-size: 1rem;"
                  placeholder="your@email.com"
                >
              </div>
              
              <div style="margin-bottom: 1.5rem;">
                <label for="subject" style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-primary);">
                  主旨 *
                </label>
                <select 
                  id="subject" 
                  name="subject" 
                  required
                  style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-md); font-size: 1rem; background-color: white;"
                >
                  <option value="">請選擇主旨</option>
                  <option value="collaboration">商業合作</option>
                  <option value="consultation">諮詢服務</option>
                  <option value="speaking">演講邀請</option>
                  <option value="interview">媒體採訪</option>
                  <option value="feedback">網站回饋</option>
                  <option value="other">其他</option>
                </select>
              </div>
              
              <div style="margin-bottom: 1.5rem;">
                <label for="message" style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-primary);">
                  訊息內容 *
                </label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="6" 
                  required
                  style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-md); font-size: 1rem; resize: vertical;"
                  placeholder="請詳細描述您想要討論的內容..."
                ></textarea>
              </div>
              
              <div style="margin-bottom: 1.5rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
                  <input type="checkbox" required style="margin: 0;">
                  我同意收到回覆郵件，並了解我的資料將依照隱私政策處理
                </label>
              </div>
              
              <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.875rem;">
                發送訊息
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 其他聯絡方式 -->
<section class="section" style="background-color: var(--light-background);">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">其他聯絡方式</h2>
      <p class="section-subtitle">
        選擇最適合您的方式與我保持聯繫
      </p>
    </div>
    
    <div class="grid grid-cols-3">
      <!-- 社群媒體 -->
      <div class="card">
        <div class="card-body">
          <div style="text-align: center;">
            <div style="width: 64px; height: 64px; background: linear-gradient(135deg, var(--primary-orange) 0%, #ff8f65 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; margin: 0 auto 1rem;">
              📱
            </div>
            <h3 style="margin-bottom: 0.75rem;">社群媒體</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.5;">
              在社群平台上關注我，獲得最新動態和即時互動
            </p>
            <div style="display: flex; gap: 0.75rem; justify-content: center;">
              <a href="https://twitter.com/your_handle" class="btn btn-outline" style="padding: 0.5rem;" target="_blank">Twitter</a>
              <a href="https://linkedin.com/in/your-profile" class="btn btn-outline" style="padding: 0.5rem;" target="_blank">LinkedIn</a>
              <a href="https://instagram.com/your_handle" class="btn btn-outline" style="padding: 0.5rem;" target="_blank">Instagram</a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 電子報 -->
      <div class="card">
        <div class="card-body">
          <div style="text-align: center;">
            <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; margin: 0 auto 1rem;">
              📬
            </div>
            <h3 style="margin-bottom: 0.75rem;">電子報</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.5;">
              訂閱我的電子報，每週收到深度內容和獨家見解
            </p>
            <a href="#newsletter" class="btn btn-primary">立即訂閱</a>
          </div>
        </div>
      </div>
      
      <!-- YouTube -->
      <div class="card">
        <div class="card-body">
          <div style="text-align: center;">
            <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; margin: 0 auto 1rem;">
              🎥
            </div>
            <h3 style="margin-bottom: 0.75rem;">YouTube 頻道</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.5;">
              訂閱我的 YouTube 頻道，觀看深度影片內容
            </p>
            <a href="https://youtube.com/@yourchannel" class="btn btn-primary" target="_blank">訂閱頻道</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section">
  <div class="container-sm">
    <div class="section-header">
      <h2 class="section-title">常見問題</h2>
    </div>
    
    <div style="max-width: 700px; margin: 0 auto;">
      <div class="card mb-4">
        <div class="card-body">
          <h4 style="margin-bottom: 0.75rem;">您通常多久回覆一次郵件？</h4>
          <p style="color: var(--text-secondary); margin: 0; line-height: 1.5;">
            我努力在 24-48 小時內回覆所有郵件。如果是緊急事務，建議透過社群媒體私訊聯繫。
          </p>
        </div>
      </div>
      
      <div class="card mb-4">
        <div class="card-body">
          <h4 style="margin-bottom: 0.75rem;">我可以邀請您來演講嗎？</h4>
          <p style="color: var(--text-secondary); margin: 0; line-height: 1.5;">
            當然可以！請透過聯絡表單說明活動詳情、日期、地點和主題要求，我會盡快回覆。
          </p>
        </div>
      </div>
      
      <div class="card mb-4">
        <div class="card-body">
          <h4 style="margin-bottom: 0.75rem;">您提供一對一諮詢服務嗎？</h4>
          <p style="color: var(--text-secondary); margin: 0; line-height: 1.5;">
            是的，我提供有限的一對一諮詢服務。請透過郵件說明您的需求，我會提供相關資訊。
          </p>
        </div>
      </div>
      
      <div class="card mb-4">
        <div class="card-body">
          <h4 style="margin-bottom: 0.75rem;">如何與您合作或邀請您參與專案？</h4>
          <p style="color: var(--text-secondary); margin: 0; line-height: 1.5;">
            請透過聯絡表單詳細說明合作內容、時程和期望，我會評估並盡快回覆。
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<script>
// 表單處理
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 這裡可以添加實際的表單提交邏輯
    alert('感謝您的訊息！我會盡快回覆您。');
    
    // 重置表單
    form.reset();
  });
  
  // 表單驗證
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (!this.value.trim()) {
        this.style.borderColor = '#ef4444';
      } else {
        this.style.borderColor = 'var(--border-light)';
      }
    });
  });
});
</script>