// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  query,
  orderByChild,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxGN3j_18Pvl3Q90A7w5YLLnHIfiNk4po",
  authDomain: "test-js-firebase-app-c0f7a.firebaseapp.com",
  projectId: "test-js-firebase-app-c0f7a",
  storageBucket: "test-js-firebase-app-c0f7a.appspot.com",
  messagingSenderId: "141261174013",
  databaseURL: "https://test-js-firebase-app-c0f7a-default-rtdb.firebaseio.com/",
  appId: "1:141261174013:web:2060d649f4d851ca92ba94",
};

// Initialize Firebase -- 웹 버전 9 (modular)
const app = initializeApp(firebaseConfig);
const database = getDatabase();

let name = "";
let message = document.getElementById("typeMsg");
let chatName = document.getElementById("chatName");
let chatList = document.getElementsByClassName("chatroomitem");
const chatRef = query(ref(database, "chats/"), orderByChild("writtentime"));

// 값 이벤트 수신 대기
// 리스너가 이벤트 발생 시점에 db의 지정된 위치에 있던 데이터 포함 snapshot 수신
// val() 사용하여 snapshot 데이터 검색 가능
// snapshot.val()로는 브라우저에서 json을 다시 가져옴. 따라서 firebase에 의해 정렬된 결과가 나타나지 않게 됨. snapshot.forEach로 firebase에 의해 정렬된 결과 이용하기
onValue(chatRef, (snapshot) => {
  let chatnamelist = {};
  let lastmsglist = {};
  let timelist = {};
  snapshot.forEach(function (child) {
    chatnamelist[child.val()["chatname"]] = child.val()["chatname"];
    lastmsglist[child.val()["lastmsg"]] = child.val()["lastmsg"];
    timelist[child.val()["writtentime"]] = child.val()["writtentime"];
  });
  getChatRooms(chatnamelist, lastmsglist, timelist);
  let roomname = document.querySelectorAll(".chatroomitem #roomname");
  for (let i = 0; i < chatList.length; i++) {
    chatList[i].addEventListener("click", function () {
      getMessages(roomname[i].innerHTML);
    });
  }
});

function makeAuth() {
  const auth = getAuth();
  signInAnonymously(auth)
    .then(() => {
      // Signed in..
      console.log("익명 인증 완");
      name = auth.currentUser.uid;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("에러코드: " + errorCode);
      console.log("에러메시지: " + errorMessage);
    });
}

function makeChat() {
  const db = getDatabase();
  set(ref(db, "chats/" + chatName.value), {
    chatname: chatName.value,
    lastmsg: "nothing",
    writtentime: new Date().getTime(),
  });
}

function createChat(tempName, tempMsg, tempTime) {
  return (
    `<div class="chatroomitem card border-0 text-reset">
      <div class="card-body">
        <div class="row gx-5">
          <div class="col-auto">
            <div class="avatar avatar-online">
              <img src="../img/online.png" alt="#" class="avatar-img" />
            </div>
          </div>

          <div class="col">
            <div class="d-flex align-items-center mb-3">
              <h5 id="roomname" class="me-auto mb-0">` +
    `${tempName}` +
    `</h5><span class="text-muted extra-small ms-2">12:45 PM</span>
            </div>
            <div class="d-flex align-items-center">
              <div class="line-clamp me-auto">` +
    `${tempMsg}` +
    `
              </div>
            </div>
          </div>
    </div>
    </div>
    </div>`
  );
}

function getChatRooms(chatnamelist, lastmsglist, timelist) {
  let roomList = "";
  for (let i = Object.keys(chatnamelist).length - 1; i >= 0; i--) {
    let tempText = "";
    let tempName, tempMsg, tempTime;
    tempName = Object.keys(chatnamelist)[i];
    tempMsg = Object.keys(lastmsglist)[i];
    tempTime = Object.keys(timelist)[i];
    tempText = createChat(tempName, tempMsg, tempTime);
    roomList += tempText;
    console.log(tempMsg);
  }
  document.querySelector("#chatrooms").innerHTML = roomList;
}

function getMessages(roomName) {
  chatName = roomName;
  document.getElementById("toproomname").innerText = roomName;
  const chatRoomRef = ref(database, "messages/" + roomName);
  onValue(chatRoomRef, (snapshot) => {
    const nameList = {};
    const msgList = {};
    const writtentimeList = {};
    let idx = 0;
    snapshot.forEach(function (child) {
      nameList[idx] = child.val()["name"];
      msgList[idx] = child.val()["message"];
      writtentimeList[idx] = child.val()["writtentime"];
      idx++;
    });
    printMsgList(nameList, msgList, writtentimeList);
  });
}

function setMember() {
  const db = getDatabase();
  set(ref(db, "members/" + chatName.value + "/"), {
    name: name,
  });
}

function sendMessage() {
  const db = getDatabase();
  console.log(chatName);
  set(ref(db, "messages/" + chatName + "/" + new Date().getTime() + "/"), {
    name: name,
    message: message.value,
    writtentime: new Date().getTime(),
  });

  // 채팅룸의 마지막 메시지 세팅
  set(ref(db, "chats/" + chatName), {
    chatname: chatName,
    lastmsg: message.value,
    writtentime: new Date().getTime(),
  });
}

function printMsgList(nameList, msgList, writtentimeList) {
  let messageList = "";
  for (let i = 0; i < Object.keys(nameList).length; i++) {
    let tempText = "";
    if (nameList[i] === name) {
      tempText = createMsg(nameList[i], msgList[i], writtentimeList[i], true);
    } else {
      tempText = createMsg(nameList[i], msgList[i], writtentimeList[i], false);
    }
    messageList += tempText;
  }

  document.querySelector(".chat-body-inner > .py-6").innerHTML = messageList;
  var chatRoomScroll = document.querySelector(".chat-body");
  chatRoomScroll.scrollTop = chatRoomScroll.scrollHeight;
}

function createMsg(name, msg, time, out) {
  let res = "";
  if (out === true) {
    res = '<div class="message message-out">';
  } else {
    res = '<div class="message">';
  }
  console.log("out: " + out);
  return (
    res +
    `<a
    href="#"
    data-bs-toggle="modal"
    data-bs-target="#modal-user-profile"
    class="avatar avatar-responsive"
  >
    <img class="avatar-img" src="assets/img/avatars/6.jpg" alt="" />
  </a>
<!-- Dropdown -->
  <div class="message-action">
  </div>
  <div class="message-inner">
    <div class="message-body">
      <div class="message-content">
        <div class="message-text">
          <p>` +
    `${msg}` +
    `</p>
          </div>
          </div>
        </div>
      </div>
      </div>`
  );
}

submitBtn.addEventListener("click", function () {
  sendMessage();
});
createRoomBtn.addEventListener("click", function () {
  makeChat();
  setMember(chatName.value, name);
});

makeAuth();
