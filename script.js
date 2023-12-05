import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {
    getAuth,
    signOut,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    serverTimestamp,
    onSnapshot,
    orderBy,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";

let signUpUserName = document.getElementById("sign-up-user-first-name");
let signUpUserLastName = document.getElementById("sign-up-user-last-name");
let signUpEmail = document.getElementById("sign-up-user-email");
let signUpPassword = document.getElementById("sign-up-user-password");
let signUpRepeatPassword = document.getElementById("sign-up-user-repeat-password");
let signInEmail = document.getElementById("user-email");
let signInPassword = document.getElementById("user-password");
let signUpForm = document.getElementById("sign-up-form");
let signInForm = document.getElementById("sign-in-form");
let loginTxt = document.getElementById("login-txt");
let signupTxt = document.getElementById("signup-txt");
let signUpDiv = document.getElementById("sign-up");
let LoginDiv = document.getElementById("sign-in");
let loader = document.getElementById("loader");
let authContainer = document.getElementsByClassName("auth-container");
let chatAppContainer = document.getElementsByClassName("chat-app-container");
let profileContainer = document.getElementsByClassName("profile-container");
let inputs = document.getElementsByClassName("inputs");
let chatUsersContainer = document.getElementById("chat-users-container");
let chatWhichUserContainer = document.getElementById("chat-which-user-container");
let userMsgContainer = document.getElementById("user-msg-container");
let userChatsContainer = document.getElementById("users-chats-container");
let logoutBtn = document.getElementById("logout-btn");
let msgform = document.getElementById("msg-form");
let noChatDisplaycontainer = document.getElementById("no-chat-display-container");

let imageInput = document.getElementById('imageInput');
let selectedImage = document.getElementById('selectedImage');
let updateBtn = document.getElementById('updateBtn');
let userFirtsNameForEdit = document.getElementById('userFirtsNameForEdit');
let userLastNameForEdit = document.getElementById('userLastNameForEdit');
let userEmailForEdit = document.getElementById('userEmailForEdit');

const firebaseConfig = {
    apiKey: "AIzaSyBl_MgCYaWNcQxbCDFEIem0KT_scTJ2NIc",
    authDomain: "chat-app-9e4d1.firebaseapp.com",
    projectId: "chat-app-9e4d1",
    storageBucket: "chat-app-9e4d1.appspot.com",
    messagingSenderId: "339356442836",
    appId: "1:339356442836:web:378dc157ce38c092efdb41",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let db = getFirestore(app);
let storage = getStorage(app)
let userId = "";
let userName = "";
let anotherUserId = "";
let chatCollectionRef = collection(db, "userMsgs");
let storageRef = ref(storage, `usersImages/${userId}`);
let userDivId = '';

// Authentication code

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        chatAppContainer[0].style.display = "flex";
        authContainer[0].style.display = "none";
        loader.style.display = "none";
        logoutBtn.style.display = "block";
        userId = user.uid;

        let userNameObj = await getDoc(doc(db, "userName", userId));

        let { firstname, lastname } = userNameObj.data();
        userName = `${firstname} ${lastname}`;

        getUser();
        profileBydefault()
        // ...
    } else {
        // User is signed out
        // ...
        chatAppContainer[0].style.display = "none";
        authContainer[0].style.display = "flex";
        loader.style.display = "none";
        logoutBtn.style.display = "none";
    }
});

signInPassword.addEventListener("focus", () => {
    signInPassword.style.borderColor = "rgb(98, 94, 94)";
    signInPassword.style.boxShadow = "none";
});

signUpRepeatPassword.addEventListener("focus", () => {
    signUpRepeatPassword.style.borderColor = "rgb(98, 94, 94)";
    signUpRepeatPassword.style.boxShadow = "none";
});

signUpForm.addEventListener("submit", (a) => {
    a.preventDefault();

    if (signUpPassword.value == signUpRepeatPassword.value) {
        createUserWithEmailAndPassword(
            auth,
            signUpEmail.value,
            signUpPassword.value
        )
            .then(async (userCredential) => {
                // Signed up
                userId = userCredential.user.uid;
                chatAppContainer[0].style.display = "flex";
                authContainer[0].style.display = "none";

                await setDoc(doc(db, "userName", userId), {
                    firstname: signUpUserName.value,
                    lastname: signUpUserLastName.value,
                    userImg: "",
                    userEmail: userCredential.user.email,
                    userId: userId,
                });

                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].value = "";
                }
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);

                chatAppContainer[0].style.display = "none";
                authContainer[0].style.display = "flex";

                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].value = "";
                }
                // ..
            });
    } else {
        signUpRepeatPassword.style.borderColor = "red";
        signUpRepeatPassword.style.boxShadow = "0px 0px 5px red";
        signUpRepeatPassword.value = "";
    }
});

signInForm.addEventListener("submit", (a) => {
    a.preventDefault();

    signInWithEmailAndPassword(auth, signInEmail.value, signInPassword.value)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            userId = user.uid;
            chatAppContainer[0].style.display = "flex";
            authContainer[0].style.display = "none";

            for (let i = 0; i < inputs.length; i++) {
                inputs[i].value = "";
            }
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
            chatAppContainer[0].style.display = "none";
            authContainer[0].style.display = "flex";
            signInPassword.value = "";
            signInPassword.style.borderColor = "red";
            signInPassword.style.boxShadow = "0px 0px 5px red";
        });
});

loginTxt.addEventListener("click", function () {
    LoginDiv.style.display = "block";
    signUpDiv.style.display = "none";
});

signupTxt.addEventListener("click", function () {
    LoginDiv.style.display = "none";
    signUpDiv.style.display = "block";
});

// Chat app code

async function getUser() {
    chatUsersContainer.innerHTML = null;

    let q = query(collection(db, "userName"), where("userId", "==", userId));

    let you = await getDocs(q);

    you.forEach((element) => {
        userDivId = element.id
        let div = `
        <div id="${element.id}" class="users">
            <img class="usersImg" src="${element.data().userImg
                ? element.data().userImg
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3wksm3opkFrzaOCjlGYwLvKytFXdtB5ukWQ&usqp=CAU"
            }" alt="user image">
            <h2 class="userName">${element.data().firstname} ${element.data().lastname
            } (You)</h2>
        </div>
        `;
        chatUsersContainer.innerHTML = div;
    });

    let q2 = query(collection(db, "userName"), where("userId", "!=", userId));

    let users = await getDocs(q2);

    users.forEach((element) => {
        let div = `
        <div id="${element.data().userId}" class="users">
            <img class="usersImg" src="${element.data().userImg
                ? element.data().userImg
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3wksm3opkFrzaOCjlGYwLvKytFXdtB5ukWQ&usqp=CAU"
            }" alt="user image">
            <h2 class="userName">${element.data().firstname} ${element.data().lastname
            }</h2>
        </div>
        `;
        chatUsersContainer.innerHTML += div;
    });

    let usersDiv = document.getElementsByClassName("users");

    for (let i = 0; i < usersDiv.length; i++) {
        usersDiv[i].addEventListener("click", function () {
            chatWhichUserContainer.innerHTML = null;

            for (let i = 0; i < usersDiv.length; i++) {
                usersDiv[i].style.backgroundColor = "white";
            }

            this.style.backgroundColor = "rgb(233, 232, 232)";

            userMsgContainer.style.display = "flex";
            userChatsContainer.style.display = "flex";
            chatWhichUserContainer.style.display = "block";
            noChatDisplaycontainer.style.display = "none";

            let div = `
            <div id="${this.id}" class="whichUser">
            <img class="whichusersImg" src="${this.childNodes[1].src
                    ? this.childNodes[1].src
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3wksm3opkFrzaOCjlGYwLvKytFXdtB5ukWQ&usqp=CAU"
                }" alt="user image">
            <h1 class="userName">${this.childNodes[3].innerText}</h1>
            ${this.id == userId ? `<img id="profile-edit-img" src="https://cdn-icons-png.flaticon.com/128/11864/11864116.png" />` : ''}
            </div>`;
            anotherUserId = this.id;

            chatWhichUserContainer.innerHTML = div;

            let profileEditImg = document.getElementById('profile-edit-img');
            profileEditImg?.addEventListener('click', showProfileEditPage)

            getMsgs();
        });
    }
}

logoutBtn.addEventListener("click", logoutFunc);

function logoutFunc() {
    signOut(auth)
        .then(() => {
            // Sign-out successful.
            chatAppContainer[0].style.display = "none";
            authContainer[0].style.display = "flex";
            profileContainer[0].style.display = "none";
            logoutBtn.style.display = "none";
            userMsgContainer.style.display = "none";
            userChatsContainer.style.display = "none";
            chatWhichUserContainer.style.display = "none";
        })
        .catch((error) => {
            // An error happened.
            alert(error.message);
        });
}

msgform.addEventListener("submit", async (submitedForm) => {
    submitedForm.preventDefault();

    let obj = {
        userMsg: submitedForm.target[0].value,
        userId: userId,
        otherUser: anotherUserId,
        time: serverTimestamp(),
        chatId: generateChatId(),
    };

    await addDoc(chatCollectionRef, obj);

    submitedForm.target[0].value = "";
});

function generateChatId() {
    let chatId =
        userId > anotherUserId ? userId + anotherUserId : anotherUserId + userId;

    return chatId;
}

async function getMsgs() {

    let usersMsg = query(
        chatCollectionRef,
        orderBy("time"),
        where("chatId", "==", generateChatId())
    );

    onSnapshot(usersMsg, (doc) => {
        userChatsContainer.innerHTML = null;
        if (!doc.empty) {
            doc.forEach((elements) => {
                let div = `
    <div class="chats ${elements.data().userId == userId ? "userChat" : "anotherUserChat"
                    }">
    <span class="user-messsage">${elements.data().userMsg}</span>
    <br>
    <span class="chat-time">${dayjs(elements.data().time.toDate()).format(
                        "DD-MM-YYYY hh:mm"
                    )}</span>
    </div>`;

                userChatsContainer.innerHTML += div;
            });
            setTimeout(() => {
                userChatsContainer.scrollTop = userChatsContainer.scrollHeight;
            }, 100);
        } else {
            userChatsContainer.innerHTML =
                "<h1 style='text-align:center; margin-top:199px;'>No chats</h1>";
        }
    });
}


async function profileBydefault() {
    let userObj = await getDoc(doc(db, "userName", userId));

    userFirtsNameForEdit.value = userObj.data().firstname;
    userLastNameForEdit.value = userObj.data().lastname;
    userEmailForEdit.value = userObj.data().userEmail;
    selectedImage.src = userObj.data().userImg ? userObj.data().userImg : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3wksm3opkFrzaOCjlGYwLvKytFXdtB5ukWQ&usqp=CAU';
}


async function showProfileEditPage() {
    profileContainer[0].style.display = 'block';
    chatAppContainer[0].style.display = 'none';
}

updateBtn.addEventListener('click',profileEdit)

function profileEdit (){
    
    let obj = {
        firstname: userFirtsNameForEdit.value,
        lastname:userLastNameForEdit.value,
    }

    updateDoc(doc(db, "userName", userDivId), obj);

    profileBydefault()

    profileContainer[0].style.display = 'none';
    chatAppContainer[0].style.display = 'flex';
}

imageInput.addEventListener('change',async () => {
    
await uploadBytes(storageRef, imageInput.files[0]).then((snapshot) => {
    console.log('file is uploaded succesfully')
    getDownloadURL(storageRef).then(async (url) => {
        let obj = {
            userImg: url
        }
        await updateDoc(doc(db, 'userName', userDivId), obj)
        profileBydefault()
    })
})
})