const SPOT_PASSWORDS={
    spot1:'apple',spot2:'banana',spot3:'cherry',spot4:'durian',
    spot5:'elderberry',spot6:'fig',spot7:'grape',spot8:'honeydew',
    spot9:'island',spot10:'gamestart',spot11:'kiwi',spot12:'lemon',
    spot13:'mango',spot14:'akatsuki'
};

const BEFORE_IMAGES={
    spot1:'stamp1/karuta-stamp1.gif',
    spot2:'stamp1/life-stamp1.gif',
    spot3:'stamp1/photo-stamp1.gif',
    spot4:'stamp1/flower-stamp1.gif',
    spot5:'stamp1/dance-stamp1.gif',
    spot6:'stamp1/tea-stamp1.gif',
    spot7:'stamp1/JRC-stamp1.gif',
    spot8:'stamp1/science-stamp1.gif',
    spot9:'stamp1/mountain-stamp1.gif',
    spot10:'stamp1/PC-stamp1.gif',
    spot11:'stamp1/art-stamp1.gif',
    spot12:'stamp1/book-stamp1.gif',
    spot13:'stamp1/font-stamp1.gif'
};

const AFTER_IMAGES={
    spot1:'stamp2/karuta-stamp2.gif',
    spot2:'stamp2/life-stamp2.gif',
    spot3:'stamp2/photo-stamp2.gif',
    spot4:'stamp2/flower-stamp2.gif',
    spot5:'stamp2/dance-stamp2.gif',
    spot6:'stamp2/tea-stamp2.gif',
    spot7:'stamp2/JRC-stamp2.gif',
    spot8:'stamp2/science-stamp2.gif',
    spot9:'stamp2/mountain-stamp2.gif',
    spot10:'stamp2/PC-stamp2.gif',
    spot11:'stamp2/art-stamp2.gif',
    spot12:'stamp2/book-stamp2.gif',
    spot13:'stamp2/font-stamp2.gif',
    spot14:'stamp2/akatsuki-stamp2.gif'
};

const TOTAL=13;
const spots=Array.from({length:TOTAL},(_,i)=>`spot${i+1}`);
let current=null;


// 初期化
window.addEventListener('load',()=>{
    createLayout();
    updateCenter();
    checkCompletion(false);
});

window.addEventListener('resize',()=>{
    createLayout();
    updateFinal();
});


// スタンプ配置
function createLayout(){
    const c=document.getElementById('circle-container');
    if(!c)return;

    const size=c.clientWidth;
    const center=size/2;
    const stampSize=Math.max(58,Math.min(72,size*.20));
    const radius=size/2;

    spots.forEach(id=>document.getElementById(id)?.remove());

    spots.forEach((id,i)=>{
        const angle=i*2*Math.PI/TOTAL-Math.PI/2;
        const x=center+radius*Math.cos(angle)-stampSize/2;
        const y=center+radius*Math.sin(angle)-stampSize/2;

        const b=document.createElement('button');
        b.id=id;
        b.className='absolute rounded-full flex items-center justify-center shadow-lg transition-all duration-500 z-20 overflow-hidden';
        b.style.cssText=`width:${stampSize}px;height:${stampSize}px;left:${x}px;top:${y}px`;
        b.innerHTML=`<img src="${BEFORE_IMAGES[id]}" class="w-full h-full object-cover rounded-full pointer-events-none">`;
        b.onclick=()=>checkPasswordModal(id);
        c.appendChild(b);

        if(localStorage.getItem(id)==='done')applyStamp(id,false);
    });
}


// クリア済みスタンプ
function applyStamp(id,effect){
    const b=document.getElementById(id);
    if(!b)return;

    if(id!=='spot14'){
        b.innerHTML=`<img src="${AFTER_IMAGES[id]}" class="w-full h-full object-cover rounded-full pointer-events-none">`;
        b.disabled=true;
        b.classList.add('cursor-not-allowed');
    }

    if(effect){
        confetti({
            particleCount:30,
            spread:45,
            origin:{y:.7},
            colors:['#06b6d4','#fff']
        });
    }
}


// 中央表示
function updateCenter(){
    const count=spots.filter(id=>localStorage.getItem(id)==='done').length;
    const icon=document.getElementById('center-icon');
    const text=document.getElementById('center-text');
    const final=document.getElementById('spot14');

    if(!icon||!text||!final)return;

    if(count<TOTAL){
        icon.innerText='LOCKED';
        text.innerText=`${count} / ${TOTAL}`;
        final.classList.add('hidden','opacity-0','scale-75');
    }else{
        icon.innerText='';
        text.innerText='';
        final.classList.remove('hidden');
        updateFinal();

        setTimeout(()=>{
            final.classList.add('opacity-100','scale-100');
        },50);
    }
}


// FINAL SPOTを中央に配置
function updateFinal(){
    const c=document.getElementById('circle-container');
    const b=document.getElementById('spot14');
    if(!c||!b)return;

    const size=c.clientWidth;
    const w=Math.min(96,size*.22);
    const h=Math.min(40,size*.1);

    b.style.cssText=`
        position:absolute;
        width:${w}px;
        height:${h}px;
        left:${(size-w)/2}px;
        top:${(size-h)/2}px;
    `;
}


// 完全クリア
function checkCompletion(effect){
    if(!spots.every(id=>localStorage.getItem(id)==='done'))return;
    if(localStorage.getItem('spot14')!=='done')return;

    const center=document.getElementById('center-display');
    const message=document.getElementById('clear-message');

    center.innerHTML=`
        <img src="${AFTER_IMAGES.spot14}"
        class="w-full h-full object-cover rounded-full pointer-events-none">
    `;

    if(message)message.classList.remove('hidden');

    if(effect){
        confetti({
            particleCount:90,
            spread:70,
            origin:{y:.6},
            colors:['#06b6d4','#fff']
        });
    }
}


// パスワード画面
function checkPasswordModal(id){
    if(localStorage.getItem(id)==='done')return;

    current=id;

    const modal=document.getElementById('password-modal');
    const name=document.getElementById('modal-spot-name');
    const input=document.getElementById('password-input');
    const error=document.getElementById('password-error');

    const display=id==='spot14'
        ?'FINAL SPOT'
        :`SPOT ${id.replace('spot','')}`;

    name.innerText=`${display} のパスワードを入力してください`;
    input.value='';
    error.classList.add('hidden');

    modal.classList.remove('hidden','opacity-0');
    modal.querySelector('div')?.classList.remove('scale-95');
    input.focus();
}


// モーダルを閉じる
function closePasswordModal(){
    document.getElementById('password-modal')?.classList.add('hidden');
    current=null;
}


// パスワード確認
function submitPassword(){
    const input=document.getElementById('password-input');
    const error=document.getElementById('password-error');

    if(input.value===SPOT_PASSWORDS[current]){
        closePasswordModal();
        localStorage.setItem(current,'done');

        setTimeout(()=>{
            applyStamp(current,true);
            updateCenter();
            checkCompletion(true);
        },50);
    }else{
        error.classList.remove('hidden');
        input.value='';
        input.focus();
    }
}

document.getElementById('password-input')
?.addEventListener('keypress',e=>{
    if(e.key==='Enter')submitPassword();
});


// デバッグ
function resetRally(){
    if(confirm('スタンプをすべて消去して初期状態に戻しますか？')){
        localStorage.clear();
        location.reload();
    }
}

function debugAllClear(){
    if(confirm('1〜13のスタンプをすべてクリア状態にしますか？')){
        spots.forEach(id=>{
            localStorage.setItem(id,'done');
            applyStamp(id,false);
        });

        updateCenter();
        checkCompletion(false);

        alert('通常スタンプをすべて解放しました。');
    }
}

