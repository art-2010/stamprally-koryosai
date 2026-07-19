// 【設定】スポットごとの個別のパスワード
const SPOT_PASSWORDS = {
    spot1:  'apple',
    spot2:  'banana',
    spot3:  'cherry',
    spot4:  'durian',
    spot5:  'elderberry',
    spot6:  'fig',
    spot7:  'grape',
    spot8:  'honeydew',
    spot9:  'island',
    spot10: 'jackfruit',
    spot11: 'kiwi',
    spot12: 'lemon',
    spot13: 'mango',
    spot14: 'Akatsuki' // 14個目の隠しスポット用
};

const BEFORE_IMAGES = {
    spot1: 'stamp1/karuta-stamp1.gif',
    spot2: 'stamp1/life-stamp1.gif',
    spot3: 'stamp1/photo-stamp1.gif',
    spot4: 'stamp1/flower-stamp1.gif',
    spot5: 'stamp1/dance-stamp1.gif',
    spot6: 'stamp1/tea-stamp1.gif',
    spot7: 'stamp1/JRC-stamp1.gif',
    spot8: 'stamp1/science-stamp1.gif',
    spot9: 'stamp1/mountain-stamp1.gif',
    spot10: 'stamp1/PC-stamp1.gif',
    spot11: 'stamp1/art-stamp1.gif',
    spot12: 'stamp1/book-stamp1.gif',
    spot13: 'stamp1/font-stamp1.gif',
};

const AFTER_IMAGES = {
    spot1: 'stamp2/karuta-stamp2.gif',
    spot2: 'stamp2/life-stamp2.gif',
    spot3: 'stamp2/photo-stamp2.gif',
    spot4: 'stamp2/flower-stamp2.gif',
    spot5: 'stamp2/dance-stamp2.gif',
    spot6: 'stamp2/tea-stamp2.gif',
    spot7: 'stamp2/JRC-stamp2.gif',
    spot8: 'stamp2/science-stamp2.gif',
    spot9: 'stamp2/mountain-stamp2.gif',
    spot10: 'stamp2/PC-stamp2.gif',
    spot11: 'stamp2/art-stamp2.gif',
    spot12: 'stamp2/book-stamp2.gif',
    spot13: 'stamp2/font-stamp2.gif',
    spot14: 'stamp2/akatsuki-stamp2.gif' // 完全クリア時に中央に表示するGIF
};

const TOTAL_SPOTS = 13;
const spots = Array.from({ length: TOTAL_SPOTS }, (_, i) => `spot${i + 1}`);

// 現在認証中のスポットIDを一時保存する変数
let currentAuthenticatingSpot = null;

window.onload = function() {
    createCircleLayout();
    
    // 通常の13個のスタンプ状態を復元
    spots.forEach(spotId => {
        if (localStorage.getItem(spotId) === 'done') {
            applyStampStyles(spotId, false);
        }
    });

    // ページ読み込み時に状態を正しく反映する
    updateCenterDisplay();
    checkCompletion(false);
};

// 円形レイアウトの生成
function createCircleLayout() {
    const container = document.getElementById('circle-container');
    if (!container) {
        console.error("エラー: 'circle-container' が見つかりません。HTMLのid属性を確認してください。");
        return;
    }
    
    const radius = 225;  // スタンプ間の距離（半径）
    const centerX = 225; // 中心座標
    const centerY = 225; // 中心座標

    spots.forEach((spotId, index) => {
        const angle = (index * (2 * Math.PI / TOTAL_SPOTS)) - (Math.PI / 2);
        
        const x = centerX + radius * Math.cos(angle) - 40;
        const y = centerY + radius * Math.sin(angle) - 40;

        const btn = document.createElement('button');
        btn.id = spotId;
        btn.className = `absolute w-20 h-20 rounded-full text-sm font-mono font-medium text-zinc-400 flex items-center justify-center shadow-lg transition-all duration-500 hover:border-zinc-500 z-20`;
        btn.style.left = `${x}px`;
        btn.style.top = `${y}px`;
        btn.innerHTML = `
         <img src="${BEFORE_IMAGES[spotId]}"
          class="w-full h-full object-cover rounded-full pointer-events-none">
        `;
        
        btn.onclick = () => checkPasswordModal(spotId);
        container.appendChild(btn);
    });
}

// デザインを変更する関数
function applyStampStyles(spotId, playEffect) {
    const btn = document.getElementById(spotId);
    if (!btn) return;

    if (spotId === 'spot14') {
        // spot14クリア時は中央の要素全体をGIFにするため、ここでは処理をスキップ
    } else {
        btn.innerHTML = `
         <img src="${AFTER_IMAGES[spotId]}"
              class="w-full h-full object-cover rounded-full pointer-events-none">
        `;
        btn.disabled = true;
        btn.classList.remove('bg-zinc-900', 'border-zinc-800', 'text-zinc-400', 'hover:border-zinc-500');
        btn.classList.add('bg-cyan-500', 'border-cyan-400', 'text-zinc-950', 'font-bold', 'shadow-[0_0_12px_rgba(6,182,212,0.5)]', 'cursor-not-allowed');
    }

    if (playEffect) {
        confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 }, colors: ['#06b6d4', '#ffffff'] });
    }
}

// 中央のカウント表示と、14個目の出現コントロール
function updateCenterDisplay() {
    const clearedCount = spots.filter(spotId => localStorage.getItem(spotId) === 'done').length;
    const centerDisplay = document.getElementById('center-display');
    const iconDisplay = document.getElementById('center-icon');
    const textDisplay = document.getElementById('center-text');
    const spot14 = document.getElementById('spot14');
    
    if (!centerDisplay || !iconDisplay || !textDisplay || !spot14) return;

    // 14番目がすでにクリアされている場合は、この関数での上書きを避ける（checkCompletionに任せる）
    if (localStorage.getItem('spot14') === 'done') return;

    // 1. 通常時（1〜12個クリアの間）
    if (clearedCount < TOTAL_SPOTS) {
        iconDisplay.innerText = 'LOCKED';
        textDisplay.innerText = `${clearedCount} / ${TOTAL_SPOTS}`;
        iconDisplay.classList.remove('text-cyan-400');
        textDisplay.classList.remove('text-cyan-400', 'mb-1');
        spot14.classList.add('hidden', 'opacity-0', 'scale-75');
    } 
    // 2. 13個集まった瞬間（★GIFは表示せず、文字をUNLOCKEDにしてボタンだけを出す）
    else if (clearedCount === TOTAL_SPOTS) {
        iconDisplay.innerText = '';
        textDisplay.innerText = '';
        textDisplay.classList.add('text-cyan-400', 'mb-12');

        spot14.style.position = 'absolute';
        spot14.style.top = '202px';   // 上からの位置（数字を大きくすると下に下がる）
        spot14.style.left = '176px';   // 左からの位置（数字を大きくすると右にズレる）
        
        spot14.classList.remove('hidden');
        setTimeout(() => {
            spot14.classList.remove('opacity-0', 'scale-75');
            spot14.classList.add('opacity-100', 'scale-100');
        }, 50);
    }
}

// 全て集まったか判定（完全クリア処理）
function checkCompletion(playEffect) {
    const normalCleared = spots.every(spotId => localStorage.getItem(spotId) === 'done');
    const finalCleared = localStorage.getItem('spot14') === 'done';
    
    if (normalCleared && finalCleared) {
        const centerDisplay = document.getElementById('center-display');
        const clearMessage = document.getElementById('clear-message');

        if (centerDisplay) {
            // ★14番目もクリアした「完全クリア時」に初めて中央をGIF画像にします
            centerDisplay.innerHTML = `
                <img src="${AFTER_IMAGES['spot14']}" 
                     class="w-full h-full object-cover rounded-full pointer-events-none">
            `;
            centerDisplay.className = "w-[225px] h-[225px] rounded-full border border-cyan-500/50 flex flex-col items-center justify-center text-center z-10 shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-700";
        }
        
        if (clearMessage) clearMessage.classList.remove('hidden');
        
        if (playEffect) {
            confetti({ particleCount: 45, angle: 60, spread: 40, origin: { x: 0.1 }, colors: ['#06b6d4', '#ffffff'] });
            confetti({ particleCount: 45, angle: 120, spread: 40, origin: { x: 0.9 }, colors: ['#06b6d4', '#ffffff'] });
        }
    }
}

// パスワード認証モーダル制御
function checkPasswordModal(spotId) {
    if (localStorage.getItem(spotId) === 'done') return;
    currentAuthenticatingSpot = spotId;
    
    const modal = document.getElementById('password-modal');
    const spotNameDisplay = document.getElementById('modal-spot-name');
    const input = document.getElementById('password-input');
    const error = document.getElementById('password-error');

    if (!modal || !spotNameDisplay || !input || !error) return;

    let displayName = spotId === 'spot14' ? 'FINAL SPOT' : `SPOT ${spotId.replace('spot', '')}`;
    spotNameDisplay.innerText = `${displayName} のパスワードを入力してください`;

    input.value = '';
    error.classList.add('hidden');
    modal.classList.remove('hidden');
    modal.classList.remove('opacity-0');
    
    const innerContent = modal.querySelector('div');
    if (innerContent) innerContent.classList.remove('scale-95');

    input.focus();
}

function closePasswordModal() {
    const modal = document.getElementById('password-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    currentAuthenticatingSpot = null;
}

function submitPassword() {
    const input = document.getElementById('password-input');
    const error = document.getElementById('password-error');
    if (!input || !error) return;

    const spotId = currentAuthenticatingSpot; 
    const correctPassword = SPOT_PASSWORDS[spotId]; 

    if (input.value === correctPassword) {
        closePasswordModal();
        
        localStorage.setItem(spotId, 'done');
        
        setTimeout(() => {
            applyStampStyles(spotId, true);
            updateCenterDisplay();
            checkCompletion(true);
        }, 50);
    } else {
        error.classList.remove('hidden');
        input.value = '';
        input.focus();
    }
}

document.getElementById('password-input')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') submitPassword();
});

function resetRally() {
    if (confirm('デバッグ：スタンプをすべて消去して初期状態に戻しますか？')) {
        localStorage.clear();
        location.reload();
    }
}

// デバッグ用：1〜13番目のスタンプを一気に解放する関数
function debugAllClear() {
    if (confirm('デバッグ：1〜13のスタンプをすべてクリア状態にしますか？')) {
        spots.forEach(spotId => {
            localStorage.setItem(spotId, 'done');
            applyStampStyles(spotId, false);
        });
        updateCenterDisplay();
        checkCompletion(false);
        alert('すべての通常スタンプを解放しました。中央のFINAL SPOTを確認してください。');
    }
}