
document.addEventListener('DOMContentLoaded', function() {
    const inputFieldsSection = document.getElementById('input-fields-section');
    const selectionSection = document.getElementById('selection-section');
    // const breadcrumbs = document.createElement('breadcrumbs');
    // breadcrumbs.id = 'breadcrumbs';
    // breadcrumbs.innerHTML = '<span>Personal Details</span>';
    // inputFieldsSection.parentNode.insertBefore(breadcrumbs, inputFieldsSection.nextSibling);

    selectionSection.style.display = 'none'; // Hide selection section initially

    const createBtn = document.getElementById('breadcrumbs');
    createBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission
        inputFieldsSection.style.display = 'none'; // Hide input fields section
        selectionSection.style.display = 'block'; // Show selection section
        breadcrumbs.innerHTML = 'Personal Details > Academic Info'; // Update breadcrumbs
    });

    const goToSelectionBtn = document.getElementById('go-to-selection-btn');
    goToSelectionBtn.addEventListener('click', function() {
        inputFieldsSection.style.display = 'none'; // Hide input fields section
        selectionSection.style.display = 'block'; // Show selection section
        breadcrumbs.innerHTML = 'Personal Details > Academic Info'; // Update breadcrumbs
    });

    const backToInputBtn = document.getElementById('back-to-input-btn');
    backToInputBtn.addEventListener('click', function() {
        selectionSection.style.display = 'none'; // Hide selection section
        inputFieldsSection.style.display = 'block'; // Show input fields section
        breadcrumbs.innerHTML = 'Personal Details'; // Update breadcrumbs
    });
});