import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, signOut, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, setDoc, getDoc, getDocs, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

let signUpUserName = document.getElementById('sign-up-user-first-name');
let signUpUserLastName = document.getElementById('sign-up-user-last-name');
let signUpEmail = document.getElementById('sign-up-user-email');
let signUpPassword = document.getElementById('sign-up-user-password');
let signUpRepeatPassword = document.getElementById('sign-up-user-repeat-password');
let signInEmail = document.getElementById('user-email');
let signInPassword = document.getElementById('user-password');
let signUpForm = document.getElementById('sign-up-form');
let signInForm = document.getElementById('sign-in-form');
let loginTxt = document.getElementById('login-txt');
let signupTxt = document.getElementById('signup-txt');
let signUpDiv = document.getElementById('sign-up');
let LoginDiv = document.getElementById('sign-in');
let loader = document.getElementById('loader');
let authContainer = document.getElementsByClassName('auth-container');
let chatAppContainer = document.getElementsByClassName('chat-app-container');
let profileContainer = document.getElementsByClassName('profile-container');
let inputs = document.getElementsByClassName('inputs');

const firebaseConfig = {
    apiKey: "AIzaSyBl_MgCYaWNcQxbCDFEIem0KT_scTJ2NIc",
    authDomain: "chat-app-9e4d1.firebaseapp.com",
    projectId: "chat-app-9e4d1",
    storageBucket: "chat-app-9e4d1.appspot.com",
    messagingSenderId: "339356442836",
    appId: "1:339356442836:web:378dc157ce38c092efdb41"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let db = getFirestore(app)
let userId = '';
let userName = '';

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        chatAppContainer[0].style.display = 'flex'
        authContainer[0].style.display = 'none'
        loader.style.display = 'none';
        userId = user.uid;

        
        let userNameObj = await getDoc(doc(db, 'userName', userId)) 

        let { firstname, lastname } = userNameObj.data()
        userName = `${firstname} ${lastname}`

        // ...
    } else {
        // User is signed out
        // ...
        chatAppContainer[0].style.display = 'none';
        authContainer[0].style.display = 'flex';
        loader.style.display = 'none';
    }
});

signInPassword.addEventListener('focus', () => {
    signInPassword.style.borderColor = 'rgb(98, 94, 94)';
    signInPassword.style.boxShadow = 'none';
})

signUpRepeatPassword.addEventListener('focus', () => {
    signUpRepeatPassword.style.borderColor = 'rgb(98, 94, 94)';
    signUpRepeatPassword.style.boxShadow = 'none';

})

signUpForm.addEventListener('submit', a => {

    a.preventDefault()

    if (signUpPassword.value == signUpRepeatPassword.value) {

        createUserWithEmailAndPassword(auth, signUpEmail.value, signUpPassword.value)
            .then(async (userCredential) => {
                // Signed up 
                userId = userCredential.user.uid;
                chatAppContainer[0].style.display = 'flex'
                authContainer[0].style.display = 'none'

                await setDoc(doc(db, 'userName', userId), {
                    firstname: signUpUserName.value,
                    lastname: signUpUserLastName.value,
                    userImg: '',
                    userEmail: userCredential.user.email
                })

                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].value = ''
                }
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage)

                chatAppContainer[0].style.display = 'none'
                authContainer[0].style.display = 'flex'

                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].value = ''
                }
                // ..
            });
    } else {
        signUpRepeatPassword.style.borderColor = 'red';
        signUpRepeatPassword.style.boxShadow = '0px 0px 5px red';
        signUpRepeatPassword.value = '';
    }

})

signInForm.addEventListener('submit', a => {
    a.preventDefault()

    signInWithEmailAndPassword(auth, signInEmail.value, signInPassword.value)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            userId = user.uid;
            chatAppContainer[0].style.display = 'flex';
            authContainer[0].style.display = 'none';

            for (let i = 0; i < inputs.length; i++) {
                inputs[i].value = ''
            }

            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage)
            chatAppContainer[0].style.display = 'none'
                authContainer[0].style.display = 'flex'
            signInPassword.value = '';
            signInPassword.style.borderColor = 'red';
            signInPassword.style.boxShadow = '0px 0px 5px red';
        });


}
)


loginTxt.addEventListener("click", function () {
    LoginDiv.style.display = 'block';
    signUpDiv.style.display = 'none';
})

signupTxt.addEventListener("click", function () {
    LoginDiv.style.display = 'none';
    signUpDiv.style.display = 'block';
})