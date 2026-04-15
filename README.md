# Slow

> Flow is Slow! 🐌

Flow 맥 앱이 너무 느리고 웹을 쓰자니 화면 줄이면 채팅창이 줄어드는 참사가 벌어져서 만든 크롬 익스텐션입니다.

## 뭘 하는 건가요?

- **채팅/알림 중심 레이아웃** — 사이드바와 메뉴를 재배치해서 채팅에 집중할 수 있게 합니다
- **팝업 채팅 → 풀스크린 오버레이** — 새 창 대신 현재 페이지 위에 채팅이 뜹니다. ESC로 닫기
- **원클릭 ON/OFF** — 익스텐션 아이콘 클릭 → 토글 스위치 → 끝

## 설치 방법

1. [Releases](https://github.com/sixone0712/slow-extension/releases) 페이지에서 `slow-x.x.x-chrome.zip` 파일 다운로드
2. 압축 해제
3. 크롬에서 `chrome://extensions` 접속
4. 우측 상단 **개발자 모드** 활성화
5. **압축해제된 확장 프로그램을 로드합니다** 클릭
6. 압축 해제한 폴더 선택

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
