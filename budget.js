let form = document.getElementById("enterForm");
let des = document.getElementById("description");
let amt = document.getElementById("amount");
let trans = document.getElementById("transactions");
let inEx = document.getElementById("type");

let transactions = [];
let editIndex = -1;
form.addEventListener("submit",(e)=>{
    e.preventDefault();
    let desValue = des.value.trim();
    let amtValue = amt.value.trim();
    let amtNumber = parseFloat(amtValue)
    let inExValue = inEx.value;

    if(desValue === "" || amtValue ===""|| inExValue ===""){
        alert("Please enter all the fields")
        return;
    }
    if(isNaN(amtNumber) || amtValue <= 0){
     alert("please enter a valid positive amount");
     return;
    }

     let newTrans = {
       desText: desValue,
       amtText: amtNumber,
       inExText:inExValue,  
     }
    if(editIndex === -1){
      transactions.push(newTrans)
    } 
    else{
        transactions[editIndex] = newTrans;
        editIndex = -1;
       
    }
    savetransactionsToLocalStorage()
    form.reset();
    renderBudget()
})
function renderBudget(){
  trans.innerHTML = "";
  transactions.forEach((ta,index)=>{
    let li = document.createElement("li")
       
    li.innerHTML = `${index +1}: ${ta.desText} ${ta.amtText} ${ta.inExText}`;
    
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.padding = "6px";
    deleteBtn.style.marginLeft ="5px"
    deleteBtn.onclick = ()=> handleDelete(index);
     

    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.style.padding = "6px";
    editBtn.style.marginLeft = "10px";
    editBtn.onclick = ()=>handleEdit(index);
    
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    trans.appendChild(li);
  })
  updateSummary();
}
function handleDelete(index){
    transactions.splice(index,1);
    savetransactionsToLocalStorage();
    renderBudget();
}

function handleEdit(index){
    const transaction = transactions[index];
     des.value = transaction.desText;
     amt.value = transaction.amtText;
     inEx.value = transaction.inExText;
      editIndex = index;
}   

function savetransactionsToLocalStorage(){
    localStorage.setItem("transactions",JSON.stringify(transactions));
}
function loadtransactionsFromLocalStorage(){
    const saved = localStorage.getItem("transactions");
    if(saved) {
        transactions = JSON.parse(saved)
    }
}
loadtransactionsFromLocalStorage()
renderBudget();

function updateSummary(){
    let income = 0;
    let expense = 0;

    transactions.forEach((t)=>{
        let amount = parseFloat(t.amtText);
        if(t.inExText === "income"){
            income += amount;
        }
        else if(t.inExText === "expense"){
           expense += amount;
        }
    });
    let balance = income - expense;
    document.getElementById("balance").textContent =balance.toFixed(2);
    document.getElementById("totalincome").textContent = income.toFixed(2);
    document.getElementById("totalexpense").textContent = expense.toFixed(2);
}