function handle(error) {
  // console.dir(error);

  let ErrBox = document.createElement("div");
  ErrBox.setAttribute("id", "ErrBox");

  let ErrMsg = document.createElement("div");
  ErrMsg.setAttribute("class", "jsErrMsg");

  let line = document.createElement("span");
  line.innerHTML =
    error.fileName +
    "<br><b>" +
    " Line: " +
    error.lineNumber +
    "</b> : " +
    error.columnNumber;
  let ErrName = document.createElement("p");
  ErrName.innerHTML = error.name;
  ErrName.setAttribute(
    "style",
    "font-weight: bold; text-decoration: underline;"
  );
  let ErrText = document.createElement("p");
  ErrText.innerHTML = error.message;

  ErrMsg.appendChild(line);
  ErrMsg.appendChild(ErrName);
  ErrMsg.appendChild(ErrText);

  if (document.getElementById("ErrBox") == undefined) {
    document.getElementById("body").appendChild(ErrBox);
    handelErrorStyles();
    ErrBox.appendChild(ErrMsg);
  } else {
    document.getElementById("ErrBox").appendChild(ErrMsg);
  }

  function handelErrorStyles() {
    var styles = `
    #ErrBox  {
      display: flex;
  justify-self: center;
  align-self: center;
  flex-direction: column;
  width: 60vw;
  position: fixed;
  top: 0px;
  left:20%;
  background-color: #f10e47;
  min-height: 5rem;
  padding: 0.5em;
}
.jsErrMsg {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 1em;
  margin: 0.5em 1em;
  border: 4px solid #fff;
  font-size: 1.2em;
  font-family: Helvetica, sans-serif;
  color: #f5f5f5;
  p {
    padding: 0.5em 0 0 0;
    margin: 0;
  }
  span {
    font-size: 0.9em;
    font-family: monospace;
  }
}
`;
    var styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }
}