const logOut = document.getElementById("logOut");
const crtGrp = document.getElementById("dropdown");
const grptbody = document.getElementById("grptbody");
const chatthead = document.getElementById("chatthead");
const main_chat = document.getElementById("main-chat");
const inviteLink = document.getElementById("inviteLink");
const invitebtn = document.getElementById("invite");

invitebtn.addEventListener("click", (e) => {
  e.preventDefault();
  axios.get(`${inviteLink.value}`, { headers: { Authorization: localStorage.getItem("token") }, }).then((result) => {

  }).catch((err) => {
    alert("Already a user.");
  });
  location.reload();
});

crtGrp.addEventListener("click", (e) => {
  e.preventDefault();
  const grpName = prompt("Name your Group:", "New Group");
  if (grpName) {
    axios.get(`http://100.26.98.177/groupParams/${grpName}`, { headers: { Authorization: localStorage.getItem("token") }, }).then((result) => {

    }).catch((err) => {
      console.log(err);
    });
  }
  location.reload();
});

logOut.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  localStorage.removeItem("message");
  location.replace("http://100.26.98.177/logIn/login.html");
});

window.addEventListener("DOMContentLoaded", async (e) => {
  e.preventDefault();
  if (!localStorage.getItem("token")) {
    location.replace("http://100.26.98.177/logIn/login.html");
  }
  try {
    renderGroup();
  } catch (err) {
    localStorage.removeItem("token");
    localStorage.removeItem("message");
    location.replace("http://100.26.98.177/logIn/login.html");
  }
});

async function renderChat(groupName, groupId) {
  main_chat.innerHTML = `<div class="table-responsive" style="overflow-x: hidden;">
                      <table class="table table-striped" id="table">
                        <thead id="chatthead">
                          <tr>
                            <th scope="col">${groupName}
                            <div class="btn-group dropend"> 
                            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="width: 35px; padding-top: 0"></button>
                            <ul class="dropdown-menu dropdown-menu-end" id="dropdown2">
                              <li><a class="dropdown-item" href="#">Copy invite link</a></li>
                              <li><a class="dropdown-item" href="#">Group members</a></li>
                              <li><a class="dropdown-item" href="#">Delete group</a></li>
                            </ul>
                            </div>
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
  const copyLink = document.getElementById("dropdown2");
  const chattbody = document.getElementById("chattbody");
  const chat = document.getElementById("chat");
  const send = document.getElementById("send");
  copyLink.addEventListener("click", (e) => {
    if (e.target.textContent == "Copy invite link") {
      let inputElement = document.createElement("input");
      inputElement.setAttribute(
        "value",
        `http://100.26.98.177/copyLink?grpname=${groupName}&grpId=${groupId}`
      );
      document.body.appendChild(inputElement);
      inputElement.select();
      document.execCommand("copy");
      inputElement.parentNode.removeChild(inputElement);
    } else if (e.target.textContent === "Group members") {
      axios
        .get(`http://100.26.98.177/groupInfo/${groupId}`, {
          headers: { Authorization: localStorage.getItem("token") },
        })
        .then((result) => {
          chattbody.innerHTML = ``;
          result.data
            .slice(0, result.data.length - 1)
            .forEach(async (element) => {
              const row = document.createElement("tr");
              const data = document.createElement("td");
              const User = await axios.get(
                `http://100.26.98.177/getUser/${element.member}`,
                { headers: { Authorization: localStorage.getItem("token") } }
              );
              if (result.data.slice(-1)[0] === true) {
                if (element.member == element.admin) {
                  data.appendChild(
                    document.createTextNode(
                      `${User.data.first} ${User.data.sur} (ADMIN)`
                    )
                  );
                  row.appendChild(data);
                  row.setAttribute("id", element.member);
                  chattbody.appendChild(row);
                } else {
                  data.appendChild(
                    document.createTextNode(
                      `${User.data.first} ${User.data.sur}`
                    )
                  );
                  const deleteb = document.createElement("button");
                  deleteb.setAttribute("class", "btn btn-danger btn-sm");
                  deleteb.setAttribute("type", "button");
                  deleteb.appendChild(document.createTextNode("Remove"));
                  deleteb.addEventListener("click", (e) => {
                    e.preventDefault();
                    axios.get(
                      `http://100.26.98.177/removeMember?memberId=${e.target.parentElement.id}&groupId=${groupId}`,
                      {
                        headers: {
                          Authorization: localStorage.getItem("token"),
                        },
                      }
                    );
                    chattbody.removeChild(e.target.parentElement);
                  });
                  row.appendChild(data);
                  row.appendChild(deleteb);
                  row.setAttribute("id", element.member);
                  chattbody.appendChild(row);
                }
              } else {
                if (element.member == element.admin) {
                  data.appendChild(
                    document.createTextNode(
                      `${User.data.first} ${User.data.sur} (ADMIN)`
                    )
                  );
                  row.appendChild(data);
                  chattbody.appendChild(row);
                } else {
                  data.appendChild(
                    document.createTextNode(
                      `${User.data.first} ${User.data.sur}`
                    )
                  );
                  row.appendChild(data);
                  chattbody.appendChild(row);
                }
              }
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get(`http://100.26.98.177/deleteGroup/${groupId}`, {
          headers: { Authorization: localStorage.getItem("token") },
        })
        .then((result) => {
          location.reload();
        })
        .catch((err) => {
          alert("Sorry. You are not the admin.");
          console.log(err);
        });
    }
  });
  send.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        "http://100.26.98.177/postChat",
        {
          chat: chat.value,
          chatgroupid: groupId,
        },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      try {
        const row = document.createElement("tr");
        const data = document.createElement("td");
        const User = await axios.get(
          `http://100.26.98.177/getUser/${result.data.UserId}`,
          { headers: { Authorization: localStorage.getItem("token") } }
        );
        data.appendChild(
          document.createTextNode(
            `${User.data.first} ${User.data.sur}: ` + result.data.chat
          )
        );
        row.appendChild(data);
        chattbody.appendChild(row);
      } catch (err) {
        console.log(err);
      }
    } catch (error) {
      console.log(error);
    }
  });
  localStorage.setItem("message", JSON.stringify([]));
  try {
    const chat = await axios.get(`http://100.26.98.177/getChat/?MessageId=${JSON.parse(localStorage.getItem("message"))[-1]}&chatGroup=${groupName}`,
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    if (chat) {
      message = JSON.parse(localStorage.getItem("message"));
      message = message.concat(chat.data);
      message = message.slice(-10);
      localStorage.setItem("message", JSON.stringify(message));
    }
    array = JSON.parse(localStorage.getItem("message"));
    for (element of array) {
      const row = document.createElement("tr");
      const data = document.createElement("td");
      try {
        const User = await axios.get(`http://100.26.98.177/getUser/${element.UserId}`,
          { headers: { Authorization: localStorage.getItem("token") } }
        );
        data.appendChild(
          document.createTextNode(
            `${User.data.first} ${User.data.sur}: ` + element.chat
          )
        );
        row.appendChild(data);
        chattbody.appendChild(row);
      } catch (error) {
        console.log(error);
      }
    }
  }catch (err) {
    console.log(err);
  }
}

let selectedRow = null;
async function renderGroup() {
  axios
    .get(`http://100.26.98.177/group/getGroup`, {
      headers: { Authorization: localStorage.getItem("token") },
    })
    .then((result) => {
      for (element of result.data) {
        const row = document.createElement("tr");
        row.setAttribute("id", `${element.GroupId}`);
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
              `http://100.26.98.177/group/getGroupChat/${e.target.parentElement.id}`,
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
                    `http://100.26.98.177/getUser/${element.UserId}`,
                    {
                      headers: { Authorization: localStorage.getItem("token") },
                    }
                  );
                  data.appendChild(document.createTextNode(
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

function myFunction() {
  const input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
