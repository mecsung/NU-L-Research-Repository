async function initThesisArchive() {
  // ============================================================
  // Thesis Fetching & Rendering
  // ============================================================
  async function initThesisFetching() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q") || "";
    const filter = urlParams.get("filter") || "all";
    await fetchTheses({ query, filter }); // Use to load all thesis
  }

  async function fetchTheses({
    query = "",
    programs = [],
    methods = [],
    types = [],
    filter = "all",
  } = {}) {
    const thesisList = document.querySelector(".thesis-list");
    if (!thesisList) return;

    const SEARCH_URL = `${baseURL}/controller/search-thesis.php`;

    // Build URL params
    const params = new URLSearchParams({
      ajax: "1",
      q: query,
      filter: filter === "all" || filter === "advance" ? "none" : filter,
    });

    if (programs.length) params.set("programs", programs.join(","));
    if (methods.length) params.set("methods", methods.join(","));
    if (types.length) params.set("types", types.join(","));

    thesisList.innerHTML = "<p>Loading results...</p>";

    try {
      const res = await fetch(`${SEARCH_URL}?${params}`);
      const resData = await res.json();

      thesisList.innerHTML = "";

      if (!resData.success) {
        thesisList.innerHTML = `<p style="color:red;">Error: ${
          resData.error || "Unknown issue"
        }</p>`;
        return;
      }

      const data = resData.data;
      if (!data || data.length === 0) {
        thesisList.innerHTML = `<p style="margin-top: 1em; margin-left: 1em;">No matching theses found.</p>`;
        return;
      }

      // Append all rows efficiently
      const fragment = document.createDocumentFragment();
      data.forEach((item) => fragment.appendChild(createThesisRow(item)));
      thesisList.appendChild(fragment);
    } catch (err) {
      console.error("Fetch error:", err);
      thesisList.innerHTML = "<p>Error loading data.</p>";
    }
  }

  function createThesisRow(item) {
    const row = document.createElement("div");
    row.className = "thesis-info-wrapper";
    row.dataset.thesisId = item.thesis_id;

    row.innerHTML = `
    <span class="thesis-info" id="title">${item.title || "N/A"}</span>
    <span class="thesis-info" id="author">${item.author || "N/A"}</span>
    <span class="thesis-info" id="pub-date">${item.pub_date || "N/A"}</span>
    <span class="thesis-info" id="pub-place">${item.pub_place || "N/A"}</span>
    <span class="thesis-info" id="methodology">${
      item.methodology || "N/A"
    }</span>
    <div class="btn-wrapper">
      <button class="interaction-btns view-btn"><span class="material-symbols-outlined">visibility</span></button>
      <button class="interaction-btns edit-btn"><span class="material-symbols-outlined">edit</span></button>
      <button class="interaction-btns delete-btn"><span class="material-symbols-outlined">delete</span></button>
    </div>
  `;

    row
      .querySelector(".view-btn")
      .addEventListener("click", () => openPopup(item.thesis_id, "view"));
    row
      .querySelector(".edit-btn")
      .addEventListener("click", () => openPopup(item.thesis_id, "edit"));
    row
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteThesis(item.thesis_id, "delete"));

    return row;
  }

  // ============================================================
  // Refresh Button
  // ============================================================
  function initRefreshButton() {
    const refreshBtn = document.getElementById("refresh-btn");
    if (!refreshBtn) return;

    refreshBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      refreshBtn.disabled = true;
      refreshBtn.textContent = "Refreshing...";

      clearURLParams();
      await fetchTheses();
      yearFilter.value = "";
      checkboxes.forEach((cb) => (cb.checked = false));

      refreshBtn.disabled = false;
      refreshBtn.textContent = "Refresh";
    });
  }

  function clearURLParams() {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, "", cleanUrl);
  }

  // ============================================================
  // Year Filter
  // ============================================================
  const yearFilter = document.getElementById("year-filter");

  function initYearFilter() {
    yearFilter.addEventListener("change", () => {
      const selectedYear = yearFilter.value;

      document.querySelectorAll(".thesis-info-wrapper").forEach((row) => {
        const pubDate = row.querySelector("#pub-date");
        if (!pubDate) {
          row.style.display = "none";
          return;
        }

        const text = pubDate.textContent.trim();
        const match = text.match(/\b(19|20)\d{2}\b/); // extract year like 2023

        const rowYear = match ? match[0] : null;

        // Show if dropdown empty OR year matches
        row.style.display =
          !selectedYear || rowYear === selectedYear ? "" : "none";
      });
    });
  }

  initYearFilter();

  // ============================================================
  // Year Filter
  // ============================================================
  let checkboxes = null;
  function initSidebarFilters() {
    function getSelectedValues(category) {
      const wrapper = [...document.querySelectorAll(".category-wrapper")].find(
        (el) =>
          el.querySelector(".category-title-wrapper span:last-child")
            ?.textContent === category
      );
      if (!wrapper) return [];
      return [
        ...wrapper.querySelectorAll("input[type='checkbox']:checked"),
      ].map((cb) => cb.value);
    }

    const sidebarObserver = new MutationObserver(() => {
      checkboxes = document.querySelectorAll(
        "#side-bar input[type='checkbox']"
      );

      if (checkboxes.length === 0) return;

      checkboxes.forEach((cb) =>
        cb.addEventListener("change", async () => {
          await fetchTheses({
            query: new URLSearchParams(window.location.search).get("q") || "",
            filter:
              new URLSearchParams(window.location.search).get("filter") ||
              "all",
            programs: getSelectedValues("PROGRAMS"),
            methods: getSelectedValues("METHODOLOGY"),
            types: getSelectedValues("THESIS_TYPE"),
          });

          if (yearFilter.value) {
            yearFilter.dispatchEvent(new Event("change"));
          }
        })
      );

      sidebarObserver.disconnect();
    });

    sidebarObserver.observe(document.body, { childList: true, subtree: true });
  }

  // ============================================================
  // Delete Thesis
  // ============================================================
  async function deleteThesis(thesis_id) {
    if (!confirm("Are you sure you want to delete this thesis?")) return;

    // 1. Fetch the current thesis data to get file names
    const res = await fetch(
      `${baseURL}/controller/thesis/get-thesis.php?id=${thesis_id}`
    );
    const data = await res.json();

    const thesis_cover = data.thesis_cover
      ? data.thesis_cover.split("/").pop()
      : null;

    const pdf_file_name = data.file_name || null;

    // 2. Build delete list (same logic as Edit)
    const filesToDelete = {};
    if (thesis_cover) filesToDelete.cover = thesis_cover;
    if (pdf_file_name) filesToDelete.pdf = pdf_file_name;

    try {
      // ------------------------------
      // FIRST DELETE OLD FILES
      // ------------------------------
      if (Object.keys(filesToDelete).length > 0) {
        await fetch(`${baseURL}/controller/thesis/delete-old-thesis-file.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filesToDelete),
        });
      }

      // ------------------------------
      // THEN DELETE THE THESIS ENTRY FROM DB
      // ------------------------------
      const response = await fetch(
        `${baseURL}controller/thesis/delete-thesis.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ thesis_id }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        document.querySelector(`[data-thesis-id="${thesis_id}"]`)?.remove();
      } else {
        alert("Delete failed: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An unexpected error occurred while deleting the thesis.");
    }
  }

  // ============================================================
  // Popup Handling - IMPROVED
  // ============================================================

  const popUp = document.getElementById("pop-up");
  const submitBtn = document.getElementById("submit-thesis");
  const purposePlaceholder = document.getElementById("purpose-label");
  const thesisForm = document.getElementById("thesis-form");
  const addBtn = document.getElementById("add-btn");
  const closeBtn = document.getElementById("close-popup");
  let purpose;
  let authors = [];
  let keywords = [];
  let references = [];

  function initPopupHandling() {
    addBtn?.addEventListener("click", () => openPopup());
    closeBtn?.addEventListener("click", closePopup);
    thesisForm?.addEventListener("click", (e) => e.stopPropagation());
  }

  function closePopup() {
    popUp.classList.remove("active");
    resetForm();

    function resetForm() {
      // 1. Reset the form (clears most inputs)
      thesisForm.reset();

      // 3. Clear dynamic lists
      document.getElementById("author-list").innerHTML = "";
      document.getElementById("keyword-list").innerHTML = "";
      document.getElementById("reference-list").innerHTML = "";

      // 4. Reset file previews
      document.getElementById("img-preview").style.display = "none";
      document.getElementById("upload-text").style.display = "inline";
      document.getElementById("file-name").textContent = "Add thesis' PDF file";

      // 5. Clear file inputs (important!)
      document.getElementById("cover-img").value = "";
      document.getElementById("thesis-file").value = "";

      // 6. Clear abstract editor
      document.getElementById("abstract-editor").innerHTML = "";

      // 7. Uncheck all checkboxes (reset() doesn't do this)
      document
        .querySelectorAll('input[name="thesisTypes"]')
        .forEach((checkbox) => {
          checkbox.checked = false;
        });

      // 8. Reset select elements to first option
      document.querySelectorAll("select").forEach((select) => {
        select.selectedIndex = 0;
      });
    }
  }

  // Make the form read-only / view-only
  function setFormViewMode() {
    const form = document.getElementById("thesis-form");

    // Text, number, date inputs
    form
      .querySelectorAll(
        "input[type=text], input[type=number], input[type=date]"
      )
      .forEach((input) => {
        input.readOnly = true;
      });

    // File inputs
    form.querySelectorAll("input[type=file]").forEach((input) => {
      input.disabled = true;
    });

    // Select dropdowns
    form.querySelectorAll("select").forEach((select) => {
      select.disabled = true;
    });

    // Checkboxes
    form.querySelectorAll("input[type=checkbox]").forEach((cb) => {
      cb.disabled = true;
    });

    // Contenteditable elements
    form.querySelectorAll("[contenteditable]").forEach((div) => {
      div.contentEditable = "false";
    });

    // Hide submit button
    document.getElementById("submit-thesis").style.display = "none";
  }

  // Make the form editable
  function setFormEditMode() {
    const form = document.getElementById("thesis-form");

    // Enable all inputs and selects
    form.querySelectorAll("input, select").forEach((el) => {
      el.readOnly = false;
      el.disabled = false;
    });

    // Contenteditable elements
    form.querySelectorAll("[contenteditable]").forEach((div) => {
      div.contentEditable = "true";
    });

    // Show submit button
    document.getElementById("submit-thesis").style.display = "block";
  }

  function openPopup(thesis_id = null, view_type = null) {
    popUp.classList.add("active");

    // --- Determine purpose (Add / Edit / View) ---
    const isAction = thesis_id && view_type;
    purpose = isAction
      ? view_type.charAt(0).toUpperCase() + view_type.slice(1)
      : "Add";

    // --- Update submit button state ---
    if (thesis_id) submitBtn.dataset.thesisId = thesis_id;
    else delete submitBtn.dataset.thesisId;

    submitBtn.style.display = purpose === "Edit" ? "block" : "none";
    submitBtn.textContent = `${purpose} Thesis`;
    purposePlaceholder.textContent = `${purpose} Thesis`;

    // --- Load data for Edit/View ---
    if (isAction) {
      retrieveThesisInfo(thesis_id);
      purpose === "View" ? setFormViewMode() : setFormEditMode();
    } else {
      // Add Mode
      setFormEditMode();
    }
  }

  // ================================
  // Fetch Thesis Data for Edit
  // ================================
  let existingCoverFile;
  let existingPdfFile;
  async function retrieveThesisInfo(thesis_id) {
    try {
      const res = await fetch(
        `${baseURL}controller/thesis/get-thesis.php?id=${thesis_id}`
      );
      const data = await res.json();

      if (data.error) {
        alert("Error fetching thesis data: " + data.error);
        return;
      }

      // 🔹 Populate title
      document.getElementById("title-textfield").value = data.title || "";

      // 🔹 Populate cover image preview (if exists)
      const coverImg = document.getElementById("img-preview");
      const uploadText = document.getElementById("upload-text");
      // Cover
      existingCoverFile = data.thesis_cover
        ? data.thesis_cover.split("/").pop()
        : null;

      if (data.thesis_cover) {
        coverImg.src = baseURL + data.thesis_cover;
        coverImg.style.display = "block";
        uploadText.style.display = "none";
      } else {
        coverImg.src = "";
        coverImg.style.display = "none";
        uploadText.style.display = "inline";
      }

      // PDF
      existingPdfFile = data.file_name || null;
      document.getElementById("file-name").textContent = data.file_name
        ? data.file_name
        : "Add thesis' PDF file";

      // 🔹 Populate authors
      authors = []; // reset current authors array

      const authorList = document.getElementById("author-list");
      authorList.innerHTML = "";
      data.authors.forEach((authorName) => addAuthor(authorName));

      // Populate the calendar
      document.querySelector(".date-picker").value = data.pub_date || "";

      // Populate the publication place
      document.getElementById("place-textfield").value = data.pub_place || "";

      // 🔹 Populate abstract
      document.getElementById("abstract-editor").innerHTML =
        data.abstract || "";

      // 🔹 Populate methodology selection
      document.getElementById("methodology-selection").value =
        data.method_id || "";

      // 🔹 Populate thesis types checkboxes
      const selectedTypes = data.thesis_types_id || []; // assuming array of type IDs
      document.querySelectorAll('input[name="thesisTypes"]').forEach((cb) => {
        cb.checked = selectedTypes.includes(Number(cb.value));
      });

      // 🔹 Populate keywords
      keywords = [];
      const keywordList = document.getElementById("keyword-list");
      keywordList.innerHTML = "";
      data.keywords.forEach((kw) => addKeyword(kw));

      // 🔹 Populate references
      references = [];
      const referenceList = document.getElementById("reference-list");
      referenceList.innerHTML = "";
      data.references_list.forEach((ref) => addReference(ref));

      // 🔹 Populate page count
      document.getElementById("pagecount-textfield").value =
        data.page_count || "";

      // 🔹 Populate program
      document.getElementById("program-selection").value =
        data.program_id || "";
    } catch (err) {
      console.error("Error fetching thesis:", err);
      alert("Failed to retrieve thesis data for editing.");
    }
  }

  // ============================================================
  // Cover Image Preview
  // ============================================================
  function initImagePreview() {
    const coverImgInput = document.getElementById("cover-img");
    const imgPreview = document.getElementById("img-preview");
    const uploadText = document.getElementById("upload-text");

    coverImgInput?.addEventListener("change", function () {
      const file = this.files[0];
      if (!file) {
        imgPreview.style.display = "none";
        uploadText.style.display = "inline";
        imgPreview.src = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        imgPreview.src = reader.result;
        imgPreview.style.display = "block";
        uploadText.style.display = "none";
      };
      reader.readAsDataURL(file);
    });
  }

  // ============================================================
  // File Upload Handler
  // ============================================================
  function initFileUpload() {
    const fileInput = document.getElementById("thesis-file");
    const addFileBtn = document.getElementById("add-file-btn");
    const fileNameSpan = document.getElementById("file-name");

    addFileBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      fileInput?.click();
    });

    fileInput?.addEventListener("change", (e) => {
      const file = e.target.files[0];
      fileNameSpan.textContent = file
        ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
        : "No file selected";
    });
  }

  // ============================================================
  // Author Input Management
  // ============================================================
  function initAuthorField() {
    const authorFirstname = document.getElementById("author-fName");
    const authorMiddlename = document.getElementById("author-mName");
    const authorLastname = document.getElementById("author-lName");
    const authorNameFields = document.querySelectorAll(".author-field");

    authors = [];

    authorLastname?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const fnameCheck = authorFirstname && authorFirstname.value.length > 0;
        const lnameCheck = authorLastname && authorLastname.value.length > 0;

        if (fnameCheck && lnameCheck) {
          const name = {
            firstname: authorFirstname.value.trim(),
            middlename:
              authorMiddlename.value.length > 0
                ? authorMiddlename.value.trim()
                : "",
            lastname: authorLastname.value.trim(),
          };

          if (name) addAuthor(name);

          authorNameFields.forEach((field) => {
            field.value = "";
          });
        } else {
          alert("Please provide a firstname");
        }
      }
    });
  }

  // Make addAuthor globally accessible
  function addAuthor(name) {
    const authorList = document.getElementById("author-list");
    const wrapper = document.createElement("div");
    wrapper.className = "input-result-wrapper";
    wrapper.innerHTML = `
      <button type="button" class="delete-btn"><span class="material-symbols-outlined">delete</span></button>
      <span class="author-name">${
        name.firstname + " " + name.middlename + " " + name.lastname
      }</span>
    `;
    if (purpose != "View") {
      wrapper.querySelector(".delete-btn").addEventListener("click", () => {
        wrapper.remove();
        authors = authors.filter((a) => a !== name);
      });
    }

    authorList.appendChild(wrapper);
    authors.push(name);
  }

  // ============================================================
  // Rich Text Editor Toolbar
  // ============================================================
  function initRichTextEditor() {
    const editor = document.getElementById("abstract-editor");
    const toolbarButtons = document.querySelectorAll(".editor-toolbar button");

    function toggleFormatting(command) {
      document.execCommand(command, false, null);
    }

    function updateButtonStates() {
      toolbarButtons.forEach((btn) => {
        const command = btn.dataset.command;
        btn.classList.toggle("active", document.queryCommandState(command));
      });
    }

    toolbarButtons.forEach((btn) =>
      btn.addEventListener("click", () => {
        toggleFormatting(btn.dataset.command);
        editor.focus();
        updateButtonStates();
      })
    );

    editor?.addEventListener("mouseup", updateButtonStates);
    editor?.addEventListener("keyup", updateButtonStates);
  }

  // ============================================================
  // Methodology Select
  // ============================================================
  function initMethodologySelect() {
    const methodologySelect = document.getElementById("methodology-selection");
    const methodologies = [
      { id: 1, name: "Quantitative" },
      { id: 2, name: "Qualitative" },
      { id: 3, name: "Mixed-Methods" },
      { id: 4, name: "Case Study" },
      { id: 5, name: "Experimental Design" },
      { id: 6, name: "Survey Method" },
      { id: 7, name: "Grounded Theory" },
      { id: 8, name: "Phenomenological" },
    ];

    methodologies.forEach(({ id, name }) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = name;
      methodologySelect.appendChild(option);
    });
  }

  // ============================================================
  // Thesis Type Checkboxes
  // ============================================================
  function initThesisTypeCheckboxes() {
    const container = document.getElementById("type-checkboxes");
    const thesisTypes = [
      { id: 1, name: "Experimental Research" },
      { id: 2, name: "Descriptive Research" },
      { id: 3, name: "Correlational Research" },
      { id: 4, name: "Qualitative Case Study" },
      { id: 5, name: "Mixed-Methods Research" },
      { id: 6, name: "Survey Research" },
      { id: 7, name: "Action Research" },
      { id: 8, name: "Ethnographic Research" },
    ];

    thesisTypes.forEach(({ id, name }) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("checkbox-item");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = `type-${id}`;
      input.value = id;
      input.name = "thesisTypes";
      const label = document.createElement("label");
      label.htmlFor = input.id;
      label.textContent = name;
      wrapper.appendChild(input);
      wrapper.appendChild(label);
      container.appendChild(wrapper);
    });
  }

  // ============================================================
  // Keywords Input
  // ============================================================
  function initKeywordField() {
    const keywordInput = document.getElementById("keyword-textfield");
    keywords = [];

    keywordInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const word = keywordInput.value.trim();
        if (word && !keywords.includes(word)) addKeyword(word);
        keywordInput.value = "";
      }
    });
  }

  function addKeyword(word) {
    const keywordList = document.getElementById("keyword-list");
    const wrapper = document.createElement("div");
    wrapper.className = "input-result-wrapper";
    wrapper.innerHTML = `
      <button type="button" class="delete-btn"><span class="material-symbols-outlined">delete</span></button>
      <span class="keyword-name">${word}</span>
    `;
    if (purpose != "View") {
      wrapper.querySelector(".delete-btn").addEventListener("click", () => {
        wrapper.remove();
        keywords = keywords.filter((k) => k !== word);
      });
    }
    keywordList.appendChild(wrapper);
    keywords.push(word);
  }

  // ============================================================
  // References Input
  // ============================================================
  function initReferenceField() {
    const referenceInput = document.getElementById("reference-textfield");
    references = [];

    referenceInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const ref = referenceInput.value.trim();
        if (ref) addReference(ref);
        referenceInput.value = "";
      }
    });
  }

  function addReference(ref) {
    const referenceList = document.getElementById("reference-list");
    const wrapper = document.createElement("div");
    wrapper.className = "input-result-wrapper";
    wrapper.innerHTML = `
      <button type="button" class="delete-btn"><span class="material-symbols-outlined">delete</span></button>
      <span class="reference-text">${ref}</span>
    `;

    if (purpose != "View") {
      wrapper.querySelector(".delete-btn").addEventListener("click", () => {
        wrapper.remove();
        references = references.filter((r) => r !== ref);
      });
    }

    referenceList.appendChild(wrapper);
    references.push(ref);
  }

  // ============================================================
  // Page Count Validation
  // ============================================================
  function initPageCountField() {
    const pageCountInput = document.getElementById("pagecount-textfield");
    pageCountInput?.addEventListener("input", () => {
      let value = parseInt(pageCountInput.value, 10);
      if (value < 1 || isNaN(value)) pageCountInput.value = "";
    });
  }

  // ============================================================
  // Program Dropdown
  // ============================================================
  function initProgramSelect() {
    const programSelect = document.getElementById("program-selection");
    const programs = [
      { id: 1, name: "Master in Management", code: "MM" },
      { id: 2, name: "BS Accounting Information System", code: "BSAIS" },
      { id: 3, name: "BS Accountancy", code: "BSA" },
      {
        id: 4,
        name: "BS Business Administration major in Marketing and Advertising",
        code: "BSBA-MA",
      },
      { id: 5, name: "BS Tourism Management", code: "BSTM" },
      { id: 6, name: "BS Information Technology", code: "BSIT" },
      { id: 7, name: "BS Computer Science", code: "BSCS" },
      { id: 8, name: "BS Information Systems", code: "BSIS" },
      { id: 9, name: "BS Criminology", code: "BSCrim" },
      {
        id: 10,
        name: "Bachelor of Science in Exercise and Sports Science",
        code: "BSESS",
      },
      { id: 11, name: "BS Psychology", code: "BSPsy" },
      { id: 12, name: "Bachelor of Multimedia Arts", code: "BMMA" },
      { id: 13, name: "BA Communication", code: "BACOMM" },
      { id: 14, name: "BS Architecture", code: "BSArch" },
      { id: 15, name: "BS Computer Engineering", code: "BSCpE" },
      { id: 16, name: "BS Civil Engineering", code: "BSCE" },
      { id: 17, name: "Master in Information Technology", code: "MIT" },
      { id: 18, name: "MA in Education, Major in English", code: "MAEd-Eng" },
      { id: 19, name: "MA in Education, Major in Filipino", code: "MAEd-Fil" },
      {
        id: 20,
        name: "MA in Education, Major in Special Education",
        code: "MAEd-SPED",
      },
      {
        id: 21,
        name: "MA in Education, Major in Educational Management",
        code: "MAEd-EM",
      },
      {
        id: 22,
        name: "Doctor of Education, Major in Educational Management",
        code: "EdD-EM",
      },
    ];

    programs.forEach(({ id, name, code }) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = `${name} (${code})`;
      programSelect.appendChild(option);
    });
  }

  // ============================================================
  // Upload Thesis Cover and PDF
  // ============================================================

  async function uploadThesisFiles(coverFile, pdfFile, thesis_title) {
    const formData = new FormData();
    formData.append("thesis-cover", coverFile);
    formData.append("thesis-file", pdfFile);
    formData.append("thesis_title", thesis_title);

    try {
      const response = await fetch(
        baseURL + "controller/thesis/upload-thesis-files.php",
        {
          method: "POST",
          body: formData,
        }
      );

      // Try to parse JSON
      const result = await response.json();

      if (result.cover || result.pdf) {
        return result; // <-- return file paths here
      } else {
        console.error("Upload failed:", result);
        return null;
      }
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  }

  // ============================================================
  // Upload Thesis Handler - IMPROVED VERSION
  // ============================================================
  function initSubmitHandler() {
    const submitBtn = document.getElementById("submit-thesis");
    submitBtn?.addEventListener("click", handleThesisSubmission);
  }

  async function handleThesisSubmission(e) {
    e.preventDefault();

    try {
      // Only validate for Add mode, skip validation for Edit mode
      if (purpose === "Add" && !validateThesisForm()) {
        return; // Stop if validation fails for new thesis
      }

      const thesisData = await prepareThesisData();

      if (!thesisData) {
        return; // Stop if data preparation fails
      }

      const result = await submitThesis(thesisData);

      if (result.success) {
        showSuccess(result.message || getSuccessMessage(purpose));
        closePopup();

        if (purpose === "Edit") {
          await initThesisFetching();
        }
      } else {
        throw new Error(result.error || "Operation failed");
      }
    } catch (error) {
      console.error("Thesis submission error:", error);
      showError(error.message || "An unexpected error occurred");
    }
  }

  // ================================
  // Thesis Form Validation
  // ================================
  function validateThesisForm() {
    // Gather all necessary data
    const title = document.getElementById("title-textfield").value.trim();
    const authorsCount = authors.length; // your authors array
    const coverFile = document.getElementById("cover-img").files[0];
    const pdfFile = document.getElementById("thesis-file").files[0];
    const abstract = document
      .getElementById("abstract-editor")
      .innerText.trim();
    const methodology = document.getElementById("methodology-selection").value;
    const thesisTypes = document.querySelectorAll(
      'input[name="thesisTypes"]:checked'
    );
    const keywordsCount = keywords.length; // your keywords array
    const referencesCount = references.length; // your references array
    const pageCount = document.getElementById("pagecount-textfield").value;
    const program = document.getElementById("program-selection").value;

    // Validation checks
    if (!title) return alert("Please enter a title.");
    if (!coverFile) return alert("Please upload a thesis cover image.");
    if (!pdfFile) return alert("Please upload the thesis PDF.");
    if (!authorsCount) return alert("Please add at least one author.");
    if (!abstract) return alert("Please enter the abstract.");
    if (!methodology) return alert("Please select a methodology.");
    if (thesisTypes.length === 0)
      return alert("Please select at least one thesis type.");
    if (!keywordsCount) return alert("Please add at least one keyword.");
    if (!referencesCount) return alert("Please add at least one reference.");
    if (!pageCount || pageCount < 1)
      return alert("Please enter a valid page count.");
    if (!program) return alert("Please select a program.");

    // All good
    return true;
  }

  // ============================================================
  // DATA PREPARATION
  // ============================================================
  async function prepareThesisData() {
    const baseData = getBaseFormData();

    const needsFileUpload = fileWasUploaded(); // true if new cover or PDF is uploaded

    if (needsFileUpload) {
      if (purpose === "Edit") {
        const oldCover = baseData.oldCoverFile
          ? baseData.oldCoverFile.split("/").pop()
          : null;
        const oldPdf = baseData.oldPdfFile || null;

        // Determine which file(s) were actually changed
        const newCover = document.getElementById("cover-img").files[0];
        const newPdf = document.getElementById("thesis-file").files[0];

        const filesToDelete = {};
        if (newCover && oldCover) filesToDelete.cover = oldCover;
        if (newPdf && oldPdf) filesToDelete.pdf = oldPdf;

        if (Object.keys(filesToDelete).length > 0) {
          try {
            await fetch(
              `${baseURL}/controller/thesis/delete-old-thesis-file.php`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filesToDelete),
              }
            );
          } catch (err) {
            console.error("Failed to delete old files:", err);
          }
        }
      }

      // Upload new files
      const fileResult = await handleFileUploads(baseData.title);

      if (!fileResult) {
        showError("File upload failed. Please try again.");
        return null;
      }

      return {
        ...baseData,
        cover_path: fileResult.cover,
        pdf_path: fileResult.pdf,
      };
    }

    // Edit mode with no new files: confirm with user
    if (purpose === "Edit") {
      const proceed = confirm(
        "No files were changed. Do you want to continue saving with existing cover and PDF?"
      );

      if (!proceed) return null; // User cancelled

      return {
        ...baseData,
        cover_path: null,
        pdf_path: null,
      };
    }
  }

  function getBaseFormData() {
    const commonData = {
      title: getValue("#title-textfield"),
      authors: authors || [],
      pub_date: getValue(".date-picker"),
      pub_place: getValue("#place-textfield"),
      methodology_id: getValue("#methodology-selection"),
      thesis_types: getCheckedValues('input[name="thesisTypes"]:checked'),
      keywords: keywords || [],
      references: references || [],
      page_count: parseInt(getValue("#pagecount-textfield")) || 0,
      program_id: getValue("#program-selection"),
      abstract: getHTML("#abstract-editor"),
    };

    // Add thesis_id only for Edit mode
    if (purpose === "Edit") {
      const thesisId =
        document.getElementById("submit-thesis")?.dataset.thesisId;
      if (!thesisId) {
        throw new Error("Missing thesis ID. Cannot update.");
      }
      commonData.thesis_id = thesisId;
      commonData.oldCoverFile = existingCoverFile ?? existingCoverFile;
      commonData.oldPdfFile = existingPdfFile ?? existingCoverFile;
    }

    return commonData;
  }

  // ============================================================
  // FILE HANDLING
  // ============================================================
  function fileWasUploaded() {
    const coverFile = document.getElementById("cover-img").files[0];
    const pdfFile = document.getElementById("thesis-file").files[0];
    return !!(coverFile || pdfFile);
  }

  async function handleFileUploads(thesis_title) {
    const coverFile = document.getElementById("cover-img").files[0];
    const pdfFile = document.getElementById("thesis-file").files[0];

    return await uploadThesisFiles(coverFile, pdfFile, thesis_title);
  }

  // ============================================================
  // API COMMUNICATION
  // ============================================================
  async function submitThesis(data) {
    const endpoint =
      purpose === "Add"
        ? "controller/thesis/save-thesis.php"
        : "controller/thesis/edit-thesis.php";

    const response = await fetch(`${baseURL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Get the actual error message from the server
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }

    return await response.json();
  }

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================
  function getValue(selector) {
    const element = document.querySelector(selector);
    return element?.value?.trim() || "";
  }

  function getHTML(selector) {
    const element = document.querySelector(selector);
    return element?.innerHTML || "";
  }

  function getCheckedValues(selector) {
    return Array.from(document.querySelectorAll(selector)).map((el) =>
      Number(el.value)
    );
  }

  function getSuccessMessage(action) {
    const messages = {
      Add: "Thesis uploaded successfully!",
      Edit: "Thesis updated successfully!",
    };
    return messages[action] || "Operation completed successfully!";
  }

  function showSuccess(message) {
    alert(`${message}`);
  }

  function showError(message) {
    alert(`${message}`);
  }

  initRefreshButton();
  await initThesisFetching();
  initYearFilter();
  initSidebarFilters();
  initPopupHandling();
  initImagePreview();
  initFileUpload();
  initAuthorField();
  initRichTextEditor();
  initMethodologySelect();
  initThesisTypeCheckboxes();
  initKeywordField();
  initReferenceField();
  initPageCountField();
  initProgramSelect();
  initSubmitHandler();
}
