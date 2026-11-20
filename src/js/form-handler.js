/* Contact form: client-side validation and native Netlify Forms submission. */
(function () {
  "use strict";

  function fieldError(input, message) {
    var errorNode = document.getElementById(input.id + "-error");
    if (errorNode) {
      errorNode.textContent = message || "";
    }
    if (message) {
      input.setAttribute("aria-invalid", "true");
    } else {
      input.removeAttribute("aria-invalid");
    }
  }

  function validate(form) {
    var invalid = [];

    var name = form.elements.name;
    var email = form.elements.email;
    var projectType = form.elements.projectType;
    var message = form.elements.message;

    if (!name.value.trim() || name.value.trim().length < 2) {
      fieldError(name, "Enter your name (at least 2 characters).");
      invalid.push(name);
    } else {
      fieldError(name, "");
    }

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailPattern.test(email.value.trim())) {
      fieldError(email, "Enter a valid email address.");
      invalid.push(email);
    } else {
      fieldError(email, "");
    }

    if (!projectType.value) {
      fieldError(projectType, "Select the type of work this is closest to.");
      invalid.push(projectType);
    } else {
      fieldError(projectType, "");
    }

    if (message.value.trim().length < 20) {
      fieldError(message, "Add a little more detail (at least 20 characters).");
      invalid.push(message);
    } else {
      fieldError(message, "");
    }

    return invalid;
  }

  function init() {
    var form = document.getElementById("contactForm");
    if (!form) {
      return;
    }

    var status = document.getElementById("formStatus");
    var submitButton = document.getElementById("submitButton");
    var submitting = false;

    function setStatus(state, html) {
      status.dataset.state = state;
      status.innerHTML = html;
      status.classList.add("is-visible");
      status.focus({ preventScroll: false });
    }

    function clearStatus() {
      status.classList.remove("is-visible");
      status.textContent = "";
      delete status.dataset.state;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearStatus();

      // Bot trap: legitimate users never fill this hidden field.
      if (submitting || (form.elements["bot-field"] && form.elements["bot-field"].value)) {
        return;
      }

      var invalid = validate(form);
      if (invalid.length > 0) {
        setStatus(
          "error",
          "Please check the highlighted fields and send again."
        );
        invalid[0].focus();
        return;
      }

      var originalLabel = submitButton.textContent;
      submitting = true;
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
      submitButton.textContent = "Sending…";

      var controller = new AbortController();
      var timeout = window.setTimeout(function () {
        controller.abort();
      }, 20000);

      var formData = new FormData(form);
      formData.set("name", form.elements.name.value.trim());
      formData.set("email", form.elements.email.value.trim());
      formData.set("projectType", form.elements.projectType.value);
      formData.set("message", form.elements.message.value.trim());

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
        signal: controller.signal
      })
        .then(function (response) {
          return { ok: response.ok };
        })
        .then(function (result) {
          if (result.ok) {
            form.reset();
            ["name", "email", "projectType", "message"].forEach(function (key) {
              fieldError(form.elements[key], "");
            });
            setStatus(
              "success",
              "Your enquiry has been received. I’ll reply to the email address you provided."
            );
            return;
          }

          setStatus(
            "error",
            "The message could not be sent. Please check your connection and try again, or use the direct email link."
          );
        })
        .catch(function () {
          setStatus(
            "error",
            "The message could not be sent — the server did not respond. Please try again or use the direct email link."
          );
        })
        .finally(function () {
          window.clearTimeout(timeout);
          submitButton.disabled = false;
          submitting = false;
          submitButton.removeAttribute("aria-busy");
          submitButton.textContent = originalLabel;
        });
    });

    // Clear a field error as soon as the user corrects it.
    form.addEventListener("input", function (event) {
      var target = event.target;
      if (target.matches("input, select, textarea") && target.id) {
        fieldError(target, "");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
