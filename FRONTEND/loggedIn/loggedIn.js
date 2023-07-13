const logOut = document.getElementById("logOut");
const crtGrp = document.getElementById("dropdown");
const grptbody = document.getElementById("grptbody");
const chatthead = document.getElementById("chatthead");
const main_chat = document.getElementById("main-chat");

crtGrp.addEventListener("click", (e) => {
  e.preventDefault();
  const grpName = prompt("Name your Group:", "New Group");
  axios
    .get(`http://localhost:3000/groupParams/${grpName}`, {
      headers: { Authorization: localStorage.getItem("token") },
    })
    .then((result) => {
      // console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

logOut.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  localStorage.removeItem("message");
  location.replace("http://localhost:5500/FRONTEND/logIn/login.html");
});

window.addEventListener("DOMContentLoaded", async (e) => {
  e.preventDefault();
  if (!localStorage.getItem("token")) {
    location.replace("http://localhost:5500/FRONTEND/logIn/login.html");
  }
  // setInterval(async ()=>{
  try {
    // renderChat();
    renderGroup();
  } catch (err) {
    // localStorage.removeItem("token");
    // localStorage.removeItem("message");
    // location.replace("http://localhost:5500/FRONTEND/logIn/login.html");
  }
  // },1000)
});

async function renderChat(groupName, groupId) {
  main_chat.innerHTML = `<div class="table-responsive">
                      <table class="table table-striped" id="table">
                        <thead id="chatthead">
                          <tr>
                            <th scope="col">${groupName} 
                            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                              aria-expanded="false" style="width: 35px; padding: 0"></button>
                            <ul class="dropdown-menu dropdown-menu-end" id="dropdown2">
                              <li><a class="dropdown-item" href="#">Copy invite link</a></li>
                            </ul>
                            </th>                            
                          </tr>
                        </thead>
                        <tbody id="chattbody"></tbody>
                      </table>
                    </div>

                    <form action="#" class="form-grp">
                      <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="Message" aria-label="Message"
                          aria-describedby="button-addon2" id="chat">
                        <button type="button" class="btn btn-info" id="send">Send</button>
                      </div>
                    </form>`;
  const copyLink = document.getElementById('dropdown2')
  const chattbody = document.getElementById("chattbody");
  const chat = document.getElementById("chat");
  const send = document.getElementById("send");
  copyLink.addEventListener('click', (e)=>{
    let inputElement=document.createElement('input')
    inputElement.setAttribute('value', `http://localhost:3000/copyLink?grpname=${groupName}&grpId=${groupId}`)
    document.body.appendChild(inputElement)
    inputElement.select()
    document.execCommand('copy')
    inputElement.parentNode.removeChild(inputElement)
  })

  send.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        "http://localhost:3000/postChat",
        {
          chat: chat.value,
          chatgroupid: groupId,
        },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      console.log(result);
      try {
        const row = document.createElement("tr");
        const data = document.createElement("td");
        const User = await axios.get(
          `http://localhost:3000/getUser/${result.data.UserId}`,
          { headers: { Authorization: localStorage.getItem("token") } }
        );
        data.appendChild(
          document.createTextNode(
            `${User.data.first} ${User.data.sur}: ` + result.data.chat
          )
        );
        row.appendChild(data);
        console.log(row);
        chattbody.appendChild(row);
      } catch (err) {
        console.log(err);
      }
    } catch (error) {
      console.log(error);
    }
  });
  // localStorage.setItem("message", JSON.stringify([]));
  // try {
  //   const chat = await axios.get(`http://localhost:3000/getChat/?MessageId=${JSON.parse(localStorage.getItem("message"))[-1]}&chatGroup=${groupName}`,
  //     { headers: { Authorization: localStorage.getItem("token") } }
  //   );
  //   if (chat) {
  //     message = JSON.parse(localStorage.getItem("message"));
  //     message = message.concat(chat.data);
  //     message = message.slice(-10);
  //     localStorage.setItem("message", JSON.stringify(message));
  //   }
  //   array = JSON.parse(localStorage.getItem("message"));
  //   for (element of array) {
  //     const row = document.createElement("tr");
  //     const data = document.createElement("td");
  //     try {
  //       const User = await axios.get(`http://localhost:3000/getUser/${element.UserId}`,
  //         { headers: { Authorization: localStorage.getItem("token") } }
  //       );
  //       data.appendChild(
  //         document.createTextNode(
  //           `${User.data.first} ${User.data.sur}: ` + element.chat
  //         )
  //       );
  //       row.appendChild(data);
  //       chattbody.appendChild(row);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // }catch (err) {
  //   console.log(err);
  // }
}

let selectedRow = null;
async function renderGroup() {
  axios
    .get(`http://localhost:3000/group/getGroup`, {
      headers: { Authorization: localStorage.getItem("token") },
    })
    .then((result) => {
      for (element of result.data) {
        const row = document.createElement("tr");
        row.setAttribute("id", `${element.id}`);
        const data = document.createElement("td");
        data.appendChild(document.createTextNode(`${element.name}`));
        row.appendChild(data);
        row.addEventListener("click", (e) => {
          if (selectedRow) {
            selectedRow.removeAttribute("style");
          }
          e.target.setAttribute(
            "style",
            "background-color: #0095dd; color: white;"
          );
          selectedRow = e.target;

          axios
            .get(
              `http://localhost:3000/group/getGroupChat/${e.target.parentElement.id}`,
              {
                headers: { Authorization: localStorage.getItem("token") },
              }
            )
            .then((result) => {
              result.data.forEach(async (element) => {
                try {
                  const row = document.createElement("tr");
                  const data = document.createElement("td");
                  const User = await axios.get(
                    `http://localhost:3000/getUser/${element.UserId}`,
                    {
                      headers: { Authorization: localStorage.getItem("token") },
                    }
                  );
                  data.appendChild(
                    document.createTextNode(
                      `${User.data.first} ${User.data.sur}: ` + element.chat
                    )
                  );
                  row.appendChild(data);
                  chattbody.appendChild(row);
                } catch (err) {
                  console.log(err);
                }
              });
            })
            .catch((err) => {
              console.log(err);
            });
          renderChat(row.textContent, e.target.parentElement.id);
          chattbody.setAttribute("style", '"overflow-x: hidden;"');
        });
        grptbody.prepend(row);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
