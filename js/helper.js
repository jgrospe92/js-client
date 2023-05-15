/**
 * @description hides the create actor button
 */
const hideCreateActorBtn = () => {
  document.getElementById("create_actorBtn").style.display = "none";
};

/**
 * @description shows the create actor button
 */
const showCreateActorBtn = () => {
  document.getElementById("create_actorBtn").style.display = "block";
};

window.addEventListener("load", hideCreateActorBtn());
