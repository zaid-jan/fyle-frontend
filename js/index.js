var query = "";
var data = [];
var currData = [];
var pageLimit = 10; //user
var firstPage = 1;
var currPage = 0;
var maxPage = 10
var totalItems = 10;

const compute = () => {
    // console.log("compute called")
    totalItems = currData.length;
    maxPage = Math.ceil(totalItems / pageLimit);
    if(maxPage === 0){
        maxPage = 1;
    }
}

window.onload = async () => {
    waitForData();
    await getData();
    dataRecieved();
}

const waitForData = () => {
    console.log("recieving data");
    document.getElementById("searchValue").disabled = true;
    document.getElementById("contents").innerHTML = "Waiting for data";
}

const getData = async () => {
    const url = `https://vast-shore-74260.herokuapp.com/banks?city=MUMBAI`
    let storageData = JSON.parse(sessionStorage.getItem(url));
    // console.log("storageData", storageData)
    if (storageData === null) {
        console.log("not in cache");
        let fetch = await axios.get(url)
        sessionStorage.setItem(url, JSON.stringify(fetch.data));
    } else {
        console.log("in cache")
    }
    data = JSON.parse(sessionStorage.getItem(url));  
    currData = data;
}

const dataRecieved = () => {
    console.log("recieved data");
    document.getElementById("searchValue").disabled = false;    
    populate(data);
}

const populate = () => {
    compute(); 
    viewCurrPage();
    let html = "";
    if(currData.length === 0){
        html = `Relevant Items Not Found`
        document.getElementById("contents").innerHTML = html
    }
    else {
        repopulate();
    }
}

const repopulate = () => {  
    console.log("session storage");
    for (i = 0; i < sessionStorage.length; i++) {
        console.log(sessionStorage.key(i) + "=[" + sessionStorage.getItem(sessionStorage.key(i)) + "]");
    }     
    let html = "";
    let counter = currPage * pageLimit
    // console.log("counter", counter);
    // console.log("counter+pageLimit", counter+pageLimit-1)
    for(let i = counter; i < counter + pageLimit && i < totalItems; i++){
        // console.log("iter", i);
        html += createHTML(currData[i])
    }       
    // console.log(html)
    console.log("currData\n",currData)
    // console.log("length", currData.length)
    // console.log("html", html)
    document.getElementById("contents").innerHTML = html;
}


const countSize = (data) => {
    return data.length;
}

const createHTML = (bankObj) => {
    let ifsc = bankObj.ifsc;
    let val = sessionStorage.getItem(ifsc);
    let fav = "";
    if(val === null){
        fav = "Favourite";
    } else if(val === "true"){
        fav = "Unfavourite";
    } else {
        fav = "Favourite";
    }
    console.log("val", val);
    console.log("fav", fav);
    var html =`
    <li class="w3-bar w3-border w3-light-grey cardList w3-bar-item">
        <div class=row>
            <div class="col-md-9 w3-bar-item">
                <span class="w3-large"> ${bankObj.bank_name}</span><br>
                <span class=spanHeadingText>IFSC: </span><span class=spanDetails>${bankObj.ifsc}</span><br>
                <span class=spanHeadingText>Address: </span><span class=spanDetails>${bankObj.address}</span><br>
                <span class=spanHeadingText>Branch: </span><span class=spanDetails>${bankObj.branch}</span><br>
                <span class=spanHeadingText>District: </span><span class=spanDetails>${bankObj.district}</span><br>        
                <span class=spanHeadingText> State: </span><span class=spanDetails>${bankObj.state}</span><br>
            </div>
            <div class="col-md-3"><input type="button" ifsc=${bankObj.ifsc} class=fav value="${fav}" onClick="handleFav(event)"></div>
        </div>
    </li>
    `
    return html;
}

const handleFav = (e) => {
    const ifsc = e.target.getAttribute('ifsc')
    const fav =  e.target.value;
    console.log(e.target.value)
    if(fav === "Favourite"){        
        e.target.value = 'Unfavourite'       
        sessionStorage.setItem(ifsc, true)
        console.log("is session", sessionStorage.getItem(ifsc));
    } else {
        e.target.value = "Favourite" 
        sessionStorage.setItem(ifsc, false);
        console.log("is session", sessionStorage.getItem(ifsc));        
    }
} 

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

var myEfficientFn = debounce(function() {
    //make changes to currPage, number of pages, 
    currPage = 0;
    let searchValue = document.getElementById("searchValue").value;
    searchValue = searchValue.toUpperCase();
    // console.log("search value", searchValue);
    findInData(searchValue)
    populate(currData)
}, 1000);

const findInData = (searchValue) => {
    currData = []
    for(obj of data){
        // console.log(obj);        
        let found = 0;
        for(keys in obj){
            if(typeof obj[keys] === "string"){
                let pos = obj[keys].indexOf(searchValue);
                // console.log(pos)
                if(pos !== -1){
                    // console.log("found on object in key", obj[keys]);
                    found = 1;
                }
            }            
        }       
        if(found === 1){
            let newObj = obj; 
            // console.log("found match", obj);
            currData[currData.length] = newObj;
            // console.log("newData", newData)
        }
    }
}

const viewCurrPage = () => {
    console.log("currPage", currPage)
    document.getElementById("currPage").innerHTML = `${currPage+1} / ${maxPage}`;
}

const increment = () => {
    console.log("currPage", currPage)
    if(currPage >= maxPage - 1){

    } else {
        currPage++;
        viewCurrPage();
        repopulate();
    }    
}

const decrement = () => {
    console.log("currPage", currPage)
    if(currPage <= 0){
        
    }
    else {
        currPage--;
        viewCurrPage();
        repopulate();
    }    
}