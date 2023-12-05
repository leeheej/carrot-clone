const caleTime = (timestemp) => {
  const curTime = new Date().getTime() - 9 * 60 * 60 * 1000; //한국시간 utc+9
  const time = new Date(curTime - timestemp);
  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();

  if (hour > 0) return `${hour}시간 전`;
  else if (minute > 0) return `${minute}분 전`;
  else if (second > 0) return `${second}초 전`;
  else "방금 전";
};

const renderData = (data) => {
  //data = [{id:1, title:"aaa",...}] 이런식으로 값이 들어옴
  //data.forEach((obj) => console.log(obj.id))
  /*
    data = [
        {id : 1, title:"aaa"},
        {id : 2, title:"bbb"}
    ]
    data.forEach(obj) => console.log(obj.id)
    //결과 : 1, 2
    */

  const main = document.querySelector("main");
  // ['a','b',...] 이렇게 입력되는데 그러면 최신 글 순서로 안보임
  // ['a','b','c'].reverse() // ['c','b','a']로 출력
  data.reverse().forEach(async (obj) => {
    const div = document.createElement("div");
    div.className = "item-list";

    const imgDiv = document.createElement("div");
    imgDiv.className = "item-list__img";

    const img = document.createElement("img");
    const res = await fetch(`/images/${obj.id}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    img.src = url;

    const InfoDiv = document.createElement("div");
    InfoDiv.className = "item-list__info";

    const InfoTitleDiv = document.createElement("div");
    InfoTitleDiv.className = "item-list__info-title";
    InfoTitleDiv.innerText = obj.title;

    const InfoMetaDiv = document.createElement("div");
    InfoMetaDiv.className = "item-list__info-meta";
    InfoMetaDiv.innerText = obj.plac + caleTime(obj.insertAt);

    const InfoPriceDiv = document.createElement("div");
    InfoPriceDiv.className = "item-list__info-price";
    InfoPriceDiv.innerText = obj.price;

    imgDiv.appendChild(img);
    InfoDiv.appendChild(InfoTitleDiv);
    InfoDiv.appendChild(InfoMetaDiv);
    InfoDiv.appendChild(InfoPriceDiv);

    div.appendChild(imgDiv);
    div.appendChild(InfoDiv);

    main.appendChild(div);
  });
};

const fetchlist = async () => {
  const res = await fetch("/prd");
  const data = await res.json();
  //console.log(data);
  renderData(data);
};

fetchlist();
