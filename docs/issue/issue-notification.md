# Notification 클릭 시 채팅방 열림 이슈

## 배경

Flow 웹(flow.team)은 채팅 메시지 수신 시 브라우저 Notification API를 통해 데스크톱 알림을 표시한다.
알림 클릭 시 `OpenUtil.openMessengerByRoomSrno(roomSrno)`를 호출하여 채팅방을 연다.

## Flow의 Notification 관련 구조

### BrowserNoti 객체 (common.min.js)

| 메소드 | 역할 |
|--------|------|
| `initSetting` | 알림 초기 설정 |
| `showChattingNotification` | 채팅 알림 생성 |
| `showAlarmNotification` | 업무 알림 생성 |
| `showLetterNotification` | 쪽지 알림 생성 |
| `showCalendarNotification` | 캘린더 알림 생성 |
| `showScheduleReminderNotification` | 일정 미리 알림 생성 |
| `requestNotificationPermission` | 알림 권한 요청 |
| `closeAlarmBanner` | 알림 배너 닫기 |

### OpenUtil 채팅 관련 메소드 (common.min.js)

| 메소드 | 역할 | 대응 여부 |
|--------|------|-----------|
| `openMessengerByRoomSrno` | 채팅방 번호로 열기 | O (래핑 완료) |
| `openMessengerByOneUserId` | 1:1 채팅 열기 | X |
| `openMessengerByProjectSrno` | 프로젝트 채팅 열기 | X |
| `openMessengerByFavoriteGroupCode` | 즐겨찾기 그룹 채팅 열기 | X |
| `openMessengerByInvite` | 초대로 채팅방 열기 | X |
| `openMessengerByDvsnCode` | 부서 코드로 채팅 열기 | X |

### OpenUtil 기타 메소드

| 메소드 | 역할 |
|--------|------|
| `openMini` | 미니 창 열기 |
| `openWindow` | 일반 창 열기 |
| `openSubScreen` | 서브 화면 열기 |
| `openGanttChart` | 간트차트 열기 |
| `openPopup` | 팝업 열기 |
| `openUrlOnBrowser` | 브라우저에서 URL 열기 |
| `getWhljJson` | WHLJ JSON 가져오기 |
| `openCollaboEvaluationPopup` | 협업 평가 팝업 |
| `openTelecommuteReportPopup` | 재택근무 보고 팝업 |
| `openPbSalesPopup` | PB 영업 팝업 |
| `openLetterMain` | 쪽지 메인 열기 |
| `openKogasChatBot` | KOGAS 챗봇 열기 |
| `openLetterDetail` | 쪽지 상세 열기 |

## 문제점

### 1. 다른 Space에서 알림 클릭 시 채팅방이 열리지 않음

**원인:** `OpenUtil.openMessengerByRoomSrno` 내부에 async/await 코드가 존재한다.
마지막 채팅방 열기로부터 600초(10분) 이상 경과 시 알림/채팅 카운트를 갱신하는 `await` 구문이 실행되며,
이로 인해 `window.open()` 호출이 지연되어 브라우저의 사용자 제스처(user gesture) 토큰이 만료된다.
크롬은 사용자 제스처 없는 `window.open()`을 팝업으로 판단하여 차단한다.

```
알림 클릭 (user gesture 시작)
→ window.focus() (Space 전환)
→ OpenUtil.openMessengerByRoomSrno(roomSrno)
  → 600초 경과 체크
  → await 카운트 갱신              ← user gesture 토큰 만료
  → window.open("", "POPUP_CHAT_xxx")  ← 팝업 차단됨
```

**결과:** 브라우저 창만 포커스되고 채팅방은 열리지 않는다.

### 2. 채팅방 열기 시 전체 영역 선택 현상

**원인:** 오버레이의 `.overlay` 요소에 `user-select` 속성이 없어서,
레이아웃 전환 시 mousedown/mouseup 좌표 차이로 브라우저가 전체 텍스트를 선택한다.
특히 느린 PC에서 발생 빈도가 높다.

**해결:** `.overlay`에 `user-select: none` 추가 (iframe 내부는 별도 document이므로 영향 없음)

## 해결 방법

### 대응 완료

#### 1. `openChatInOverlay` 동기적 미리 생성 (inject.js)

`OpenUtil.openMessengerByRoomSrno`를 래핑하여, 원본 함수 실행 전에 동기적으로 오버레이를 생성한다.
async/await로 인한 팝업 차단을 우회한다.

```javascript
var _orig = OpenUtil.openMessengerByRoomSrno;
OpenUtil.openMessengerByRoomSrno = function(roomSrno) {
  openChatInOverlay('POPUP_CHAT_' + roomSrno);  // 동기적으로 미리 생성
  _orig.apply(this, arguments);                   // 원본 함수 실행
};
```

#### 2. 같은 target 중복 호출 방지 (inject.js)

위 래핑으로 인해 `openChatInOverlay`가 두 번 호출될 수 있다 (1차: 래핑, 2차: window.open 인터셉터).
같은 target의 오버레이가 이미 존재하면 재사용하여 iframe이 파괴되는 것을 방지한다.

```javascript
var existing = document.getElementById('slow-host');
if (existing) {
  var existingIframe = existing.shadowRoot.querySelector('iframe');
  if (existingIframe && existingIframe.name === target)
    return existingIframe.contentWindow;  // 같은 target이면 재사용
  existing.remove();                       // 다른 target이면 제거
}
```

#### 3. 전체 영역 선택 방지 (inject.js)

`.overlay`에 `user-select: none` 추가.

### 미대응

- `openMessengerByOneUserId` 등 나머지 5개 `openMessengerBy*` 메소드도 동일한 async 이슈가 존재할 가능성이 있음
- 알림 클릭이 아닌 다른 경로 (채팅 목록 클릭 등)에서는 inject.js의 `window.open` 인터셉터로 이미 대응 중
