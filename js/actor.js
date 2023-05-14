/**
 * @param {object} htmlElement object
 * @description validate and processes form data
 */
/**
 * @desc global variables
 */
const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", (e) => {
  "use strict";
  handleCreateActor(e);
});
/**
 * @description
 * @returns None
 */
const handleCreateActor = async (e) => {
  const form = document.getElementById("actor_form");
  let uri = new URL("films-api/actors", baseUrl);
  var myModalEl = document.getElementById("staticBackdrop");
  var modal = bootstrap.Modal.getOrCreateInstance(myModalEl);
  const fname = sanitizeInput(document.getElementById("first_name").value);
  const lname = sanitizeInput(document.getElementById("last_name").value);

  if (!fname || !lname) {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll(".needs-validation");
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms).forEach(function (form) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add("was-validated");
    });
    return;
  }

  var bodyReq = JSON.stringify([{ first_name: fname, last_name: lname }]);
  try {
    const response = await fetch(uri, {
      method: "POST",
      body: bodyReq,
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
  } catch (error) {
    console.error(error);
  }
  modal.hide();
  resetForm();
};
