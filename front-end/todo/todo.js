/* ---------------------------INITIALISATION--------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("popup");
  const openPopup = document.getElementById("open-popup");
  const closePopup = document.getElementById("close-popup");
  const form = document.getElementById("todo-form");
  const todoList = document.getElementById("todo-list");

  const taskInput = document.getElementById("task");
  const descInput = document.getElementById("desc");
  const dateInput = document.getElementById("date");
  const statusSelect = document.getElementById("status");

 /* ---------------------------POP-UP OUVERTURE / FERMETURE--------------------------- */
  openPopup.addEventListener("click", () => {
    popup.style.display = "flex";
    taskInput.focus();
  });

  closePopup.addEventListener("click", () => {
    popup.style.display = "none";
  });

  // Fermer si clic en dehors
  popup.addEventListener("click", (e) => {
    if (e.target === popup) popup.style.display = "none";
  });

  /* ---------------------------SUBMIT FORMULAIRE--------------------------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const task = taskInput.value.trim();
    if (!task) return;

    const desc = descInput.value.trim();
    const deadline = dateInput.value;
    const status = statusSelect.value;

    // Création de carte 
    const card = document.createElement("div");
    card.className = "task-card";
    card.innerHTML = `
      <div class="new-task">
        <h3>${task}</h3>
        <div class="task-buttons">
          <button type="button" class="check-btn" title="check"><i class='bx  bx-checkbox'></i> </button>
          <button type="button" class="mod-btn" title="Modifier"><i class='bx bx-pen'></i></button>
          <button type="button" class="rm-btn" title="Supprimer"><i class='bx bx-trash-alt'></i></button>
        </div>
      </div>
      <div class="task-details" style="display:none;">
        <p><strong>Description:</strong> ${desc || "—"}</p>
        <p><strong>Deadline:</strong> ${deadline || "—"}</p>
        <p><strong>Status:</strong> ${status}</p>
      </div>
    `;

   /* ---------------------------BOUTON CHECK--------------------------- */
    const checkBtn = card.querySelector(".check-btn");
    const checkIcon = checkBtn.querySelector("i");

    checkBtn.addEventListener("click", () => {
      checkIcon.classList.toggle("bx-checkbox");         // enlève / remet l’ancienne icône
      checkIcon.classList.toggle("bx-checkbox-square");  // ajoute / enlève la nouvelle icône

      card.querySelector("h3").classList.toggle("task-done"); // ← ligne ajoutée : barre le titre
    });

/* ---------------------------AFFICHAGE / MASQUAGE DETAILS--------------------------- */
    const title = card.querySelector("h3");
    const details = card.querySelector(".task-details");
    title.addEventListener("click", () => {
      details.style.display = details.style.display === "none" ? "block" : "none";
    });

  /* ---------------------------BOUTON SUPPRIMER--------------------------- */ //Class = .rm-btn
    card.querySelector(".rm-btn").addEventListener("click", () => card.remove()); 

  /* ---------------------------BOUTON MODIFIER--------------------------- */ //Class = .mod-btn
    card.querySelector(".mod-btn").addEventListener("click", () => {
      taskInput.value = task;
      descInput.value = desc;
      dateInput.value = deadline;
      statusSelect.value = status;
      popup.style.display = "flex";
      taskInput.focus();

      taskBeingEdited = card; // on garde une référence à cette carte
    });

/* ---------------------------AJOUT CARTE DANS LA LISTE--------------------------- */
    todoList.appendChild(card);
    form.reset();
    popup.style.display = "none"; // fermer après ajout
  });
});

/* ---------------------------GESTION DONE-BUTTONS EXISTANTS--------------------------- */ 
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".done-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".task-card");
      const title = card.querySelector(".task-title");
      title.classList.toggle("task-done");
    });
  });
});

/* ---------------------------CHECK BTN GLOBAL --------------------------- */
const btn = document.querySelector(".check-btn");
const icon = btn.querySelector("i");

btn.addEventListener("check", () => {
  icon.classList.toggle("bx-checkbox");         // enlève / remet l’ancienne icône
  icon.classList.toggle("bx-checkbox-square");  // ajoute / enlève la nouvelle icône
});

