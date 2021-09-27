// const puppeteer = require("puppeteer");
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore/lite";
const firebaseConfig = {
  apiKey: "AIzaSyAlOrsKxCYJMcOXmrFSX08RPeweyre6_n8",
  authDomain: "glearn-webextension.firebaseapp.com",
  databaseURL: "https://glearn-webextension-default-rtdb.firebaseio.com",
  projectId: "glearn-webextension",
  storageBucket: "glearn-webextension.appspot.com",
  messagingSenderId: "633343675352",
  appId: "1:633343675352:web:518a7bb3fc1a66578f00ad",
};

import puppeteer from "puppeteer";
const loginLink = "https://login.gitam.edu/Login.aspx";
const username = "121910302022";
const password = "69YHHC@3";

//initialize
let browerOpen = puppeteer.launch({
  headless: false,
  args: ["--start-maximized"], //full screen
  defaultViewport: null,
});
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let page;
var array = []; // to put all the non-sliced links
var desc = []; // session desc
var result = {};
export var cityList = await klasslinks();
//open browser instance
browerOpen
  .then(function (browserObj) {
    let browserOpenPromise = browserObj.newPage();
    return browserOpenPromise; //since it is a promise we are returning it
  })
  .then(function (newTab) {
    page = newTab;
    let gleanOpenPromise = newTab.goto(loginLink);
    return gleanOpenPromise;
  })
  .then(function () {
    let usernameEntered = page.type("input[id='txtusername']", username, {
      delay: 50,
    });
    return usernameEntered;
  })
  .then(function () {
    let passwordEntered = page.type("input[id='password']", password, {
      delay: 50,
    });
    return passwordEntered;
  })
  .then(function () {
    let loginButtonClicked = page.click("input[id='Submit']", { delay: 50 });
    return loginButtonClicked;
  })
  .then(function () {
    let clickOnGlearn = waitAndClick(
      "#MainContent_studentg > div:nth-child(12) > a",
      page
    );
    return clickOnGlearn;
  })
  .then(function () {
    let waitForSomeTime = page.waitFor(5000);
    return waitForSomeTime;
  })
  .then(function () {
    let glearn = page.goto("http://glearn.gitam.edu/student/welcome.aspx");
    return glearn;
  })
  .then(function () {
    const grupos = page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "#ContentPlaceHolder1_GridViewonline > tbody > tr > td > a"
        ),
        (element) => element.href
      )
    );
    return grupos;
  })
  .then(function (groups) {
    array = groups;
    console.log(array);
  })
  .then(function () {
    const grupos = page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "#ContentPlaceHolder1_GridViewonline > tbody > tr > td > a"
        ),
        (element) => element.innerText
      )
    );
    return grupos;
  })
  .then(function (grupos) {
    desc = grupos;
    console.log(desc);
  })
  .then(function () {
    desc.forEach((klass, i) => (result[klass] = array[i]));
    console.log(result);
  })
  .then(function () {
    for (let index = 0; index < Object.keys(result).length; index++) {
      var astring = stripThatDown(Object.keys(result)[index]).trim();
      // console.log(astring + "---->" + typeof astring);
      // console.log(todaysDate() + "--->" + typeof todaysDate());
      // console.log(astring === todaysDate());
      var bstring = todaysDate();
      if (astring === bstring) {
        console.log("Yesss");
        const docRef = addDoc(collection(db, "classlinks"), {
          desc: Object.keys(result)[index],
          links: Object.values(result)[index],
        });
        console.log(docRef);
      } else {
        console.log("NOuuuu");
      }
    }
  })
  .then(console.log(klasslinks()));

//A function which waits for the full page to load.
const waitAndClick = (selector, currentPage) => {
  return new Promise(function (resolve, reject) {
    let waitForModelPromise = currentPage.waitForSelector(selector);
    waitForModelPromise
      .then(function () {
        let clickModel = currentPage.click(selector);
        return clickModel;
      })
      .then(function () {
        resolve();
      })
      .catch(function (err) {
        reject();
      });
  });
};
//Gives the present day date
const todaysDate = () => {
  const d = new Date();
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
  const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);

  // console.log(`${da}-${mo}-${ye}`);
  return `${da}-${mo}-${ye}`;
};
//Split the Description
const stripThatDown = (astring) => {
  let strippedText = astring.split(":");
  return strippedText[1];
};

async function klasslinks() {
  const citiesCol = collection(db, "classlinks");
  const citySnapshot = await getDocs(citiesCol);
  cityList = citySnapshot.docs.map((doc) => doc.data());
  console.log(cityList);
  return JSON.stringify(cityList);
}
