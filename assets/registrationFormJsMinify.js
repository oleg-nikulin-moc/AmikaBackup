function getEmailByDistributor(distributor) {
  switch (distributor) {
    case "Armstrong McCall":
      return "KEdgar@cosmoprofbeauty.com";
    case "Aurora Beauty Supply":
      return "Venessa@aurorabeautyak.com";
    case "Beauty Craft":
      return "meghanm@beautycraft.com";
    case "Cosmo Prof":
      return "KSwick@Sallybeauty.com";
    case "Goldwell New York":
      return "mhaight@goldwellny.com";
    case "Hair-Lines":
      return "jessjpms@hotmail.com";
    case "MAKA Beauty Systems":
      return "MichelleK@makabeauty.com";
    case "ManocoBlue":
      return "mhooker@manocoblue.com";
    case "Paramount Beauty Distributors":
      return "fran@paramountbeauty.com";
    case "Prestige Salon Products":
      return "rhonda@prestigesalonproducts.com";
    case "SalonCentric":
      return "mcroud@saloncentric.com";
    case "Salon Service Group":
      return "bwolfangel@salonservicegroup.com";
    case "Salon Services Pro":
      return "annabellem@salonservicespro.com";
    case "State Beauty/RDA Pro Mart":
      return "RDell@saloncentric.com";
    case "TruBeauty Concepts":
      return "myrta@trubeautyconcepts.com";
    default:
      return "";
  }
}

function validateForm() {
  const e = document.getElementsByClassName("tab"),
    t = e[currentTab].querySelectorAll("[required]"),
    n = document.getElementById("password"),
    a = document.getElementById("confirmPassword"),
    o = document.getElementById("confirmPasswordError"),
    s = document.getElementById("passwordError");
  let l = !0;
  const i = document.querySelector("[data-terms-field]"),
    r = document.getElementById("submitBtn"),
    d =
      (document.getElementById("nextBtn"),
      document.getElementById("salon_name"),
      document.getElementById("salonNameError"),
      document.getElementById("phone")),
    c = document.getElementById("phoneError");
  let u = d.value.trim();
  const m = e[currentTab].querySelector("#account_number"),
    y = document.querySelector("#account_number"),
    p = document.getElementById("accountNumberError");
  let g = y.value.trim();
  const v = document.getElementById("emailMain"),
    f = document.getElementById("emailError");
  let h = v.value;
  const b = /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    E = e[currentTab].querySelector("#zip"),
    S = document.getElementById("zip"),
    w = document.getElementById("zipError");
  let x = v.value;
  const I = /^.{8,50}$/;
  function B() {
    var e;
    (l = !0),
      t.forEach(function (e) {
        "" === e.value
          ? (e.classList.add("invalid"),
            (l = !1),
            (e.nextElementSibling.textContent = "Empty value"))
          : e.value.length < 2
          ? (e.classList.add("invalid"),
            (l = !1),
            (e.nextElementSibling.textContent =
              "Text must be at least 2 characters"))
          : (e.classList.remove("invalid"),
            (e.nextElementSibling.textContent = ""));
      }),
      "" === u || validatePhoneNumber(u)
        ? ((c.style.display = "none"),
          (c.textContent = ""),
          d.classList.remove("invalid"))
        : ((c.style.display = "block"),
          (c.textContent = "Incorrect phone number"),
          d.classList.add("invalid"),
          (l = !1)),
      b.test(h)
        ? ((f.textContent = ""),
          (f.style.display = "none"),
          v.classList.remove("invalid"))
        : ((f.textContent = "Invalid email format"),
          (f.style.display = "block"),
          v.classList.add("invalid"),
          (l = !1)),
      I.test(n.value)
        ? n.value !== a.value
          ? ((o.textContent = "Passwords do not match"), (l = !1))
          : ((s.textContent = ""), (o.textContent = ""))
        : ((s.textContent = "Password must be at least 8 characters"),
          (l = !1)),
      !0 === E &&
        ("/^(d{3})sd{3}-d{4}$/".test((e = x)) ||
        "/^(+?1s?)?(()?(d{3})(?(2)))[-.s]?(d{3})[-.s]?(d{4})$/".test(e)
          ? ((w.textContent = ""),
            (w.style.display = "none"),
            S.classList.remove("invalid"))
          : ((w.textContent = "Invalid zip code format"),
            (w.style.display = "block"),
            S.classList.add("invalid"),
            (l = !1))),
      !0 === m &&
        (!(function (e) {
          return "/^.{5,50}$/".test(e);
        })(g)
          ? ((p.style.display = "block"),
            (p.textContent = "Incorrect phone number"),
            y.classList.add("invalid"),
            (l = !1))
          : ((p.style.display = "none"),
            (p.textContent = ""),
            y.classList.remove("invalid")));
  }
  function C(e) {
    const t = e.target,
      n = t.getAttribute("id");
    "email" === n
      ? (h = t.value)
      : "phone" === n
      ? (u = t.value)
      : "account_number" === n
      ? (g = t.value)
      : "zip" === n && (x = t.value),
      B();
  }
  return (
    i.addEventListener("change", function () {
      i.checked && l ? (r.disabled = !1) : (r.disabled = !0);
    }),
    t.forEach(function (e) {
      e.addEventListener("input", C);
    }),
    v?.addEventListener("input", C),
    d?.addEventListener("input", C),
    y?.addEventListener("input", C),
    n?.addEventListener("input", C),
    a?.addEventListener("input", C),
    i?.addEventListener("change", B),
    S?.addEventListener("change", B),
    B(),
    l
  );
}
function validatePhoneNumber(e) {
  return /^\d{10}$/.test(e.replace(/\s/g, ""));
}
function imagePreview() {
  const e = document.getElementById("file-input"),
    t = document.querySelector("[data-upload-text]"),
    n = document.querySelector("[data-remove-img]"),
    a = document.querySelector("[data-upload-file]"),
    o = document.querySelector("[ data-upload-image-wrap]"),
    s = t.textContent,
    l = document.getElementById("preview"),
    i = e.files[0];
  if (
    (i &&
      i.size > 5242880 &&
      (alert(
        "Розмір файлу перевищує максимально допустимий розмір (5 МБ). Будь ласка, виберіть файл меншого розміру."
      ),
      (e.value = "")),
    ["image/jpeg", "image/jpg", "application/pdf", "image/png"].includes(
      i.type
    ))
  ) {
    const r = e.value.split("\\").pop();
    if (r)
      if (
        ((t.textContent = r),
        (n.style.display = "flex"),
        (l.style.display = "block"),
        "application/pdf" === i.type)
      )
        (o.style.display = "none"), (a.style.display = "none");
      else {
        const e = new FileReader();
        (e.onload = (e) => {
          l.setAttribute("src", e.target.result),
            (a.style.display = "none"),
            (o.style.display = "block");
        }),
          e.readAsDataURL(i);
      }
    else
      (t.textContent = s),
        (n.style.display = "none"),
        (l.style.display = "none"),
        (a.style.display = "block");
  }
}
function removePreview() {
  const e = document.getElementById("file-input").files[0],
    t = document.querySelector("[data-upload-text]"),
    n = document.querySelector("[data-remove-img]"),
    a = document.querySelector("[data-upload-file]"),
    o = document.getElementById("preview"),
    s = t.textContent;
  (e.value = ""),
    (t.textContent = s),
    (n.style.display = "none"),
    (o.style.display = "none"),
    (a.style.display = "block");
}
const countrySelect = document.getElementById("country"),
  citySelect = document.getElementById("city"),
  zipField = document.getElementById("zip");

function toggleDivVisibility() {
  const e = document.querySelectorAll("[data-upload-image]")[0],
    t = document.querySelectorAll("[data-upload-image-block]")[0],
    n = e.value;
  t.style.display = "true" === n ? "block" : "none";
}
function popupRegstrationLoad() {
  const form = document.querySelector(".login-register-alert-popup");
  const stateSelect = form.querySelector("#state");
  citySelect && ((citySelect.disabled = !0), (zipField.disabled = !0)),
    stateSelect.addEventListener("change", () => {
      (citySelect.disabled = !1), (zipField.disabled = !1);
    });
}
function showSpinner() {
  const e = document.querySelector("[data-spinner-wrap]");
  document
    .querySelectorAll(".tingle-modal-box")
    .forEach((e) => (e.style.overflow = "hidden")),
    (e.style.display = "block");
}
function hideSpinner() {
  const e = document.querySelector("[data-spinner-wrap]");
  document
    .querySelectorAll(".tingle-modal-box")
    .forEach((e) => (e.style.overflow = "auto")),
    (e.style.display = "none");
}
const secretCode = "32kMURYG2ryEG5n4UEgzeaMpzpKMcoxJBNkvSiA2";
function generateAuthData(e) {
  return toBase64(JSON.stringify(e));
}
function generateToken(e, t) {
  const n = generateSecretSalt(e, t),
    a = toBase64(JSON.stringify(e)) + n,
    o = CryptoJS.SHA256(a);
  return toBase64(CryptoJS.enc.Hex.stringify(o));
}
function generateSecretSalt(e, t) {
  return toBase64(e.customer.email + "/" + t);
}
function toBase64(e) {
  return btoa(decodeURIComponent(encodeURIComponent(e)));
}
function submitForm(e) {
  const t = document.getElementById("create_customer");
  e.preventDefault();
  const n = document.getElementById("file-input"),
    a = t.phone.value.trim().replace(/-/g, "");
  const distributorEmail = getEmailByDistributor(t.distributorName.value);
  let o = "";
  o = "" !== a ? "+1" + a : a;
  const s = {
      customer: {
        first_name: t.firstName.value,
        last_name: t.last_name.value,
        email: t.email.value,
        account_number: t.account_number.value.replace(/\s/g, "_"),
        password: t.password.value,
        password_confirmation: t.confirmPassword.value,
        phone: o.replace(/ /g, ""),
        salon_name: t.salon_name.value,
        distributor_name: t.distributorName.value,
        distributor_email: distributorEmail,
        is_suit: t.isSuit.value,
        subscribe: t.subscribe.checked,
        addresses: [
          {
            salon_address: t.salon_address.value,
            country: t.country.value.toUpperCase(),
            state: t.province.value,
            city: t.city.value,
            zip: t.zip.value,
          },
        ],
      },
    },
    l = generateToken(s, secretCode),
    i = generateAuthData(s);
  console.log("generateToken", l), console.log("generateAuthData", i);
  showSpinner(),
    fetch(
      `https://cbb5e9xp3a.execute-api.us-east-1.amazonaws.com/auth/registration?auth_data=${i}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": l },
        body: JSON.stringify(s),
      }
    )
      .then((e) => e.json())
      .then((e) => {
        if (e.success) {
          if (n.files.length > 0) {
            const e = n.files[0],
              a = e.name.replace(/[\/+&\\]/g, "_"),
              o = btoa(t.email.value) + "&" + a;
            return fetch(
              `https://nrn4n1ioml.execute-api.us-east-1.amazonaws.com/auth/suits-images/${o}?auth_data=${i}`,
              {
                method: "POST",
                "x-api-key": l,
                headers: { "Content-Type": "multipart/form-data" },
                body: e,
              }
            )
              .then(function (e) {
                200 === e.status
                  ? (console.log("Response success"),
                    window.showSuccessForm(),
                    hideSpinner())
                  : alert("Image not uploaded.");
              })
              .catch(function (e) {
                hideSpinner(), console.error("Error:", e);
              });
          }
          if (e.success)
            return (
              console.log(
                "If successful but image loading is not required, perform the necessary actions."
              ),
              window.showSuccessForm(),
              hideSpinner(),
              Promise.resolve()
            );
          console.log("fieldName", e.errors[0].field_name),
            console.log("error_message", e.errors[0].error_message),
            hideSpinner(),
            window.hideRecoverPasswordForm(),
            hideSpinner(),
            console.log("Form submitted successfully");
        } else {
          console.log("Form submission error:", e.error_message), hideSpinner();
          const t = e.errors;
          console.log("responseErrors", t),
            t.forEach(function (e) {
              const t = e.field_name,
                n = e.error_message;
              if ("email" == t) {
                window.nextPrev(-2);
                const e = document.getElementById("email"),
                  t = document.getElementById("emailError");
                e.classList.add("invalid"),
                  (t.style.display = "block"),
                  (t.textContent = n);
              } else if ("account_number" == t) {
                const e = document.getElementById("account_number"),
                  an = document.getElementById("accountNumberError");
                e.classList.add("invalid"),
                  (an.style.display = "block"),
                  (an.textContent = n);
              } else if ("salon_address" == t) {
                window.nextPrev(-1);
                const e = document.getElementById("salon_address"),
                  sa = document.getElementById("salonAddressError");
                e.classList.add("invalid"),
                  (sa.style.display = "block"),
                  (sa.textContent = n);
              } else {
                window.nextPrev(-2);
                const e = document.getElementById(t),
                  a = document.getElementById(`${t}Error`);
                e.classList.add("invalid"),
                  (a.style.display = "block"),
                  (a.textContent = n);
              }
            });
        }
      })
      .catch((e) => {
        hideSpinner(), console.log(e);
      });
}
