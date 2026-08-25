// ========================================
// パスワード
// ========================================

const SPOT_PASSWORDS = {

    spot1: 'naniwaduni',
    spot2: 'lifescience',
    spot3: 'pictures',
    spot4: 'flower',
    spot5: 'showtime',
    spot6: '310sado',
    spot7: 'jrc2026',
    spot8: 'explosion',
    spot9: 'climbing',
    spot10: 'gamestart',
    spot11: 'colorful',
    spot12: 'literature',
    spot13: 'calligraphy',
    spot14: 'akatsuki'

};


// ========================================
// スタンプ画像
// ========================================

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
    spot13: 'stamp1/font-stamp1.gif'

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
    spot14: 'stamp2/Akatsuki-stamp2.gif'

};


// ========================================
// 基本設定
// ========================================

const TOTAL = 13;

const spots = Array.from(
    {
        length: TOTAL
    },
    (_, i) => `spot${i + 1}`
);

let current = null;


// ========================================
// 初期化
// ========================================

window.addEventListener('load', function () {

    createLayout();

    updateCenter();

    checkCompletion(false);

});


// ========================================
// 画面サイズ変更
// ========================================

window.addEventListener('resize', function () {

    createLayout();

    updateFinal();

});


// ========================================
// スタンプを作成
// ========================================

function createLayout() {

    const container =
        document.getElementById('circle-container');

    if (!container) {
        return;
    }


    const size =
        container.clientWidth;

    const center =
        size / 2;


    const stampSize =
        Math.max(
            58,
            Math.min(72, size * 0.20)
        );


    const radius =
        size / 2;


    // 既存スタンプを削除

    spots.forEach(function (id) {

        const old =
            document.getElementById(id);

        if (old) {
            old.remove();
        }

    });


    // スタンプを作成

    spots.forEach(function (id, i) {

        const angle =
            i * 2 * Math.PI / TOTAL - Math.PI / 2;


        const x =
            center +
            radius * Math.cos(angle) -
            stampSize / 2;


        const y =
            center +
            radius * Math.sin(angle) -
            stampSize / 2;


        const button =
            document.createElement('button');


        button.id = id;

        button.type = 'button';


        button.className =
            'absolute rounded-full flex items-center justify-center shadow-lg transition-all duration-500 z-20 overflow-hidden';


        button.style.width =
            stampSize + 'px';

        button.style.height =
            stampSize + 'px';

        button.style.left =
            x + 'px';

        button.style.top =
            y + 'px';


        button.innerHTML = `

            <img
                src="${BEFORE_IMAGES[id]}"
                class="w-full h-full object-cover rounded-full pointer-events-none"
            >

        `;


        button.addEventListener(
            'click',
            function () {

                checkPasswordModal(id);

            }
        );


        container.appendChild(button);


        // すでに解除済みなら解除後画像を表示

        if (
            localStorage.getItem(id) === 'done'
        ) {

            applyStamp(id, false);

        }

    });

}


// ========================================
// スタンプをクリア画像に変更
// ========================================

function applyStamp(
    id,
    effect = true
) {

    const button =
        document.getElementById(id);


    if (!button) {
        return;
    }


    if (AFTER_IMAGES[id]) {

        button.innerHTML = `

            <img
                src="${AFTER_IMAGES[id]}"
                class="w-full h-full object-cover rounded-full pointer-events-none"
            >

        `;

    }


    button.disabled = true;

    button.classList.add(
        'cursor-not-allowed'
    );


    // 紙吹雪

    if (
        effect &&
        typeof confetti === 'function'
    ) {

        confetti({

            particleCount: 30,

            spread: 45,

            origin: {
                y: 0.7
            },

            colors: [
                '#06b6d4',
                '#ffffff'
            ]

        });

    }

}


// ========================================
// 中央の数字
// ========================================

function updateCenter() {

    const icon =
        document.getElementById('center-icon');

    const text =
        document.getElementById('center-text');

    const final =
        document.getElementById('spot14');


    if (
        !icon ||
        !text ||
        !final
    ) {
        return;
    }


    const count =
        spots.filter(function (id) {

            return (
                localStorage.getItem(id) === 'done'
            );

        }).length;


    // ========================================
    // 13個未満
    // ========================================

    if (count < TOTAL) {

        icon.innerText =
            'LOCKED';

        text.innerText =
            count + ' / ' + TOTAL;


        final.classList.add(
            'hidden',
            'opacity-0',
            'scale-75'
        );

        return;

    }


    // ========================================
    // 13個コンプリート
    // ========================================

    icon.innerText = '';

    text.innerText = '';


    final.classList.remove(
        'hidden'
    );


    updateFinal();


    setTimeout(function () {

        final.classList.add(
            'opacity-100',
            'scale-100'
        );

    }, 50);

}


// ========================================
// FINAL SPOTの位置
// ========================================

function updateFinal() {

    const container =
        document.getElementById(
            'circle-container'
        );

    const final =
        document.getElementById(
            'spot14'
        );


    if (
        !container ||
        !final
    ) {
        return;
    }


    const size =
        container.clientWidth;


    const w =
        Math.min(
            96,
            size * 0.22
        );


    const h =
        Math.min(
            40,
            size * 0.1
        );


    final.style.cssText = `

        position: absolute;

        width: ${w}px;

        height: ${h}px;

        left: ${(size - w) / 2}px;

        top: ${(size - h) / 2}px;

    `;

}


// ========================================
// パスワードモーダルを開く
// ========================================

function checkPasswordModal(id) {

    if (
        localStorage.getItem(id) === 'done'
    ) {
        return;
    }


    current = id;


    const modal =
        document.getElementById(
            'password-modal'
        );

    const name =
        document.getElementById(
            'modal-spot-name'
        );

    const input =
        document.getElementById(
            'password-input'
        );

    const error =
        document.getElementById(
            'password-error'
        );


    if (
        !modal ||
        !name ||
        !input ||
        !error
    ) {
        return;
    }


    const display =
        id === 'spot14'
            ? 'FINAL SPOT'
            : 'SPOT ' +
              id.replace(
                  'spot',
                  ''
              );


    name.innerText =
        display +
        ' のパスワードを入力してください';


    input.value = '';

    error.classList.add(
        'hidden'
    );


    modal.classList.remove(
        'hidden',
        'opacity-0'
    );


    const box =
        modal.querySelector('div');


    if (box) {

        box.classList.remove(
            'scale-95'
        );

    }


    input.focus();

}


// ========================================
// モーダルを閉じる
// ========================================

function closePasswordModal() {

    const modal =
        document.getElementById(
            'password-modal'
        );


    if (modal) {

        modal.classList.add(
            'hidden'
        );

    }

}


// ========================================
// パスワード送信
// ========================================

function submitPassword() {

    const input =
        document.getElementById(
            'password-input'
        );

    const error =
        document.getElementById(
            'password-error'
        );


    if (
        !input ||
        !error
    ) {
        return;
    }


    const id =
        current;


    if (!id) {
        return;
    }


    const password =
        input.value.trim();


    // ========================================
    // パスワード正解
    // ========================================

    if (
        password ===
        SPOT_PASSWORDS[id]
    ) {

        localStorage.setItem(
            id,
            'done'
        );


        closePasswordModal();


        applyStamp(
            id,
            true
        );


        updateCenter();


        checkCompletion(
            true
        );


        current = null;


    } else {

        // ========================================
        // パスワード不正解
        // ========================================

        error.classList.remove(
            'hidden'
        );


        input.value = '';

        input.focus();

    }

}


// ========================================
// Enterキー
// ========================================

document.addEventListener(
    'DOMContentLoaded',
    function () {

        const input =
            document.getElementById(
                'password-input'
            );


        if (!input) {
            return;
        }


        input.addEventListener(
            'keydown',
            function (event) {

                if (
                    event.key ===
                    'Enter'
                ) {

                    event.preventDefault();

                    submitPassword();

                }

            }
        );

    }
);


// ========================================
// クリア状況
// ========================================

function checkCompletion(effect) {

    const count =
        spots.filter(function (id) {

            return (
                localStorage.getItem(id) === 'done'
            );

        }).length;


    const center =
        document.getElementById(
            'center-display'
        );

    const message =
        document.getElementById(
            'clear-message'
        );

    const messageText =
        document.getElementById(
            'clear-message-text'
        );


    if (
        !center ||
        !message ||
        !messageText
    ) {
        return;
    }


    // ========================================
    // 13個すべて集めた場合
    // ========================================

    if (
        count === TOTAL &&
        localStorage.getItem('spot14') !== 'done'
    ) {

        message.classList.remove(
            'hidden'
        );


        messageText.innerHTML =
            '13個のスタンプをコンプリートしました！<br>' +
            '最後のスタンプはパソコンサイエンス部展示室へお越しください';


        return;

    }


    // ========================================
    // 14個目までクリア
    // ========================================

    if (
        count === TOTAL &&
        localStorage.getItem('spot14') === 'done'
    ) {

        center.innerHTML = `

            <img
                src="${AFTER_IMAGES.spot14}"
                class="w-full h-full object-cover rounded-full pointer-events-none"
            >

        `;


        message.classList.remove(
            'hidden'
        );


        messageText.innerHTML =
            'スタンプオールコンプリート!!<br>' +
            'パソコンサイエンス部展示室にて景品を贈呈します';


        // ========================================
        // コンプリート時の紙吹雪
        // ========================================

        if (
            effect &&
            typeof confetti === 'function'
        ) {

            confetti({

                particleCount: 90,

                spread: 70,

                origin: {
                    y: 0.6
                },

                colors: [
                    '#06b6d4',
                    '#ffffff'
                ]

            });

        }

    }

}
