import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
let nickname = "";

function makeAuth() {
  const auth = getAuth();
  signInAnonymously(auth)
    .then(() => {
      // Signed in..
      console.log("익명 인증 완");
      nickname = auth.currentUser.uid;
      console.log(nickname);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("에러코드: " + errorCode);
      console.log("에러메시지: " + errorMessage);
    });
}

function checkAuth() {
  const status = onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      console.log(user);
      const uid = user.uid;
      console.log(uid);
      // ...
    } else {
      console.log("로그아웃");
      // User is signed out
      // ...
    }
  });
}

makeAuth();
