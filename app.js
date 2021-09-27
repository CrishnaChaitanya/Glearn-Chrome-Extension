import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";
const firebaseConfig = {
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// let cityList;
async function klasslinks() {
  const citiesCol = collection(db, "classlinks");
  const citySnapshot = await getDocs(citiesCol);
  let cityList = citySnapshot.docs.map((doc) => doc.data());
  loadTableData(cityList);
  // console.log(cityList);
  // console.log(cityList[0].desc);
  // console.log(cityList[0].links);
  return cityList;
}
klasslinks();
// 😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀

loadTableData(personData);

function loadTableData(tableData) {
  const tableBody = document.getElementById("tableData");
  let dataHTML = "";
  for (let person of tableData) {
    dataHTML += `<tr><td>${person.desc}</td><td><a href="${person.links}"target="_blank>${person.links}</a></td></tr>`;
  }

  console.log(dataHTML);
  tableBody.innerHTML = dataHTML;
  console.log("asd");
}
