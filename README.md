# Slow

> Flow is Slow! 🐌

Flow 맥 앱이 너무 느리고 웹을 쓰자니 화면 줄이면 채팅창이 줄어드는 참사가 벌어져서 만든 크롬 익스텐션입니다.

## 뭘 하는 건가요?

- **채팅/알림 중심 레이아웃** — 사이드바와 메뉴를 재배치해서 채팅에 집중할 수 있게 합니다
- **팝업 채팅 → 풀스크린 오버레이** — 새 창 대신 현재 페이지 위에 채팅이 뜹니다. ESC로 닫기
- **원클릭 ON/OFF** — 익스텐션 아이콘 클릭 → 토글 스위치 → 끝

## 설치 방법

[링크를 클릭하여 크롬 웹스토어 접속하여 설치](https://chromewebstore.google.com/detail/slow/gkndpbefncdlnnmljpcoflmihjpkidla?authuser=0&hl=ko)

### 사용

1. [flow.team](https://flow.team) 접속
2. 툴바의 Slow 아이콘 클릭
3. 토글 ON
4. 페이지가 리로드되면서 적용 완료

## 개발

```bash
# 개발 서버 (핫 리로드)
pnpm dev

# Firefox 빌드
pnpm build:firefox

# 배포용 zip
pnpm zip
```

## 기술 스택

- [WXT](https://wxt.dev) — 웹 익스텐션 프레임워크
- TypeScript
