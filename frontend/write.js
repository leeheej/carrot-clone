const form = document.getElementById("write-form");

const handleSubmitForm = async (event) => {
  event.preventDefault();
  const body = new FormData(form);
  body.append("insertAt", new Date().getTime());

  try {
    const res = await fetch("/prd", {
      method: "POST",
      body,
    });
    const data = await res.json();
    if (data === "200") window.location.pathname = "/";
  } catch (e) {
    console.error(e);
  } // try에서 로직 실행, 에러 발생 시 아래 로직 실행

  /*
  await res fetch("/prd", {
    method: "POST",
    body: new FormData(form),
  });
  const data = await res.json();
  if (data==='200') window.loacation.pathname = "/";
  else console.error('fail');
  */
};

form.addEventListener("submit", handleSubmitForm);
//submit은 이벤트 제출 후 reload 시켜서 이를 방지해줘야함
